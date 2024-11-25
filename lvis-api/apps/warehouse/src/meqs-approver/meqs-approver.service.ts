import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { MEQSApprover } from 'apps/warehouse/prisma/generated/client';
@Injectable()
export class MeqsApproverService {

    private readonly logger = new Logger(MeqsApproverService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }


    async findByMeqsId(meqsId: string): Promise<MEQSApprover[]> {

        this.logger.log('findByMeqsId()', meqsId)

        return await this.prisma.mEQSApprover.findMany({
            where: {
                meqs_id: meqsId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }

   

}
