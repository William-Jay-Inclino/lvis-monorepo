import type { RrItem } from "../rr/rr-item.types";
import type { ItemTransaction } from './item-transaction.type'

export interface Item {
	id: string;
	item_type_id: string;
	unit_id: string;
	code: string;
	name: string;
	description: string;
	total_quantity: number;
	quantity_on_queue: number;
	initial_quantity: number;
	item_type: ItemType;
	item_transactions: ItemTransaction[];
	rr_items: RrItem[];
	unit: Unit;
	GWAPrice: number
	alert_level: number

	// set programmatically
	label?: string
}


export interface FindAllResponse {
	data: Item[]
	totalItems: number
	currentPage: number
	totalPages: number
}


export interface CreateItemInput {
	item_type: ItemType | null
	unit: Unit | null
	code: string
	name: string
	description: string
	initial_quantity: number
	initial_average_price: number
	alert_level: number
}


export interface UpdateItemInput {
	item_type: ItemType
	unit: Unit
	code: string
	name: string
	description: string
	alert_level: number
}


export interface MutationResponse {
	success: boolean
	msg: string
	data?: Item
}

// Use in OSRIV/SERIV add item
export interface AddItem {
	id: string;
	code: string;
	name: string;
	description: string;
	available_quantity: number;
	unit: Unit;
	GWAPrice: number
    qty_request: number
}