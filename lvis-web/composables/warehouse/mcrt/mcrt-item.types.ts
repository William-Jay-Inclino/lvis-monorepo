import type { Item } from "../item/item.type"
import type { MCRT } from "./mcrt.types"


export interface MCRTItem {
    id: string 
    mcrt_id: string 
    item_id: string 
    quantity: number 
    price: number

    // =============== derived / resolvers =============== 
    mcrt: MCRT
    item: Item
    showQtyError: boolean
    reference_qty: number
    qty_returned: number
    qty_on_queue: number
}

