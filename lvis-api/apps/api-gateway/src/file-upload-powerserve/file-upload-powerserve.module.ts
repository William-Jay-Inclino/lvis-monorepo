import { Module } from '@nestjs/common';
import { FileUploadPowerserveService } from './file-upload-powerserve.service';
import { FileUploadPowerserveController } from './file-upload-powerserve.controller';

@Module({
  providers: [FileUploadPowerserveService],
  controllers: [FileUploadPowerserveController]
})
export class FileUploadPowerserveModule {}
