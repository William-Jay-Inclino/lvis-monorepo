import { Module } from '@nestjs/common';
import { MeqsResolver } from './meqs.resolver';
import { MeqsService } from './meqs.service';
import { HttpModule } from '@nestjs/axios';
import { MeqsApproverService } from '../meqs-approver/meqs-approver.service';
import { MeqsController } from './meqs.controller';
import { MeqsPdfService } from './meqs.pdf.service';
import { RvService } from '../rv/rv.service';
import { JoService } from '../jo/jo.service';
import { SprService } from '../spr/spr.service';
import { CanvassService } from '../canvass/canvass.service';

@Module({
  imports: [HttpModule],
  providers: [
    MeqsResolver, 
    MeqsService, 
    MeqsPdfService, 
    MeqsApproverService,
    RvService,
    JoService,
    SprService,
    CanvassService,
  ],
  controllers: [MeqsController],
})

export class MeqsModule {}
