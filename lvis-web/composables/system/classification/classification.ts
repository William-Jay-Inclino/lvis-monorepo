

export interface Classification {
    id: string;
    name: string;
}


export interface CreateClassificationInput {
    name: string;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Classification
}