import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { RVApprover } from 'apps/warehouse/prisma/generated/client';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';

@Injectable()
export class RvApproverService {


    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // attach pending note if there is any. Will replace the rvApprover note
    // attach only if rvApprover status is pending
    async findByRvId(rvId: string, rv_number: string): Promise<RVApprover[]> {
        const approvers = await this.prisma.rVApprover.findMany({
            where: { rv_id: rvId },
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
                        reference_number: rv_number,
                        reference_table: DB_ENTITY.RV
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
