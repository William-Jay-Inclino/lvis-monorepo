import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripTicketInput } from './dto/create-trip-ticket.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma } from 'apps/warehouse/prisma/generated/client';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { TRIP_TICKET_STATUS } from './entities/trip-ticket.enums';
import { APPROVAL_STATUS } from 'apps/warehouse/src/__common__/types';
import { CreateTripTicketApproverSubInput } from './dto/create-trip-ticket-approver.sub.input';
import { DB_ENTITY } from '../__common__/constants';
import { TripTicketsResponse } from './entities/trip-tickets-response.entity';

@Injectable()
export class TripTicketService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateTripTicketInput) {

		const start_time = new Date(input.start_time);
		const end_time = new Date(input.end_time);

		await this.validateTripScheduleConflict(input.vehicle_id, start_time, end_time);

		const tripNumber = await this.getLatestTripNumber()

		const data: Prisma.TripTicketCreateInput = {
			trip_number: tripNumber,
			vehicle: { connect: { id: input.vehicle_id } },
			driver_id: input.driver_id,
			passengers: input.passengers,
			destination: input.destination,
			purpose: input.purpose,
			start_time,
			end_time,
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

		const queries = []

		const createTripQuery = this.prisma.tripTicket.create({
			data
		})

		queries.push(createTripQuery)

		const createPendingQuery = this.getCreatePendingQuery(input.approvers, tripNumber)

		queries.push(createPendingQuery)

        const result = await this.prisma.$transaction(queries)

		console.log('Successfully created Trip Ticket')
        console.log('Pending with associated approver created successfully');

		return result[0]

	}

	private async validateTripScheduleConflict(vehicleId: string, startTime: Date, endTime: Date) {
		const conflictingTrip = await this.prisma.tripTicket.findFirst({
		  where: {
			vehicle_id: vehicleId,
			AND: [
			  { start_time: { lt: endTime } },
			  { end_time: { gt: startTime } },
			],
		  },
		});
	
		if (conflictingTrip) {
		  throw new BadRequestException(
			'There is a scheduling conflict with another trip for this vehicle in the selected time range.'
		  );
		}
	}

	private getCreatePendingQuery(approvers: CreateTripTicketApproverSubInput[], tripNumber: string) {

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

	async findAll(
		page: number,
		pageSize: number,
		vehicle_id?: string,
		driver_id?: string,
		date_prepared?: string,
		estimated_departure?: string,
	  ): Promise<TripTicketsResponse> {
		const skip = (page - 1) * pageSize;
		const take = pageSize;
	  
		const filters: any = {};
		if (vehicle_id) filters.vehicle_id = vehicle_id;
		if (driver_id) filters.driver_id = driver_id;
		if (date_prepared) filters.created_at = { gte: new Date(date_prepared) };
		if (estimated_departure) filters.start_time = { gte: new Date(estimated_departure) };
	  
		const [totalItems, tripTickets] = await this.prisma.$transaction([
		  this.prisma.tripTicket.count({ where: filters }),
		  this.prisma.tripTicket.findMany({
			include: {
				vehicle: true,
			},
			where: filters,
			skip,
			take,
			orderBy: { created_at: 'desc' },
		  }),
		]);
	  
		const totalPages = Math.ceil(totalItems / pageSize);
	  
		return {
		  data: tripTickets,
		  totalItems,
		  currentPage: page,
		  totalPages,
		};
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

	private async getLatestTripNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.tripTicket.findFirst({
            where: { trip_number: { startsWith: currentYear } },
            orderBy: { trip_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.trip_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

	async getScheduledTrips(d: {start: Date, end: Date}) {
		return this.prisma.tripTicket.findMany({
			where: {
				start_time: {
					gte: d.start,
				},
				end_time: {
					lte: d.end,
				},
			},
			orderBy: {
			  	start_time: 'asc',
			},
		});
	}

}
