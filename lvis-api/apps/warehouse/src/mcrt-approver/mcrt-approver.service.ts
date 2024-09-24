import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMcrtApproverInput } from './dto/create-mcrt-approver.input';
import { UpdateMcrtApproverInput } from './dto/update-mcrt-approver.input';
import { MCRTApprover } from 'apps/warehouse/prisma/generated/client';
import { PrismaService } from '../__prisma__/prisma.service';

@Injectable()
export class McrtApproverService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    create(createMcrtApproverInput: CreateMcrtApproverInput) {
        return 'This action adds a new mcrtApprover';
    }

    findAll() {
        return `This action returns all mcrtApprover`;
    }

    findOne(id: number) {
        return `This action returns a #${id} mcrtApprover`;
    }

    update(id: number, updateMcrtApproverInput: UpdateMcrtApproverInput) {
        return `This action updates a #${id} mcrtApprover`;
    }

    remove(id: number) {
        return `This action removes a #${id} mcrtApprover`;
    }

    async findByMcrtId(mcrtId: string): Promise<MCRTApprover[]> {

        if (!mcrtId) {
            throw new BadRequestException('mcrt_id is undefined')
        }

        return await this.prisma.mCRTApprover.findMany({
            where: {
                mcrt_id: mcrtId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
}
