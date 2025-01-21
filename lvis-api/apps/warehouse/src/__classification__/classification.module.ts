import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClassificationResolver } from './classification.resolver';
import { RvService } from '../rv/rv.service';
import { CanvassService } from '../canvass/canvass.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [ClassificationResolver, RvService, CanvassService],
})
export class ClassificationModule {}
