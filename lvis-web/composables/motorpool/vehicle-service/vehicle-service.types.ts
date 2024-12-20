

export interface VehicleService {
    id: string 
    name: string 
}

export interface CreateVehicleService {
    name: string
}

export interface UpdateVehicleService {
    name: string
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: VehicleService
}