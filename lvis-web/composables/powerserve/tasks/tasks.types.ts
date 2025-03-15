import type { Employee } from "../common"
import type { Complaint } from "../complaints/complaints.types"

export interface Task {
    id: number
    ref_number: string
    complaintid: number
    assigned_toid: string | null 
    task_statusid: number
    remarks: string 
    accomplishment: string 
    action_taken: string 
    created_at: string 
    units_earned: number

    complaint?: Complaint
    assign_to?: Employee
    task_status?: TaskStatus
    logs?: TaskLog[]
}

export interface TaskStatus {
    id: number 
    name: string 
    color_class: string
    total: number
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
    task_statusid: number 
    remarks: string 
    updated_by: string 
    updated_at: string
    
    task_status?: TaskStatus
}

export interface TaskFile {
    id: number 
    taskid: number 
    src: string 
}