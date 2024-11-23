import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { RVApprover } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class RvApproverService {


    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findByRvId(rvId: string): Promise<RVApprover[]> {

        if (!rvId) {
            throw new BadRequestException('rv_id is undefined')
        }

        return await this.prisma.rVApprover.findMany({
            // include: this.includedFields,
            where: {
                rv_id: rvId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }

}
