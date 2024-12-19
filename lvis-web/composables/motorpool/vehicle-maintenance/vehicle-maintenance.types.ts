import type { ServiceCenter } from "../service-center/service-center.types"
import type { VehicleService } from "../vehicle-service/vehicle-service.types"

export interface VehicleMaintenance {
    id: string
    ref_number: string
    service_date: string
    service_mileage: Date
    next_service_date: string
    next_service_mileage: Date 
    cost: number
    remarks: string
    performed_by: string

    // derived / resolvers 
    vehicle: Vehicle
    service_center: ServiceCenter
    services: VehicleService[]
}

export interface CreateVehicleMaintenance {
    vehicle: Vehicle | null
    service_center: ServiceCenter | null
    service_date: Date | null 
    service_mileage: number 
    next_service_date: Date | null 
    next_service_mileage: number 
    cost: number 
    remarks: string 
    performed_by: string
    services: VehicleService[]
}

export interface UpdateVehicleMaintenance {
    vehicle: Vehicle
    service_center: ServiceCenter
    service_date: Date | null 
    service_mileage: number 
    next_service_date: Date | null 
    next_service_mileage: number 
    cost: number 
    remarks: string 
    performed_by: string
    services: VehicleService[]
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: VehicleMaintenance
}


export interface FindAllResponse {
	data: VehicleMaintenance[]
	totalItems: number
	currentPage: number
	totalPages: number
}