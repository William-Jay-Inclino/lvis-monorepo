import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { MCRTApprover } from 'apps/warehouse/prisma/generated/client';
import { ChangeMcrtApproverInput } from './dto/change-mcrt-approver.input';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class McrtApproverService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async changeApprover(id: string, input: ChangeMcrtApproverInput) {
        return this.prisma.$transaction(async (prisma) => {
            const item = await prisma.mCRTApprover.findUnique({
                where: { id },
                include: {
                    mcrt: {
                        select: {
                            mcrt_number: true,
                        },
                    },
                },
            });
    
            if (!item) {
                throw new NotFoundException('mcrt approver not found with id of ' + id);
            }

            if(item.status !== APPROVAL_STATUS.PENDING) {
                throw new BadRequestException('Can only change approver if status is pending')
            }
    
            const updateMcrtApprover = await prisma.mCRTApprover.update({
                where: { id },
                data: {
                    approver_id: input.new_approver_id,
                },
            });
    
            const pending = await prisma.pending.findUnique({
                where: {
                    approver_id_reference_number_reference_table: {
                        approver_id: item.approver_id,
                        reference_number: item.mcrt.mcrt_number,
                        reference_table: DB_ENTITY.MCRT,
                    },
                },
            });
    
            if (pending) {
                // delete previous approver's pending
                await prisma.pending.delete({
                    where: { id: pending.id },
                });
    
                // add pending for new approver
                await prisma.pending.create({
                    data: {
                        approver_id: input.new_approver_id,
                        reference_number: item.mcrt.mcrt_number,
                        reference_table: DB_ENTITY.MCRT,
                        description: `MCRT no. ${item.mcrt.mcrt_number}`,
                    },
                });
            }
    
            return updateMcrtApprover;
        });
    }

    async findByMcrtId(mcrtId: string): Promise<MCRTApprover[]> {

        if (!mcrtId) {
            throw new BadRequestException('mcrt_id is undefined')
        }

        return await this.prisma.mCRTApprover.findMany({
            where: {
                mcrt_id: mcrtId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
}
