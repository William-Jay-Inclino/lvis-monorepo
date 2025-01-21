import { Module } from '@nestjs/common';
import { JoService } from './jo.service';
import { JoResolver } from './jo.resolver';
import { HttpModule } from '@nestjs/axios';
import { CanvassService } from '../canvass/canvass.service';
import { JoApproverService } from '../jo-approver/jo-approver.service';
import { JoController } from './jo.controller';
import { JoPdfService } from './jo.pdf.service';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { WarehouseAuditModule } from '../warehouse_audit/warehouse_audit.module';

@Module({
  imports: [HttpModule, WarehouseAuditModule],
  providers: [
    JoService, 
    JoResolver, 
    JoPdfService, 
    JoApproverService, 
    CanvassService, 
    WinstonLoggerService
  ],
  exports: [JoService],
  controllers: [JoController]
})
export class JoModule { }
