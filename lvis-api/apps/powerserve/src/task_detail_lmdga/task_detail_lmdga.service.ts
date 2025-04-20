import { Injectable } from '@nestjs/common';
import { UpdateLmdgaInput } from './dto/update-lmdga.input';
import { Prisma } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class TaskDetailLmdgaService {

    async create_or_update(
            payload: { 
              data: UpdateLmdgaInput, 
              task_id: number 
            }, 
            tx: Prisma.TransactionClient
          ) {
            const { data, task_id } = payload;
            
            const needsDisconnectCheck = !data.feeder_id

            const existingRecord = needsDisconnectCheck 
            ? await tx.taskDetailLmdga.findUnique({
                where: { task_id },
                select: { feeder_id: true }
                })
            : null;

            const baseData = {
                kva_rating: data.kva_rating ?? null, 
                substation_id: data.substation_id ?? null, 
                dt_location: data.dt_location ?? null, 
                phase_number: data.phase_number ?? null,
                number_of_hc: data.number_of_hc ?? null,
                number_of_spans: data.number_of_spans ?? null,
                copper_aluminum_primary: data.copper_aluminum_primary ?? null, 
                copper_aluminum_secondary: data.copper_aluminum_secondary ?? null,
                copper_aluminum_ground: data.copper_aluminum_ground ?? null,
                size_primary: data.size_primary ?? null,
                size_secondary: data.size_secondary ?? null,
                size_ground: data.size_ground ?? null,
                terminal_connector_primary: data.terminal_connector_primary ?? null, 
                terminal_connector_secondary: data.terminal_connector_secondary ?? null,
                terminal_connector_ground: data.terminal_connector_ground ?? null,
                tap_position: data.tap_position ?? null,
                brand: data.brand ?? null,
                number_of_bushing_primary: data.number_of_bushing_primary ?? null,
                number_of_bushing_secondary: data.number_of_bushing_secondary ?? null,
                protective_device: data.protective_device ?? null,
                load_current_sec_bushing: data.load_current_sec_bushing ?? null,
                load_current_neutral: data.load_current_neutral ?? null,
                load_current_one: data.load_current_one ?? null,
                load_current_two: data.load_current_two ?? null,
                voltage_level_one: data.voltage_level_one ?? null,
                voltage_level_two: data.voltage_level_two ?? null,
                sec_line_conductor_size_one: data.sec_line_conductor_size_one ?? null,
                sec_line_conductor_size_two: data.sec_line_conductor_size_two ?? null,
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
          
            await tx.taskDetailLmdga.upsert({
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
