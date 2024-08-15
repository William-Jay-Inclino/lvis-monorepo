

export interface Account {
    id: string;
    code: string;
    name: string;
    description: string;
}


export interface CreateAccountInput {
    code: string;
    name: string;
    description: string;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Account
}