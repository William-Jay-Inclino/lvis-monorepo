import { Module } from '@nestjs/common';
import { OsrivItemService } from './osriv-item.service';
// import { OsrivItemResolver } from './osriv-item.resolver';

@Module({
  providers: [
    // OsrivItemResolver, 
    OsrivItemService],
})
export class OsrivItemModule {}
