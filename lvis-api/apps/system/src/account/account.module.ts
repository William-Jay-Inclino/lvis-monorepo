import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [AccountResolver, AccountService, WinstonLoggerService],
})
export class AccountModule {}
