import type { Lineman } from "../lineman/lineman.types";
import { dles_errors, dles_initial_data, type DlesError, type DlesInput } from "./task-detail-types/dles";
import { kwh_meter_errors, kwh_meter_initial_data, type KwhMeterError, type KwhMeterInput } from "./task-detail-types/kwh-meter";
import { line_services_errors, line_services_initial_data, type LineServicesError, type LineServicesInput } from "./task-detail-types/line-services";
import { lmdga_errors, lmdga_initial_data, type LmdgaError, type LmdgaInput } from "./task-detail-types/lmdga";
import { power_interruption_errors, power_interruption_initial_data, type PowerInterruptionError, type PowerInterruptionInput } from "./task-detail-types/power-interruption";
import { TASK_STATUS } from "./task.constants";
import type { Task, TaskStatus } from "./task.types";


const formatId = (obj: { id: string } | undefined | null) => 
    obj?.id ? `"${obj.id}"` : 'null';

const formatString = (value: string | undefined | null) =>
    value ? `"${value}"` : 'null';

const formatArray = (arr: Array<{ id: string }> | undefined | null) =>
    arr ? `[${arr.map(i => `"${i.id}"`).join(", ")}]` : 'null';

export function is_valid_kwh_meter(payload: { data:  KwhMeterInput, task_status: TaskStatus }): KwhMeterError {

    const { data, task_status } = payload 

    const errors = deepClone(kwh_meter_errors)

    if(task_status.id === TASK_STATUS.COMPLETED) {

        if(data.meter_number.trim() === '') {
            errors.meter_number = true 
        }
    
        if(!data.cause) {
            errors.cause = true 
        }
    
        if(!data.meter_brand) {
            errors.meter_brand = true 
        }
    
        if(data.last_reading.trim() === '') {
            errors.last_reading = true 
        }
    
        if(data.initial_reading.trim() === '') {
            errors.initial_reading = true 
        }
    
        if(data.meter_class.trim() === '') {
            errors.meter_class = true 
        }

    }


    if(data.linemen_incharge.length === 0) {
        errors.linemen_incharge = true 
    }

    if(data.distance_travel_in_km < 0) {
        errors.distance_travel_in_km = true
    }

    return errors

}

export function is_valid_power_interruption(payload: { data:  PowerInterruptionInput, task_status: TaskStatus }): PowerInterruptionError {

    const { data, task_status } = payload 

    const errors = deepClone(power_interruption_errors)

    if(task_status.id === TASK_STATUS.COMPLETED) {

        if(data.affected_area.trim() === '') {
            errors.affected_area = true 
        }
    
        if(!data.cause) {
            errors.cause = true 
        }
    
        if(!data.feeder) {
            errors.feeder = true 
        }
    
        if(!data.weather_condition) {
            errors.weather_condition = true 
        }
    
        if(!data.device) {
            errors.device = true 
        }
    
        if(!data.equipment_failed) {
            errors.equipment_failed = true 
        }
    
        if(data.fuse_rating.trim() === '') {
            errors.fuse_rating = true 
        }

    }


    if(data.linemen_incharge.length === 0) {
        errors.linemen_incharge = true 
    }

    if(data.distance_travel_in_km < 0) {
        errors.distance_travel_in_km = true
    }

    return errors

}

export function is_valid_line_services(payload: { data:  LineServicesInput, task_status: TaskStatus }): LineServicesError {

    const { data, task_status } = payload 

    const errors = deepClone(line_services_errors)
    
    if(task_status.id === TASK_STATUS.COMPLETED) {
    
        if(!data.cause) {
            errors.cause = true 
        }

    }


    if(data.linemen_incharge.length === 0) {
        errors.linemen_incharge = true 
    }

    if(data.distance_travel_in_km < 0) {
        errors.distance_travel_in_km = true
    }

    return errors

}

export function is_valid_dles(payload: { data:  DlesInput, task_status: TaskStatus }): DlesError {

    const { data, task_status } = payload 

    const errors = deepClone(dles_errors)

    if(task_status.id === TASK_STATUS.COMPLETED) {

        if(data.sco_number.trim() === '') {
            errors.sco_number = true 
        }
    
        if(data.old_serial_number.trim() === '') {
            errors.old_serial_number = true 
        }
    
        if(data.new_serial_number.trim() === '') {
            errors.new_serial_number = true 
        }
    
        if(data.seriv_number.trim() === '') {
            errors.seriv_number = true 
        }
    
        if(data.kva_rating.trim() === '') {
            errors.kva_rating = true 
        }
    
        if(!data.cause) {
            errors.cause = true 
        }

    }


    if(data.linemen_incharge.length === 0) {
        errors.linemen_incharge = true 
    }

    if(data.distance_travel_in_km < 0) {
        errors.distance_travel_in_km = true
    }

    return errors

}

export function is_valid_lmdga(payload: { data:  LmdgaInput, task_status: TaskStatus }): LmdgaError {

    const { data, task_status } = payload 

    const errors = deepClone(lmdga_errors)

    if(task_status.id === TASK_STATUS.COMPLETED) {

        // if(data.kva_rating.trim() === '') {
        //     errors.kva_rating = true 
        // }
    
        // if(!data.substation) {
        //     errors.substation = true
        // }
    
        // if(data.dt_location.trim() === '') {
        //     errors.dt_location = true 
        // }
    
        // if(!data.feeder) {
        //     errors.feeder = true
        // }
    
        // if(data.phase_number.trim() === '') {
        //     errors.phase_number = true 
        // }
    
        // if(data.number_of_hc.trim() === '') {
        //     errors.number_of_hc = true 
        // }
    
        // if(data.number_of_spans.trim() === '') {
        //     errors.number_of_spans = true 
        // }
    
        // if(data.copper_aluminum_primary.trim() === '') {
        //     errors.copper_aluminum_primary = true 
        // }
    
        // if(data.copper_aluminum_secondary.trim() === '') {
        //     errors.copper_aluminum_secondary = true 
        // }
    
        // if(data.copper_aluminum_ground.trim() === '') {
        //     errors.copper_aluminum_ground = true 
        // }
    
        // if(data.size_primary.trim() === '') {
        //     errors.size_primary = true 
        // }
    
        // if(data.size_secondary.trim() === '') {
        //     errors.size_secondary = true 
        // }
    
        // if(data.size_ground.trim() === '') {
        //     errors.size_ground = true 
        // }
    
        // if(data.terminal_connector_primary.trim() === '') {
        //     errors.terminal_connector_primary = true 
        // }
    
        // if(data.terminal_connector_secondary.trim() === '') {
        //     errors.terminal_connector_secondary = true 
        // }
    
        // if(data.terminal_connector_ground.trim() === '') {
        //     errors.terminal_connector_ground = true 
        // }
    
        // if(data.tap_position.trim() === '') {
        //     errors.tap_position = true 
        // }
    
        // if(data.brand.trim() === '') {
        //     errors.brand = true 
        // }
    
        // if(data.number_of_bushing_primary.trim() === '') {
        //     errors.number_of_bushing_primary = true 
        // }
    
        // if(data.number_of_bushing_secondary.trim() === '') {
        //     errors.number_of_bushing_secondary = true 
        // }
    
        // if(data.protective_device.trim() === '') {
        //     errors.protective_device = true 
        // }
    
        // if(data.load_current_sec_bushing.trim() === '') {
        //     errors.load_current_sec_bushing = true 
        // }
    
        // if(data.load_current_neutral.trim() === '') {
        //     errors.load_current_neutral = true 
        // }
    
        // if(data.load_current_one.trim() === '') {
        //     errors.load_current_one = true 
        // }
    
        // if(data.load_current_two.trim() === '') {
        //     errors.load_current_two = true 
        // }
    
        // if(data.voltage_level_one.trim() === '') {
        //     errors.voltage_level_one = true 
        // }
    
        // if(data.voltage_level_two.trim() === '') {
        //     errors.voltage_level_two = true 
        // }
    
        // if(data.sec_line_conductor_size_one.trim() === '') {
        //     errors.sec_line_conductor_size_one = true 
        // }
    
        // if(data.sec_line_conductor_size_two.trim() === '') {
        //     errors.sec_line_conductor_size_two = true 
        // }
    
        // if(data.brand.trim() === '') {
        //     errors.brand = true 
        // }

    }


    if(data.linemen_incharge.length === 0) {
        errors.linemen_incharge = true 
    }

    if(data.distance_travel_in_km < 0) {
        errors.distance_travel_in_km = true
    }

    return errors

}

export function get_pi_mutation_string(payload: { input: PowerInterruptionInput }): string {
    const { input } = payload;

    return `{
        linemen_incharge_ids: ${formatArray(input.linemen_incharge)},
        distance_travel_in_km: ${input.distance_travel_in_km}
        affected_area: ${formatString(input.affected_area)},
        feeder_id: ${formatId(input.feeder)},
        cause_id: ${formatId(input.cause)},
        weather_condition_id: ${formatId(input.weather_condition)},
        device_id: ${formatId(input.device)},
        equipment_failed_id: ${formatId(input.equipment_failed)},
        fuse_rating: ${formatString(input.fuse_rating)},
    }`;
}

export function get_kwh_meter_mutation_string(payload: { input: KwhMeterInput }): string {

    const { input } = payload

    return `{
        linemen_incharge_ids: ${formatArray(input.linemen_incharge)},
        distance_travel_in_km: ${input.distance_travel_in_km}
        meter_number: ${formatString(input.meter_number)},
        meter_brand_id: ${formatId(input.meter_brand)},
        cause_id: ${formatId(input.cause)},
        last_reading: ${formatString(input.last_reading)},
        initial_reading: ${formatString(input.initial_reading)},
        meter_class: ${formatString(input.meter_class)},
    }`;

}

export function get_line_services_mutation_string(payload: { input: LineServicesInput }): string {
    const { input } = payload;

    return `{
        linemen_incharge_ids: ${formatArray(input.linemen_incharge)},
        distance_travel_in_km: ${input.distance_travel_in_km}
        order_number: ${formatString(input.order_number)},
        cause_id: ${formatId(input.cause)},
        mrv_number: ${formatString(input.mrv_number)},
        seriv_number: ${formatString(input.seriv_number)},
        mst_number: ${formatString(input.mst_number)},
        mcrt_number: ${formatString(input.mcrt_number)},
    }`;
}

export function get_dles_mutation_string(payload: { input: DlesInput }): string {

    const { input } = payload

    return `{
        linemen_incharge_ids: ${formatArray(input.linemen_incharge)},
        distance_travel_in_km: ${input.distance_travel_in_km}
        sco_number: ${formatString(input.sco_number)},
        old_serial_number: ${formatString(input.old_serial_number)},
        new_serial_number: ${formatString(input.new_serial_number)},
        seriv_number: ${formatString(input.seriv_number)},
        kva_rating: ${formatString(input.kva_rating)},
        cause_id: ${formatId(input.cause)},
    }`;

}

export function get_lmdga_mutation_string(payload: { input: LmdgaInput }): string {

    const { input } = payload

    return `{
        linemen_incharge_ids: ${formatArray(input.linemen_incharge)},
        distance_travel_in_km: ${input.distance_travel_in_km}
        kva_rating: ${formatString(input.kva_rating)},
        substation_id: ${formatId(input.substation)},
        dt_location: ${formatString(input.dt_location)},
        feeder_id: ${formatId(input.feeder)},
        phase_number: ${formatString(input.phase_number)},
        number_of_hc: ${formatString(input.number_of_hc)},
        number_of_spans: ${formatString(input.number_of_spans)},
        copper_aluminum_primary: ${formatString(input.copper_aluminum_primary)},
        copper_aluminum_secondary: ${formatString(input.copper_aluminum_secondary)},
        copper_aluminum_ground: ${formatString(input.copper_aluminum_ground)},
        size_primary: ${formatString(input.size_primary)},
        size_secondary: ${formatString(input.size_secondary)},
        size_ground: ${formatString(input.size_ground)},
        terminal_connector_primary: ${formatString(input.terminal_connector_primary)},
        terminal_connector_secondary: ${formatString(input.terminal_connector_secondary)},
        terminal_connector_ground: ${formatString(input.terminal_connector_ground)},
        tap_position: ${formatString(input.tap_position)},
        brand: ${formatString(input.brand)},
        number_of_bushing_primary: ${formatString(input.number_of_bushing_primary)},
        number_of_bushing_secondary: ${formatString(input.number_of_bushing_secondary)},
        protective_device: ${formatString(input.protective_device)},
        load_current_sec_bushing: ${formatString(input.load_current_sec_bushing)},
        load_current_neutral: ${formatString(input.load_current_neutral)},
        load_current_one: ${formatString(input.load_current_one)},
        load_current_two: ${formatString(input.load_current_two)},
        voltage_level_one: ${formatString(input.voltage_level_one)},
        voltage_level_two: ${formatString(input.voltage_level_two)},
        sec_line_conductor_size_one: ${formatString(input.sec_line_conductor_size_one)},
        sec_line_conductor_size_two: ${formatString(input.sec_line_conductor_size_two)},
    }`;

}

export function can_update_task_info(payload: { status_id: TASK_STATUS }) {
    const { status_id } = payload
    return [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED, TASK_STATUS.UNRESOLVED].includes(status_id)

}

export function get_kwh_meter_data(payload: { task: Task }): KwhMeterInput {

    const { task } = payload

    if(!task.task_detail_kwh_meter) {
        return deepClone(kwh_meter_initial_data);
    }

    const kwh_meter = task.task_detail_kwh_meter

    return {
        linemen_incharge: kwh_meter.linemen_incharge.map(i => ({...i.lineman, fullname: getFullname(i.lineman.employee.firstname, i.lineman.employee.middlename, i.lineman.employee.lastname)})),
        distance_travel_in_km: kwh_meter.distance_travel_in_km,
        meter_number: kwh_meter.meter_number || '',
        meter_brand: kwh_meter.meter_brand,
        cause: kwh_meter.cause,
        last_reading: kwh_meter.last_reading || '',
        initial_reading: kwh_meter.initial_reading || '',
        meter_class: kwh_meter.meter_class || '',
    }


}

export function get_power_interruption_data(payload: { task: Task }): PowerInterruptionInput {

    const { task } = payload

    if(!task.task_detail_power_interruption) {
        return deepClone(power_interruption_initial_data)
    }

    const pi = task.task_detail_power_interruption

    return {
        linemen_incharge: pi.linemen_incharge.map(i => ({...i.lineman, fullname: getFullname(i.lineman.employee.firstname, i.lineman.employee.middlename, i.lineman.employee.lastname)})),
        distance_travel_in_km: pi.distance_travel_in_km,
        affected_area: pi.affected_area || '',
        feeder: pi.feeder,
        cause: pi.cause,
        weather_condition: pi.weather_condition,
        device: pi.device,
        equipment_failed: pi.equipment_failed,
        fuse_rating: pi.fuse_rating || '',
    }


}

export function get_line_services_data(payload: { task: Task }): LineServicesInput {

    const { task } = payload

    if(!task.task_detail_line_services) {
        return deepClone(line_services_initial_data)
    }

    const ls = task.task_detail_line_services

    return {
        linemen_incharge: ls.linemen_incharge.map(i => ({...i.lineman, fullname: getFullname(i.lineman.employee.firstname, i.lineman.employee.middlename, i.lineman.employee.lastname)})),
        distance_travel_in_km: ls.distance_travel_in_km,
        order_number: ls.order_number || '',
        cause: ls.cause,
        mrv_number: ls.mrv_number || '',
        seriv_number: ls.seriv_number || '',
        mst_number: ls.mst_number || '',
        mcrt_number: ls.mcrt_number || '',
    }


}

export function get_dles_data(payload: { task: Task }): DlesInput {

    console.log('get_dles_data', payload);

    const { task } = payload

    if (!task.task_detail_dles) {
        return deepClone(dles_initial_data);
    }

    const dles = task.task_detail_dles

    return {
        linemen_incharge: dles.linemen_incharge.map(i => ({...i.lineman, fullname: getFullname(i.lineman.employee.firstname, i.lineman.employee.middlename, i.lineman.employee.lastname)})),
        distance_travel_in_km: dles.distance_travel_in_km,
        sco_number: dles.sco_number || '',
        old_serial_number: dles.old_serial_number || '',
        new_serial_number: dles.new_serial_number || '',
        seriv_number: dles.seriv_number || '',
        kva_rating: dles.kva_rating || '',
        cause: dles.cause,
    }

}

export function get_lmdga_data(payload: { task: Task }): LmdgaInput {

    const { task } = payload

    if(!task.task_detail_lmdga) {
        return deepClone(lmdga_initial_data);
    }

    const lmdga = task.task_detail_lmdga

    return {
        linemen_incharge: lmdga.linemen_incharge.map(i => ({...i.lineman, fullname: getFullname(i.lineman.employee.firstname, i.lineman.employee.middlename, i.lineman.employee.lastname)})),
        distance_travel_in_km: lmdga.distance_travel_in_km,
        kva_rating: lmdga.kva_rating || '',
        substation: lmdga.substation,
        dt_location: lmdga.dt_location || '',
        feeder: lmdga.feeder,
        phase_number: lmdga.phase_number || '',
        number_of_hc: lmdga.number_of_hc || '',
        number_of_spans: lmdga.number_of_spans || '',
        copper_aluminum_primary: lmdga.copper_aluminum_primary || '',
        copper_aluminum_secondary: lmdga.copper_aluminum_secondary || '',
        copper_aluminum_ground: lmdga.copper_aluminum_ground || '',
        size_primary: lmdga.size_primary || '',
        size_secondary: lmdga.size_secondary || '',
        size_ground: lmdga.size_ground || '',
        terminal_connector_primary: lmdga.terminal_connector_primary || '',
        terminal_connector_secondary: lmdga.terminal_connector_secondary || '',
        terminal_connector_ground: lmdga.terminal_connector_ground || '',
        tap_position: lmdga.tap_position || '',
        brand: lmdga.brand || '',
        number_of_bushing_primary: lmdga.number_of_bushing_primary || '',
        number_of_bushing_secondary: lmdga.number_of_bushing_secondary || '',
        protective_device: lmdga.protective_device || '',
        load_current_sec_bushing: lmdga.load_current_sec_bushing || '',
        load_current_neutral: lmdga.load_current_neutral || '',
        load_current_one: lmdga.load_current_one || '',
        load_current_two: lmdga.load_current_two || '',
        voltage_level_one: lmdga.voltage_level_one || '',
        voltage_level_two: lmdga.voltage_level_two || '',
        sec_line_conductor_size_one: lmdga.sec_line_conductor_size_one || '',
        sec_line_conductor_size_two: lmdga.sec_line_conductor_size_two || '',
    }


}