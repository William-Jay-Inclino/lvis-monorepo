import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { JOApprover } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class JoApproverService {

  private readonly logger = new Logger(JoApproverService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findByJoId(joId: string): Promise<JOApprover[]> {

    this.logger.log('findByJoId()', joId)

    if (!joId) {
      throw new BadRequestException('jo_id is undefined')
    }

    return await this.prisma.jOApprover.findMany({
      where: {
        jo_id: joId
      },
      orderBy: {
        order: 'asc'
      }
    })
  }

}
