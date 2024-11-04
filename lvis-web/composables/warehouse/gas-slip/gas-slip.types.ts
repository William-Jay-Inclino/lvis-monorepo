import type { FuelType, GasStation } from "~/composables/common.types"
import type { Employee } from "~/composables/system/employee/employee.types"
import type { CreateGasSlipApprover, GasSlipApprover } from "./gas-slip.approver.types"


export interface GasSlip { 
    id: string 
    gas_slip_number: string 
    vehicle_id: string 
    driver_id: string 
    gas_station_id: number 
    fuel_type_id: number 
    requested_by_id: string 
    with_container: boolean 
    liter_in_text: string 
    actual_liter: number 
    price_per_liter: number 
    purpose: string 
    is_posted: boolean | null



    // =============== audit fields =============== 

    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date

    // derived / resolvers
    gas_slip_approvers: GasSlipApprover[]
    status: APPROVAL_STATUS
    vehicle: Vehicle 
    driver: Employee
    gas_station: GasStation
    fuel_type: FuelType
    requested_by: Employee
    can_update: boolean
    can_post: boolean
}


export interface CreateGasSlip {
    vehicle: Vehicle | null 
    driver: Employee | null
    gas_station: GasStation | null
    fuel_type: FuelType | null
    requested_by: Employee | null
    with_container: boolean 
    liter_in_text: string 
    purpose: string 
    approvers: CreateGasSlipApprover[]
}


export interface FindAllResponse {
	data: GasSlip[]
	totalItems: number
	currentPage: number
	totalPages: number
}


export interface MutationResponse {
	success: boolean
	msg: string
	data?: GasSlip
}

export interface ChangeApproverResponse {
	success: boolean
	msg: string
	data?: GasSlipApprover
}