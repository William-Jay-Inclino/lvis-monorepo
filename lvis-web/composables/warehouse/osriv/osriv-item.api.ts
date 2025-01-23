import type { Item } from "../item/item.type";
import type { OSRIVItem } from "./osriv-item.types";
import type { UpdateItemsResponse } from "./osriv.types";


export async function updateOsrivItems(osriv_id: string, osrivItems: OSRIVItem[]): Promise<UpdateItemsResponse> {

    const items = osrivItems.map(i => {
        return `
        {
          item_id: "${i.item.id}"
          quantity: ${i.quantity}
          price: ${i.price}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            updateOsrivItems(
                osriv_id: "${osriv_id}",
                items: [${items}] 
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateOsrivItems) {
            return {
                success: true,
                msg: 'Items updated successfully!',
                osriv_items: response.data.data.updateOsrivItems,
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update items. Please contact system administrator',
            osriv_items: [],
        };
    }
}

export async function fetchItems(): Promise<{
    items: Item[],
}> {
    const query = `
        query {
            items(page: 1, pageSize: 200, item_codes: "${ITEM_TYPE.OFFICE_SUPPLY}") {
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