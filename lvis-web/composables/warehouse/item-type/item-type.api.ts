import { sendRequest } from "~/utils/api"
import type { ItemType, CreateItemTypeInput, MutationResponse } from "./item-type.types";



export async function findAll(): Promise<ItemType[]> {

    const query = `
        query {
            item_types {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.item_types;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<ItemType | undefined> {
    const query = `
        query {
            item_type(id: "${id}") {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.item_type) {
            return response.data.data.item_type;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateItemTypeInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => `${field}: "${input[field as keyof CreateItemTypeInput]}"`)
        .join(', ');

    const mutation = `
        mutation {
            createItemType(input: { ${inputFields} }) {
                id 
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createItemType) {
            return {
                success: true,
                msg: 'Item Type created successfully!',
                data: response.data.data.createItemType
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Item Type. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateItemTypeInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => `${field}: "${input[field as keyof CreateItemTypeInput]}"`)
        .join(', ');

    const mutation = `
        mutation {
            updateItemType(id: "${id}", input: { ${inputFields} }) {
                id 
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateItemType) {
            return {
                success: true,
                msg: 'Item Type updated successfully!',
                data: response.data.data.updateItemType
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Item Type. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeItemType(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeItemType) {
            return response.data.data.removeItemType
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Item Type. Please contact system administrator'
        }
    }
}