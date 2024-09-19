import { Module } from '@nestjs/common';
import { MctService } from './mct.service';
import { MctResolver } from './mct.resolver';

@Module({
  providers: [MctResolver, MctService],
})
export class MctModule {}
