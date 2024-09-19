import { Injectable } from '@nestjs/common';
import { CreateMctInput } from './dto/create-mct.input';
import { UpdateMctInput } from './dto/update-mct.input';

@Injectable()
export class MctService {
  create(createMctInput: CreateMctInput) {
    return 'This action adds a new mct';
  }

  findAll() {
    return `This action returns all mct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mct`;
  }

  update(id: number, updateMctInput: UpdateMctInput) {
    return `This action updates a #${id} mct`;
  }

  remove(id: number) {
    return `This action removes a #${id} mct`;
  }
}
