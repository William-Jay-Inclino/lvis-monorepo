import { Module } from '@nestjs/common';
import { SerivItemService } from './seriv-item.service';
import { SerivItemResolver } from './seriv-item.resolver';

@Module({
  providers: [SerivItemResolver, SerivItemService],
})
export class SerivItemModule {}
