import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { JOApprover } from 'apps/warehouse/prisma/generated/client';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';

@Injectable()
export class JoApproverService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // attach pending note if there is any. Will replace the joApprover note
    // attach only if joApprover status is pending
    async findByJoId(joId: string, jo_number: string): Promise<JOApprover[]> {
        const approvers = await this.prisma.jOApprover.findMany({
            where: { jo_id: joId },
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
                        reference_number: jo_number,
                        reference_table: DB_ENTITY.JO
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
