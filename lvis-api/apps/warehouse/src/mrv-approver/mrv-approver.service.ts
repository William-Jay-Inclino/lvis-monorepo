import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMrvApproverInput } from './dto/create-mrv-approver.input';
import { UpdateMrvApproverInput } from './dto/update-mrv-approver.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MRVApprover } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class MrvApproverService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    create(CreateMrvApproverInput: CreateMrvApproverInput) {
        return 'This action adds a new serivApprover';
    }

    findAll() {
        return `This action returns all serivApprover`;
    }

    findOne(id: number) {
        return `This action returns a #${id} serivApprover`;
    }

    update(id: number, updateMrvApproverInput: UpdateMrvApproverInput) {
        return `This action updates a #${id} serivApprover`;
    }

    remove(id: number) {
        return `This action removes a #${id} serivApprover`;
    }

    async findByMrvId(mrvId: string): Promise<MRVApprover[]> {

        if (!mrvId) {
            throw new BadRequestException('mrv_id is undefined')
        }

        return await this.prisma.mRVApprover.findMany({
            where: {
                mrv_id: mrvId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
}
