import { Module } from '@nestjs/common';
import { MrvItemService } from './mrv-item.service';
import { MrvItemResolver } from './mrv-item.resolver';
import { CommonService } from '../__common__/classes';
import { SerivItemService } from '../seriv-item/seriv-item.service';
import { McrtService } from '../mcrt/mcrt.service';
import { HttpModule } from '@nestjs/axios';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  imports: [HttpModule],
  providers: [
    MrvItemResolver, 
    MrvItemService,
    CommonService,
    SerivItemService,
    McrtService,
    WinstonLoggerService
  ],
})
export class MrvItemModule {}
