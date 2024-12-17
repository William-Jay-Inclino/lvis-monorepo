import type { Pending } from "~/composables/e-forms/pendings/pendings.types"
import type { UserEmployee } from "../user/user.types"
import type { Division } from "~/composables/common.types"
import type { Department } from "../department/department"


export interface Employee {
    id: string
    employee_number: string 
    rank_number: number
    department_id: string
    division_id?: string | null
    firstname: string
    middlename: string
    lastname: string
    name_prefix: string | null
    name_suffix: string | null
    position: string
    signature_src: string
    status: EMPLOYEE_STATUS

    // derived / resolvers 

    pending_approvals?: Pending[]
    total_pending_approvals?: number
    is_budget_officer?: boolean
    is_finance_manager?: boolean
    is_warehouse_custodian?: boolean

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
    employee_number: string
    rank_number: number
    firstname: string
    middlename: string
    lastname: string
    name_prefix: string
    name_suffix: string
    position: string
    division: Division | null
    department: Department | null
    signature_src?: string | null
}

export interface UpdateEmployeeInput {
    employee_number: string
    rank_number: number
    firstname: string
    middlename: string
    lastname: string
    name_prefix: string
    name_suffix: string
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

export const enum EMPLOYEE_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}