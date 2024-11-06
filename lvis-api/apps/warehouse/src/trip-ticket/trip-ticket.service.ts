import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripTicketInput } from './dto/create-trip-ticket.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, TripTicket, TripTicketApprover } from 'apps/warehouse/prisma/generated/client';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { TRIP_TICKET_STATUS } from './entities/trip-ticket.enums';
import { APPROVAL_STATUS } from 'apps/warehouse/src/__common__/types';
import { CreateTripTicketApproverSubInput } from './dto/create-trip-ticket-approver.sub.input';
import { DB_ENTITY } from '../__common__/constants';
import { TripTicketsResponse } from './entities/trip-tickets-response.entity';
import { VEHICLE_STATUS } from '../vehicle/entities/vehicle.enums';
import { UpdateActualTimeResponse } from './entities/update-actual-time-response.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { TripTicketApproverStatusUpdated } from '../trip-ticket-approver/events/trip-ticket-approver-status-updated.event';

@Injectable()
export class TripTicketService {

	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateTripTicketInput) {

		const startTime = new Date(input.start_time);
		const endTime = new Date(input.end_time);

		const vehicle = await this.prisma.vehicle.findUnique({
			where: { id: input.vehicle_id }
		})

		if(!vehicle) {
			throw new NotFoundException('Vehicle not found with id of ' + input.vehicle_id)
		}

		if(vehicle.status !== VEHICLE_STATUS.AVAILABLE_FOR_TRIP) {
			throw new BadRequestException("Vehicle not available for trip")
		}

		await this.validateTripScheduleConflict({
			vehicleId: input.vehicle_id,
			driverId: input.driver_id,
			startTime,
			endTime
		});

		const tripNumber = await this.getLatestTripNumber()

		const data: Prisma.TripTicketCreateInput = {
			trip_number: tripNumber,
			vehicle: { connect: { id: input.vehicle_id } },
			driver_id: input.driver_id,
			passengers: input.passengers,
			destination: input.destination,
			purpose: input.purpose,
			start_time: startTime,
			end_time: endTime,
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
			include: {
				vehicle: true,
			},
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

	async getScheduledTrips(d: {start: Date, end: Date}) {

		console.log('getScheduledTrips', d);
		
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

	async update_actual_time(rf_id: string): Promise<UpdateActualTimeResponse> {
		
		// get vehicle by RFID
		const vehicle = await this.prisma.vehicle.findUnique({
		  	where: { rf_id },
		});
	
		if (!vehicle) {

			return {
				success: false,
				msg: `No vehicle found with the corresponding RFID.`
			}

		}
	
		const currentDateTime = new Date();

		const inProgressTrip = await this.prisma.tripTicket.findFirst({
			where: {
				vehicle_id: vehicle.id,
				status: TRIP_TICKET_STATUS.IN_PROGRESS,
				actual_start_time: { not: null },
				actual_end_time: null
			}
		})

		if(inProgressTrip) {

			await this.prisma.$transaction(async (prisma) => {
				await prisma.tripTicket.update({
					where: { id: inProgressTrip.id },
					data: {
						actual_end_time: currentDateTime,
						status: TRIP_TICKET_STATUS.COMPLETED
					},
				});
		  
				await prisma.vehicle.update({
				  where: { id: vehicle.id },
				  data: {
					status: VEHICLE_STATUS.AVAILABLE_FOR_TRIP,
				  },
				});
			});

			const updatedTripTicket = await this.findOne(inProgressTrip.id);

			return {
				success: true,
				msg: 'Actual arrival time recorded successfully',
				data: updatedTripTicket,
			}

		}

		// get trip to depart 
		const toDepartTrip = await this.prisma.tripTicket.findFirst({
			where: {
				vehicle_id: vehicle.id,
				start_time: { lte: currentDateTime },
				end_time: { gte: currentDateTime },
				status: TRIP_TICKET_STATUS.APPROVED,
				actual_start_time: null,
			},
		});


		// update actual_start_time 
		if(toDepartTrip) {

			await this.prisma.$transaction(async (prisma) => {
				await prisma.tripTicket.update({
					where: { id: toDepartTrip.id },
					data: {
						actual_start_time: currentDateTime,
						status: TRIP_TICKET_STATUS.IN_PROGRESS
					},
				});
			
				await prisma.vehicle.update({
					where: { id: vehicle.id },
					data: {
						status: VEHICLE_STATUS.IN_USE,
					},
				});
			});

			const updatedTripTicket = await this.findOne(toDepartTrip.id);

			return {
				success: true,
				msg: 'Actual Departure time recorded successfully',
				data: updatedTripTicket,
			}

		}



		return {
			success: false,
			msg: `No active trip ticket found for this vehicle at this time.`
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

	private async validateTripScheduleConflict(payload: {
		vehicleId: string,
		driverId: string,
		startTime: Date,
		endTime: Date,
	}) {
		const { vehicleId, driverId, startTime, endTime } = payload

		const conflictingTrip = await this.prisma.tripTicket.findFirst({
			where: {
				status: { in: [TRIP_TICKET_STATUS.PENDING, TRIP_TICKET_STATUS.APPROVED, TRIP_TICKET_STATUS.IN_PROGRESS] },
				OR: [
					{
						vehicle_id: vehicleId,
						AND: [{ start_time: { lt: endTime } }, { end_time: { gt: startTime } }],
					},
					{
						driver_id: driverId,
						AND: [{ start_time: { lt: endTime } }, { end_time: { gt: startTime } }],
					},
				],
			},
		});
	  
		if (conflictingTrip) {
		  throw new BadRequestException(
			'There is a scheduling conflict with another trip for this vehicle or driver in the selected time range.'
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

	@OnEvent('trip-ticket-approver-status.updated')
	async handle_trip_ticket_approver_status_updated(payload: TripTicketApproverStatusUpdated) {

		console.log('handle_trip_ticket_approver_status_updated', payload);
		
		const tripApprover = await this.prisma.tripTicketApprover.findUnique({
			where: { id: payload.id },
			include: {
				trip_ticket: {
					include: {
						trip_ticket_approvers: true
					}
				}
			}
		})

		if (!tripApprover) {
			throw new NotFoundException('tripApprover not found with id: ' + payload.id)
		}

		if (tripApprover.trip_ticket.status === TRIP_TICKET_STATUS.COMPLETED) {
			console.log('Trip Ticket is already completed. End function')
			return
		}

		const approvers = tripApprover.trip_ticket.trip_ticket_approvers
		console.log('approvers', approvers)

		const isApproved = this.isStatusApproved(approvers)

		if (!isApproved) {
			console.log('Trip Ticket status is not approved. End function')
			return
		}

		// if trip ticket approvers are all approved then set trip ticket status to approve

		const result = await this.prisma.tripTicket.update({
			where: {
				id: tripApprover.trip_ticket_id
			},
			data: {
				status: APPROVAL_STATUS.APPROVED
			}
		})

		console.log('Trip ticket status set to approve successfully');

	}

	private isStatusApproved(approvers: TripTicketApprover[]) {
		for (let approver of approvers) {

			if (approver.status !== APPROVAL_STATUS.APPROVED) {
				return false
			}

		}

		return true
	}

}
