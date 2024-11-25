import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { POApprover } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class PoApproverService {


    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findByPoId(poId: string): Promise<POApprover[]> {


        return await this.prisma.pOApprover.findMany({
            where: {
                po_id: poId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }

    

}
