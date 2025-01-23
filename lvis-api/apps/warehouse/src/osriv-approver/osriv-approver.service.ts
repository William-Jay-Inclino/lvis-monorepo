import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { OSRIVApprover } from 'apps/warehouse/prisma/generated/client';
import { ChangeOsrivApproverInput } from './dto/change-osriv-approver.input';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { getModule } from '../__common__/helpers';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OsrivApproverService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: WarehouseAuditService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async changeApprover(
        id: string, input: ChangeOsrivApproverInput, 
		metadata: { ip_address: string, device_info: any }
    ) {
        return this.prisma.$transaction(async (prisma) => {
            const item = await prisma.oSRIVApprover.findUnique({
                where: { id },
                include: {
                    osriv: {
                        select: {
                            osriv_number: true,
                            osriv_approvers: {
                                orderBy: {
                                    order: 'asc'
                                }
                            }
                        },
                    },
                },
            });
    
            if (!item) {
                throw new NotFoundException('osriv approver not found with id of ' + id);
            }

            if(item.status !== APPROVAL_STATUS.PENDING) {
                throw new BadRequestException('Can only change approver if status is pending')
            }
    
            // check if ang approver na ilisan kay naay pendings 
            // if naay pendings then change the pending to the new approver
            
            const pending = await prisma.pending.findFirst({
                where: {
                    reference_number: item.osriv.osriv_number,
                    reference_table: DB_ENTITY.OSRIV,
                    approver_id: item.approver_id,
                },
            });
    
            if (pending) {

                const approvers = item.osriv.osriv_approvers.filter(i => i.approver_id === item.approver_id)

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

            const updateOsrivApprover = await prisma.oSRIVApprover.update({
                where: { id },
                data: {
                    approver_id: input.new_approver_id,
                },
            });

            await this.audit.createAuditEntry({
                username: this.authUser.user.username,
                table: DB_TABLE.OSRIV_APPROVER,
                action: 'CHANGE-OSRIV-APPROVER',
                reference_id: id,
                metadata: {
                    'old_approver_id': item.approver_id,
                    'new_approver_id': input.new_approver_id,
                },
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, prisma as Prisma.TransactionClient)
    
            return updateOsrivApprover;
        });
    }

    // attach pending note if there is any. Will replace the osrivApprover note
    // attach only if osrivApprover status is pending
    async findByOsrivId(osrivId: string, osriv_number: string): Promise<OSRIVApprover[]> {
        const approvers = await this.prisma.oSRIVApprover.findMany({
            where: { osriv_id: osrivId },
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
                        reference_number: osriv_number,
                        reference_table: DB_ENTITY.OSRIV
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
