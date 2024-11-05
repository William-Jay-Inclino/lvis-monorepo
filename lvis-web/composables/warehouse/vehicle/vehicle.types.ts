import type { Employee } from "~/composables/system/employee/employee.types"
import type { VEHICLE_CLASSIFICATION, VEHICLE_STATUS } from "./vehicle.enums"

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

    // derived / resolvers 
    label?: string
    assignee: Employee
    total_unposted_gas_slips: number
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