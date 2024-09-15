import { Injectable } from '@nestjs/common';
import { CreateSerivItemInput } from './dto/create-seriv-item.input';
import { UpdateSerivItemInput } from './dto/update-seriv-item.input';

@Injectable()
export class SerivItemService {
  create(createSerivItemInput: CreateSerivItemInput) {
    return 'This action adds a new serivItem';
  }

  findAll() {
    return `This action returns all serivItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serivItem`;
  }

  update(id: number, updateSerivItemInput: UpdateSerivItemInput) {
    return `This action updates a #${id} serivItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} serivItem`;
  }
}
