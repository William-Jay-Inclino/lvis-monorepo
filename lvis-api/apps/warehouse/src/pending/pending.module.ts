import { Module } from '@nestjs/common';
import { PendingService } from './pending.service';
import { PendingResolver } from './pending.resolver';
import { HttpModule } from '@nestjs/axios';
import { ItemService } from '../item/item.service';

@Module({
  imports: [HttpModule],
  providers: [PendingResolver, PendingService, ItemService],
})
export class PendingModule {}
