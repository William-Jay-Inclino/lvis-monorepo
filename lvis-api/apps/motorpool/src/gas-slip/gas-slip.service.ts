import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGasSlipInput } from './dto/create-gas-slip.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma } from 'apps/motorpool/prisma/generated/client';
import { MotorpoolRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { APPROVAL_STATUS } from 'apps/warehouse/src/__common__/types';

@Injectable()
export class GasSlipService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateGasSlipInput) {

		const data: Prisma.GasSlipCreateInput = {
			gas_slip_number: '',
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

		const created = await this.prisma.gasSlip.create({
			data
		})

		console.log('Successfully created Gas Slip')

		return created

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

	async remove(id: string): Promise<MotorpoolRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.gasSlip.delete({
			where: { id },
		})

		return {
			success: true,
			msg: "Gas Slip successfully deleted"
		}

	}

}
