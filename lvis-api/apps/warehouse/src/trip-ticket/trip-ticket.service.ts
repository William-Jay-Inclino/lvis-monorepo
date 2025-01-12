import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripTicketInput } from './dto/create-trip-ticket.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, TripTicket, TripTicketApprover } from 'apps/warehouse/prisma/generated/client';
import { WarehouseCancelResponse, WarehouseRemoveResponse } from '../__common__/classes';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { TRIP_TICKET_STATUS } from './entities/trip-ticket.enums';
import { APPROVAL_STATUS } from 'apps/warehouse/src/__common__/types';
import { DB_ENTITY } from '../__common__/constants';
import { TripTicketsResponse } from './entities/trip-tickets-response.entity';
import { VEHICLE_STATUS } from '../vehicle/entities/vehicle.enums';
import { UpdateActualTimeResponse } from './entities/update-actual-time-response.entity';
import { getDateRange, getModule, isAdmin, isNormalUser } from '../__common__/helpers';
import { UpdateTripTicketInput } from './dto/update-trip-ticket.input';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Employee } from '../__employee__/entities/employee.entity';
import { endOfYear, startOfYear } from 'date-fns';
import { CreateTripResponse } from './entities/create-trip-response.entity';
import * as moment from 'moment';
import { get_pending_description_for_motorpool, getEmployee } from '../__common__/utils';

@Injectable()
export class TripTicketService {

	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateTripTicketInput): Promise<CreateTripResponse> {

		if (!(await this.canCreate(input))) {
            throw new Error('Failed to create TripTicket. Please try again')
        }

		const startTime = new Date(input.start_time);
		const endTime = new Date(input.end_time);

		const vehicle = await this.prisma.vehicle.findUnique({
			where: { id: input.vehicle_id }
		})

		if(!vehicle) {
			throw new NotFoundException('Vehicle not found with id of ' + input.vehicle_id)
		}

		// if(vehicle.status !== VEHICLE_STATUS.AVAILABLE_FOR_TRIP) {
		// 	throw new BadRequestException("Vehicle not available for trip")
		// }

		const validate_response = await this.validateTripScheduleConflict({
			vehicleId: input.vehicle_id,
			driverId: input.driver_id,
			startTime,
			endTime
		});

		if(validate_response.success === false) {
			return {
				success: false,
				msg: validate_response.msg,
			}
		}

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
						status: TRIP_TICKET_STATUS.PENDING,
                    }
                })
            }
		}

        return await this.prisma.$transaction(async (tx) => {

            const trip_created = await tx.tripTicket.create({
				data,
				include: {
					vehicle: true
				}
			})

            const firstApprover = input.approvers.reduce((min, obj) => {
                return obj.order < min.order ? obj : min;
            }, input.approvers[0]);

			const requisitioner = await getEmployee(trip_created.prepared_by_id, this.authUser)
			
			const description = get_pending_description_for_motorpool({
				vehicle: trip_created.vehicle,
				employee: requisitioner,
				purpose: trip_created.purpose,
				label: 'Prepared by'
			})
    
            const pendingData = {
                approver_id: firstApprover.approver_id,
                reference_number: tripNumber,
                reference_table: DB_ENTITY.TRIP_TICKET,
                description
            }

            await tx.pending.create({ data: pendingData })

            return {
				success: true,
				msg: 'Trip Ticket created successfully!',
				data: trip_created
			}
        });

	}

	async update(id: string, input: UpdateTripTicketInput): Promise<CreateTripResponse> {
        const existingItem = await this.prisma.tripTicket.findUnique({
            where: { id },
            include: {
                trip_ticket_approvers: true
            }
        })

        if (!existingItem) {
            throw new NotFoundException('Trip ticket not found')
        }

		if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can update this record!')
        }

		if (!(await this.canUpdate(input, existingItem))) {
            throw new Error('Failed to update Trip Ticket. Please try again')
        }

		let startTime = null
		let endTime = null

		if ((input.start_time && !input.end_time) || (!input.start_time && input.end_time)) {
			throw new BadRequestException('Start time and End time are both required');
		}
		  
		if (input.start_time && input.end_time) {
			startTime = new Date(input.start_time);
			endTime = new Date(input.end_time);
		  
			const validate_response = await this.validateTripScheduleConflict({
				tripId: id,
				vehicleId: input.vehicle_id,
				driverId: input.driver_id,
				startTime,
				endTime
			});

			if(validate_response.success === false) {
				return {
					success: false,
					msg: validate_response.msg,
				}
			}

		}

		const queries = []

		const data: Prisma.TripTicketUpdateInput = {
            updated_by: this.authUser.user.username,
			vehicle: input.vehicle_id ? 
				{ connect: { id: input.vehicle_id } }
				: 
				{ connect: { id: existingItem.vehicle_id } },
			driver_id: input.driver_id ?? existingItem.driver_id,
			passengers: input.passengers ?? existingItem.passengers,
			destination: input.destination ?? existingItem.destination,
			purpose: input.purpose ?? existingItem.purpose,
			start_time: startTime ?? existingItem.start_time,
			end_time: endTime ?? existingItem.end_time,
			is_operation: input.is_operation ?? existingItem.is_operation,
			is_stay_in: input.is_stay_in ?? existingItem.is_stay_in,
			is_personal: input.is_personal ?? existingItem.is_personal,
			is_out_of_coverage: input.is_out_of_coverage ?? existingItem.is_out_of_coverage,
			prepared_by_id: input.prepared_by_id ?? existingItem.prepared_by_id,
		}

		const updateTripQ = this.prisma.tripTicket.update({
			where: { id },
			data
		})

		queries.push(updateTripQ)
		
		// change vehicle so change also the 1st approver or the vehicle assignee
		if(input.vehicle_id && input.vehicle_id !== existingItem.vehicle_id) {

			const existingAssignee = existingItem.trip_ticket_approvers.find(i => i.order === 1)

			if(!existingAssignee) {
				throw new NotFoundException(`Trip ticket approver not found with trip number of ${existingItem.trip_number} and order is 1`)
			}

			const vehicle = await this.prisma.vehicle.findUnique({
				where: {
					id: input.vehicle_id
				},
				select: {
					id: true,
					assignee_id: true,
				}
			})

			const updateAssigneeQ = this.prisma.tripTicketApprover.update({
				where: {
					id: existingAssignee.id
				},
				data: {
					approver_id: vehicle.assignee_id
				}
			})

			queries.push(updateAssigneeQ)
		}

		// is_operation is truthy and needs to change the approver GM
		if(input.is_operation !== undefined && input.is_operation !== existingItem.is_operation) {

			const existingGM = existingItem.trip_ticket_approvers.find(i => i.order === 4)

			// remove
			if(existingGM) {
				const removeGmQ = this.prisma.tripTicketApprover.delete({
					where: {
						id: existingGM.id
					}
				})
				queries.push(removeGmQ)
			}

			// add gm as approver
			if(input.is_operation === false) {

				const general_manager = await this.get_general_manager(this.authUser)

				if(!general_manager) {
					throw new NotFoundException("General manager is not found or undefined")
				}

				const updateGmQ = this.prisma.tripTicketApprover.create({
					data: {
						trip_ticket_id: id,
						approver_id: general_manager.id,
						label: 'GM / OIC',
						order: 4,
						notes: '',
						status: TRIP_TICKET_STATUS.PENDING,
					}
				})

				queries.push(updateGmQ)
				
			}

		}

		const result = await this.prisma.$transaction(queries)

		return {
			success: true,
			msg: 'Trip Ticket updated successfully!',
			data: result[0]
		}

	}

	async cancel(id: string): Promise<WarehouseCancelResponse> {

        const existingItem = await this.prisma.tripTicket.findUnique({
            where: { id }
        })

        if (!existingItem) {
            throw new NotFoundException('Trip Ticket not found')
        }

        if (!this.canAccess(existingItem)) {
            throw new ForbiddenException('Only Admin and Owner can cancel this record!')
        }

        const queries: Prisma.PrismaPromise<any>[] = []
        
        const updateTripQuery = this.prisma.tripTicket.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: this.authUser.user.username,
				status: TRIP_TICKET_STATUS.CANCELLED,
            },
            where: { id }
        })

        queries.push(updateTripQuery)

        // delete all associated pendings

        const deleteAssociatedPendings = this.prisma.pending.deleteMany({
            where: {
                reference_number: existingItem.trip_number
            }
        })

        queries.push(deleteAssociatedPendings)

        const result = await this.prisma.$transaction(queries)

        return {
            success: true,
            msg: 'Successfully cancelled Trip Ticket',
            cancelled_at: result[0].cancelled_at,
            cancelled_by: result[0].cancelled_by
        }

    }

	async findAll(
		page: number,
		pageSize: number,
		vehicle_id?: string,
		driver_id?: string,
		date_prepared?: string,
		estimated_departure?: string,
		trip_status?: number
	  ): Promise<TripTicketsResponse> {
		const skip = (page - 1) * pageSize;
		const take = pageSize;
	  
		const filters: any = {};
		if (vehicle_id) filters.vehicle_id = vehicle_id;
		if (driver_id) filters.driver_id = driver_id;
		// if (date_prepared) filters.created_at = { gte: new Date(date_prepared) };

		if (date_prepared) {
            const { startDate, endDate } = getDateRange(date_prepared);

            filters.created_at = {
                gte: startDate,
                lte: endDate,
            };

        }

		if (estimated_departure) {
            const { startDate, endDate } = getDateRange(estimated_departure);

            filters.start_time = {
                gte: startDate,
                lte: endDate,
            };

        }

		// if (estimated_departure) filters.start_time = { gte: new Date(estimated_departure) };

		if (trip_status) {
            filters.status = trip_status;
        }

        // Default to current year's records if neither filter is provided
        if (!vehicle_id && !driver_id && !date_prepared && !estimated_departure && !trip_status) {
            const startOfYearDate = startOfYear(new Date());
            const endOfYearDate = endOfYear(new Date());

            filters.created_at = {
                gte: startOfYearDate,
                lte: endOfYearDate,
            };
        }
	  
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

	async findTripsByTripNumber(tripNumber: string, includeDetails: boolean = false) {

		const trimmedTripNumber = tripNumber.trim(); 

        let selectClause;
        if (includeDetails) {
            selectClause = { 
                id: true,
                trip_number: true, 
                vehicle: true,
                driver_id: true,
                created_at: true,
				start_time: true,
				status: true,
            }; 
        } else {
            selectClause = { trip_number: true };
        }

        const items = await this.prisma.tripTicket.findMany({
            select: selectClause,
            where: {
                trip_number: {
                    startsWith: trimmedTripNumber
                },
                cancelled_at: null
            },
            orderBy: {
                trip_number: 'desc'
            },
            take: 10,
        });

        return items;
    }

	async findOne(payload: { id?: string; trip_number?: string }) {
		const { id, trip_number } = payload;

		const item = await this.prisma.tripTicket.findUnique({
			include: {
				vehicle: true,
			},
			where: id ? { id } : { trip_number }
		})

		if (!item) {
			throw new NotFoundException('Trip Ticket not found')
		}

		return item
	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {

		const existingItem = await this.findOne({ id })

		await this.prisma.tripTicket.delete({
			where: { id },
		})

		return {
			success: true,
			msg: "Trip Ticket successfully deleted"
		}

	}

	async getScheduledTrips(d: { start: Date, end: Date }) {

		return this.prisma.tripTicket.findMany({
			include: {
					vehicle: true,
			},
			where: {
				start_time: {
					gte: d.start, 
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

			const updatedTripTicket = await this.findOne({ id: inProgressTrip.id });

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

			const updatedTripTicket = await this.findOne({ id: toDepartTrip.id });

			return {
				success: true,
				msg: 'Actual Departure time recorded successfully',
				data: updatedTripTicket,
			}

		}

		const vehicle_nearest_trip = await this.get_nearest_trip_of_vehicle(vehicle.id)
		
		return {
			success: false,
			msg: `No active trip ticket found for this vehicle at this time.`,
			data: vehicle_nearest_trip
		}

		
		
	}

	async get_nearest_trip_of_vehicle(vehicle_id: string): Promise<TripTicket | null> {
		const currentTime = new Date();
	  
		// Define start and end of the current day
		const startOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 0, 0, 0);
		const endOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 23, 59, 59);
	  
		// Query trips only within the current day, sorted by start_time
		const trips = await this.prisma.tripTicket.findMany({
			include: {
				vehicle: true,
			},
			where: {
				vehicle_id,
				start_time: {
				gte: startOfDay,
				lte: endOfDay,
				},
			},
		});
	  
		if (trips.length === 0) return null;
	  
		const nearestTrip = trips.reduce((closest, current) => {
			const currentDiff = Math.abs(new Date(current.start_time).getTime() - currentTime.getTime());
			const closestDiff = Math.abs(new Date(closest.start_time).getTime() - currentTime.getTime());
		  
			return currentDiff < closestDiff ? current : closest;
		  }, trips[0]); 
	  
		return nearestTrip;
	}

	async remove_actual_start_time(id: string): Promise<UpdateActualTimeResponse> {

		return await this.prisma.$transaction(async (prisma) => {
			const existing_trip_ticket = await prisma.tripTicket.findUnique({
				where: {
					id,
				},
			});

			if(!existing_trip_ticket) {
				throw new NotFoundException("Trip ticket not found with id: " + id)
			}
		
			if (existing_trip_ticket.actual_end_time) {
				return {
					success: false,
					msg: 'Can only remove actual departure time if actual arrival time is null',
				};
			}

			if(!existing_trip_ticket.actual_start_time) {
				return {
					success: false,
					msg: 'Actual departure time is already null',
				};
			}
		
			const trip_ticket = await prisma.tripTicket.update({
				where: {
					id,
				},
				data: {
					actual_start_time: null,
					status: TRIP_TICKET_STATUS.APPROVED,
				},
			});
		
			await prisma.vehicle.update({
				where: {
					id: trip_ticket.vehicle_id,
				},
				data: {
					status: VEHICLE_STATUS.AVAILABLE_FOR_TRIP,
				},
			});
		
			return {
				success: true,
				msg: 'Actual departure time removed',
				data: trip_ticket
			};
		});
	}

	async remove_actual_end_time(id: string): Promise<UpdateActualTimeResponse> {
		return await this.prisma.$transaction(async (prisma) => {

			const existing_trip_ticket = await prisma.tripTicket.findUnique({
				where: {
					id,
				},
			});

			if(!existing_trip_ticket) {
				throw new NotFoundException("Trip ticket not found with id: " + id)
			}

			if (!existing_trip_ticket.actual_end_time) {
				return {
					success: false,
					msg: 'Actual arrival time is already null',
				};
			}
		
			const trip_ticket = await prisma.tripTicket.update({
				where: {
					id,
				},
				data: {
					actual_end_time: null,
					status: TRIP_TICKET_STATUS.IN_PROGRESS,
				},
			});
		
			await prisma.vehicle.update({
				where: {
					id: trip_ticket.vehicle_id,
				},
				data: {
					status: VEHICLE_STATUS.IN_USE,
				},
			});
		
			return {
				success: true,
				msg: 'Actual arrival time removed',
				data: trip_ticket
			};
		});
	}

	async update_actual_start_time(id: string, start_time: string): Promise<UpdateActualTimeResponse> {
		return await this.prisma.$transaction(async (prisma) => {

			const existing_trip_ticket = await prisma.tripTicket.findUnique({
				where: {
					id,
				},
			});

			if (!existing_trip_ticket) {
				throw new NotFoundException('Trip ticket not found with id: ' + id);
			}

			if (!!existing_trip_ticket.actual_start_time) {

				const trip_ticket = await prisma.tripTicket.update({
					where: { id },
					data: {
					actual_start_time: new Date(start_time),
				},
				});

				return {
					success: true,
					msg: 'Actual departure time updated',
					data: trip_ticket,
				};

			} else {
				
				const trip_ticket = await prisma.tripTicket.update({
					where: { id },
					data: {
						actual_start_time: new Date(start_time),
						status: TRIP_TICKET_STATUS.IN_PROGRESS,
					},
				});

				await prisma.vehicle.update({
					where: {
						id: trip_ticket.vehicle_id,
					},
					data: {
						status: VEHICLE_STATUS.IN_USE,
					},
				});

				return {
					success: true,
					msg: 'Actual departure time updated',
					data: trip_ticket,
				};
			}
		});
	}

	async update_actual_end_time(id: string, end_time: string): Promise<UpdateActualTimeResponse> {
		return await this.prisma.$transaction(async (prisma) => {
			const existing_trip_ticket = await prisma.tripTicket.findUnique({
				where: {
					id,
				},
			});

			if (!existing_trip_ticket) {
				throw new NotFoundException('Trip ticket not found with id: ' + id);
			}

			if (existing_trip_ticket.actual_end_time) {
				const trip_ticket = await prisma.tripTicket.update({
					where: { id },
					data: {
						actual_end_time: new Date(end_time),
					},
				});

				return {
					success: true,
					msg: 'Actual arrival time updated',
					data: trip_ticket,
				};
			} else {
				const trip_ticket = await prisma.tripTicket.update({
					where: { id },
					data: {
						actual_end_time: new Date(end_time),
						status: TRIP_TICKET_STATUS.COMPLETED,
					},
				});

				await prisma.vehicle.update({
					where: {
						id: trip_ticket.vehicle_id,
					},
					data: {
						status: VEHICLE_STATUS.AVAILABLE_FOR_TRIP,
					},
				});

				return {
					success: true,
					msg: 'Actual arrival time updated',
					data: trip_ticket,
				};
			}
		});
	}

	async canUpdateForm(trip_ticket_id: string): Promise<Boolean> {

        const trip_ticket = await this.prisma.tripTicket.findUnique({
            where: {
                id: trip_ticket_id
            },
            select: {
                created_by: true,
                trip_ticket_approvers: true
            }
        })

        const hasPermission = trip_ticket.created_by === this.authUser.user.username || isAdmin(this.authUser);

        if (!hasPermission) {
            return false
        }

        const hasApproval = trip_ticket.trip_ticket_approvers.find(i => i.status !== APPROVAL_STATUS.PENDING)

        if (hasApproval) {
            return false
        }

        return true

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
		tripId?: string,
		vehicleId: string,
		driverId: string,
		startTime: Date,
		endTime: Date,
	}): Promise<{success: boolean, msg: string}> {
		const { tripId, vehicleId, driverId, startTime, endTime } = payload

		if (startTime >= endTime) {
			throw new BadRequestException('Start time must be earlier than End time');
		}

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
				...(tripId && { id: { not: tripId } }), // Exclude current trip if tripId is provided
			},
			include: {
				vehicle: {
					select: {
						name: true,
						vehicle_number: true,
					}
				}
			}
		});
	  
		if (conflictingTrip) {

			const formattedStart = moment(conflictingTrip.start_time).format('MMM DD YYYY, hh:mm A'); 
			const formattedEnd = moment(conflictingTrip.end_time).format('MMM DD YYYY, hh:mm A');

			return {
				success: false,
				msg: `Scheduling conflict detected for Trip Number ${conflictingTrip.trip_number} using vehicle ${conflictingTrip.vehicle.vehicle_number} ${conflictingTrip.vehicle.name}. The trip is scheduled from ${formattedStart} to ${formattedEnd}.`,
			}
		} else {
			return {
				success: true,
				msg: 'No conflict. Can create'
			}
		}
	}

	private async canCreate(input: CreateTripTicketInput): Promise<boolean> {

        const employeeIds: string[] = input.approvers.map(({ approver_id }) => approver_id);

		employeeIds.push(input.driver_id)
		employeeIds.push(input.prepared_by_id)

        const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

        if (!isValidEmployeeIds) {
            throw new BadRequestException("One or more employee id is invalid")
        }

        return true

    }

	private async canUpdate(input: UpdateTripTicketInput, existingItem: TripTicket): Promise<boolean> {

        // validates if there is already an approver who take an action
        if (isNormalUser(this.authUser)) {

            const approvers = await this.prisma.tripTicketApprover.findMany({
                where: {
                    trip_ticket_id: existingItem.id
                }
            })

            // used to indicate whether there is at least one approver whose status is not pending.
            const isAnyNonPendingApprover = this.isAnyNonPendingApprover(approvers)

            if (isAnyNonPendingApprover) {
                throw new BadRequestException(`Unable to update Trip Ticket. Can only update if all approver's status is pending`)
            }
        }

        const employeeIds = []

        if (input.driver_id) {
            employeeIds.push(input.driver_id)
        }

		if (input.prepared_by_id) {
            employeeIds.push(input.prepared_by_id)
        }

        if (employeeIds.length > 0) {

            const isValidEmployeeIds = await this.areEmployeesExist(employeeIds, this.authUser)

            if (!isValidEmployeeIds) {
                throw new NotFoundException('One or more employee IDs is not valid')
            }

        }

        return true
    }

	private canAccess(item: TripTicket): boolean {

        if (isAdmin(this.authUser)) return true

        const isOwner = item.created_by === this.authUser.user.username

        if (isOwner) return true

        return false

    }

	// used to indicate whether there is at least one approver whose status is not pending.
	private isAnyNonPendingApprover(approvers: TripTicketApprover[]): boolean {

		for (let approver of approvers) {

			if (approver.status !== APPROVAL_STATUS.PENDING) {

				return true

			}

		}

		return false

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

	private async get_general_manager(authUser: AuthUser): Promise<Employee | null> {

        const query = `
            query {
                general_manager {
					id 
				}
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
                return null;
            }

            return data.data.general_manager;

        } catch (error) {
            return null;
        }
    }


}
