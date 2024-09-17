import { Injectable } from '@nestjs/common';
import { CreateMrvApproverInput } from './dto/create-mrv-approver.input';
import { UpdateMrvApproverInput } from './dto/update-mrv-approver.input';

@Injectable()
export class MrvApproverService {
  create(createMrvApproverInput: CreateMrvApproverInput) {
    return 'This action adds a new mrvApprover';
  }

  findAll() {
    return `This action returns all mrvApprover`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mrvApprover`;
  }

  update(id: number, updateMrvApproverInput: UpdateMrvApproverInput) {
    return `This action updates a #${id} mrvApprover`;
  }

  remove(id: number) {
    return `This action removes a #${id} mrvApprover`;
  }
}
