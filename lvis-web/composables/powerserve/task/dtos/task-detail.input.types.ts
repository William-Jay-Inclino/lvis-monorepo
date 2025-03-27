import type { Device, Feeder, Lineman, MeterBrand, Substation, WeatherCondition } from "../../common"

export interface PowerInterruptionInput {
    affected_area: string 
    feeder: Feeder | null 
    cause: string 
    weather_condition: WeatherCondition | null 
    device: Device | null 
    equipment_failed: string 
    fuse_rating: string 

    linemen_incharge: Lineman[]
}

export interface KwhMeterInput {
    lineman_incharge: Lineman | null 
    meter_number: string 
    meter_brand: MeterBrand | null 
    last_reading: string 
    initial_reading: string 
    meter_class: string 
}


export interface LineServicesInput {
    lineman_incharge: Lineman | null 
    order_number: string 
    cause: string 
    mrv_number: string 
    seriv_number: string 
    mst_number: string 
    mcrt_number: string 
}

export interface DlesInput {
    lineman_incharge: Lineman | null 
    sco_number: string 
    old_serial_number: string 
    new_serial_number: string 
    seriv_number: string 
    kva_rating: string 
    cause: string 
}


export interface LmdgaInput {
    lineman_incharge: Lineman | null 
    kva_rating: string 
    substation: Substation | null 
    dt_location: string 
    feeder: Feeder | null 
    phase_number: string 
    number_of_hc: string 
    number_of_spans: string 
    copper_aluminum_primary: string 
    copper_aluminum_secondary: string 
    copper_aluminum_ground: string 
    size_primary: string 
    size_secondary: string 
    size_ground: string 
    terminal_connector_primary: string 
    terminal_connector_secondary: string 
    terminal_connector_ground: string 
    tap_position: string 
    brand: string 
    number_of_bushing_primary: string 
    number_of_bushing_secondary: string 
    protective_device: string 
    load_current_sec_bushing: string 
    load_current_neutral: string 
    load_current_one: string 
    load_current_two: string 
    voltage_level_one: string 
    voltage_level_two: string 
    sec_line_conductor_size_one: string 
    sec_line_conductor_size_two: string 
}