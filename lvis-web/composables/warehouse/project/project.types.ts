import type { ProjectItem } from "./project-item.types";


export interface Project {
    id: string 
    name: string 

    project_items: ProjectItem[]
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