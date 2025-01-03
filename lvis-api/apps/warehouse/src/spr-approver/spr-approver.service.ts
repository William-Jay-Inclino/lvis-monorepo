import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { SPRApprover } from 'apps/warehouse/prisma/generated/client';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';

@Injectable()
export class SprApproverService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

        // attach pending note if there is any. Will replace the sprApprover note
        // attach only if sprApprover status is pending
        async findBySprId(sprId: string, spr_number: string): Promise<SPRApprover[]> {
            const approvers = await this.prisma.sPRApprover.findMany({
                where: { spr_id: sprId },
                orderBy: { order: 'asc' }
            });
    
    
            const pendingPromises = approvers.map(approver => 
                this.prisma.pending.findUnique({
                    select: {
                            approver_id: true, 
                            approver_notes: true 
                    },
                    where: {
                            approver_id_reference_number_reference_table: {
                                approver_id: approver.approver_id,
                                reference_number: spr_number,
                                reference_table: DB_ENTITY.SPR
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
