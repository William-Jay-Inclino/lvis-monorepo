import { Injectable } from '@nestjs/common';
import { UpdatePowerInterruptionInput } from './dto/update-power-interruption.input';
import { Prisma } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class TaskDetailPowerInterruptionService {

    async create_or_update(
        payload: { 
            data: UpdatePowerInterruptionInput, 
            task_id: number 
        }, 
        tx: Prisma.TransactionClient
        ) {
        const { data, task_id } = payload;
        
        const baseData = {
            affected_area: data.affected_area,
            feeder: { connect: { id: data.feeder_id } },
            cause: data.cause,
            weather_condition: { connect: { id: data.weather_condition_id } },
            device: { connect: { id: data.device_id } },
            equipment_failed: data.equipment_failed,
            fuse_rating: data.fuse_rating,
        };
        
        await tx.taskDetailPowerInterruption.upsert({
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
