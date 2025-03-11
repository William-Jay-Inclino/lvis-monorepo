import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceResolver } from './device.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';

@Module({
  imports: [PowerserveAuditModule],
  providers: [DeviceResolver, DeviceService],
})
export class DeviceModule {}
