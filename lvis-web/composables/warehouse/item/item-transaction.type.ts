import { ITEM_TRANSACTION_TYPE } from '~/composables/warehouse/item/item.enums'
import type { RrItem } from '../rr/rr-item.types';
import type { Item } from './item.type';

export interface ItemTransaction {
	id: number;
	item_id: string;
	rr_item_id?: string | null;
	type: ITEM_TRANSACTION_TYPE;
	quantity: number;
	price: number;
	remarks?: string | null;
	item: Item;
	rr_item?: RrItem;

	created_at: Date
	created_by: String
}