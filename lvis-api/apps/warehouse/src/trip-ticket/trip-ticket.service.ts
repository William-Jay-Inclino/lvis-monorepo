import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripTicketInput } from './dto/create-trip-ticket.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma } from 'apps/warehouse/prisma/generated/client';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { TRIP_TICKET_STATUS } from './entities/trip-ticket.enums';
import { APPROVAL_STATUS } from 'apps/warehouse/src/__common__/types';

@Injectable()
export class TripTicketService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateTripTicketInput) {

		const data: Prisma.TripTicketCreateInput = {
			vehicle: { connect: { id: input.vehicle_id } },
			driver_id: input.driver_id,
			passengers: input.passengers,
			destination: input.destination,
			purpose: input.purpose,
			start_time: input.start_time,
			end_time: input.end_time,
			is_operation: input.is_operation,
			is_stay_in: input.is_stay_in,
			is_personal: input.is_personal,
			is_out_of_coverage: input.is_out_of_coverage,
			prepared_by_id: input.prepared_by_id,
			status: TRIP_TICKET_STATUS.PENDING,
			created_by: this.authUser.user.username,
			trip_ticket_approvers: {
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

		const created = await this.prisma.tripTicket.create({
			data
		})

		console.log('Successfully created Trip Ticket')

		return created

	}

	async findAll() {
		return await this.prisma.tripTicket.findMany()
	}

	async findOne(id: string) {

		const item = await this.prisma.tripTicket.findUnique({
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Trip Ticket not found')
		}

		return item
	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.tripTicket.delete({
			where: { id },
		})

		return {
			success: true,
			msg: "Trip Ticket successfully deleted"
		}

	}

}
