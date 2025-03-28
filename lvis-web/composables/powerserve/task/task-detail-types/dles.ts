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
    task: Task | null 
    sco_number: string 
    old_serial_number: string 
    new_serial_number: string 
    seriv_number: string 
    kva_rating: string 
    cause: string 

    linemen_incharge: Lineman[]
}


export const dles_initial_data: DlesInput = {
    task: null,
    sco_number: '',
    old_serial_number: '',
    new_serial_number: '',
    seriv_number: '',
    kva_rating: '',
    cause: '',
    linemen_incharge: [],
}