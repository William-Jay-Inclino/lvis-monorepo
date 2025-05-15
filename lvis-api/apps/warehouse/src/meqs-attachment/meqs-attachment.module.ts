import { Module } from '@nestjs/common';
import { MeqsAttachmentService } from './meqs-attachment.service';
import { MeqsAttachmentResolver } from './meqs-attachment.resolver';

@Module({
  providers: [MeqsAttachmentResolver, MeqsAttachmentService],
})
export class MeqsAttachmentModule {}
