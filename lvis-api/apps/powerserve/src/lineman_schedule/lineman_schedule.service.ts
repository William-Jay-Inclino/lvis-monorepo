import { Injectable } from '@nestjs/common';
import { UpdateLinemanScheduleInput } from './dto/update-lineman_schedule.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class LinemanScheduleService {

  update(
    input: UpdateLinemanScheduleInput,
    metadata: { ip_address: string, device_info: any, authUser: AuthUser }
  ) {

  }

}
