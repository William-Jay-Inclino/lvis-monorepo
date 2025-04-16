import { Injectable } from '@nestjs/common';
import { UpdateLineServicesInput } from './dto/update-line-services.input';
import { Prisma } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class TaskDetailLineServicesService {

    async create_or_update(
        payload: { 
          data: UpdateLineServicesInput, 
          task_id: number 
        }, 
        tx: Prisma.TransactionClient
      ) {
        const { data, task_id } = payload;
        
        const baseData = {
            order_number: data.order_number,
            cause: { connect: { id: data.cause_id } },
            mrv_number: data.mrv_number,
            seriv_number: data.seriv_number,
            mst_number: data.mst_number,
            mcrt_number: data.mcrt_number,
            barangay: { connect: { id: data.barangay_id } },
            distance_travel_in_km: 0, 
        };
      
        await tx.taskDetailLineServices.upsert({
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
