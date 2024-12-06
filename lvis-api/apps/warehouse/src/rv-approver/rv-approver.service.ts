import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { RVApprover } from 'apps/warehouse/prisma/generated/client';
import { DB_ENTITY } from '../__common__/constants';

@Injectable()
export class RvApproverService {


    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findByRvId(rvId: string, rv_number: string): Promise<RVApprover[]> {
        // Fetch approvers for the given rv_id, ordered by 'order' in ascending order
        const approvers = await this.prisma.rVApprover.findMany({
            where: { rv_id: rvId },
            orderBy: { order: 'asc' }
        });
    
        // Create a set to track which approver_id has already been updated
        const updatedApprovers = new Set<string>();
    
        // Use Promise.all to fetch pending data for each approver
        const pendingPromises = approvers.map(approver => 
            this.prisma.pending.findUnique({
                select: { approver_notes: true },
                where: {
                    approver_id_reference_number_reference_table: {
                        approver_id: approver.approver_id,
                        reference_number: rv_number,
                        reference_table: DB_ENTITY.RV
                    }
                }
            })
        );
    
        const pendingResults = await Promise.all(pendingPromises);
    
        // Loop through approvers and update notes for the first occurrence of each approver_id
        for (let i = 0; i < approvers.length; i++) {
            const approver = approvers[i];
            const pending = pendingResults[i];
    
            // Update notes only if the approver_id hasn't been updated yet
            if (!updatedApprovers.has(approver.approver_id) && pending) {
                approver.notes = pending.approver_notes;
                updatedApprovers.add(approver.approver_id);  // Mark as updated
            }
        }
    
        return approvers;  // Return the original approvers list
    }
    
}
