import type { Department } from "./system/department/department"
import type { Employee } from "./system/employee/employee.types"
import type { User, UserPermissions } from "./system/user/user.types"
import type { VEHICLE_CLASSIFICATION, VEHICLE_STATUS } from "./warehouse/vehicle/vehicle.enums"

export enum USER_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export enum DEPARTMENT_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export enum DIVISION_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export enum ROLE {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface AuthUser {
    user: User
    access_token: string
}

export enum APPROVAL_STATUS {
    PENDING = 1,
    APPROVED = 2,
    DISAPPROVED = 3,
    CANCELLED = 4,
}

export enum VAT_TYPE {
    NONE = 1,
    INC = 2,
    EXC = 3,
    EXEMPT = 4
}

export enum ITEM_CLASS {
    STOCK = 1,
    NON_STOCK = 2
}

export enum ITEM_TRANSACTION_TYPE {
    STOCK_IN = 1,
    STOCK_OUT = 2
}

export interface Approver {
    id: string
    // approver_id: string
    approver: Employee
    date_approval: string | null
    notes: string
    status: APPROVAL_STATUS,
    label: string
    order: number
}

export interface CreateApproverInput {
    approver: Employee | null
    label: string
    order: number
}

export interface UpdateApproverInput {
    id: string
    approver: Employee | null
    date_approval: string | null
    notes: string | null
    status: {
        id: APPROVAL_STATUS,
        label: string
    }
    label: string
    order: number
}

export interface Unit {
    id: string
    name: string
}

export interface Classification {
    id: string
    name: string
}

export interface CancelResponse {
    success: boolean
    msg: string
    cancelled_at?: Date
    cancelled_by?: string
}

// export interface Department {
//     id: string
//     code: string
//     name: string
//     status: number
//     permissions: UserPermissions;

//     divisions: Division[]
// }

export interface Division {
    id: string
    department_id: string
    code: string
    name: string
    status: number
    permissions: UserPermissions;

    // resolvers 
    department: Department
}

export interface Vehicle {
    id: string
    vehicle_number: string
    plate_number: string
    classification_id: VEHICLE_CLASSIFICATION 
    assignee_id: string 
    name: string
    date_acquired: Date 
    status: VEHICLE_STATUS,

    // derived / resolvers 
    label?: string
    assignee: Employee
    total_unposted_gas_slips: number
}

export interface GasStation {
    id: string
    name: string
}

export interface FuelType {
    id: string
    name: string
}
export interface WarehouseRequestType {
	id: number
	name: string
}

export interface IApprovalStatus {
    id: number 
    label: string
}