import { Prisma } from "apps/powerserve/prisma/generated/client";
import { PowerInterruptionSubInput } from "../dto/power-interruption.sub.input";
import { KwhMeterSubInput } from "../dto/kwh-meter.sub.input";
import { LineServicesSubInput } from "../dto/line-services.input";
import { DlesSubInput } from "../dto/dles.sub.input";
import { LmdgaSubInput } from "../dto/lmdga.input";


export function get_power_interruption_data(payload: { data: PowerInterruptionSubInput, barangay_id: string }): {
    create: Prisma.TaskDetailPowerInterruptionCreateWithoutTaskInput
}  {

    const { data, barangay_id } = payload

    return {
        create: {
            affected_area: data.affected_area,
            feeder: { connect: { id: data.feeder_id } },
            cause: { connect: { id: data.cause_id } },
            weather_condition: { connect: { id: data.weather_condition_id } },
            device: { connect: { id: data.device_id } },
            barangay: { connect: { id: barangay_id } },
            equipment_failed: data.equipment_failed,
            fuse_rating: data.fuse_rating,
            linemen_incharge: {
                createMany: {
                    data: data.linemen_incharge_ids.map(i => ({ lineman_id: i }))
                }
            }
        }
    }

}

export function get_kwh_meter_data(payload: { data: KwhMeterSubInput, barangay_id: string }): {
    create: Prisma.TaskDetailKwhMeterCreateWithoutTaskInput
}  {

    const { data, barangay_id } = payload

    return {
        create: {
            meter_number: data.meter_number,
            meter_brand: { connect: { id: data.meter_brand_id } },
            barangay: { connect: { id: barangay_id } },
            cause: { connect: { id: data.cause_id } },
            last_reading: data.last_reading,
            initial_reading: data.initial_reading,
            meter_class: data.meter_class,
            linemen_incharge: {
                createMany: {
                    data: data.linemen_incharge_ids.map(i => ({ lineman_id: i }))
                }
            }
        }
    }

}

export function get_line_services_data(payload: { data: LineServicesSubInput, barangay_id: string }): {
    create: Prisma.TaskDetailLineServicesCreateWithoutTaskInput
}  {

    const { data, barangay_id } = payload

    return {
        create: {
            order_number: data.order_number,
            cause: { connect: { id: data.cause_id } },
            barangay: { connect: { id: barangay_id } },
            mrv_number: data.mrv_number,
            seriv_number: data.seriv_number,
            mst_number: data.mst_number,
            mcrt_number: data.mcrt_number,
            linemen_incharge: {
                createMany: {
                    data: data.linemen_incharge_ids.map(i => ({ lineman_id: i }))
                }
            }
        }
    }

}

export function get_dles_data(payload: { data: DlesSubInput, barangay_id: string }): {
    create: Prisma.TaskDetailDlesCreateWithoutTaskInput
}  {

    const { data, barangay_id } = payload

    return {
        create: {
            sco_number: data.sco_number,
            cause: { connect: { id: data.cause_id } },
            barangay: { connect: { id: barangay_id } },
            old_serial_number: data.old_serial_number,
            new_serial_number: data.new_serial_number,
            seriv_number: data.seriv_number,
            kva_rating: data.kva_rating,
            linemen_incharge: {
                createMany: {
                    data: data.linemen_incharge_ids.map(i => ({ lineman_id: i }))
                }
            }
        }
    }

}

export function get_lmdga_data(payload: { data: LmdgaSubInput, barangay_id: string }): {
    create: Prisma.TaskDetailLmdgaCreateWithoutTaskInput
}  {

    const { data, barangay_id } = payload

    return {
        create: {
            kva_rating: data.kva_rating, 
            substation_id: data.substation_id, 
            barangay: { connect: { id: barangay_id } },
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
            linemen_incharge: {
                createMany: {
                    data: data.linemen_incharge_ids.map(i => ({ lineman_id: i }))
                }
            }
        }
    }

}