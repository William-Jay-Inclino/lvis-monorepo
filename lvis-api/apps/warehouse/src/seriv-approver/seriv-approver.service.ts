import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSerivApproverInput } from './dto/create-seriv-approver.input';
import { UpdateSerivApproverInput } from './dto/update-seriv-approver.input';
import { SERIVApprover } from 'apps/warehouse/prisma/generated/client';
import { PrismaService } from '../__prisma__/prisma.service';

@Injectable()
export class SerivApproverService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    create(createSerivApproverInput: CreateSerivApproverInput) {
        return 'This action adds a new serivApprover';
    }

    findAll() {
        return `This action returns all serivApprover`;
    }

    findOne(id: number) {
        return `This action returns a #${id} serivApprover`;
    }

    update(id: number, updateSerivApproverInput: UpdateSerivApproverInput) {
        return `This action updates a #${id} serivApprover`;
    }

    remove(id: number) {
        return `This action removes a #${id} serivApprover`;
    }

    async findBySerivId(serivId: string): Promise<SERIVApprover[]> {

        if (!serivId) {
            throw new BadRequestException('seriv_id is undefined')
        }

        return await this.prisma.sERIVApprover.findMany({
            where: {
                seriv_id: serivId
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
}
