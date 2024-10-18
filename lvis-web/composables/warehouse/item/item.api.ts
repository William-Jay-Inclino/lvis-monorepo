import type { ITEM_TYPE } from "#imports";
import type { CreateItemInput, FindAllResponse, Item, ItemType, MutationResponse, UpdateItemInput } from "./item.type";



export async function fetchDataInSearchFilters(): Promise<{
    items: Item[],
    item_types: ItemType[],
}> {
    const query = `
        query {
            items(page: 1, pageSize: 10) {
                data{
                    code
                }
            }
            item_types {
                id 
                code 
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let items = []
        let item_types = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if(data.item_types) {
            item_types = data.item_types
        }

        return {
            items,
            item_types,
        }

    } catch (error) {
        console.error(error);
        return {
            items: [],
            item_types: [],
        }
    }
}

export async function findAll(payload: { page: number, pageSize: number, description: string, itemTypeCode: ITEM_TYPE | null }): Promise<FindAllResponse> {

    const { page, pageSize, description, itemTypeCode } = payload;

    let description2 = null
    let itemTypeCode2 = null

    if (description.trim() !== '') {
        description2 = `"${description}"`
    }

    if(itemTypeCode) {
        itemTypeCode2 = `"${itemTypeCode}"`
    }

    const query = `
        query {
            items(
                page: ${page},
                pageSize: ${pageSize},
                description: ${description2},
                item_codes: ${itemTypeCode2}
            ) {
                data {
                    id
                    code 
                    item_type{
                        id 
                        code 
                        name
                    }
                    description
                    total_quantity
                    quantity_on_queue
                    GWAPrice
                }
                totalItems
                currentPage
                totalPages
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.items;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findByCode(code: string): Promise<Item | undefined> {
    const query = `
        query {
            item(code: "${code}") {
                id
                code 
                item_type {
                    id 
                    code 
                    name
                }
                description
                total_quantity
                quantity_on_queue
                GWAPrice
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.item) {
            return response.data.data.item;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<Item | undefined> {
    const query = `
        query {
            item(id: "${id}") {
                id
                code 
                description
                total_quantity
                quantity_on_queue
                initial_quantity
                GWAPrice
                alert_level
                item_type {
                    id 
                    code 
                    name
                }
                unit {
                    id
                    name
                }
                item_transactions {
                    id
                    type 
                    quantity
                    price 
                    remarks
                    created_at
                    rr_item {
                        rr {
                            id 
                            rr_number
                        }
                    }
                    osriv_item {
                        osriv {
                            id 
                            osriv_number
                        }
                    }
                    seriv_item {
                        seriv {
                            id 
                            seriv_number
                        }
                    }
                    mrv_item {
                        mrv {
                            id 
                            mrv_number
                        }
                    }
                    mcrt_item {
                        mcrt {
                            id 
                            mcrt_number
                        }
                    }
                    mst_item {
                        mst {
                            id 
                            mst_number
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.item) {
            return response.data.data.item;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function fetchFormDataInCreate(): Promise<{
    units: Unit[],
    item_types: ItemType[],
}> {


    const query = `
        query {
            units{
                id
                name
            },
            item_types {
                id
                code 
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let units = []
        let item_types = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.units) {
            units = data.units
        }
        if (data.item_types) {
            item_types = data.item_types
        }

        return {
            units,
            item_types,
        }

    } catch (error) {
        console.error(error);
        return {
            units: [],
            item_types: [],
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    units: Unit[],
    item: Item | undefined,
    item_types: ItemType[],
}> {


    const query = `
        query {
            item(id: "${id}") {
                id
                code 
                description
                alert_level
                item_type {
                    id 
                    code 
                    name
                }
                unit {
                    id
                    name
                }
            }
            units{
                id
                name
            }
            item_types{
                id
                code
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let units = []
        let item_types = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.item) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const item = data.item

        if (data.units) {
            units = data.units
        }

        if (data.item_types) {
            item_types = data.item_types
        }

        return {
            units,
            item,
            item_types,
        }

    } catch (error) {
        console.error(error);
        return {
            item: undefined,
            units: [],
            item_types: [],
        }
    }


}

export async function create(input: CreateItemInput): Promise<MutationResponse> {

    const mutation = `
        mutation {
            createItem(input: {
                item_type_id: ${input.item_type?.id},
                unit_id: "${input.unit?.id}",
                description: "${input.description}",
                initial_quantity: ${input.initial_quantity},
                initial_average_price: ${input.initial_average_price},
                alert_level: ${input.alert_level},
            }) {
                id 
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createItem) {
            return {
                success: true,
                msg: 'Item created successfully!',
                data: response.data.data.createItem
            }
        }

        if (response.data && response.data.errors && response.data.errors[0].extensions && response.data.errors[0].extensions.status === 409) {
            return {
                success: false,
                msg: response.data.errors[0].message || 'Item code must be unique'
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Item. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: UpdateItemInput): Promise<MutationResponse> {


    const mutation = `
        mutation {
            updateItem(id: "${id}", input: {
                item_type_id: ${input.item_type.id},
                unit_id: "${input.unit?.id}",
                code: "${input.code}",
                description: "${input.description}",
                alert_level: ${input.alert_level},
            }) {
                id 
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateItem) {
            return {
                success: true,
                msg: 'Item updated successfully!',
                data: response.data.data.updateItem
            }
        }

        if (response.data && response.data.errors && response.data.errors[0].extensions && response.data.errors[0].extensions.status === 409) {
            return {
                success: false,
                msg: response.data.errors[0].message || 'Item code must be unique'
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Item. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeItem(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeItem) {
            return response.data.data.removeItem
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Item. Please contact system administrator'
        }
    }
}

export async function fetchItemsByCode(payload: string): Promise<Item[]> {
    const query = `
        query {
            itemsByCode(input: "${payload}") {
                id
                code 
                description
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.itemsByCodeOrName

    } catch (error) {
        console.error(error);
        return []
    }
}