import type { Municipality } from "../municipality/municipality"
import type { Sitio } from "../sitio/sitio.types"


export interface Barangay  {
    id: string 
    municipality_id: string 
    name: string 

    // relationships

    municipality: Municipality
    sitios: Sitio[]
}


export interface CreateBarangay {
    municipality: Municipality | null
    name: string
}

export interface UpdateBarangay {
    municipality: Municipality | null
    name: string
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Barangay
}