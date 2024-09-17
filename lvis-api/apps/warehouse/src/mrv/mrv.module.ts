import { Module } from '@nestjs/common';
import { MrvService } from './mrv.service';
import { MrvResolver } from './mrv.resolver';

@Module({
  providers: [MrvResolver, MrvService],
})
export class MrvModule {}
