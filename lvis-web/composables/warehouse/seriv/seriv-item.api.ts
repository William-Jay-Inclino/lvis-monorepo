import type { Item } from "../item/item.type";
import type { SERIVItem } from "./seriv-item.types";
import type { UpdateItemsResponse } from "./seriv.types";


export async function updateSerivItems(seriv_id: string, serivItems: SERIVItem[]): Promise<UpdateItemsResponse> {

    const items = serivItems.map(i => {
        return `
        {
          item_id: "${i.item.id}"
          quantity: ${i.quantity}
          price: ${i.price}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            updateSerivItems(
                seriv_id: "${seriv_id}",
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

        if (response.data && response.data.data && response.data.data.updateSerivItems) {
            return {
                success: true,
                msg: 'Items updated successfully!',
                seriv_items: response.data.data.updateSerivItems,
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update items. Please contact system administrator',
            seriv_items: [],
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