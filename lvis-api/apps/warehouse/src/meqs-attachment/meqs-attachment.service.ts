import { Injectable } from '@nestjs/common';
import { CreateMeqsAttachmentInput } from './dto/create-meqs-attachment.input';
import { UpdateMeqsAttachmentInput } from './dto/update-meqs-attachment.input';

@Injectable()
export class MeqsAttachmentService {
  create(createMeqsAttachmentInput: CreateMeqsAttachmentInput) {
    return 'This action adds a new meqsAttachment';
  }

  findAll() {
    return `This action returns all meqsAttachment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meqsAttachment`;
  }

  update(id: number, updateMeqsAttachmentInput: UpdateMeqsAttachmentInput) {
    return `This action updates a #${id} meqsAttachment`;
  }

  remove(id: number) {
    return `This action removes a #${id} meqsAttachment`;
  }
}
