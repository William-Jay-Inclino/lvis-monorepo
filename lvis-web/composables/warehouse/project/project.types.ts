

export interface Project {
    id: string 
    name: string 
}

export interface CreateProjectInput {
    name: string;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Project
}


export interface FindAllResponse {
	data: Project[]
	totalItems: number
	currentPage: number
	totalPages: number
}