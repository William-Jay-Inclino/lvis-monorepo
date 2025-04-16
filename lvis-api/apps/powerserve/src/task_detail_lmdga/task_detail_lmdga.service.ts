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
            
            const baseData = {
                kva_rating: data.kva_rating, 
                substation_id: data.substation_id, 
                dt_location: data.dt_location, 
                feeder: { connect: { id: data.feeder_id } },
                phase_number: data.phase_number,
                number_of_hc: data.number_of_hc,
                number_of_spans: data.number_of_spans,
                copper_aluminum_primary: data.copper_aluminum_primary, 
                copper_aluminum_secondary: data.copper_aluminum_secondary,
                copper_aluminum_ground: data.copper_aluminum_ground,
                size_primary: data.size_primary,
                size_secondary: data.size_secondary,
                size_ground: data.size_ground,
                terminal_connector_primary: data.terminal_connector_primary, 
                terminal_connector_secondary: data.terminal_connector_secondary,
                terminal_connector_ground: data.terminal_connector_ground,
                tap_position: data.tap_position,
                brand: data.brand,
                number_of_bushing_primary: data.number_of_bushing_primary,
                number_of_bushing_secondary: data.number_of_bushing_secondary,
                protective_device: data.protective_device,
                load_current_sec_bushing: data.load_current_sec_bushing,
                load_current_neutral: data.load_current_neutral,
                load_current_one: data.load_current_one,
                load_current_two: data.load_current_two,
                voltage_level_one: data.voltage_level_one,
                voltage_level_two: data.voltage_level_two,
                sec_line_conductor_size_one: data.sec_line_conductor_size_one,
                sec_line_conductor_size_two: data.sec_line_conductor_size_two,
                barangay: { connect: { id: data.barangay_id } },
                distance_travel_in_km: 0, 
            };
          
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
