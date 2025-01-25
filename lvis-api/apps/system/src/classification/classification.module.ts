import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationResolver } from './classification.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { SystemAuditModule } from '../system_audit/system_audit.module';

@Module({
  imports: [SystemAuditModule],
  providers: [ClassificationResolver, ClassificationService, WinstonLoggerService],
})
export class ClassificationModule {}
