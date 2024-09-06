import { Injectable } from '@nestjs/common';
import { CreateOsrivItemInput } from './dto/create-osriv-item.input';
import { UpdateOsrivItemInput } from './dto/update-osriv-item.input';

@Injectable()
export class OsrivItemService {
  create(createOsrivItemInput: CreateOsrivItemInput) {
    return 'This action adds a new osrivItem';
  }

  findAll() {
    return `This action returns all osrivItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} osrivItem`;
  }

  update(id: number, updateOsrivItemInput: UpdateOsrivItemInput) {
    return `This action updates a #${id} osrivItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} osrivItem`;
  }
}
