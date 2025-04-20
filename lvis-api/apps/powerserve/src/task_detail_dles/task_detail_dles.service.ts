import { Injectable } from '@nestjs/common';
import { UpdateDlesInput } from './dto/update-dles.input';
import { Prisma } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class TaskDetailDlesService {

    async create_or_update(
        payload: { 
            data: UpdateDlesInput, 
            task_id: number 
        }, 
        tx: Prisma.TransactionClient
        ) {
        const { data, task_id } = payload;

        const needsDisconnectCheck = !data.cause_id

        const existingRecord = needsDisconnectCheck 
            ? await tx.taskDetailDles.findUnique({
                where: { task_id },
                select: { cause_id: true }
                })
            : null;
        
        const baseData = {
            sco_number: data.sco_number ?? null,
            old_serial_number: data.old_serial_number ?? null,
            new_serial_number: data.new_serial_number ?? null,
            seriv_number: data.seriv_number ?? null,
            kva_rating: data.kva_rating ?? null,
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
        
        await tx.taskDetailDles.upsert({
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
