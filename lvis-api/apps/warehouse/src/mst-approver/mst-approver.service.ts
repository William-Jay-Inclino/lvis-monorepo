import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMstApproverInput } from './dto/create-mst-approver.input';
import { UpdateMstApproverInput } from './dto/update-mst-approver.input';
import { MSTApprover } from 'apps/warehouse/prisma/generated/client';
import { PrismaService } from '../__prisma__/prisma.service';

@Injectable()
export class MstApproverService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    create(createMcrtApproverInput: CreateMstApproverInput) {
        return 'This action adds a new mcrtApprover';
    }

    findAll() {
        return `This action returns all mcrtApprover`;
    }

    findOne(id: number) {
        return `This action returns a #${id} mcrtApprover`;
    }

    update(id: number, updateMcrtApproverInput: UpdateMstApproverInput) {
        return `This action updates a #${id} mcrtApprover`;
    }

    remove(id: number) {
        return `This action removes a #${id} mcrtApprover`;
    }

    async findByMstId(mstId: string): Promise<MSTApprover[]> {

        if (!mstId) {
            throw new BadRequestException('mst_id is undefined')
        }

        return await this.prisma.mSTApprover.findMany({
            where: {
                mst_id: mstId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
}
