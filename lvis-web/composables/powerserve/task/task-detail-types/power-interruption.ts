import type { Barangay } from "../../barangay/barangay"
import type { ActivityCategoryCause, Device, Equipment, Feeder, WeatherCondition } from "../../common"
import type { Lineman } from "../../lineman/lineman.types"
import type { Task } from "../task.types"

export interface TaskDetailPowerInterruption {
    id: number 
    task_id: number 
    feeder_id: string 
    weather_condition_id: string | null 
    device_id: string | null 
    cause_id: string | null 
    barangay_id: string 
    distance_travel_in_km: number
    affected_area: string | null 
    equipment_failed_id: string | null 
    fuse_rating: string | null 
    
    // relationships
    linemen_incharge: PowerInterruptionLineman[]
    equipment_failed: Equipment | null 
    feeder: Feeder | null
    weather_condition: WeatherCondition | null
    device: Device | null
    task: Task
    cause: ActivityCategoryCause | null
    barangay: Barangay
}

export interface PowerInterruptionLineman {
    lineman_id: string 
    task_detail_id: number 

    lineman: Lineman
    task_detail: TaskDetailPowerInterruption 
}

export interface PowerInterruptionInput {
    feeder: Feeder | null 
    weather_condition: WeatherCondition | null 
    device: Device | null 
    cause: ActivityCategoryCause | null
    distance_travel_in_km: number
    affected_area: string 
    equipment_failed: Equipment | null 
    fuse_rating: string 

    linemen_incharge: Lineman[]
}

export const power_interruption_initial_data: PowerInterruptionInput = {
    feeder: null,
    weather_condition: null,
    device: null,
    cause: null,
    distance_travel_in_km: 0,
    affected_area: '',
    equipment_failed: null,
    fuse_rating: '',
    linemen_incharge: [],
}

export interface PowerInterruptionError {
    feeder: boolean
    weather_condition: boolean
    device: boolean
    cause: boolean
    distance_travel_in_km: boolean
    affected_area: boolean
    equipment_failed: boolean
    fuse_rating: boolean
    linemen_incharge: boolean
}

export const power_interruption_errors: PowerInterruptionError = {
    feeder: false,
    weather_condition: false,
    device: false,
    cause: false,
    distance_travel_in_km: false,
    affected_area: false,
    equipment_failed: false,
    fuse_rating: false,
    linemen_incharge: false,
}