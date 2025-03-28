import type { Device, Feeder, Lineman, WeatherCondition } from "../../common"
import type { Task } from "../task.types"

export interface TaskDetailPowerInterruption {
    id: number 
    task_id: number 
    affected_area: string 
    feeder_id: string 
    cause: string 
    weather_condition_id: string 
    device_id: string 
    equipment_failed: string 
    fuse_rating: string 

    // relationships
    linemen_incharge: PowerInterruptionLineman[]
    feeder: Feeder
    weather_condition: WeatherCondition
    device: Device
    task: Task
}

export interface PowerInterruptionLineman {
    lineman_id: string 
    lineman: Lineman 
}

export interface PowerInterruptionInput {
    affected_area: string 
    feeder: Feeder | null 
    cause: string 
    weather_condition: WeatherCondition | null 
    device: Device | null 
    equipment_failed: string 
    fuse_rating: string 

    linemen_incharge: Lineman[]
}

export const power_interruption_initial_data: PowerInterruptionInput = {
    affected_area: '',
    feeder: null,
    cause: '',
    weather_condition: null,
    device: null,
    equipment_failed: '',
    fuse_rating: '',
    linemen_incharge: [],
}
