import { Module } from '@nestjs/common';
import { PowerserveController } from './powerserve.controller';
import { PowerserveService } from './powerserve.service';

@Module({
  imports: [],
  controllers: [PowerserveController],
  providers: [PowerserveService],
})
export class PowerserveModule {}
