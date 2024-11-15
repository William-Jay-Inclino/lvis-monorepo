import type { Pending } from "~/composables/e-forms/pendings/pendings.types"
import type { Position } from "../position/position"
import type { UserEmployee } from "../user/user.types"
import type { Division } from "~/composables/common.types"


export interface Employee {
    id: string
    department_id: string
    division_id?: string | null
    firstname: string
    middlename: string
    lastname: string
    position: string
    signature_src: string

    // derived / resolvers 

    // is_approver?: boolean
    pending_approvals?: Pending[]
    total_pending_approvals?: number
    is_budget_officer?: boolean
    is_finance_manager?: boolean

    // set programmatically
    fullname?: string
    user_employee?: UserEmployee
    department: Department
    division: Division | null
}

export interface FindAllResponse {
    data: Employee[]
    totalItems: number
    currentPage: number
    totalPages: number
}

export interface CreateEmployeeInput {
    firstname: string
    middlename: string
    lastname: string
    position: string
    division: Division | null
    department: Department | null
    signature_src?: string | null
}

export interface UpdateEmployeeInput {
    firstname: string
    middlename: string
    lastname: string
    position: string
    division: Division | null
    department: Department | null
    signature_src?: string | null
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Employee
}