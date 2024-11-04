import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGasSlipInput } from './dto/create-gas-slip.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { GasSlipApprover, Prisma } from 'apps/warehouse/prisma/generated/client';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { APPROVAL_STATUS } from 'apps/warehouse/src/__common__/types';
import { CreateGasSlipApproverSubInput } from './dto/create-gas-slip-approver.sub.input';
import { DB_ENTITY } from '../__common__/constants';
import { GasSlipsResponse } from './entities/gas-slips-response.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { GasSlipApproverStatusUpdated } from '../gas-slip-approver/events/gas-slip-approver-status-updated.event';
import { getModule, isAdmin } from '../__common__/helpers';

@Injectable()
export class GasSlipService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateGasSlipInput) {

		const total_unposted_gaslips = await this.get_total_unposted_gas_slips(input.vehicle_id)

		if(total_unposted_gaslips >= 5) {
			throw new BadRequestException("Total unposted gas slips should not exceed by 5")
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

		const queries = []

		const createGasSlipQuery = this.prisma.gasSlip.create({
			data
		})

		queries.push(createGasSlipQuery)

		const createPendingQuery = this.getCreatePendingQuery(input.approvers, gasSlipNumber)
		queries.push(createPendingQuery)

        const result = await this.prisma.$transaction(queries)

		console.log('Successfully created Gas Slip')
        console.log('Pending with associated approver created successfully');

		return result[0]

	}

	private getCreatePendingQuery(approvers: CreateGasSlipApproverSubInput[], gasSlipNumber: string) {
		
		const module = getModule(DB_ENTITY.GAS_SLIP)

        const firstApprover = approvers.reduce((min, obj) => {
            return obj.order < min.order ? obj : min;
        }, approvers[0]);

        const data = {
            approver_id: firstApprover.approver_id,
            reference_number: gasSlipNumber,
            reference_table: DB_ENTITY.GAS_SLIP,
            description: `${ module.description } no. ${gasSlipNumber}`
        }

        return this.prisma.pending.create({ data })

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

	async findOne(id: string) {

		const item = await this.prisma.gasSlip.findUnique({
			include: {
				vehicle: true,
				gas_station: true,
				fuel_type: true,
			},
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Gas Slip not found')
		}

		return item
	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

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

	@OnEvent('gas-slip-approver-status.updated')
	async handle_gas_slip_approver_status_updated(payload: GasSlipApproverStatusUpdated) {

		console.log('handle_gas_slip_approver_status_updated', payload);
		
		const gasSlipApprover = await this.prisma.gasSlipApprover.findUnique({
			where: { id: payload.id },
			include: {
				gas_slip: {
					include: {
						gas_slip_approvers: true
					}
				}
			}
		})

		if (!gasSlipApprover) {
			throw new NotFoundException('gasSlipApprover not found with id: ' + payload.id)
		}

		if (gasSlipApprover.gas_slip.is_posted) {
			console.log('Gas Slip is already posted. End function')
			return
		}

		const approvers = gasSlipApprover.gas_slip.gas_slip_approvers
		console.log('approvers', approvers)

		const isApproved = this.isStatusApproved(approvers)

		if (!isApproved) {
			console.log('Gas Slip status is not approved. End function')
			return
		}

		// if gas slip is approved then set is_posted to false 

		const result = await this.prisma.gasSlip.update({
			where: {
				id: gasSlipApprover.gas_slip_id
			},
			data: {
				is_posted: false 
			}
		})

	}

	private isStatusApproved(approvers: GasSlipApprover[]) {
		for (let approver of approvers) {

			if (approver.status !== APPROVAL_STATUS.APPROVED) {
				return false
			}

		}

		return true
	}

}
