import type { Barangay } from "../../barangay/barangay"
import type { ActivityCategoryCause } from "../../common"
import type { Lineman } from "../../lineman/lineman.types"
import type { Task } from "../task.types"


export interface TaskDetailDles {
    id: number 
    task_id: number 
    barangay_id: string 
    cause_id: string | null
    distance_travel_in_km: number
    sco_number: string | null
    old_serial_number: string | null 
    new_serial_number: string | null
    seriv_number: string | null
    kva_rating: string | null

    barangay: Barangay
    cause: ActivityCategoryCause | null
    linemen_incharge: DlesLineman[]
    task: Task
}

export interface DlesLineman {
    lineman_id: string 
    task_detail_id: number 

    lineman: Lineman
    task_detail: TaskDetailDles 
}

export interface DlesInput {
    cause: ActivityCategoryCause | null 
    distance_travel_in_km: number
    sco_number: string
    old_serial_number: string 
    new_serial_number: string
    seriv_number: string
    kva_rating: string

    linemen_incharge: Lineman[]
}

export const dles_initial_data: DlesInput = {
    cause: null,
    distance_travel_in_km: 0,
    sco_number: '',
    old_serial_number: '',
    new_serial_number: '',
    seriv_number: '',
    kva_rating: '',
    linemen_incharge: [],
}

export interface DlesError {
    cause: boolean
    distance_travel_in_km: boolean
    sco_number: boolean
    old_serial_number: boolean
    new_serial_number: boolean
    seriv_number: boolean
    kva_rating: boolean
    linemen_incharge: boolean
}

export const dles_errors: DlesError = {
    cause: false,
    distance_travel_in_km: false,
    sco_number: false,
    old_serial_number: false,
    new_serial_number: false,
    seriv_number: false,
    kva_rating: false,
    linemen_incharge: false,
}