import type { Barangay } from "../../barangay/barangay"
import type { ActivityCategoryCause } from "../../common"
import type { Lineman } from "../../lineman/lineman.types"
import type { Task } from "../task.types"

export interface TaskDetailLineServices {
    id: number 
    task_id: number 
    barangay_id: string 
    cause_id: string | null 
    distance_travel_in_km: number
    order_number: string | null 
    mrv_number: string | null 
    seriv_number: string | null 
    mst_number: string | null 
    mcrt_number: string | null 

    linemen_incharge: LineServicesLineman[]
    task: Task
    cause: ActivityCategoryCause | null
    barangay: Barangay
}

export interface LineServicesLineman {
    lineman_id: string 
    task_detail_id: number 

    lineman: Lineman
    task_detail: TaskDetailLineServices 
}

export interface LineServicesInput {
    cause: ActivityCategoryCause | null
    distance_travel_in_km: number
    order_number: string
    mrv_number: string
    seriv_number: string 
    mst_number: string 
    mcrt_number: string 

    linemen_incharge: Lineman[]
}


export const line_services_initial_data: LineServicesInput = {
    cause: null,
    distance_travel_in_km: 0,
    order_number: '',
    mrv_number: '',
    seriv_number: '',
    mst_number: '',
    mcrt_number: '',
    linemen_incharge: [],
}

export interface LineServicesError {
    cause: boolean
    distance_travel_in_km: boolean
    order_number: boolean
    mrv_number: boolean
    seriv_number: boolean
    mst_number: boolean
    mcrt_number: boolean
    linemen_incharge: boolean
}

export const line_services_errors: LineServicesError = {
    cause: false,
    distance_travel_in_km: false,
    order_number: false,
    mrv_number: false,
    seriv_number: false,
    mst_number: false,
    mcrt_number: false,
    linemen_incharge: false,
}