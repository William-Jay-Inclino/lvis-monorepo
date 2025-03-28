import type { Feeder, Lineman, Substation } from "../../common"
import type { Task } from "../task.types"

export interface TaskDetailLmdga {
    id: number 
    task_id: number 
    kva_rating: string 
    substation_id: string 
    dt_location: string 
    feeder_id: string 
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

    linemen_incharge: LmdgaLineman[]
    task: Task
}

export interface LmdgaLineman {
    lineman_id: string 
    lineman: Lineman 
}

export interface LmdgaInput {
    task: Task | null 
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
    task: null,
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