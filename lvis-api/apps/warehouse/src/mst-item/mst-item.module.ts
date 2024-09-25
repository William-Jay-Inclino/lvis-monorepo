import { Module } from '@nestjs/common';
import { MstItemService } from './mst-item.service';
import { MstItemResolver } from './mst-item.resolver';

@Module({
  providers: [MstItemResolver, MstItemService],
})
export class MstItemModule {}
