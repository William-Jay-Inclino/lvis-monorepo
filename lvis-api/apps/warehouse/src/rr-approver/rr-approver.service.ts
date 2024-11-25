
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { RRApprover } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class RrApproverService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }


    async findByRrId(rrId: string): Promise<RRApprover[]> {

        return await this.prisma.rRApprover.findMany({
            where: {
                rr_id: rrId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }

   

}
