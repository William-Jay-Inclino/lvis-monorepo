import { Injectable } from '@nestjs/common';
import { CreateSerivInput } from './dto/create-seriv.input';
import { UpdateSerivInput } from './dto/update-seriv.input';

@Injectable()
export class SerivService {
  create(createSerivInput: CreateSerivInput) {
    return 'This action adds a new seriv';
  }

  findAll() {
    return `This action returns all seriv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seriv`;
  }

  update(id: number, updateSerivInput: UpdateSerivInput) {
    return `This action updates a #${id} seriv`;
  }

  remove(id: number) {
    return `This action removes a #${id} seriv`;
  }
}
