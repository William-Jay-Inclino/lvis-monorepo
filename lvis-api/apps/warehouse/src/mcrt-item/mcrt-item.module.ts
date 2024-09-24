import { Module } from '@nestjs/common';
import { McrtItemService } from './mcrt-item.service';
import { McrtItemResolver } from './mcrt-item.resolver';

@Module({
  providers: [McrtItemResolver, McrtItemService],
})
export class McrtItemModule {}
