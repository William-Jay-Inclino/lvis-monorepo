import type { Barangay } from "../barangay/barangay"

export interface Sitio {
    id: string 
    barangay_id: string 
    name: string 

    // relationships

    barangay: Barangay
}

export interface CreateSitioInput {
    barangay: Barangay | null 
    name: string
}

export interface UpdateSitioInput {
    barangay: Barangay | null 
    name: string
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Sitio
}