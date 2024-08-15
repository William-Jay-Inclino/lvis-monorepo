import type { Item } from "../item/item.type"

export interface CanvassItem {
    id: string
    canvass_id: string
    unit: Unit | null
    item: Item | null
    description: string
    quantity: number

    // these fields are used in forms
    hasAwardedSupplier?: boolean
}


export interface CreateCanvassItemInput {
    canvass_id: string
    description: string
    unit: Unit | null
    item: Item | null
    quantity: number
}


export interface UpdateCanvassItemInput {
    description: string
    unit: Unit | null
    item: Item | null
    quantity: number
}


export interface MutationResponse {
    success: boolean
    msg: string
    data?: CanvassItem
}