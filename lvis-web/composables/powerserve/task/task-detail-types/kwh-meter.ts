import type { Barangay } from "../../barangay/barangay"
import type { ActivityCategoryCause, MeterBrand } from "../../common"
import type { Lineman } from "../../lineman/lineman.types"
import type { Task } from "../task.types"

export interface TaskDetailKwhMeter {
    id: number 
    task_id: number 
    barangay_id: string 
    cause_id: string | null 
    distance_travel_in_km: number
    meter_number: string | null 
    meter_brand_id: string | null 
    last_reading: string | null 
    initial_reading: string | null 
    meter_class: string | null 

    barangay: Barangay
    cause: ActivityCategoryCause | null
    linemen_incharge: KwhMeterLineman[]
    task: Task 
    meter_brand: MeterBrand
}

export interface KwhMeterLineman {
    lineman_id: string
    task_detail_id: number

    lineman: Lineman
    task_detail: TaskDetailKwhMeter 
}

export interface KwhMeterInput {
    cause: ActivityCategoryCause | null 
    distance_travel_in_km: number
    meter_number: string 
    meter_brand: MeterBrand | null 
    last_reading: string 
    initial_reading: string 
    meter_class: string 

    linemen_incharge: Lineman[]
}


export const kwh_meter_initial_data: KwhMeterInput = {
    cause: null,
    distance_travel_in_km: 0,
    meter_number: '',
    meter_brand: null,
    last_reading: '',
    initial_reading: '',
    meter_class: '',
    linemen_incharge: [],
}

export interface KwhMeterError {
    cause: boolean
    distance_travel_in_km: boolean
    meter_number: boolean
    meter_brand: boolean
    last_reading: boolean
    initial_reading: boolean
    meter_class: boolean
    linemen_incharge: boolean
}

export const kwh_meter_errors: KwhMeterError = {
    cause: false,
    distance_travel_in_km: false,
    meter_number: false,
    meter_brand: false,
    last_reading: false,
    initial_reading: false,
    meter_class: false,
    linemen_incharge: false,
}