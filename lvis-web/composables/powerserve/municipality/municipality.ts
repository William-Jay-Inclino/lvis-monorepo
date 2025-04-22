import type { Area } from "../area/area.types"
import type { Barangay } from "../barangay/barangay"


export interface Municipality {
    id: string 
    area_id: string 
    name: string 

    // relationships
    area: Area
    barangays: Barangay[]
}

export interface CreateMunicipality {
    area: Area | null
    name: string
}

export interface UpdateMunicipality {
    area: Area | null
    name: string
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Municipality
}

