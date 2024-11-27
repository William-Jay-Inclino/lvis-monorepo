import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  controllers: [UserController],
  providers: [UserResolver, UserService, WinstonLoggerService],
  exports: [UserService]
})
export class UserModule {}
