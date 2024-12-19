import { Module } from '@nestjs/common';
import { ServiceCenterService } from './service-center.service';
import { ServiceCenterResolver } from './service-center.resolver';

@Module({
  providers: [ServiceCenterResolver, ServiceCenterService],
})
export class ServiceCenterModule {}
