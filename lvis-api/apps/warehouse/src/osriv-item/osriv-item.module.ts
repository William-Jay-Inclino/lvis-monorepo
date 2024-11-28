import { Module } from '@nestjs/common';
import { OsrivItemService } from './osriv-item.service';
import { OsrivItemResolver } from './osriv-item.resolver';
import { CommonService } from '../__common__/classes';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [
    OsrivItemResolver, 
    OsrivItemService,
    CommonService,
    WinstonLoggerService
  ],
})
export class OsrivItemModule {}
