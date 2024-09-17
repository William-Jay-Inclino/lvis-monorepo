import { Injectable } from '@nestjs/common';
import { CreateMrvInput } from './dto/create-mrv.input';
import { UpdateMrvInput } from './dto/update-mrv.input';

@Injectable()
export class MrvService {
  create(createMrvInput: CreateMrvInput) {
    return 'This action adds a new mrv';
  }

  findAll() {
    return `This action returns all mrv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mrv`;
  }

  update(id: number, updateMrvInput: UpdateMrvInput) {
    return `This action updates a #${id} mrv`;
  }

  remove(id: number) {
    return `This action removes a #${id} mrv`;
  }
}
