import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { SERIVApprover } from 'apps/warehouse/prisma/generated/client';
import { ChangeSerivApproverInput } from './dto/change-seriv-approver.input';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { getModule } from '../__common__/helpers';

@Injectable()
export class SerivApproverService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async changeApprover(id: string, input: ChangeSerivApproverInput) {
        return this.prisma.$transaction(async (prisma) => {
            const item = await prisma.sERIVApprover.findUnique({
                where: { id },
                include: {
                    seriv: {
                        select: {
                            seriv_number: true,
                        },
                    },
                },
            });
    
            if (!item) {
                throw new NotFoundException('seriv approver not found with id of ' + id);
            }

            if(item.status !== APPROVAL_STATUS.PENDING) {
                throw new BadRequestException('Can only change approver if status is pending')
            }
    
            const updateSerivApprover = await prisma.sERIVApprover.update({
                where: { id },
                data: {
                    approver_id: input.new_approver_id,
                },
            });
    
            const pending = await prisma.pending.findUnique({
                where: {
                    approver_id_reference_number_reference_table: {
                        approver_id: item.approver_id,
                        reference_number: item.seriv.seriv_number,
                        reference_table: DB_ENTITY.SERIV,
                    },
                },
            });
    
            if (pending) {
                // delete previous approver's pending
                await prisma.pending.delete({
                    where: { id: pending.id },
                });

                const module = getModule(DB_ENTITY.SERIV)
    
                // add pending for new approver
                await prisma.pending.create({
                    data: {
                        approver_id: input.new_approver_id,
                        reference_number: item.seriv.seriv_number,
                        reference_table: DB_ENTITY.SERIV,
                        description: `${ module.description } no. ${item.seriv.seriv_number}`,
                    },
                });
            }
    
            return updateSerivApprover;
        });
    }

    // attach pending note if there is any. Will replace the serivApprover note
    // attach only if serivApprover status is pending
    async findBySerivId(serivId: string, seriv_number: string): Promise<SERIVApprover[]> {
        const approvers = await this.prisma.sERIVApprover.findMany({
            where: { seriv_id: serivId },
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
                        reference_number: seriv_number,
                        reference_table: DB_ENTITY.SERIV
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
