import type { Employee } from "./system/employee/employee.types"
import type { User } from "./system/user/user.types"

export enum USER_STATUS {
    ACTIVE = 1,
    INACTIVE = 2
}

export enum DEPARTMENT_STATUS {
    ACTIVE = 1,
    INACTIVE = 2
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

export interface Department {
    id: string
    code: string
    name: string
    status: number
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
    assignee: Employee
    total_unposted_gas_slips: number
}

export const enum VEHICLE_STATUS {
    AVAILABLE_FOR_TRIP = 1,
    IN_USE = 2,
    UNDER_REPAIR = 3,
    UNDER_MAINTENANCE = 4,
    OUT_OF_SERVICE = 5,
    DECOMMISSIONED = 6,
}

export const enum VEHICLE_CLASSIFICATION {
    COMPANY = 1,
    GOVERNMENT = 2,
    OUTSOURCE = 3,
    PRIVATE = 4,
    V_HIRE = 5,
}

export const VehicleClassificationMapper = {
    [VEHICLE_CLASSIFICATION.COMPANY]: 'Company',
    [VEHICLE_CLASSIFICATION.GOVERNMENT]: 'Government',
    [VEHICLE_CLASSIFICATION.OUTSOURCE]: 'Outsource',
    [VEHICLE_CLASSIFICATION.PRIVATE]: 'Private',
    [VEHICLE_CLASSIFICATION.V_HIRE]: 'V-Hire',
}

export interface Project {
    id: string
    name: string
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