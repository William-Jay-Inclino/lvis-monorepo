import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGasSlipInput } from './dto/create-gas-slip.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { GasSlip, GasSlipApprover, Prisma } from 'apps/warehouse/prisma/generated/client';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { APPROVAL_STATUS } from 'apps/warehouse/src/__common__/types';
import { CreateGasSlipApproverSubInput } from './dto/create-gas-slip-approver.sub.input';
import { DB_ENTITY } from '../__common__/constants';
import { GasSlipsResponse } from './entities/gas-slips-response.entity';
import { getModule, isAdmin, isNormalUser } from '../__common__/helpers';
import { PostGasSlipInput } from './dto/post-gas-slip.input';
import { MAX_UNPOSTED_GAS_SLIPS } from '../__common__/config';
import { VEHICLE_CLASSIFICATION } from '../vehicle/entities/vehicle.enums';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { UpdateGasSlipInput } from './dto/update-gas-slip.input';
import { endOfYear, startOfYear } from 'date-fns';

@Injectable()
export class GasSlipService {

	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateGasSlipInput) {

		if (!(await this.canCreate(input))) {
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
			created_by: this.authUser.user.username,
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

        const result = await this.prisma.$transaction(async (tx) => {

            const gas_slip_created = await tx.gasSlip.create({ data })

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

            const module = getModule(DB_ENTITY.GAS_SLIP)
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: gasSlipNumber,
                reference_table: DB_ENTITY.GAS_SLIP,
                description: `${ module.description } no. ${gasSlipNumber}`
            }

            await tx.pending.create({ data: pendingData })


            return gas_slip_created
        });
    
        return result;

	}

	async update(id: string, input: UpdateGasSlipInput) {
        const existingItem = await this.prisma.gasSlip.findUnique({
            where: { id },
            include: {
                gas_slip_approvers: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('Gas Slip not found')
        }

		if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

		if (!(await this.canUpdate(input, existingItem))) {
            throw new Error('Failed to update Gas Slip. Please try again')
        }

		const data: Prisma.GasSlipUpdateInput = {
            updated_by: this.authUser.user.username,
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
		}

		const updated = await this.prisma.gasSlip.update({
			where: { id },
			data
		})

		return updated
		
	}

	async findAll(
		page: number,
		pageSize: number,
		vehicle_id?: string,
	  ): Promise<GasSlipsResponse> {
		const skip = (page - 1) * pageSize;
		const take = pageSize;
	  
		const filters: any = {};
		if (vehicle_id) filters.vehicle_id = vehicle_id;

		// Default to current year's records if neither filter is provided
		if (!vehicle_id) {
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

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne({ id })

		await this.prisma.gasSlip.delete({
			where: { id },
		})

		return {
			success: true,
			msg: "Gas Slip successfully deleted"
		}

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

	async post_gas_slip(id: string, input: PostGasSlipInput) {

		const existingGasSlip = await this.prisma.gasSlip.findUnique({
			where: { id }
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

		const updated = await this.prisma.gasSlip.update({
			where: { id },
			data: {
				actual_liter: input.actual_liter,
				price_per_liter: input.price_per_liter,
				is_posted: true,
			}
		})

		return updated

	}

	async canUpdateForm(gas_slip_id: string): Promise<Boolean> {

        const gasSlip = await this.prisma.gasSlip.findUnique({
            where: {
                id: gas_slip_id
            },
            select: {
                created_by: true,
                gas_slip_approvers: true
            }
        })

        const isOwner = gasSlip.created_by === this.authUser.user.username || isAdmin(this.authUser)

        if (!isOwner) {
            return false
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

        const isOwner = gasSlip.created_by === this.authUser.user.username || isAdmin(this.authUser)

        if (!isOwner) {
            return false
        }

        const status = await this.getStatus(gas_slip_id)

		if(status === APPROVAL_STATUS.APPROVED && gasSlip.is_posted === false) {
			return true
		} else {
			return false
		}

    }

	async canPostGasSlip(gas_slip_id: string): Promise<Boolean> {

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

        const isOwner = gasSlip.created_by === this.authUser.user.username || isAdmin(this.authUser)

        if (!isOwner) {
            return false
        }

        if(gasSlip.is_posted !== null && gasSlip.is_posted === false) {
			return true 
		}

        return false 

    }

	private async canCreate(input: CreateGasSlipInput): Promise<boolean> {

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

		employeeIds.push(input.driver_id)
		employeeIds.push(input.requested_by_id)

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

	private async canUpdate(input: UpdateGasSlipInput, existingItem: GasSlip): Promise<boolean> {
		
        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

            console.log('is normal user')

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

            const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

            if (!isValidEmployeeIds) {
                throw new NotFoundException('One or more employee IDs is not valid')
            }

        }

        return true
    }

	private canAccess(item: GasSlip): boolean {

        if (isAdmin(this.authUser)) return true

        const isOwner = item.created_by === this.authUser.user.username

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

		console.log('approvers', approvers);

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

        console.log('query', query)

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

            console.log('data', data);
            console.log('data.data.validateEmployeeIds', data.data.validateEmployeeIds)

            if (!data || !data.data) {
                console.log('No data returned');
                return false;
            }

            return data.data.validateEmployeeIds;

        } catch (error) {
            console.error('Error querying employees:', error.message);
            return false;
        }
    }

	// @OnEvent('gas-slip-approver-status.updated')
	// async handle_gas_slip_approver_status_updated(payload: GasSlipApproverStatusUpdated) {

	// 	console.log('handle_gas_slip_approver_status_updated', payload);
		
	// 	const gasSlipApprover = await this.prisma.gasSlipApprover.findUnique({
	// 		where: { id: payload.id },
	// 		include: {
	// 			gas_slip: {
	// 				include: {
	// 					gas_slip_approvers: true
	// 				}
	// 			}
	// 		}
	// 	})

	// 	if (!gasSlipApprover) {
	// 		throw new NotFoundException('gasSlipApprover not found with id: ' + payload.id)
	// 	}

	// 	if (gasSlipApprover.gas_slip.is_posted) {
	// 		console.log('Gas Slip is already posted. End function')
	// 		return
	// 	}

	// 	const approvers = gasSlipApprover.gas_slip.gas_slip_approvers
	// 	console.log('approvers', approvers)

	// 	const isApproved = this.isStatusApproved(approvers)

	// 	if (!isApproved) {
	// 		console.log('Gas Slip status is not approved. End function')
	// 		return
	// 	}

	// 	// if gas slip is approved then set is_posted to false 

	// 	const result = await this.prisma.gasSlip.update({
	// 		where: {
	// 			id: gasSlipApprover.gas_slip_id
	// 		},
	// 		data: {
	// 			is_posted: false 
	// 		}
	// 	})

	// }

	// private isStatusApproved(approvers: GasSlipApprover[]) {
	// 	for (let approver of approvers) {

	// 		if (approver.status !== APPROVAL_STATUS.APPROVED) {
	// 			return false
	// 		}

	// 	}

	// 	return true
	// }

}
