import { Module } from '@nestjs/common';
import { McrtItemService } from './mcrt-item.service';
import { McrtItemResolver } from './mcrt-item.resolver';
import { CommonService } from '../__common__/classes';

@Module({
  providers: [McrtItemResolver, McrtItemService, CommonService],
})
export class McrtItemModule {}
