import type { Item } from "../item/item.type"
import type { OSRIV } from "./osriv.types"


export interface OSRIVItem {
    id: string 
    osriv_id: string 
    item_id: string 
    quantity: number 


    // =============== derived / resolvers =============== 
    osriv: OSRIV
    item: Item
}

export interface CreateOSRIVItem {
    quantity: number 
    item: Item | null
}