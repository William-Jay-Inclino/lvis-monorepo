

export interface Vehicle {
    id: string;
    name: string;
    plate_number: string;
}


export interface CreateVehicleInput {
    name: string
    plate_number: string;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Vehicle
}