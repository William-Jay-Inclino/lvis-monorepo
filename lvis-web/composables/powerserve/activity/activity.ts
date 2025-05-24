import type { ActivityCategory, PowerserveUnit } from "../common"
import type { Task } from "../task/task.types"


export interface Activity  {
    id: string 
    category_id: number 
    unit_id: string 
    code: string 
    name: string 
    quantity: number 
    num_of_personnel: number 

    // relationships

    category: ActivityCategory
    tasks: Task[]
    unit: PowerserveUnit
}


export interface CreateActivity {
    category: ActivityCategory | null
    unit: PowerserveUnit | null
    code: string
    name: string
    quantity: number
    num_of_personnel: number
}

export interface UpdateActivity {
    category: ActivityCategory | null
    unit: PowerserveUnit | null
    code: string
    name: string
    quantity: number
    num_of_personnel: number
}


export interface MutationResponse {
    success: boolean
    msg: string
    data?: Activity
}