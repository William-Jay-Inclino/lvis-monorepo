import { Injectable } from '@nestjs/common';
import { CreateMcrtItemInput } from './dto/create-mcrt-item.input';
import { UpdateMcrtItemInput } from './dto/update-mcrt-item.input';

@Injectable()
export class McrtItemService {
  create(createMcrtItemInput: CreateMcrtItemInput) {
    return 'This action adds a new mcrtItem';
  }

  findAll() {
    return `This action returns all mcrtItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mcrtItem`;
  }

  update(id: number, updateMcrtItemInput: UpdateMcrtItemInput) {
    return `This action updates a #${id} mcrtItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} mcrtItem`;
  }
}
