import type { Lineman } from "../../common"
import type { Task } from "../task.types"


export interface TaskDetailDles {
    id: number 
    task_id: number 
    sco_number: string 
    old_serial_number: string 
    new_serial_number: string 
    seriv_number: string 
    kva_rating: string 
    cause: string 

    linemen_incharge: DlesLineman[]
    task: Task
}

export interface DlesLineman {
    lineman_id: string 
    lineman: Lineman 
}


export interface DlesInput {
    sco_number: string 
    old_serial_number: string 
    new_serial_number: string 
    seriv_number: string 
    kva_rating: string 
    cause: string 

    linemen_incharge: Lineman[]
}


export const dles_initial_data: DlesInput = {
    sco_number: '',
    old_serial_number: '',
    new_serial_number: '',
    seriv_number: '',
    kva_rating: '',
    cause: '',
    linemen_incharge: [],
}

export interface DlesError {
    sco_number: boolean
    old_serial_number: boolean
    new_serial_number: boolean
    seriv_number: boolean
    kva_rating: boolean
    cause: boolean
    linemen_incharge: boolean
}

export const dles_errors: DlesError = {
    sco_number: false,
    old_serial_number: false,
    new_serial_number: false,
    seriv_number: false,
    kva_rating: false,
    cause: false,
    linemen_incharge: false,
}