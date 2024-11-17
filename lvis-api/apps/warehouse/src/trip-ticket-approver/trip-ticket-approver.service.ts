import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { TripTicketApprover } from 'apps/warehouse/prisma/generated/client';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { ChangeTripTicketApproverInput } from './dto/change-trip-ticket-approver.input';
import { APPROVAL_STATUS } from '../__common__/types';
import { DB_ENTITY } from '../__common__/constants';
import { getModule } from '../__common__/helpers';

@Injectable()
export class TripTicketApproverService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async changeApprover(id: string, input: ChangeTripTicketApproverInput) {
        return this.prisma.$transaction(async (prisma) => {
            const item = await prisma.tripTicketApprover.findUnique({
                where: { id },
                include: {
                    trip_ticket: {
                        select: {
                            trip_number: true,
                        },
                    },
                },
            });
    
            if (!item) {
                throw new NotFoundException('trip ticket approver not found with id of ' + id);
            }

            if(item.status !== APPROVAL_STATUS.PENDING) {
                throw new BadRequestException('Can only change approver if status is pending')
            }
    
            const updateApprover = await prisma.tripTicketApprover.update({
                where: { id },
                data: {
                    approver_id: input.new_approver_id,
                },
            });
    
            const pending = await prisma.pending.findUnique({
                where: {
                    approver_id_reference_number_reference_table: {
                        approver_id: item.approver_id,
                        reference_number: item.trip_ticket.trip_number,
                        reference_table: DB_ENTITY.TRIP_TICKET,
                    },
                },
            });
    
            if (pending) {
                // delete previous approver's pending
                await prisma.pending.delete({
                    where: { id: pending.id },
                });

                const module = getModule(DB_ENTITY.TRIP_TICKET)
    
                // add pending for new approver
                await prisma.pending.create({
                    data: {
                        approver_id: input.new_approver_id,
                        reference_number: item.trip_ticket.trip_number,
                        reference_table: DB_ENTITY.TRIP_TICKET,
                        description: `${ module.description } no. ${item.trip_ticket.trip_number}`,
                    },
                });
            }
    
            return updateApprover;
        });
    }

    async findByTripTicketId(tripTicketId: string): Promise<TripTicketApprover[]> {

        if (!tripTicketId) {
            throw new BadRequestException('tripTicketId is undefined')
        }

        return await this.prisma.tripTicketApprover.findMany({
            where: {
                trip_ticket_id: tripTicketId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }

}
