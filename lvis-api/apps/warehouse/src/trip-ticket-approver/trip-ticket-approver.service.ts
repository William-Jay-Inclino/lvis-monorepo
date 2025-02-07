import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, TripTicketApprover } from 'apps/warehouse/prisma/generated/client';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { ChangeTripTicketApproverInput } from './dto/change-trip-ticket-approver.input';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { DB_ENTITY } from '../__common__/constants';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class TripTicketApproverService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: WarehouseAuditService,
    ) { }

    /*
        Problem: 2 the same approvers then update 2nd approver. The pending of the first approver is affected

        Solution: 
        1. Should only update pending if 1st approver is selected

        Algorithm:
        1. Get all approvers
        2. Get order of the approver to update
        3. Check if approver to update has duplicates
        4. If has duplicate then check if it's not 1st. Only update pending if first 

    */

    async changeApprover(
        id: string, 
        input: ChangeTripTicketApproverInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {
        return this.prisma.$transaction(async (prisma) => {

            const authUser = metadata.authUser

            const item = await prisma.tripTicketApprover.findUnique({
                where: { id },
                include: {
                    trip_ticket: {
                        select: {
                            trip_number: true,
                            trip_ticket_approvers: {
                                orderBy: {
                                    order: 'asc'
                                }
                            }
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
    
            // check if ang approver na ilisan kay naay pendings 
            // if naay pendings then change the pending to the new approver
            
            const pending = await prisma.pending.findFirst({
                where: {
                    reference_number: item.trip_ticket.trip_number,
                    reference_table: DB_ENTITY.TRIP_TICKET,
                    approver_id: item.approver_id,
                },
            });
    
            if (pending) {

                const approvers = item.trip_ticket.trip_ticket_approvers.filter(i => i.approver_id === item.approver_id)

                // check if approver to update has duplicates
                if(approvers.length > 1) {

                    const leastOrder = approvers.reduce((min, obj) => {
                        return obj.order < min.order ? obj : min
                    }, approvers[0])

                    // can update since approver to update has the least order. Meaning first on the queue
                    if(item.id === leastOrder.id) {

                        // delete previous approver's pending
                        await prisma.pending.delete({
                            where: { id: pending.id },
                        });
        
                        // add pending for new approver
                        await prisma.pending.create({
                            data: {
                                approver_id: input.new_approver_id,
                                reference_number: pending.reference_number,
                                reference_table: pending.reference_table,
                                description: pending.description,
                            },
                        });
                    }
                } else {
                    // delete previous approver's pending
                    await prisma.pending.delete({
                        where: { id: pending.id },
                    });
    
                    // add pending for new approver
                    await prisma.pending.create({
                        data: {
                            approver_id: input.new_approver_id,
                            reference_number: pending.reference_number,
                            reference_table: pending.reference_table,
                            description: pending.description,
                        },
                    });
                }
            }

            const updateApprover = await prisma.tripTicketApprover.update({
                where: { id },
                data: {
                    approver_id: input.new_approver_id,
                },
            });

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.TRIP_TICKET_APPROVER,
                action: 'CHANGE-TRIP-TICKET-APPROVER',
                reference_id: id,
                metadata: {
                    'old_approver_id': item.approver_id,
                    'new_approver_id': input.new_approver_id,
                },
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, prisma as Prisma.TransactionClient)
    
            return updateApprover;
        });
    }

    // attach pending note if there is any. Will replace the tripTicketApprover note
    // attach only if tripTicketApprover status is pending
    async findByTripTicketId(tripId: string, trip_number: string): Promise<TripTicketApprover[]> {
        const approvers = await this.prisma.tripTicketApprover.findMany({
            where: { trip_ticket_id: tripId },
            orderBy: { order: 'asc' }
        });
    
    
        const pendingPromises = approvers.map(approver => 
            this.prisma.pending.findUnique({
                select: {
                    approver_id: true, 
                    approver_notes: true 
                },
                where: {
                    reference_number_reference_table: {
                        reference_number: trip_number,
                        reference_table: DB_ENTITY.TRIP_TICKET
                    }
                }
            })
        );
    
        const pendingResults = await Promise.all(pendingPromises);
        const added_notes_approver = []

        for(let approver of approvers) {
            const pending = pendingResults.find(i => {
                if(i) {
                    return i.approver_id === approver.approver_id
                }
            })

            // if approver has current pending. Use the pending note 
            if(pending && approver.status === APPROVAL_STATUS.PENDING) {

                if(added_notes_approver.includes(approver.approver_id)) {
                    continue
                }

                added_notes_approver.push(approver.approver_id)
                
                approver.notes = pending.approver_notes
            }
        }
        
        return approvers; 
    }

}
