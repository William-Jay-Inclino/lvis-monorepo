import type { Barangay } from "../../barangay/barangay"
import type { ActivityCategoryCause } from "../../common"
import type { Lineman } from "../../lineman/lineman.types"
import type { Task } from "../task.types"


export interface TaskDetailDles {
    id: number 
    task_id: number 
    cause_id: string 
    barangay_id: string 
    sco_number: string 
    old_serial_number: string 
    new_serial_number: string 
    seriv_number: string 
    kva_rating: string 
    distance_travel_in_km: number

    linemen_incharge: DlesLineman[]
    task: Task
    cause: ActivityCategoryCause
    barangay: Barangay
}

export interface DlesLineman {
    lineman_id: string 
    task_detail_id: number 

    lineman: Lineman
    task_detail: TaskDetailDles 
}


export interface DlesInput {
    sco_number: string 
    old_serial_number: string 
    new_serial_number: string 
    seriv_number: string 
    kva_rating: string 
    cause: ActivityCategoryCause | null 
    distance_travel_in_km: number

    linemen_incharge: Lineman[]
}


export const dles_initial_data: DlesInput = {
    sco_number: '',
    old_serial_number: '',
    new_serial_number: '',
    seriv_number: '',
    kva_rating: '',
    cause: null,
    linemen_incharge: [],
    distance_travel_in_km: 0,
}

export interface DlesError {
    sco_number: boolean
    old_serial_number: boolean
    new_serial_number: boolean
    seriv_number: boolean
    kva_rating: boolean
    cause: boolean
    linemen_incharge: boolean
    distance_travel_in_km: boolean
}

export const dles_errors: DlesError = {
    sco_number: false,
    old_serial_number: false,
    new_serial_number: false,
    seriv_number: false,
    kva_rating: false,
    cause: false,
    linemen_incharge: false,
    distance_travel_in_km: false,
}