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

        const needsDisconnectCheck = !data.cause_id || !data.meter_brand_id

        const existingRecord = needsDisconnectCheck 
            ? await tx.taskDetailKwhMeter.findUnique({
                where: { task_id },
                select: { cause_id: true, meter_brand: true }
                })
            : null;
        
        const baseData = {
            meter_number: data.meter_number ?? null,
            last_reading: data.last_reading ?? null,
            initial_reading: data.initial_reading ?? null,
            meter_class: data.meter_class ?? null,
            barangay: { connect: { id: data.barangay_id } },
            distance_travel_in_km: data.distance_travel_in_km, 
        };

        if (data.cause_id) {
            // @ts-ignore
            baseData.cause = { connect: { id: data.cause_id } };
        } else if (existingRecord?.cause_id) {
            // @ts-ignore
            baseData.cause = { disconnect: true };
        }

        if (data.meter_brand_id) {
            // @ts-ignore
            baseData.meter_brand = { connect: { id: data.meter_brand_id } };
        } else if (existingRecord?.cause_id) {
            // @ts-ignore
            baseData.meter_brand = { disconnect: true };
        }
      
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