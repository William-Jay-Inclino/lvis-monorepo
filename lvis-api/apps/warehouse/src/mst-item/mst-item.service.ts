import { Injectable } from '@nestjs/common';
import { CreateMstItemInput } from './dto/create-mst-item.input';
import { UpdateMstItemInput } from './dto/update-mst-item.input';

@Injectable()
export class MstItemService {
  create(createMstItemInput: CreateMstItemInput) {
    return 'This action adds a new mstItem';
  }

  findAll() {
    return `This action returns all mstItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mstItem`;
  }

  update(id: number, updateMstItemInput: UpdateMstItemInput) {
    return `This action updates a #${id} mstItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} mstItem`;
  }
}
