import { ITEM_TRANSACTION_TYPE } from '~/composables/warehouse/item/item.enums'
import type { RrItem } from '../rr/rr-item.types';
import type { Item } from './item.type';
import type { OSRIVItem } from '../osriv/osriv-item.types';
import type { SERIVItem } from '../seriv/seriv-item.types';
import type { MRVItem } from '../mrv/mrv-item.types';
import type { MCRTItem } from '../mcrt/mcrt-item.types';
import type { MSTItem } from '../mst/mst-item.types';

export interface ItemTransaction {
	id: number;
	item_id: string;
	rr_item_id?: string | null;
	osriv_item_id?: string | null;
	seriv_item_id?: string | null;
	mrv_item_id?: string | null;
	mcrt_item_id?: string | null;
	mst_item_id?: string | null;
	type: ITEM_TRANSACTION_TYPE;
	quantity: number;
	price: number;
	remarks?: string | null;
	
	item: Item;
	rr_item?: RrItem;
	osriv_item?: OSRIVItem;
	seriv_item?: SERIVItem;
	mrv_item?: MRVItem;
	mcrt_item?: MCRTItem;
	mst_item?: MSTItem;

	created_at: Date
	created_by: String
}