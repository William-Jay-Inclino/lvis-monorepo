import { Module } from '@nestjs/common';
import { SerivService } from './seriv.service';
import { SerivResolver } from './seriv.resolver';

@Module({
  providers: [SerivResolver, SerivService],
})
export class SerivModule {}
