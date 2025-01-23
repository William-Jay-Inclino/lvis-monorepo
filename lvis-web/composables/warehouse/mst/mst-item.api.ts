import type { Item } from "../item/item.type";
import type { MSTItem } from "./mst-item.types";
import type { UpdateItemsResponse } from "./mst.types";


export async function updateMstItems(mst_id: string, mstItems: MSTItem[]): Promise<UpdateItemsResponse> {

    const items = mstItems.map(i => {
        return `
        {
          item_id: "${i.item.id}"
          quantity: ${i.quantity}
          price: ${i.price}
          status: ${i.statusObject?.id}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            updateMstItems(
                mst_id: "${mst_id}",
                items: [${items}] 
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateMstItems) {
            return {
                success: true,
                msg: 'Items updated successfully!',
                mst_items: response.data.data.updateMstItems,
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update items. Please contact system administrator',
            mst_items: [],
        };
    }
}

export async function fetchItems(): Promise<{
    items: Item[],
}> {
    const query = `
        query {
            items(page: 1, pageSize: 1000, item_codes: "${ITEM_TYPE.LINE_MATERIALS}") {
                data{
                    id
                    code
                    description
                    item_type {
                        id 
                        code 
                        name
                    }
                    unit {
                        id 
                        name
                    }
                    total_quantity
                    quantity_on_queue
                    GWAPrice
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let items: Item[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        return {
            items,
        }

    } catch (error) {
        console.error(error);
        return {
            items: [],
        }
    }
}