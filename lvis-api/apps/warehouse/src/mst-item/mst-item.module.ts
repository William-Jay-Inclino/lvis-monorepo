import { Module } from '@nestjs/common';
import { MstItemService } from './mst-item.service';
import { MstItemResolver } from './mst-item.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [MstItemResolver, MstItemService, WinstonLoggerService],
})
export class MstItemModule {}
