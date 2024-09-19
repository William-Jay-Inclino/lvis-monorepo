import type { Item } from "../item/item.type"
import type { MRV } from "./mrv.types"


export interface MRVItem {
    id: string 
    mrv_id: string 
    item_id: string 
    quantity: number 
    price: number

    // =============== derived / resolvers =============== 
    mrv: MRV
    item: Item
}

