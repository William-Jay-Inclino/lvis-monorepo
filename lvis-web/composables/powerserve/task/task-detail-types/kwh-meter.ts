import type { ActivityCategoryCause, Barangay, Lineman, MeterBrand } from "../../common"
import type { Task } from "../task.types"

export interface TaskDetailKwhMeter {
    id: number 
    task_id: number 
    cause_id: string 
    barangay_id: string 
    meter_number: string 
    meter_brand_id: string 
    last_reading: string 
    initial_reading: string 
    meter_class: string 

    linemen_incharge: KwhMeterLineman[]
    task: Task 
    meter_brand: MeterBrand
    cause: ActivityCategoryCause
    barangay: Barangay
}

export interface KwhMeterLineman {
    lineman_id: string 
    lineman: Lineman 
}

export interface KwhMeterInput {
    meter_number: string 
    cause: ActivityCategoryCause | null 
    meter_brand: MeterBrand | null 
    last_reading: string 
    initial_reading: string 
    meter_class: string 

    linemen_incharge: Lineman[]
}


export const kwh_meter_initial_data: KwhMeterInput = {
    meter_number: '',
    cause: null,
    meter_brand: null,
    last_reading: '',
    initial_reading: '',
    meter_class: '',
    linemen_incharge: [],
}

export interface KwhMeterError {
    meter_number: boolean
    cause: boolean
    meter_brand: boolean
    last_reading: boolean
    initial_reading: boolean
    meter_class: boolean
    linemen_incharge: boolean
}

export const kwh_meter_errors: KwhMeterError = {
    meter_number: false,
    cause: false,
    meter_brand: false,
    last_reading: false,
    initial_reading: false,
    meter_class: false,
    linemen_incharge: false,
}