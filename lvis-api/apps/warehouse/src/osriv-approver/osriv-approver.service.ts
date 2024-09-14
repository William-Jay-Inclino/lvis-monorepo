import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOsrivApproverInput } from './dto/create-osriv-approver.input';
import { UpdateOsrivApproverInput } from './dto/update-osriv-approver.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { OSRIVApprover } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class OsrivApproverService {

  constructor(
      private readonly prisma: PrismaService,
  ) { }

  create(createOsrivApproverInput: CreateOsrivApproverInput) {
    return 'This action adds a new osrivApprover';
  }

  findAll() {
    return `This action returns all osrivApprover`;
  }

  findOne(id: number) {
    return `This action returns a #${id} osrivApprover`;
  }

  update(id: number, updateOsrivApproverInput: UpdateOsrivApproverInput) {
    return `This action updates a #${id} osrivApprover`;
  }

  remove(id: number) {
    return `This action removes a #${id} osrivApprover`;
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
