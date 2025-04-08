import type { Employee } from "~/composables/hr/employee/employee.types"
import type { Complaint } from "../complaint/complaint.types"
import type { Activity } from "../common"
import type { Area } from "../area/area.types"
import type { Department } from "~/composables/hr/department/department"
import type { TaskDetailPowerInterruption } from "./task-detail-types/power-interruption"
import type { TaskDetailKwhMeter } from "./task-detail-types/kwh-meter"
import type { TaskDetailLineServices } from "./task-detail-types/line-services"
import type { TaskDetailDles } from "./task-detail-types/dles"
import type { TaskDetailLmdga } from "./task-detail-types/lmdga"

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
    acted_at: string | null 
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
    files: TaskFile[]

    task_detail_power_interruption?: TaskDetailPowerInterruption | null
    task_detail_kwh_meter?: TaskDetailKwhMeter | null
    task_detail_line_services?: TaskDetailLineServices | null
    task_detail_dles?: TaskDetailDles | null
    task_detail_lmdga?: TaskDetailLmdga | null
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

export interface TaskLog {
    id: number 
    task_id: number 
    task_status_id: number 
    remarks?: string | null
    created_by: string 
    created_at: string
    
    status?: TaskStatus
}

export interface TaskFile {
    id: number 
    taskid: number 
    filename: string
    source_path: string
}

