
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { RRApprover } from 'apps/warehouse/prisma/generated/client';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';

@Injectable()
export class RrApproverService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }


    // attach pending note if there is any. Will replace the rrApprover note
    // attach only if rrApprover status is pending
    async findByRrId(rrId: string, rr_number: string): Promise<RRApprover[]> {
        const approvers = await this.prisma.rRApprover.findMany({
            where: { rr_id: rrId },
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
                        reference_number: rr_number,
                        reference_table: DB_ENTITY.RR
                    }
                }
            })
        );
    
        const pendingResults = await Promise.all(pendingPromises);

        for(let approver of approvers) {
            const pending = pendingResults.find(i => {
                if(i) {
                    return i.approver_id === approver.approver_id
                }
            })

            // if approver has current pending. Use the pending note 
            if(pending && approver.status === APPROVAL_STATUS.PENDING) {
                approver.notes = pending.approver_notes
            }
        }
        
        return approvers; 
    }

   

}
