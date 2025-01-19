import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GasSlipApprover } from 'apps/warehouse/prisma/generated/client';
import { PrismaService } from '../__prisma__/prisma.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { ChangeGasSlipApproverInput } from './dto/change-gas-slip-approver.input';
import { APPROVAL_STATUS } from '../__common__/types';
import { DB_ENTITY } from '../__common__/constants';
import { getModule } from '../__common__/helpers';

@Injectable()
export class GasSlipApproverService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async changeApprover(id: string, input: ChangeGasSlipApproverInput) {

        return this.prisma.$transaction(async (prisma) => {
            const item = await prisma.gasSlipApprover.findUnique({
                where: { id },
                include: {
                    gas_slip: {
                        select: {
                            gas_slip_number: true,
                            gas_slip_approvers: {
                                orderBy: {
                                    order: 'asc'
                                }
                            }
                        },
                    },
                },
            });

            if (!item) {
                throw new NotFoundException('gas slip approver not found with id of ' + id);
            }

            if(item.status !== APPROVAL_STATUS.PENDING) {
                throw new BadRequestException('Can only change approver if status is pending')
            }

            const pending = await prisma.pending.findUnique({
                where: {
                    reference_number_reference_table: {
                        reference_number: item.gas_slip.gas_slip_number,
                        reference_table: DB_ENTITY.GAS_SLIP,
                    },
                },
            });

            if (pending) {

                const approvers = item.gas_slip.gas_slip_approvers.filter(i => i.approver_id === item.approver_id)

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

            const updateApprover = await prisma.gasSlipApprover.update({
                where: { id },
                data: {
                    approver_id: input.new_approver_id,
                },
            });

            return updateApprover;
        });
    }

    // attach pending note if there is any. Will replace the gasSlipApprover note
    // attach only if gasSlipApprover status is pending
    async findByGasSlipId(gasId: string, gas_number: string): Promise<GasSlipApprover[]> {
        const approvers = await this.prisma.gasSlipApprover.findMany({
            where: { gas_slip_id: gasId },
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
                        reference_number: gas_number,
                        reference_table: DB_ENTITY.GAS_SLIP
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
