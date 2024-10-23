import { Module } from '@nestjs/common';
import { FuelTypeModule } from './fuel-type/fuel-type.module';

@Module({
  imports: [FuelTypeModule],
  controllers: [],
  providers: [],
})
export class MotorpoolModule {}
