import type { ActivityCategoryCause, Barangay, Device, Equipment, Feeder, Lineman, WeatherCondition } from "../../common"
import type { Task } from "../task.types"

export interface TaskDetailPowerInterruption {
    id: number 
    task_id: number 
    affected_area: string 
    feeder_id: string 
    cause_id: string 
    barangay_id: string 
    weather_condition_id: string 
    equipment_failed_id: string 
    device_id: string 
    fuse_rating: string 
    
    // relationships
    linemen_incharge: PowerInterruptionLineman[]
    equipment_failed: Equipment 
    feeder: Feeder
    weather_condition: WeatherCondition
    device: Device
    task: Task
    cause: ActivityCategoryCause
    barangay: Barangay
}

export interface PowerInterruptionLineman {
    lineman_id: string 
    lineman: Lineman 
}

export interface PowerInterruptionInput {
    affected_area: string 
    feeder: Feeder | null 
    cause: ActivityCategoryCause | null
    weather_condition: WeatherCondition | null 
    device: Device | null 
    equipment_failed: Equipment | null 
    fuse_rating: string 

    linemen_incharge: Lineman[]
}

export const power_interruption_initial_data: PowerInterruptionInput = {
    affected_area: '',
    feeder: null,
    cause: null,
    weather_condition: null,
    device: null,
    equipment_failed: null,
    fuse_rating: '',
    linemen_incharge: [],
}

export interface PowerInterruptionError {
    affected_area: boolean
    feeder: boolean
    cause: boolean
    weather_condition: boolean
    device: boolean
    equipment_failed: boolean
    fuse_rating: boolean
    linemen_incharge: boolean
}

export const power_interruption_errors: PowerInterruptionError = {
    affected_area: false,
    feeder: false,
    cause: false,
    weather_condition: false,
    device: false,
    equipment_failed: false,
    fuse_rating: false,
    linemen_incharge: false,
}