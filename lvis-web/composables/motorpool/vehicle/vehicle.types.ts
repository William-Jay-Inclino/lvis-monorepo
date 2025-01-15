import type { Employee } from "~/composables/hr/employee/employee.types"
import type { VEHICLE_CLASSIFICATION, VEHICLE_STATUS } from "./vehicle.enums"
import type { GasSlip } from "../gas-slip/gas-slip.types"
import type { TripTicket } from "../trip-ticket/trip-ticket.types"
import type { VehicleMaintenance } from "../vehicle-maintenance/vehicle-maintenance.types"

export interface Vehicle {
    id: string
    vehicle_number: string
    plate_number: string
    classification_id: VEHICLE_CLASSIFICATION 
    assignee_id: string 
    name: string
    date_acquired: Date 
    status: VEHICLE_STATUS,
    is_private: boolean
    rf_id: string | null

    // derived / resolvers 
    label?: string
    assignee: Employee
    total_unposted_gas_slips: number
    gas_slips: GasSlip[]
    trip_tickets: TripTicket[]
    service_history: VehicleMaintenance[]
}

export interface CreateVehicleInput {
    name: string
    vehicle_number: string;
    plate_number: string;
    classification: {
        id: string,
        name: string 
    } | null 
    assignee: Employee | null
    date_acquired: string  
}

export interface UpdateVehicleInput {
    name: string
    vehicle_number: string;
    plate_number: string;
    classification: {
        id: VEHICLE_CLASSIFICATION,
        name: string 
    } | null 
    assignee: Employee | null
    date_acquired: string  
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Vehicle
}

export interface VehicleClassification {
    id: VEHICLE_CLASSIFICATION 
    name: string 
}

export interface FindAllResponse {
	data: Vehicle[]
	totalItems: number
	currentPage: number
	totalPages: number
}

export type VehicleType = 'BOD' | 'GV' | 'MU' | 'OM' | 'PV' | 'SV' | 'TR' | 'VH'