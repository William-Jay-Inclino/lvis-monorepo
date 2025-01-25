import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { SystemAuditModule } from '../system_audit/system_audit.module';

@Module({
  imports: [SystemAuditModule],
  controllers: [UserController],
  providers: [UserResolver, UserService, WinstonLoggerService],
  exports: [UserService]
})
export class UserModule {}
