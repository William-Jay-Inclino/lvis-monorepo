import type { Employee } from "~/composables/hr/employee/employee.types"
import type { Complaint } from "../complaint/complaint.types"
import type { Activity } from "../common"
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
    distance_travel_in_km: number 
    affected_area: string 
    feederid: string 
    cause: string 
    weather_conditionid: string 
    deviceid: string 
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