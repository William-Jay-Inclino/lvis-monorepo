import type { Lineman } from "../../common"
import type { Task } from "../task.types"

export interface TaskDetailLineServices {
    id: number 
    task_id: number 
    order_number: string 
    cause: string 
    mrv_number: string 
    seriv_number: string 
    mst_number: string 
    mcrt_number: string 

    linemen_incharge: LineServicesLineman[]
    task: Task
}

export interface LineServicesLineman {
    lineman_id: string 
    lineman: Lineman 
}

export interface LineServicesInput {
    task: Task | null 
    order_number: string 
    cause: string 
    mrv_number: string 
    seriv_number: string 
    mst_number: string 
    mcrt_number: string 

    linemen_incharge: Lineman[]
}


export const line_services_initial_data: LineServicesInput = {
    task: null,
    order_number: '',
    cause: '',
    mrv_number: '',
    seriv_number: '',
    mst_number: '',
    mcrt_number: '',
    linemen_incharge: [],
}

export interface LineServicesError {
    order_number: boolean
    cause: boolean
    mrv_number: boolean
    seriv_number: boolean
    mst_number: boolean
    mcrt_number: boolean
    linemen_incharge: boolean
}

export const line_services_errors: LineServicesError = {
    order_number: false,
    cause: false,
    mrv_number: false,
    seriv_number: false,
    mst_number: false,
    mcrt_number: false,
    linemen_incharge: false,
}