import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { SERIVApprover } from 'apps/warehouse/prisma/generated/client';
import { ChangeSerivApproverInput } from './dto/change-seriv-approver.input';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

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
    
                // add pending for new approver
                await prisma.pending.create({
                    data: {
                        approver_id: input.new_approver_id,
                        reference_number: item.seriv.seriv_number,
                        reference_table: DB_ENTITY.SERIV,
                        description: `SERIV no. ${item.seriv.seriv_number}`,
                    },
                });
            }
    
            return updateSerivApprover;
        });
    }

    async findBySerivId(serivId: string): Promise<SERIVApprover[]> {

        if (!serivId) {
            throw new BadRequestException('seriv_id is undefined')
        }

        return await this.prisma.sERIVApprover.findMany({
            where: {
                seriv_id: serivId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
}
