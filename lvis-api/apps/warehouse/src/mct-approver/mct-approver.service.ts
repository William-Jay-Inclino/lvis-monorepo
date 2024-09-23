import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMctApproverInput } from './dto/create-mct-approver.input';
import { UpdateMctApproverInput } from './dto/update-mct-approver.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MCTApprover } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class MctApproverService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    create(CreateMrvApproverInput: CreateMctApproverInput) {
        return 'This action adds a new serivApprover';
    }

    findAll() {
        return `This action returns all serivApprover`;
    }

    findOne(id: number) {
        return `This action returns a #${id} serivApprover`;
    }

    update(id: number, updateMrvApproverInput: UpdateMctApproverInput) {
        return `This action updates a #${id} serivApprover`;
    }

    remove(id: number) {
        return `This action removes a #${id} serivApprover`;
    }

    async findByMctId(mctId: string): Promise<MCTApprover[]> {

        if (!mctId) {
            throw new BadRequestException('mrv_id is undefined')
        }

        return await this.prisma.mCTApprover.findMany({
            where: {
                mct_id: mctId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
}
