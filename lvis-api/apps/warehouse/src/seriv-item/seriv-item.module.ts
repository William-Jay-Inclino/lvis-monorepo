import { Module } from '@nestjs/common';
import { SerivItemService } from './seriv-item.service';
import { SerivItemResolver } from './seriv-item.resolver';
import { CommonService } from '../__common__/classes';

@Module({
  providers: [
    SerivItemResolver, 
    SerivItemService,
    CommonService,
  ],
})
export class SerivItemModule {}
