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