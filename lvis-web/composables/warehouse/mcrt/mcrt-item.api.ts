import type { Item } from "../item/item.type";
import type { MCRTItem } from "./mcrt-item.types";
import type { UpdateItemsResponse } from "./mcrt.types";


export async function updateMcrtItems(mcrt_id: string, mcrtItems: MCRTItem[]): Promise<UpdateItemsResponse> {

    const items = mcrtItems.map(i => {
        return `
        {
          item_id: "${i.item.id}"
          quantity: ${i.quantity}
          price: ${i.price}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            updateMcrtItems(
                mcrt_id: "${mcrt_id}",
                items: [${items}] 
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateMcrtItems) {
            return {
                success: true,
                msg: 'Items updated successfully!',
                mcrt_items: response.data.data.updateMcrtItems,
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update items. Please contact system administrator',
            mcrt_items: [],
        };
    }
}

export async function fetchMcrtItems(id: string): Promise<{
    items: MCRTItem[],
}> {
    const query = `
        query {
            mcrt(id: "${id}") {
                mcrt_items {
                    id
                    quantity
                    price
                    reference_qty
                    qty_returned
                    qty_on_queue
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

            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let items: MCRTItem[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.mcrt && data.mcrt.mcrt_items) {
            items = data.mcrt.mcrt_items
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