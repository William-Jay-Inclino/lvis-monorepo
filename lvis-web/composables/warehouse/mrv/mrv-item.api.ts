import type { Item } from "../item/item.type";
import type { MRVItem } from "./mrv-item.types";
import type { UpdateItemsResponse } from "./mrv.types";


export async function updateMrvItems(mrv_id: string, mrvItems: MRVItem[]): Promise<UpdateItemsResponse> {

    const items = mrvItems.map(i => {
        return `
        {
          item_id: "${i.item.id}"
          quantity: ${i.quantity}
          price: ${i.price}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            updateMrvItems(
                mrv_id: "${mrv_id}",
                items: [${items}] 
            ) {
                id
                quantity
                price
                item {
                    id
                    code
                    description
                    item_type {
                        id 
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
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateMrvItems) {
            return {
                success: true,
                msg: 'Items updated successfully!',
                mrv_items: response.data.data.updateMrvItems,
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update items. Please contact system administrator',
            mrv_items: [],
        };
    }
}

export async function fetchItems(): Promise<{
    items: Item[],
}> {
    const query = `
        query {
            items(page: 1, pageSize: 200, item_codes: "${ITEM_TYPE.LINE_MATERIALS}") {
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