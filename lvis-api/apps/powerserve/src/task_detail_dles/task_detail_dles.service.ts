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
        
        const baseData = {
            sco_number: data.sco_number,
            old_serial_number: data.old_serial_number,
            new_serial_number: data.new_serial_number,
            seriv_number: data.seriv_number,
            kva_rating: data.kva_rating,
            cause: data.cause,
        };
        
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
