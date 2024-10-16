import { Module } from '@nestjs/common';
import { SerivItemService } from './seriv-item.service';
import { SerivItemResolver } from './seriv-item.resolver';
import { CommonService } from '../__common__/classes';
import { HttpModule } from '@nestjs/axios';
import { McrtService } from '../mcrt/mcrt.service';

@Module({
  imports: [HttpModule],
  providers: [
    SerivItemResolver, 
    SerivItemService,
    McrtService,
    CommonService,
  ],
})
export class SerivItemModule {}
