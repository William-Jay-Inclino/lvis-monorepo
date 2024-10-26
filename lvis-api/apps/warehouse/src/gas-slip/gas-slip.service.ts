import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGasSlipInput } from './dto/create-gas-slip.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma } from 'apps/warehouse/prisma/generated/client';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { APPROVAL_STATUS } from 'apps/warehouse/src/__common__/types';
import { CreateGasSlipApproverSubInput } from './dto/create-gas-slip-approver.sub.input';
import { DB_ENTITY } from '../__common__/constants';

@Injectable()
export class GasSlipService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateGasSlipInput) {

		const total_unposted_gaslips = await this.get_total_unposted_gas_slips(input.requested_by_id)

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

	private getCreatePendingQuery(approvers: CreateGasSlipApproverSubInput[], tripNumber: string) {

        const firstApprover = approvers.reduce((min, obj) => {
            return obj.order < min.order ? obj : min;
        }, approvers[0]);

        const data = {
            approver_id: firstApprover.approver_id,
            reference_number: tripNumber,
            reference_table: DB_ENTITY.TRIP_TICKET,
            description: `Trip no. ${tripNumber}`
        }

        return this.prisma.pending.create({ data })

    }

	async findAll() {
		return await this.prisma.gasSlip.findMany()
	}

	async findOne(id: string) {

		const item = await this.prisma.gasSlip.findUnique({
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

	async get_total_unposted_gas_slips(requested_by_id: string) {
		const unpostedGasSlipsCount = await this.prisma.gasSlip.count({
			where: {
			  requested_by_id,
			  is_posted: false,
			},
		  });
	  
		  return unpostedGasSlipsCount;
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

}
