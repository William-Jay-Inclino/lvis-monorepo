import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CanvassService } from '../canvass/canvass.service';
import { PendingService } from '../pending/pending.service';
import { ItemService } from '../item/item.service';

@Module({
  imports: [HttpModule],
  providers: [
    CanvassService,
    PendingService,
    ItemService,
  ],
})
export class EmployeeModule { }
