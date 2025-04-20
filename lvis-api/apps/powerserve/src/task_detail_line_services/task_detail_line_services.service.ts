import { Injectable } from '@nestjs/common';
import { UpdateLineServicesInput } from './dto/update-line-services.input';
import { Prisma } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class TaskDetailLineServicesService {

    async create_or_update(
        payload: { data: UpdateLineServicesInput, task_id: number }, 
        tx: Prisma.TransactionClient
    ) {
        const { data, task_id } = payload;
        
        const needsDisconnectCheck = !data.cause_id
        
        const existingRecord = needsDisconnectCheck 
            ? await tx.taskDetailLineServices.findUnique({
                where: { task_id },
                select: { cause_id: true }
                })
            : null;
    
        const baseData = {
            order_number: data.order_number ?? null,
            mrv_number: data.mrv_number ?? null,
            seriv_number: data.seriv_number ?? null,
            mst_number: data.mst_number ?? null,
            mcrt_number: data.mcrt_number ?? null,
            distance_travel_in_km: data.distance_travel_in_km,
            barangay: { connect: { id: data.barangay_id } }
        };
    
        // Handle cause relationship
        if (data.cause_id) {
            // @ts-ignore
            baseData.cause = { connect: { id: data.cause_id } };
        } else if (existingRecord?.cause_id) {
            // @ts-ignore
            baseData.cause = { disconnect: true };
        }

    
        return tx.taskDetailLineServices.upsert({
            where: { task_id },
            update: { 
                ...baseData, 
                linemen_incharge: {
                    deleteMany: {},
                    create: data.linemen_incharge_ids.map(lineman_id => ({ lineman_id }))
                } 
            },
            create: { 
                ...baseData, 
                task: { connect: { id: task_id } },
                linemen_incharge: {
                    create: data.linemen_incharge_ids.map(lineman_id => ({ lineman_id }))
                }
            }
        });
    }

}
