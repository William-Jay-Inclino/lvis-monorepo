import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { MSTApprover } from 'apps/warehouse/prisma/generated/client';
import { ChangeMstApproverInput } from './dto/change-mst-approver.input';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { getModule } from '../__common__/helpers';

@Injectable()
export class MstApproverService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async changeApprover(id: string, input: ChangeMstApproverInput) {
        return this.prisma.$transaction(async (prisma) => {
            const item = await prisma.mSTApprover.findUnique({
                where: { id },
                include: {
                    mst: {
                        select: {
                            mst_number: true,
                        },
                    },
                },
            });
    
            if (!item) {
                throw new NotFoundException('mst approver not found with id of ' + id);
            }

            if(item.status !== APPROVAL_STATUS.PENDING) {
                throw new BadRequestException('Can only change approver if status is pending')
            }
    
            const updateMstApprover = await prisma.mSTApprover.update({
                where: { id },
                data: {
                    approver_id: input.new_approver_id,
                },
            });
    
            const pending = await prisma.pending.findUnique({
                where: {
                    approver_id_reference_number_reference_table: {
                        approver_id: item.approver_id,
                        reference_number: item.mst.mst_number,
                        reference_table: DB_ENTITY.MST,
                    },
                },
            });
    
            if (pending) {
                // delete previous approver's pending
                await prisma.pending.delete({
                    where: { id: pending.id },
                });

                const module = getModule(DB_ENTITY.MST)
    
                // add pending for new approver
                await prisma.pending.create({
                    data: {
                        approver_id: input.new_approver_id,
                        reference_number: item.mst.mst_number,
                        reference_table: DB_ENTITY.MST,
                        description: `${ module.description } no. ${item.mst.mst_number}`,
                    },
                });
            }
    
            return updateMstApprover;
        });
    }

    async findByMstId(mstId: string): Promise<MSTApprover[]> {

        if (!mstId) {
            throw new BadRequestException('mst_id is undefined')
        }

        return await this.prisma.mSTApprover.findMany({
            where: {
                mst_id: mstId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
}
