

export interface Unit {
    id: string;
    name: string;
}


export interface CreateUnitInput {
    name: string
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Unit
}