import type { Item } from "../item/item.type"
import type { SERIV } from "./seriv.types"


export interface SERIVItem {
    id: string 
    seriv_id: string 
    item_id: string 
    quantity: number 
    price: number

    // =============== derived / resolvers =============== 
    seriv: SERIV
    item: Item
    qty_returned: number
    qty_on_queue: number
}

