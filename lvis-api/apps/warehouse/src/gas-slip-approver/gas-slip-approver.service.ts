import { Injectable } from '@nestjs/common';
import { CreateGasSlipApproverInput } from './dto/create-gas-slip-approver.input';
import { UpdateGasSlipApproverInput } from './dto/update-gas-slip-approver.input';

@Injectable()
export class GasSlipApproverService {
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
}
