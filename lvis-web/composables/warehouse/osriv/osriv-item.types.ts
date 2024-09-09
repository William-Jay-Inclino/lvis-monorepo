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
	id: string;
	code: string;
	name: string;
	description: string;
	available_quantity: number;
	unit: Unit;
	GWAPrice: number

    qty_input: number
}