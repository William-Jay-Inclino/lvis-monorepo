import { Module } from '@nestjs/common';
import { McrtItemService } from './mcrt-item.service';
import { McrtItemResolver } from './mcrt-item.resolver';
import { CommonService } from '../__common__/classes';
import { SerivItemService } from '../seriv-item/seriv-item.service';
import { McrtService } from '../mcrt/mcrt.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    McrtItemResolver, 
    McrtItemService, 
    CommonService, 
    SerivItemService,
    McrtService,
  ],
})
export class McrtItemModule {}
