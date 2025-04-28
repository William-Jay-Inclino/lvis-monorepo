import type { Barangay } from "../../barangay/barangay"
import type { Feeder, Substation } from "../../common"
import type { Lineman } from "../../lineman/lineman.types"
import type { Task } from "../task.types"

export interface TaskDetailLmdga {
    id: number 
    task_id: number 
    barangay_id: number 
    distance_travel_in_km: number
    kva_rating: string | null
    substation_id: string | null 
    dt_location: string | null 
    feeder_id: string | null 
    phase_number: string | null 
    number_of_hc: string | null 
    number_of_spans: string | null 
    copper_aluminum_primary: string | null 
    copper_aluminum_secondary: string | null 
    copper_aluminum_ground: string | null 
    size_primary: string | null 
    size_secondary: string | null 
    size_ground: string | null 
    terminal_connector_primary: string | null 
    terminal_connector_secondary: string | null 
    terminal_connector_ground: string | null 
    tap_position: string | null 
    brand: string | null 
    number_of_bushing_primary: string | null 
    number_of_bushing_secondary: string | null 
    protective_device: string | null 
    load_current_sec_bushing: string | null 
    load_current_neutral: string | null 
    load_current_one: string | null 
    load_current_two: string | null 
    voltage_level_one: string | null 
    voltage_level_two: string | null 
    sec_line_conductor_size_one: string | null 
    sec_line_conductor_size_two: string | null 

    linemen_incharge: LmdgaLineman[]
    task: Task
    substation: Substation | null
    feeder: Feeder | null
    barangay: Barangay
    
}

export interface LmdgaLineman {
    lineman_id: string 
    task_detail_id: number 

    lineman: Lineman
    task_detail: TaskDetailLmdga 
}

export interface LmdgaInput {
    distance_travel_in_km: number
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

    linemen_incharge: Lineman[]
}

export interface LmdgaLineman {
    lineman_id: string 
    lineman: Lineman 
}


export const lmdga_initial_data: LmdgaInput = {
    distance_travel_in_km: 0,
    kva_rating: '',
    substation: null, 
    dt_location: '', 
    feeder: null, 
    phase_number: '', 
    number_of_hc: '', 
    number_of_spans: '', 
    copper_aluminum_primary: '', 
    copper_aluminum_secondary: '', 
    copper_aluminum_ground: '', 
    size_primary: '',
    size_secondary: '', 
    size_ground: '', 
    terminal_connector_primary: '', 
    terminal_connector_secondary: '', 
    terminal_connector_ground: '', 
    tap_position: '', 
    brand: '', 
    number_of_bushing_primary: '', 
    number_of_bushing_secondary: '', 
    protective_device: '', 
    load_current_sec_bushing: '', 
    load_current_neutral: '', 
    load_current_one: '', 
    load_current_two: '', 
    voltage_level_one: '', 
    voltage_level_two: '', 
    sec_line_conductor_size_one: '', 
    sec_line_conductor_size_two: '', 
    linemen_incharge: [],
}

export interface LmdgaError {
    distance_travel_in_km: boolean
    kva_rating: boolean
    substation: boolean
    dt_location: boolean
    feeder: boolean
    phase_number: boolean 
    number_of_hc: boolean
    number_of_spans: boolean
    copper_aluminum_primary: boolean 
    copper_aluminum_secondary: boolean
    copper_aluminum_ground: boolean
    size_primary: boolean
    size_secondary: boolean
    size_ground: boolean
    terminal_connector_primary: boolean 
    terminal_connector_secondary: boolean
    terminal_connector_ground: boolean
    tap_position: boolean
    brand: boolean
    number_of_bushing_primary: boolean 
    number_of_bushing_secondary: boolean
    protective_device: boolean
    load_current_sec_bushing: boolean 
    load_current_neutral: boolean
    load_current_one: boolean
    load_current_two: boolean
    voltage_level_one: boolean
    voltage_level_two: boolean
    sec_line_conductor_size_one: boolean
    sec_line_conductor_size_two: boolean
    linemen_incharge: boolean,
}

export const lmdga_errors: LmdgaError = {
    distance_travel_in_km: false,
    kva_rating: false,
    substation: false,
    dt_location: false,
    feeder: false,
    phase_number: false, 
    number_of_hc: false,
    number_of_spans: false,
    copper_aluminum_primary: false, 
    copper_aluminum_secondary: false,
    copper_aluminum_ground: false,
    size_primary: false,
    size_secondary: false,
    size_ground: false,
    terminal_connector_primary: false, 
    terminal_connector_secondary: false,
    terminal_connector_ground: false,
    tap_position: false,
    brand: false,
    number_of_bushing_primary: false, 
    number_of_bushing_secondary: false,
    protective_device: false,
    load_current_sec_bushing: false, 
    load_current_neutral: false,
    load_current_one: false,
    load_current_two: false,
    voltage_level_one: false,
    voltage_level_two: false,
    sec_line_conductor_size_one: false,
    sec_line_conductor_size_two: false,
    linemen_incharge: false,
}