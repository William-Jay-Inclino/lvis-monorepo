import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { MEQSApprover } from 'apps/warehouse/prisma/generated/client';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';
@Injectable()
export class MeqsApproverService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }


    // attach pending note if there is any. Will replace the meqsApprover note
    // attach only if meqsApprover status is pending
    async findByMeqsId(meqsId: string, meqs_number: string): Promise<MEQSApprover[]> {
        const approvers = await this.prisma.mEQSApprover.findMany({
            where: { meqs_id: meqsId },
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
                        reference_number: meqs_number,
                        reference_table: DB_ENTITY.MEQS
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
