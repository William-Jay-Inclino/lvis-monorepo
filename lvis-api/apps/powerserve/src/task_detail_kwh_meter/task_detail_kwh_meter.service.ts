import { Injectable } from '@nestjs/common';
import { UpdateKwhMeterInput } from './dto/update-kwh-meter.input';
import { Prisma } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class TaskDetailKwhMeterService {

    async create_or_update(
        payload: { 
          data: UpdateKwhMeterInput, 
          task_id: number 
        }, 
        tx: Prisma.TransactionClient
      ) {
        const { data, task_id } = payload;
        
        const baseData = {
          meter_number: data.meter_number,
          meter_brand: { connect: { id: data.meter_brand_id } },
          last_reading: data.last_reading,
          initial_reading: data.initial_reading,
          meter_class: data.meter_class
        };
      
        await tx.taskDetailKwhMeter.upsert({
          where: { task_id },
          update: {
            ...baseData,
            linemen_incharge: {
              deleteMany: {},
              create: data.linemen_incharge_ids?.map(lineman_id => ({ lineman_id })) || []
            }
          },
          create: {
            ...baseData,
            task: { connect: { id: task_id } },
            linemen_incharge: {
              create: data.linemen_incharge_ids?.map(lineman_id => ({ lineman_id })) || []
            }
          }
        });
    }

}