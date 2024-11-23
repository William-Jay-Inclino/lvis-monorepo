import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { SPRApprover } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class SprApproverService {

  private readonly logger = new Logger(SprApproverService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findBySprId(sprId: string): Promise<SPRApprover[]> {

    this.logger.log('findBySprId()', sprId)

    if (!sprId) {
      throw new BadRequestException('sprId is undefined')
    }

    return await this.prisma.sPRApprover.findMany({
      // include: this.includedFields,
      where: {
        spr_id: sprId
      },
      orderBy: {
        order: 'asc'
      }
    })
  }


}
