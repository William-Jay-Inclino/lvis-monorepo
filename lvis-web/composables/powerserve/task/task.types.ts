import type { Employee } from "~/composables/hr/employee/employee.types"
import type { Complaint } from "../complaint/complaint.types"
import type { Activity, Lineman } from "../common"
import type { TASK_STATUS } from "./task.constants"

export interface Task {
    id: number
    ref_number: string
    complaint_id: number
    assignee_id: string | null 
    activity_id: string | null 
    task_status_id: number
    description: string 
    remarks: string 
    accomplishment: string 
    action_taken: string 
    created_at: string 
    units_earned: number

    complaint?: Complaint
    activity?: Activity
    assignee?: Employee
    status?: TaskStatus
    logs?: TaskLog[]
}

export interface TaskStatus {
    id: number 
    name: string 
    color_class: string
    description: string
    total: number
    total_count_by_assignee: number
}

export interface TaskDetail_Power_Interruption {
    id: number 
    taskid: number 
    lineman_inchargeid: string 
    affected_area: string 
    feederid: string 
    cause: string 
    weather_conditionid: string 
    deviceid: string 
    equipment_failed: string 
    fuse_rating: string 
}

export interface Create_Power_Interruption_Input {
    lineman_incharge: Lineman | null 
    affected_area: string 
    // feeder:  
    cause: string 
    // weather_conditionid: string 
    // deviceid: string 
    equipment_failed: string 
    fuse_rating: string 
}

export interface TaskDetail_KWH_Meter {
    id: number 
    taskid: number 
    lineman_inchargeid: string 
    distance_travel_in_km: number 
    meter_number: string 
    meter_brandid: string 
    last_reading: string 
    initial_reading: string 
    meter_class: string 
}

export interface TaskDetail_Line_Services {
    id: number 
    taskid: number 
    lineman_inchargeid: string 
    distance_travel_in_km: number 
    order_number: string 
    cause: string 
    mrv_number: string 
    seriv_number: string 
    mst_number: string 
    mcrt_number: string 
}

export interface TaskDetail_DLES {
    id: number 
    taskid: number 
    lineman_inchargeid: string 
    distance_travel_in_km: number 
    sco_number: string 
    old_serial_number: string 
    new_serial_number: string 
    seriv_number: string 
    kva_rating: string 
    cause: string 
}


export interface TaskDetail_LMDGA {
    id: number 
    taskid: number 
    lineman_inchargeid: string 
    distance_travel_in_km: number 
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
}


export interface TaskLog {
    id: number 
    taskid: number 
    task_status_id: number 
    remarks?: string | null
    created_by: string 
    created_at: string
    
    status?: TaskStatus
}

export interface TaskFile {
    id: number 
    taskid: number 
    src: string 
}

export interface AssignTaskInput {
    task: Task
    assignee: Employee
    remarks: string 
    will_start: boolean
}

export interface UpdateTaskStatusInput {
    task: Task
    status_id: TASK_STATUS,
    remarks: string 
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Task
  }


export interface FindAllResponse {
    data: Task[]
    totalItems: number
    currentPage: number
    totalPages: number
}

export interface UpdateTaskInput {
    activity: Activity | null
    description: string
    status: TaskStatus | null
    action_taken: string
    date_acted: string
    lineman_incharge: Employee | null 
    notes: string
}