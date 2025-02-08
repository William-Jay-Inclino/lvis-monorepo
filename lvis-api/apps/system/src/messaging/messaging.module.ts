import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';

@Module({
  providers: [MessagingService],
  exports: [MessagingService],
  controllers: [MessagingController],
})
export class MessagingModule {}
