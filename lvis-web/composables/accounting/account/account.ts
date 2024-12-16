

export interface Account {
    id: string;
    code: string;
    name: string;
}


export interface CreateAccountInput {
    code: string;
    name: string;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Account
}


export interface FindAllResponse {
	data: Account[]
	totalItems: number
	currentPage: number
	totalPages: number
}