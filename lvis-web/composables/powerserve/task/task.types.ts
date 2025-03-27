import type { Employee } from "~/composables/hr/employee/employee.types"
import type { Complaint } from "../complaint/complaint.types"
import type { Activity, Device, Feeder, Lineman, WeatherCondition } from "../common"
import type { TASK_STATUS } from "./task.constants"
import type { KwhMeterInput, PowerInterruptionInput } from "./dtos/task-detail.input.types"
import type { Area } from "../area/area.types"
import type { Department } from "~/composables/hr/department/department"

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
    created_by: string 
    units_earned: number

    // task_assignment?: 
    task_assignment?: TaskAssignment
    complaint?: Complaint
    activity?: Activity
    assignee?: Employee
    status?: TaskStatus
    logs?: TaskLog[]

    task_detail_power_interruption?: TaskDetailPowerInterruption | null
}

export interface TaskAssignment {
    id: number 
    task_id: number 
    area_id?: string 
    department_id?: string 
    division_id?: string
    
    task: Task
    area?: Area
    department?: Department
    division?: Division
}


export interface TaskStatus {
    id: number 
    name: string 
    color_class: string
    description: string
    total: number
    total_count_by_assignee: number
    total_count_by_group: number
}

export interface TaskDetailPowerInterruption {
    id: number 
    taskid: number 
    affected_area: string 
    feederid: string 
    cause: string 
    weather_conditionid: string 
    deviceid: string 
    equipment_failed: string 
    fuse_rating: string 

    // relationships
    linemen: PowerInterruptionLineman[]
    feeder: Feeder
    weather_condition: WeatherCondition
    device: Device
}

export interface PowerInterruptionLineman {
    lineman_id: string 
    lineman: Lineman 
}

export interface Create_Power_Interruption_Input {
    affected_area: string 
    feeder: Feeder | null 
    cause: string 
    weather_condition: WeatherCondition | null 
    device: Device | null 
    equipment_failed: string 
    fuse_rating: string 
    linemen: Lineman[]
}

export interface TaskDetail_KWH_Meter {
    id: number 
    taskid: number 
    meter_number: string 
    meter_brandid: string 
    last_reading: string 
    initial_reading: string 
    meter_class: string 

    linemen: KwhMeterLineman[]
}

export interface KwhMeterLineman {
    lineman_id: string 
    lineman: Lineman 
}

export interface TaskDetail_Line_Services {
    id: number 
    taskid: number 
    order_number: string 
    cause: string 
    mrv_number: string 
    seriv_number: string 
    mst_number: string 
    mcrt_number: string 

    linemen: LineServicesLineman[]
}

export interface LineServicesLineman {
    lineman_id: string 
    lineman: Lineman 
}

export interface TaskDetail_DLES {
    id: number 
    taskid: number 
    sco_number: string 
    old_serial_number: string 
    new_serial_number: string 
    seriv_number: string 
    kva_rating: string 
    cause: string 

    linemen: DlesLineman[]
}

export interface DlesLineman {
    lineman_id: string 
    lineman: Lineman 
}

export interface TaskDetail_LMDGA {
    id: number 
    taskid: number 
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

    linemen: LmdgaLineman[]
}

export interface LmdgaLineman {
    lineman_id: string 
    lineman: Lineman 
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
    acted_at: string
    notes: string
    task_detail: {
        power_interruption?: PowerInterruptionInput,
        kwh_meter?: KwhMeterInput | null,
    }
}

export interface CreateTaskInput {
    complaint: Complaint | null,
    assignee: Employee | null,
    remarks: string
}