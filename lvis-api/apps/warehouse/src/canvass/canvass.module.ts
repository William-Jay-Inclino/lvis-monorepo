import { Module } from '@nestjs/common';
import { CanvassService } from './canvass.service';
import { CanvassResolver } from './canvass.resolver';
import { HttpModule } from '@nestjs/axios';
import { CanvassController } from './canvass.controller';
import { CanvassPdfService } from './canvass.pdf.service';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [CanvassService, CanvassPdfService, CanvassResolver, WinstonLoggerService],
  exports: [CanvassService],
  controllers: [CanvassController]
})
export class CanvassModule { }
