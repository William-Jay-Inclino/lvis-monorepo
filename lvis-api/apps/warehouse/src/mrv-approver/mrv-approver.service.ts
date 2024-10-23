import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { MRVApprover } from 'apps/warehouse/prisma/generated/client';
import { ChangeMrvApproverInput } from './dto/change-mrv-approver.input';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class MrvApproverService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async changeApprover(id: string, input: ChangeMrvApproverInput) {
        return this.prisma.$transaction(async (prisma) => {
            const item = await prisma.mRVApprover.findUnique({
                where: { id },
                include: {
                    mrv: {
                        select: {
                            mrv_number: true,
                        },
                    },
                },
            });
    
            if (!item) {
                throw new NotFoundException('mrv approver not found with id of ' + id);
            }

            if(item.status !== APPROVAL_STATUS.PENDING) {
                throw new BadRequestException('Can only change approver if status is pending')
            }
    
            const updateMrvApprover = await prisma.mRVApprover.update({
                where: { id },
                data: {
                    approver_id: input.new_approver_id,
                },
            });
    
            const pending = await prisma.pending.findUnique({
                where: {
                    approver_id_reference_number_reference_table: {
                        approver_id: item.approver_id,
                        reference_number: item.mrv.mrv_number,
                        reference_table: DB_ENTITY.MRV,
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
                        reference_number: item.mrv.mrv_number,
                        reference_table: DB_ENTITY.MRV,
                        description: `MRV no. ${item.mrv.mrv_number}`,
                    },
                });
            }
    
            return updateMrvApprover;
        });
    }

    async findByMrvId(mrvId: string): Promise<MRVApprover[]> {

        if (!mrvId) {
            throw new BadRequestException('mrv_id is undefined')
        }

        return await this.prisma.mRVApprover.findMany({
            where: {
                mrv_id: mrvId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
}
