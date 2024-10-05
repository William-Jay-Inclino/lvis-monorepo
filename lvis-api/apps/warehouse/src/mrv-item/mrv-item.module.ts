import { Module } from '@nestjs/common';
import { MrvItemService } from './mrv-item.service';
import { MrvItemResolver } from './mrv-item.resolver';
import { CommonService } from '../__common__/classes';

@Module({
  providers: [
    MrvItemResolver, 
    MrvItemService,
    CommonService,
  ],
})
export class MrvItemModule {}
