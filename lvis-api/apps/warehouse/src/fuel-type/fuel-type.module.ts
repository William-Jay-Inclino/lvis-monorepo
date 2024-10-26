import { Module } from '@nestjs/common';
import { FuelTypeService } from './fuel-type.service';
import { FuelTypeResolver } from './fuel-type.resolver';

@Module({
  providers: [FuelTypeResolver, FuelTypeService],
})
export class FuelTypeModule {}
