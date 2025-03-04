import type { Employee } from "../common"
import type { Complaint } from "../complaints/complaints.types"

export interface Task {
    _id: number
    ref_number: string
    complaint_id: number
    assign_to_id: string | null 
    task_status_id: number
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
    _id: number 
    name: string 
    color_class: string
}

export interface TaskDetail_Power_Interruption {
    _id: number 
    task_id: number 
    lineman_incharge_id: string 
    distance_travel_in_km: number 
    affected_area: string 
    feeder_id: string 
    cause: string 
    weather_condition_id: string 
    device_id: string 
    equipment_failed: string 
    fuse_rating: string 
}

export interface TaskDetail_KWH_Meter {
    _id: number 
    task_id: number 
    lineman_incharge_id: string 
    distance_travel_in_km: number 
    meter_number: string 
    meter_brand_id: string 
    last_reading: string 
    initial_reading: string 
    meter_class: string 
}


export interface TaskLog {
    _id: number 
    task_id: number 
    task_status_id: number 
    remarks: string 
    updated_by: string 
    updated_at: string
    
    task_status?: TaskStatus
}

export interface TaskFile {
    _id: number 
    task_id: number 
    src: string 
}