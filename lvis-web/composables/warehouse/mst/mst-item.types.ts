import type { Item } from "../item/item.type"
import type { MST } from "./mst.types"
import { ITEM_STATUS } from "~/utils/constants"

export interface MSTItem {
    id: string 
    mst_id: string 
    item_id: string 
    quantity: number 
    price: number
    status: ITEM_STATUS
    
    // =============== derived / resolvers =============== 
    mst: MST
    item: Item
    statusObject?: {
        id: ITEM_STATUS,
        name: string
    }
}

