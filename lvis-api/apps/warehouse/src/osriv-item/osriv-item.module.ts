import { Module } from '@nestjs/common';
import { OsrivItemService } from './osriv-item.service';
import { OsrivItemResolver } from './osriv-item.resolver';
import { CommonService } from '../__common__/classes';

@Module({
  providers: [
    OsrivItemResolver, 
    OsrivItemService,
    CommonService
  ],
})
export class OsrivItemModule {}
