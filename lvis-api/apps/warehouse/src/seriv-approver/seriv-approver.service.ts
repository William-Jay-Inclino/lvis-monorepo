import { Injectable } from '@nestjs/common';
import { CreateSerivApproverInput } from './dto/create-seriv-approver.input';
import { UpdateSerivApproverInput } from './dto/update-seriv-approver.input';

@Injectable()
export class SerivApproverService {
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
}
