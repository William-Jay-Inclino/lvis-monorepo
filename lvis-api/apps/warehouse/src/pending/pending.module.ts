import { Module } from '@nestjs/common';
import { PendingService } from './pending.service';
import { PendingResolver } from './pending.resolver';
import { HttpModule } from '@nestjs/axios';
import { ItemService } from '../item/item.service';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { CommonService } from '../__common__/classes';

@Module({
  imports: [HttpModule],
  providers: [PendingResolver, PendingService, ItemService, WinstonLoggerService, CommonService],
  exports: [PendingService],
})
export class PendingModule {}
