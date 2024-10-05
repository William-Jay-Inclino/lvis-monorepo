import { Module } from '@nestjs/common';
import { MstItemService } from './mst-item.service';
import { MstItemResolver } from './mst-item.resolver';
import { CommonService } from '../__common__/classes';

@Module({
  providers: [MstItemResolver, MstItemService, CommonService],
})
export class MstItemModule {}
