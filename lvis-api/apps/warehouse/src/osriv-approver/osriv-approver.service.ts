import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { OSRIVApprover } from 'apps/warehouse/prisma/generated/client';
import { AuthUser } from '../__common__/auth-user.entity';
import { ChangeOsrivApproverInput } from './dto/change-osriv-approver.input';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';

@Injectable()
export class OsrivApproverService {

    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async changeApprover(id: string, input: ChangeOsrivApproverInput) {
        return this.prisma.$transaction(async (prisma) => {
            const item = await prisma.oSRIVApprover.findUnique({
                where: { id },
                include: {
                    osriv: {
                        select: {
                            osriv_number: true,
                        },
                    },
                },
            });
    
            if (!item) {
                throw new NotFoundException('osriv approver not found with id of ' + id);
            }

            if(item.status !== APPROVAL_STATUS.PENDING) {
                throw new BadRequestException('Can only change approver if status is pending')
            }
    
            const updateOsrivApprover = await prisma.oSRIVApprover.update({
                where: { id },
                data: {
                    approver_id: input.new_approver_id,
                },
            });
    
            const pending = await prisma.pending.findUnique({
                where: {
                    approver_id_reference_number_reference_table: {
                        approver_id: item.approver_id,
                        reference_number: item.osriv.osriv_number,
                        reference_table: DB_ENTITY.OSRIV,
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
                        reference_number: item.osriv.osriv_number,
                        reference_table: DB_ENTITY.OSRIV,
                        description: `OSRIV no. ${item.osriv.osriv_number}`,
                    },
                });
            }
    
            return updateOsrivApprover;
        });
    }

    async findByOsrivId(osrivId: string): Promise<OSRIVApprover[]> {

        if (!osrivId) {
            throw new BadRequestException('osriv_id is undefined')
        }

        return await this.prisma.oSRIVApprover.findMany({
            where: {
                osriv_id: osrivId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
}
