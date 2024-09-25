import type { Item } from "../item/item.type"
import type { MST } from "./mst.types"


export interface MSTItem {
    id: string 
    mst_id: string 
    item_id: string 
    quantity: number 
    price: number

    // =============== derived / resolvers =============== 
    mst: MST
    item: Item
}

