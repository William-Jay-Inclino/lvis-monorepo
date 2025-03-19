import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DivisionService } from './division.service';

@Module({
  imports: [HttpModule],
  providers: [DivisionService],
  exports: [ DivisionService ]
})
export class DivisionModule {}
