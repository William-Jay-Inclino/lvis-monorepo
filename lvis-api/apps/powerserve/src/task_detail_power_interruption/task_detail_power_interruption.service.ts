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
        
        const needsDisconnectCheck = !data.feeder_id || !data.cause_id || !data.weather_condition_id || !data.device_id || !data.equipment_failed_id

        const existingRecord = needsDisconnectCheck 
        ? await tx.taskDetailPowerInterruption.findUnique({
            where: { task_id },
            select: { feeder_id: true, cause_id: true, weather_condition_id: true, device_id: true, equipment_failed_id: true }
            })
        : null;

        const baseData = {
            affected_area: data.affected_area ?? null,
            fuse_rating: data.fuse_rating ?? null,
            barangay: { connect: { id: data.barangay_id } },
            distance_travel_in_km: data.distance_travel_in_km, 
        };

        if (data.feeder_id) {
            // @ts-ignore
            baseData.feeder = { connect: { id: data.feeder_id } };
        } else if (existingRecord?.feeder_id) {
            // @ts-ignore
            baseData.feeder = { disconnect: true };
        }

        if (data.cause_id) {
            // @ts-ignore
            baseData.cause = { connect: { id: data.cause_id } };
        } else if (existingRecord?.cause_id) {
            // @ts-ignore
            baseData.cause = { disconnect: true };
        }

        if (data.weather_condition_id) {
            // @ts-ignore
            baseData.weather_condition = { connect: { id: data.weather_condition_id } };
        } else if (existingRecord?.weather_condition_id) {
            // @ts-ignore
            baseData.weather_condition = { disconnect: true };
        }

        if (data.device_id) {
            // @ts-ignore
            baseData.device = { connect: { id: data.device_id } };
        } else if (existingRecord?.device_id) {
            // @ts-ignore
            baseData.device = { disconnect: true };
        }

        if (data.equipment_failed_id) {
            // @ts-ignore
            baseData.equipment_failed = { connect: { id: data.equipment_failed_id } };
        } else if (existingRecord?.device_id) {
            // @ts-ignore
            baseData.equipment_failed = { disconnect: true };
        }
        
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
