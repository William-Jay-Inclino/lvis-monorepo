import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';
import { ComplaintModule } from '../complaint/complaint.module';
import { TaskDetailKwhMeterService } from '../task_detail_kwh_meter/task_detail_kwh_meter.service';
import { TaskDetailPowerInterruptionService } from '../task_detail_power_interruption/task_detail_power_interruption.service';
import { TaskDetailLineServicesService } from '../task_detail_line_services/task_detail_line_services.service';
import { TaskDetailDlesService } from '../task_detail_dles/task_detail_dles.service';
import { TaskDetailLmdgaService } from '../task_detail_lmdga/task_detail_lmdga.service';
import { NotificationService } from '../notification/notification.service';
import { TaskEventListeners } from './task.event-listener';

@Module({
  imports: [ PowerserveAuditModule, forwardRef(() => ComplaintModule)],
  providers: [
    TaskResolver, 
    TaskService, 
    TaskDetailKwhMeterService,
    TaskDetailPowerInterruptionService,
    TaskDetailLineServicesService,
    TaskDetailDlesService,
    TaskDetailLmdgaService,
    NotificationService,
    TaskEventListeners,
  ],
  exports: [ TaskService ]
})
export class TaskModule {}
