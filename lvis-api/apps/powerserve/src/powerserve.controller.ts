import { Controller, Get } from '@nestjs/common';
import { PowerserveService } from './powerserve.service';

@Controller()
export class PowerserveController {
  constructor(private readonly powerserveService: PowerserveService) {}

  @Get()
  getHello(): string {
    return this.powerserveService.getHello();
  }
}
