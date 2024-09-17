import { Injectable } from '@nestjs/common';
import { CreateMrvItemInput } from './dto/create-mrv-item.input';
import { UpdateMrvItemInput } from './dto/update-mrv-item.input';

@Injectable()
export class MrvItemService {
  create(createMrvItemInput: CreateMrvItemInput) {
    return 'This action adds a new mrvItem';
  }

  findAll() {
    return `This action returns all mrvItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mrvItem`;
  }

  update(id: number, updateMrvItemInput: UpdateMrvItemInput) {
    return `This action updates a #${id} mrvItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} mrvItem`;
  }
}
