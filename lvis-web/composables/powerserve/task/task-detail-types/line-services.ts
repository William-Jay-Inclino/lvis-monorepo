import type { Barangay } from "../../barangay/barangay"
import type { ActivityCategoryCause } from "../../common"
import type { Lineman } from "../../lineman/lineman.types"
import type { Task } from "../task.types"

export interface TaskDetailLineServices {
    id: number 
    task_id: number 
    cause_id: string 
    barangay_id: string 
    order_number: string 
    mrv_number: string 
    seriv_number: string 
    mst_number: string 
    mcrt_number: string 
    distance_travel_in_km: number

    linemen_incharge: LineServicesLineman[]
    task: Task
    cause: ActivityCategoryCause
    barangay: Barangay
}

export interface LineServicesLineman {
    lineman_id: string 
    task_detail_id: number 

    lineman: Lineman
    task_detail: TaskDetailLineServices 
}

export interface LineServicesInput {
    order_number: string | null 
    cause: ActivityCategoryCause | null
    mrv_number: string | null
    seriv_number: string | null 
    mst_number: string | null 
    mcrt_number: string | null 
    distance_travel_in_km: number

    linemen_incharge: Lineman[]
}


export const line_services_initial_data: LineServicesInput = {
    order_number: '',
    cause: null,
    mrv_number: '',
    seriv_number: '',
    mst_number: '',
    mcrt_number: '',
    linemen_incharge: [],
    distance_travel_in_km: 0,
}

export interface LineServicesError {
    order_number: boolean
    cause: boolean
    mrv_number: boolean
    seriv_number: boolean
    mst_number: boolean
    mcrt_number: boolean
    linemen_incharge: boolean
    distance_travel_in_km: boolean
}

export const line_services_errors: LineServicesError = {
    order_number: false,
    cause: false,
    mrv_number: false,
    seriv_number: false,
    mst_number: false,
    mcrt_number: false,
    linemen_incharge: false,
    distance_travel_in_km: false,
}