import { Module } from '@nestjs/common';
import { CanvassItemService } from './canvass-item.service';
import { CanvassItemResolver } from './canvass-item.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [CanvassItemService, CanvassItemResolver, WinstonLoggerService]
})
export class CanvassItemModule {}
