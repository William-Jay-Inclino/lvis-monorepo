import type { Sitio } from "../common"


export interface CreateSitioInput {
    barangay_id: string 
    name: string
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Sitio
}