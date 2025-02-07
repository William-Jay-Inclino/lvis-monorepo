import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGasSlipInput } from './dto/create-gas-slip.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { GasSlip, GasSlipApprover, Prisma } from 'apps/warehouse/prisma/generated/client';
import { WarehouseCancelResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { APPROVAL_STATUS, DB_TABLE } from 'apps/warehouse/src/__common__/types';
import { DB_ENTITY } from '../__common__/constants';
import { GasSlipsResponse } from './entities/gas-slips-response.entity';
import { isAdmin, isNormalUser } from '../__common__/helpers';
import { PostGasSlipInput } from './dto/post-gas-slip.input';
import { MAX_UNPOSTED_GAS_SLIPS } from '../__common__/config';
import { VEHICLE_CLASSIFICATION } from '../vehicle/entities/vehicle.enums';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { UpdateGasSlipInput } from './dto/update-gas-slip.input';
import { endOfYear, startOfYear } from 'date-fns';
import { get_pending_description_for_motorpool, getEmployee, isPastDate } from '../__common__/utils';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class GasSlipService {

	constructor(
		private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
	) { }

	async create(
        input: CreateGasSlipInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const authUser = metadata.authUser

        if(isPastDate(input.used_on)) {
            throw new BadRequestException('Date should not be in the past')
        }

		if (!(await this.canCreate({ input, authUser }))) {
            throw new Error('Failed to create Gas Slip. Please try again')
        }

		const vehicle = await this.prisma.vehicle.findUnique({
			where: { id: input.vehicle_id },
			select: {
				id: true,
				classification_id: true,
			}
		})

		if(!vehicle) {
			throw new NotFoundException("Vehicle not found with id " + input.vehicle_id)
		}

		// only validate total unposted gas slips if not private vehicle
		if(vehicle.classification_id !== VEHICLE_CLASSIFICATION.PRIVATE) {
			const total_unposted_gaslips = await this.get_total_unposted_gas_slips(input.vehicle_id)
	
			if(total_unposted_gaslips >= MAX_UNPOSTED_GAS_SLIPS) {
				throw new BadRequestException("Total unposted gas slips should not exceed by " + MAX_UNPOSTED_GAS_SLIPS)
			}
		}


		const gasSlipNumber = await this.getLatestGasSlipNumber()

		const data: Prisma.GasSlipCreateInput = {
			gas_slip_number: gasSlipNumber,
			vehicle: { connect: { id: input.vehicle_id } },
			driver_id: input.driver_id,
			gas_station: { connect: { id: input.gas_station_id } },
			fuel_type: { connect: { id: input.fuel_type_id } },
			requested_by_id: input.requested_by_id,
			with_container: input.with_container,
			liter_in_text: input.liter_in_text,
			purpose: input.purpose,
			used_on: new Date(input.used_on),
			created_by: authUser.user.username,
            approval_status: APPROVAL_STATUS.PENDING,
			gas_slip_approvers: {
				create: input.approvers.map(i => {
					return {
						approver_id: i.approver_id,
						label: i.label,
						order: i.order,
						notes: '',
						status: APPROVAL_STATUS.PENDING,
					}
				})
			}
		}

        return await this.prisma.$transaction(async (tx) => {

            const gas_slip_created = await tx.gasSlip.create({
                data,
                include: {
                    vehicle: true,
                    gas_slip_approvers: true,
                }
            })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const driver = await getEmployee(gas_slip_created.driver_id, authUser)
            
            const description = get_pending_description_for_motorpool({
                vehicle: gas_slip_created.vehicle,
                employee: driver,
                purpose: gas_slip_created.purpose,
            })
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: gasSlipNumber,
                reference_table: DB_ENTITY.GAS_SLIP,
                description
            }

            await tx.pending.create({ data: pendingData })

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.GAS_SLIP,
                action: 'CREATE-GAS-SLIP',
                reference_id: gas_slip_created.gas_slip_number,
                metadata: gas_slip_created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)

            return gas_slip_created
        });
    
	}

	async update(
        id: string, 
        input: UpdateGasSlipInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {
        
        const authUser = metadata.authUser

        if(isPastDate(input.used_on)) {
            throw new BadRequestException('Date should not be in the past')
        }

        const existingItem = await this.prisma.gasSlip.findUnique({
            where: { id },
            include: {
                vehicle: true,
                gas_slip_approvers: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('Gas Slip not found')
        }

		if (!this.canAccess( { item: existingItem, authUser } )) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

		if (!(await this.canUpdate({ input, existingItem, authUser }))) {
            throw new Error('Failed to update Gas Slip. Please try again')
        }

        const used_on = input.used_on ? new Date(input.used_on) : existingItem.used_on

		const data: Prisma.GasSlipUpdateInput = {
            updated_by: authUser.user.username,
			vehicle: input.vehicle_id ? 
				{ connect: { id: input.vehicle_id } }
				: 
				{ connect: { id: existingItem.vehicle_id } },
			driver_id: input.driver_id ?? existingItem.driver_id,
			gas_station: input.gas_station_id ? 
				{ connect: { id: input.gas_station_id } } 
				:
				{ connect: { id: existingItem.gas_station_id } },
			fuel_type: input.fuel_type_id ? 
				{ connect: { id: input.fuel_type_id } } 
				:
				{ connect: { id: existingItem.fuel_type_id } },
			requested_by_id: input.requested_by_id ?? existingItem.requested_by_id,
			with_container: input.with_container ?? existingItem.with_container,
			liter_in_text: input.liter_in_text ?? existingItem.liter_in_text,
			purpose: input.purpose ?? existingItem.purpose,
			used_on,
		}

		return await this.prisma.$transaction(async(tx) => {
        
            const gas_slip_updated = await tx.gasSlip.update({
                data,
				include: {
					vehicle: true,
                    gas_slip_approvers: true,
				},
                where: { id }
            })

            const pending = await tx.pending.findFirst({
				where: {
					reference_number: gas_slip_updated.gas_slip_number,
					reference_table: DB_ENTITY.GAS_SLIP,
				}
			})

			if(pending) {

				const driver = await getEmployee(gas_slip_updated.driver_id, authUser)
			
				const description = get_pending_description_for_motorpool({
					vehicle: gas_slip_updated.vehicle,
					employee: driver,
					purpose: gas_slip_updated.purpose,
				})

				await tx.pending.update({
					where: {
						id: pending.id
					},
					data: {
						description
					}
				})
			}

            await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.GAS_SLIP,
				action: 'UPDATE-GAS-SLIP',
				reference_id: gas_slip_updated.gas_slip_number,
				metadata: {
					'old_value': existingItem,
					'new_value': gas_slip_updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
            
            return gas_slip_updated

        })
		
	}

	async cancel(
        id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<WarehouseCancelResponse> {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.gasSlip.findUnique({
            where: { id },
            include: {
                vehicle: true,
            }
        })

        if (!existingItem) {
            throw new NotFoundException('Gas Slip not found')
        }

        if (!this.canAccess({ item: existingItem, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        return await this.prisma.$transaction(async(tx) => {

            const gas_slip_cancelled = await tx.gasSlip.update({
                data: {
                    cancelled_at: new Date(),
                    cancelled_by: authUser.user.username,
                    approval_status: APPROVAL_STATUS.CANCELLED
                },
                where: { id },
                include: {
                    vehicle: true
                }
            })
    
            // delete associated pending
    
            const pending = await tx.pending.findUnique({
                where: {
                    reference_number_reference_table: {
                        reference_number: existingItem.gas_slip_number,
                        reference_table: DB_ENTITY.GAS_SLIP
                    }
                }
            })

            if(pending) {

                await tx.pending.delete({
                    where: { id: pending.id }
                })

            }

            await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.GAS_SLIP,
				action: 'CANCEL-GAS-SLIP',
				reference_id: gas_slip_cancelled.gas_slip_number,
				metadata: {
					'old_value': existingItem,
					'new_value': gas_slip_cancelled
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Successfully cancelled Gas Slip',
                cancelled_at: gas_slip_cancelled.cancelled_at,
                cancelled_by: gas_slip_cancelled.cancelled_by
            }

        })


    }

	async findAll(
		page: number,
		pageSize: number,
		vehicle_id?: string, 
        approval_status?: number,
        is_posted?: boolean,
        used_on?: Date,
	  ): Promise<GasSlipsResponse> {
		const skip = (page - 1) * pageSize;
		const take = pageSize;
	  
		const filters: any = {};
		if (vehicle_id) filters.vehicle_id = vehicle_id;
        if (approval_status) {
            filters.approval_status = approval_status;
        }
        if(is_posted !== undefined) {
            filters.is_posted = is_posted
        }

        if (used_on) {
            const startOfDay = new Date(used_on);
            startOfDay.setHours(0, 0, 0, 0);
        
            const endOfDay = new Date(used_on);
            endOfDay.setHours(23, 59, 59, 999);
        
            filters.used_on = {
              gte: startOfDay,
              lte: endOfDay,
            };
        }

		// Default to current year's records if neither filter is provided
		if (!vehicle_id && !approval_status && used_on === undefined) {
			const startOfYearDate = startOfYear(new Date());
			const endOfYearDate = endOfYear(new Date());

			filters.created_at = {
				gte: startOfYearDate,
				lte: endOfYearDate,
			};
		}

		const [totalItems, gasSlips] = await this.prisma.$transaction([
		  this.prisma.gasSlip.count({ where: filters }),
		  this.prisma.gasSlip.findMany({
			include: {
				vehicle: true,
				gas_station: true,
				fuel_type: true,
			},
			where: filters,
			skip,
			take,
			orderBy: { created_at: 'desc' },
		  }),
		]);
	  
		const totalPages = Math.ceil(totalItems / pageSize);
	  
		return {
		  data: gasSlips,
		  totalItems,
		  currentPage: page,
		  totalPages,
		};
	}

    async findGasSlipsByGasSlipNumber(gasSlipNumber: string, includeDetails: boolean = false) {

		const trimmedGasSlipNumber = gasSlipNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                gas_slip_number: true, 
                vehicle: true,
                used_on: true,
                approval_status: true,
            }; 
        } else {
            selectClause = { gas_slip_number: true };
        }

        const items = await this.prisma.gasSlip.findMany({
            select: selectClause,
            where: {
                gas_slip_number: {
                    startsWith: trimmedGasSlipNumber
                },
                cancelled_at: null
            },
            orderBy: {
                gas_slip_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

	async findOne(payload: { id?: string; gas_slip_number?: string }) {
		const { id, gas_slip_number } = payload;
	
		const item = await this.prisma.gasSlip.findUnique({
			include: {
				vehicle: true,
				gas_station: true,
				fuel_type: true,
			},
			where: id ? { id } : { gas_slip_number }
		});
	
		if (!item) {
			throw new NotFoundException('Gas Slip not found');
		}
	
		return item;
	}

	async get_total_unposted_gas_slips(vehicle_id: string) {
		const unpostedGasSlipsCount = await this.prisma.gasSlip.count({
			where: {
				vehicle_id,
			  	is_posted: false,
			},
		  });
	  
		  return unpostedGasSlipsCount;
	}

	async post_gas_slip(
        id: string, 
        input: PostGasSlipInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const authUser = metadata.authUser

		const existingGasSlip = await this.prisma.gasSlip.findUnique({
			where: { id },
            include: {
                vehicle: true,
            }
		})

		if(!existingGasSlip) {
			throw new NotFoundException("Gas Slip not found with id of " + id)
		}

		if(existingGasSlip.is_posted === null) {
			throw new BadRequestException("Cannot post gas slip. Field is_posted is null")
		}

		if(existingGasSlip.is_posted === true) {
			throw new BadRequestException("Cannot post gas slip. Field is_posted is already set to true")
		}

        return await this.prisma.$transaction(async(tx) => {

            const updated = await this.prisma.gasSlip.update({
                where: { id },
                data: {
                    actual_liter: input.actual_liter,
                    price_per_liter: input.price_per_liter,
                    is_posted: true,
                },
                include: {
                    vehicle: true,
                }
            })

            await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.GAS_SLIP,
				action: 'POST-GAS-SLIP',
				reference_id: updated.gas_slip_number,
				metadata: {
					'old_value': existingGasSlip,
					'new_value': updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
            }, tx as Prisma.TransactionClient)
    
            return updated

        })


	}

	async canUpdateForm(payload: { gas_slip_id: string, authUser: AuthUser }): Promise<Boolean> {

        const { gas_slip_id, authUser } = payload

        const gasSlip = await this.prisma.gasSlip.findUnique({
            where: {
                id: gas_slip_id
            },
            select: {
                created_by: true,
                gas_slip_approvers: true
            }
        })

        const hasPermission = gasSlip.created_by === authUser.user.username || isAdmin(authUser);

        if (!hasPermission) {
            return false;
        }

        const hasApproval = gasSlip.gas_slip_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

    }

	async canPrint(gas_slip_id: string): Promise<Boolean> {

        const gasSlip = await this.prisma.gasSlip.findUnique({
            where: {
                id: gas_slip_id,
            },
            select: {
                created_by: true,
				is_posted: true, 
            }
        })

        const status = await this.getStatus(gas_slip_id)

		if(status === APPROVAL_STATUS.APPROVED && gasSlip.is_posted === false) {
			return true
		} else {
			return false
		}

    }

	async canPostGasSlip(payload: { gas_slip_id: string, authUser: AuthUser }): Promise<Boolean> {

        const { gas_slip_id, authUser } = payload

        const gasSlip = await this.prisma.gasSlip.findUnique({
            where: {
                id: gas_slip_id
            },
            select: {
                created_by: true,
				is_posted: true,
                gas_slip_approvers: true
            }
        })

        const hasPermission = gasSlip.created_by === authUser.user.username || isAdmin(authUser);

        if (!hasPermission) {
            return false;
        }

        if(gasSlip.is_posted !== null && gasSlip.is_posted === false) {
			return true 
		}

        return false 

    }

	private async canCreate(payload: { input: CreateGasSlipInput, authUser: AuthUser }): Promise<boolean> {

        const { input, authUser } = payload

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

		employeeIds.push(input.driver_id)
		employeeIds.push(input.requested_by_id)

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

	private async canUpdate(payload: { 
        input: UpdateGasSlipInput, 
        existingItem: GasSlip,
        authUser: AuthUser 
    }): Promise<boolean> {
        
        const { input, existingItem, authUser } = payload

        // validates if there is already an approver who take an action
        if (isNormalUser(authUser)) {

            const approvers = await this.prisma.gasSlipApprover.findMany({
                where: {
                    gas_slip_id: existingItem.id
                }
            })

            // used to indicate whether there is at least one approver whose status is not pending.
            const isAnyNonPendingApprover = this.isAnyNonPendingApprover(approvers)

            if (isAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update Gas Slip. Can only update if all approver's status is pending`)
            }
        }

        const employeeIds = []

        if (input.driver_id) {
            employeeIds.push(input.driver_id)
        }

		if (input.requested_by_id) {
            employeeIds.push(input.requested_by_id)
        }

        if (employeeIds.length > 0) {

            const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, authUser)

            if (!isValidEmployeeIds) {
                throw new NotFoundException('One or more employee IDs is not valid')
            }

        }

        return true
    }

	private canAccess(payload: { item: GasSlip, authUser: AuthUser }): boolean {

        const { item, authUser } = payload

        if (isAdmin(authUser)) return true

        const isOwner = item.created_by === authUser.user.username

        if (isOwner) return true

        return false

    }

	// used to indicate whether there is at least one approver whose status is not pending.
	private isAnyNonPendingApprover(approvers: GasSlipApprover[]): boolean {

		for (let approver of approvers) {

			if (approver.status !== APPROVAL_STATUS.PENDING) {

				return true

			}

		}

		return false

	}

	private async getLatestGasSlipNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.gasSlip.findFirst({
            where: { gas_slip_number: { startsWith: currentYear } },
            orderBy: { gas_slip_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.gas_slip_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

	async getStatus(id: string): Promise<APPROVAL_STATUS> {

        const approvers = await this.prisma.gasSlipApprover.findMany({
            where: {
                gas_slip_id: id,
            }
        })

        const hasDisapproved = approvers.find(i => i.status === APPROVAL_STATUS.DISAPPROVED)

        if (hasDisapproved) {
            return APPROVAL_STATUS.DISAPPROVED
        }

        const hasPending = approvers.find(i => i.status === APPROVAL_STATUS.PENDING)

        if (hasPending) {
            return APPROVAL_STATUS.PENDING
        }

        return APPROVAL_STATUS.APPROVED

    }

	private async areEmployeesExist(employeeIds: string[], authUser: AuthUser): Promise<boolean> {

        const query = `
            query {
                validateEmployeeIds(ids: ${JSON.stringify(employeeIds)})
            }
        `;

        try {
            const { data } = await firstValueFrom(
                this.httpService.post(
                    process.env.API_GATEWAY_URL,
                    { query },
                    {
                        headers: {
                            Authorization: authUser.authorization,
                            'Content-Type': 'application/json',
                        },
                    }
                ).pipe(
                    catchError((error) => {
                        throw error;
                    }),
                ),
            );

            if (!data || !data.data) {
                return false;
            }

            return data.data.validateEmployeeIds;

        } catch (error) {
            return false;
        }
    }

}
