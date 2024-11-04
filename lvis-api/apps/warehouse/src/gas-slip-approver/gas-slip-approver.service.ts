import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGasSlipApproverInput } from './dto/create-gas-slip-approver.input';
import { UpdateGasSlipApproverInput } from './dto/update-gas-slip-approver.input';
import { GasSlipApprover } from 'apps/warehouse/prisma/generated/client';
import { PrismaService } from '../__prisma__/prisma.service';

@Injectable()
export class GasSlipApproverService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  create(createGasSlipApproverInput: CreateGasSlipApproverInput) {
    return 'This action adds a new gasSlipApprover';
  }

  findAll() {
    return `This action returns all gasSlipApprover`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gasSlipApprover`;
  }

  update(id: number, updateGasSlipApproverInput: UpdateGasSlipApproverInput) {
    return `This action updates a #${id} gasSlipApprover`;
  }

  remove(id: number) {
    return `This action removes a #${id} gasSlipApprover`;
  }

  async findByGasSlipId(gas_slip_id: string): Promise<GasSlipApprover[]> {

    if (!gas_slip_id) {
        throw new BadRequestException('gas_slip_id is undefined')
    }

    return await this.prisma.gasSlipApprover.findMany({
        where: {
            gas_slip_id
        },
        orderBy: {
            order: 'asc'
        }
    })
  }

}
