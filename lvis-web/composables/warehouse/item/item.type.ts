import type { ProjectItem } from "../project/project-item.types";
import type { Project } from "../project/project.types";
import type { RrItem } from "../rr/rr-item.types";
import type { ItemTransaction } from './item-transaction.type'
import { ITEM_STATUS, ITEM_TYPE } from "~/utils/constants";

export interface Item {
	id: string;
	item_type_id: number;
	unit_id: string;
	code: string;
	description: string;
	total_quantity: number;
	quantity_on_queue: number;
	item_transactions: ItemTransaction[];
	item_price_logs: ItemPriceLogs[];
	rr_items: RrItem[];
	unit: Unit;
	GWAPrice: number
	price: number | null
	alert_level: number
	latest_price_update?: string | null

	// set programmatically
	label?: string
	item_type: ItemType
	project_item: ProjectItem | null
}

export interface ItemType {
	id: number
	code: ITEM_TYPE
	name: string
}

export interface ItemPriceLogs {
	id: number
	item_id: string 
	beginning_price: string
	beginning_quantity: string
	created_at: string 
	created_by: string 
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
	description: string
	initial_quantity: number
	initial_average_price: number
	alert_level: number
	project: Project | null 
}


export interface UpdateItemInput {
	item_type: ItemType
	unit: Unit
	description: string
	alert_level: number
	project: Project | null 
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
	description: string;
	available_quantity: number;
	unit: Unit;
	GWAPrice: number
    qty_request: number
	item_type: ItemType
	label: string
	statusObject?: {
		id: ITEM_STATUS,
		name: string,
	}
	project_item?: ProjectItem | null
}


export interface UpdateItemPriceResponse {
	success: boolean;
	msg: string;
	previous_item?: Item;
	updated_item?: Item;
  }