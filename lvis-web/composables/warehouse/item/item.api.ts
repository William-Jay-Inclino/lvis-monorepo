import type { CreateItemInput, FindAllResponse, Item, MutationResponse, UpdateItemInput } from "./item.type";



export async function fetchDataInSearchFilters(): Promise<{
    items: Item[],
    itemTypes: ItemType[]
}> {
    const query = `
        query {
            items(page: 1, pageSize: 10) {
                data{
                    code
                }
            },
            item_types{
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let items = []
        let itemTypes = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if (data.item_types) {
            itemTypes = data.item_types
        }
        return {
            items,
            itemTypes
        }

    } catch (error) {
        console.error(error);
        return {
            items: [],
            itemTypes: [],
        }
    }
}

export async function findAll(payload: { page: number, pageSize: number, name: string | null, item_type_id: string | null }): Promise<FindAllResponse> {

    const { page, pageSize, name, item_type_id } = payload;

    let name2 = null
    let item_type_id2 = null

    if (name) {
        name2 = `"${name}"`
    }

    if (item_type_id) {
        item_type_id2 = `"${item_type_id}"`
    }

    const query = `
        query {
            items(
                page: ${page},
                pageSize: ${pageSize},
                name: ${name2},
                item_type_id: ${item_type_id2},
            ) {
                data {
                    id
                    code 
                    name
                    description
                    total_quantity
                    GWAPrice
                    item_type {
                        id 
                        name
                    }
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
                name
                description
                total_quantity
                GWAPrice
                item_type {
                    id 
                    name
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

export async function findOne(id: string): Promise<Item | undefined> {
    const query = `
        query {
            item(id: "${id}") {
                id
                code 
                name
                description
                total_quantity
                initial_quantity
                GWAPrice
                alert_level
                item_type {
                    id 
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
    itemTypes: ItemType[],
    units: Unit[],
}> {


    const query = `
        query {
            item_types{
                id
                name
            }
            units{
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let itemTypes = []
        let units = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.item_types) {
            itemTypes = data.item_types
        }

        if (data.units) {
            units = data.units
        }

        return {
            itemTypes,
            units,
        }

    } catch (error) {
        console.error(error);
        return {
            itemTypes: [],
            units: [],
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    itemTypes: ItemType[],
    units: Unit[],
    item: Item | undefined
}> {


    const query = `
        query {
            item(id: "${id}") {
                id
                code 
                name
                description
                alert_level
                item_type {
                    id 
                    name
                }
                unit {
                    id
                    name
                }
            }
            item_types{
                id
                name
            }
            units{
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let itemTypes = []
        let units = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.item) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const item = data.item

        if (data.item_types) {
            itemTypes = data.item_types
        }

        if (data.units) {
            units = data.units
        }

        return {
            itemTypes,
            units,
            item
        }

    } catch (error) {
        console.error(error);
        return {
            item: undefined,
            itemTypes: [],
            units: [],
        }
    }


}

export async function create(input: CreateItemInput): Promise<MutationResponse> {

    const mutation = `
        mutation {
            createItem(input: {
                item_type_id: "${input.item_type?.id}",
                unit_id: "${input.unit?.id}",
                code: "${input.code}",
                name: "${input.name}",
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
                item_type_id: "${input.item_type?.id}",
                unit_id: "${input.unit?.id}",
                code: "${input.code}",
                name: "${input.name}",
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

export async function fetchItemsByCodeOrName(payload: string): Promise<Item[]> {
    const query = `
        query {
            itemsByCodeOrName(input: "${payload}") {
                id
                code 
                name
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