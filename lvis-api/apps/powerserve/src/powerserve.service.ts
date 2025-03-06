import { Injectable } from '@nestjs/common';

@Injectable()
export class PowerserveService {
  getHello(): string {
    return 'Hello World!';
  }
}
