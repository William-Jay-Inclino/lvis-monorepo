import { Module } from '@nestjs/common';
import { MrvItemService } from './mrv-item.service';
import { MrvItemResolver } from './mrv-item.resolver';

@Module({
  providers: [MrvItemResolver, MrvItemService],
})
export class MrvItemModule {}
