import { Injectable } from '@nestjs/common';
import { CreateMctApproverInput } from './dto/create-mct-approver.input';
import { UpdateMctApproverInput } from './dto/update-mct-approver.input';

@Injectable()
export class MctApproverService {
  create(createMctApproverInput: CreateMctApproverInput) {
    return 'This action adds a new mctApprover';
  }

  findAll() {
    return `This action returns all mctApprover`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mctApprover`;
  }

  update(id: number, updateMctApproverInput: UpdateMctApproverInput) {
    return `This action updates a #${id} mctApprover`;
  }

  remove(id: number) {
    return `This action removes a #${id} mctApprover`;
  }
}
