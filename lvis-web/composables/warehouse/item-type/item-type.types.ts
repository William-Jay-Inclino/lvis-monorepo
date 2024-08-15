

export interface ItemType {
    id: string;
    name: string;
}


export interface CreateItemTypeInput {
    name: string
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: ItemType
}