import type { RR } from "./rr.types"
import type { MeqsSupplierItem } from '../../purchase/meqs/meqs-supplier-item'
import type { ItemTransaction } from "../item/item-transaction.type"

export interface RrItem {
	id: string
	rr_id: string
	meqs_supplier_item_id: string
	quantity_accepted: number

	// =============== derived / resolvers =============== 

	meqs_supplier_item: MeqsSupplierItem
	isInvalidQtyAccepted: boolean
	rr?: RR
	item_transaction?: ItemTransaction
}


export interface UpdateRrItemsInput {
	id: string
	quantity_accepted: number
}



export interface UpdateRrItemsResponse {
	success: boolean
	msg: string
	// data: RrItem[]
}