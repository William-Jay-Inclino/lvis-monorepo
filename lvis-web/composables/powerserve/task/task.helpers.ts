import { dles_errors, type DlesError, type DlesInput } from "./task-detail-types/dles";
import { kwh_meter_errors, type KwhMeterError, type KwhMeterInput } from "./task-detail-types/kwh-meter";
import { line_services_errors, type LineServicesError, type LineServicesInput } from "./task-detail-types/line-services";
import { lmdga_errors, type LmdgaError, type LmdgaInput } from "./task-detail-types/lmdga";
import { power_interruption_errors, type PowerInterruptionError, type PowerInterruptionInput } from "./task-detail-types/power-interruption";

export function is_valid_kwh_meter(payload: { data:  KwhMeterInput }): KwhMeterError {

    const { data } = payload 

    const errors = {...kwh_meter_errors}

    if(data.meter_number.trim() === '') {
        errors.meter_number = true 
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

    if(data.linemen_incharge.length === 0) {
        errors.linemen_incharge = true 
    }

    return errors

}

export function is_valid_power_interruption(payload: { data:  PowerInterruptionInput }): PowerInterruptionError {

    const { data } = payload 

    const errors = {...power_interruption_errors}

    if(data.affected_area.trim() === '') {
        errors.affected_area = true 
    }

    if(!data.feeder) {
        errors.feeder = true 
    }

    if(data.cause.trim() === '') {
        errors.cause = true 
    }

    if(!data.weather_condition) {
        errors.weather_condition = true 
    }

    if(!data.device) {
        errors.device = true 
    }

    if(data.equipment_failed.trim() === '') {
        errors.equipment_failed = true 
    }

    if(data.fuse_rating.trim() === '') {
        errors.fuse_rating = true 
    }

    if(data.linemen_incharge.length === 0) {
        errors.linemen_incharge = true 
    }

    return errors

}

export function is_valid_line_services(payload: { data:  LineServicesInput }): LineServicesError {

    const { data } = payload 

    const errors = {...line_services_errors}

    if(data.order_number.trim() === '') {
        errors.order_number = true 
    }

    if(data.cause.trim() === '') {
        errors.cause = true 
    }

    if(data.mrv_number.trim() === '') {
        errors.mrv_number = true 
    }

    if(data.seriv_number.trim() === '') {
        errors.seriv_number = true 
    }

    if(data.mst_number.trim() === '') {
        errors.mst_number = true 
    }

    if(data.mcrt_number.trim() === '') {
        errors.mcrt_number = true 
    }

    if(data.linemen_incharge.length === 0) {
        errors.linemen_incharge = true 
    }

    return errors

}

export function is_valid_dles(payload: { data:  DlesInput }): DlesError {

    const { data } = payload 

    const errors = {...dles_errors}

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

    if(data.cause.trim() === '') {
        errors.cause = true 
    }

    if(data.linemen_incharge.length === 0) {
        errors.linemen_incharge = true 
    }

    return errors

}

export function is_valid_lmdga(payload: { data:  LmdgaInput }): LmdgaError {

    const { data } = payload 

    const errors = {...lmdga_errors}

    if(data.kva_rating.trim() === '') {
        errors.kva_rating = true 
    }

    if(!data.substation) {
        errors.substation = true
    }

    if(data.dt_location.trim() === '') {
        errors.dt_location = true 
    }

    if(!data.feeder) {
        errors.feeder = true
    }

    if(data.phase_number.trim() === '') {
        errors.phase_number = true 
    }

    if(data.number_of_hc.trim() === '') {
        errors.number_of_hc = true 
    }

    if(data.number_of_spans.trim() === '') {
        errors.number_of_spans = true 
    }

    if(data.copper_aluminum_primary.trim() === '') {
        errors.copper_aluminum_primary = true 
    }

    if(data.copper_aluminum_secondary.trim() === '') {
        errors.copper_aluminum_secondary = true 
    }

    if(data.copper_aluminum_ground.trim() === '') {
        errors.copper_aluminum_ground = true 
    }

    if(data.size_primary.trim() === '') {
        errors.size_primary = true 
    }

    if(data.size_secondary.trim() === '') {
        errors.size_secondary = true 
    }

    if(data.size_ground.trim() === '') {
        errors.size_ground = true 
    }

    if(data.terminal_connector_primary.trim() === '') {
        errors.terminal_connector_primary = true 
    }

    if(data.terminal_connector_secondary.trim() === '') {
        errors.terminal_connector_secondary = true 
    }

    if(data.terminal_connector_ground.trim() === '') {
        errors.terminal_connector_ground = true 
    }

    if(data.tap_position.trim() === '') {
        errors.tap_position = true 
    }

    if(data.brand.trim() === '') {
        errors.brand = true 
    }

    if(data.number_of_bushing_primary.trim() === '') {
        errors.number_of_bushing_primary = true 
    }

    if(data.number_of_bushing_secondary.trim() === '') {
        errors.number_of_bushing_secondary = true 
    }

    if(data.protective_device.trim() === '') {
        errors.protective_device = true 
    }

    if(data.load_current_sec_bushing.trim() === '') {
        errors.load_current_sec_bushing = true 
    }

    if(data.load_current_neutral.trim() === '') {
        errors.load_current_neutral = true 
    }

    if(data.load_current_one.trim() === '') {
        errors.load_current_one = true 
    }

    if(data.load_current_two.trim() === '') {
        errors.load_current_two = true 
    }

    if(data.voltage_level_one.trim() === '') {
        errors.voltage_level_one = true 
    }

    if(data.voltage_level_two.trim() === '') {
        errors.voltage_level_two = true 
    }

    if(data.sec_line_conductor_size_one.trim() === '') {
        errors.sec_line_conductor_size_one = true 
    }

    if(data.sec_line_conductor_size_two.trim() === '') {
        errors.sec_line_conductor_size_two = true 
    }

    if(data.brand.trim() === '') {
        errors.brand = true 
    }

    if(data.linemen_incharge.length === 0) {
        errors.linemen_incharge = true 
    }

    return errors

}

export function get_pi_mutation_string(payload: { input: PowerInterruptionInput }): string {

    const { input } = payload

    return `{
        linemen_incharge_ids: [${input.linemen_incharge.map(i => `"${i.id}"`).join(", ")}],
        affected_area: "${input.affected_area}",
        feeder_id: "${input.feeder?.id}",
        cause: "${input.cause}",
        weather_condition_id: "${input.weather_condition?.id}",
        device_id: "${input.device?.id}",
        equipment_failed: "${input.equipment_failed}",
        fuse_rating: "${input.fuse_rating}"
    }`

}


export function get_kwh_meter_mutation_string(payload: { input: KwhMeterInput }): string {

    const { input } = payload

    return `{
        linemen_incharge_ids: [${input.linemen_incharge.map(i => `"${i.id}"`).join(", ")}],
        meter_number: "${input.meter_number}",
        meter_brand_id: "${input.meter_brand?.id}",
        last_reading: "${input.last_reading}",
        initial_reading: "${input.initial_reading}",
        meter_class: "${input.meter_class}"
    }`

}


export function get_line_services_mutation_string(payload: { input: LineServicesInput }): string {

    const { input } = payload

    return `{
        linemen_incharge_ids: [${input.linemen_incharge.map(i => `"${i.id}"`).join(", ")}],
        order_number: "${input.order_number}",
        cause: "${input.cause}",
        mrv_number: "${input.mrv_number}",
        seriv_number: "${input.seriv_number}",
        mst_number: "${input.mst_number}"
        mcrt_number: "${input.mcrt_number}"
    }`

}

export function get_dles_mutation_string(payload: { input: DlesInput }): string {

    const { input } = payload

    return `{
        linemen_incharge_ids: [${input.linemen_incharge.map(i => `"${i.id}"`).join(", ")}],
        sco_number: "${input.sco_number}",
        old_serial_number: "${input.old_serial_number}",
        new_serial_number: "${input.new_serial_number}",
        seriv_number: "${input.seriv_number}",
        kva_rating: "${input.kva_rating}"
        cause: "${input.cause}"
    }`

}


export function get_lmdga_mutation_string(payload: { input: LmdgaInput }): string {

    const { input } = payload

    return `{
        linemen_incharge_ids: [${input.linemen_incharge.map(i => `"${i.id}"`).join(", ")}],
        kva_rating: "${input.kva_rating}",
        substation_id: "${input.substation?.id}",
        dt_location: "${input.dt_location}",
        feeder_id: "${input.feeder?.id}",
        phase_number: "${input.phase_number}"
        number_of_hc: "${input.number_of_hc}"
        number_of_spans: "${input.number_of_spans}"
        copper_aluminum_primary: "${input.copper_aluminum_primary}"
        copper_aluminum_secondary: "${input.copper_aluminum_secondary}"
        copper_aluminum_ground: "${input.copper_aluminum_ground}"
        size_primary: "${input.size_primary}"
        size_secondary: "${input.size_secondary}"
        size_ground: "${input.size_ground}"
        terminal_connector_primary: "${input.terminal_connector_primary}"
        terminal_connector_secondary: "${input.terminal_connector_secondary}"
        terminal_connector_ground: "${input.terminal_connector_ground}"
        tap_position: "${input.tap_position}"
        brand: "${input.brand}"
        number_of_bushing_primary: "${input.number_of_bushing_primary}"
        number_of_bushing_secondary: "${input.number_of_bushing_secondary}"
        protective_device: "${input.protective_device}"
        load_current_sec_bushing: "${input.load_current_sec_bushing}"
        load_current_neutral: "${input.load_current_neutral}"
        load_current_one: "${input.load_current_one}"
        load_current_two: "${input.load_current_two}"
        voltage_level_one: "${input.voltage_level_one}"
        voltage_level_two: "${input.voltage_level_two}"
        sec_line_conductor_size_one: "${input.sec_line_conductor_size_one}"
        sec_line_conductor_size_two: "${input.sec_line_conductor_size_two}"
    }`

}