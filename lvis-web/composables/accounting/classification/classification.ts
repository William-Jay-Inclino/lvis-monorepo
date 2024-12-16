

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


export interface FindAllResponse {
	data: Classification[]
	totalItems: number
	currentPage: number
	totalPages: number
}