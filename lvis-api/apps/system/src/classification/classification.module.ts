import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationResolver } from './classification.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [ClassificationResolver, ClassificationService, WinstonLoggerService],
})
export class ClassificationModule {}
