import { sendRequest } from "~/utils/api"
import type { Unit, CreateUnitInput, MutationResponse } from "./unit";



export async function findAll(): Promise<Unit[]> {

    const query = `
        query {
            units {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.units;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Unit | undefined> {
    const query = `
        query {
            unit(id: "${id}") {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.unit) {
            return response.data.data.unit;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateUnitInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => `${field}: "${input[field as keyof CreateUnitInput]}"`)
        .join(', ');

    const mutation = `
        mutation {
            createUnit(input: { ${inputFields} }) {
                id 
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createUnit) {
            return {
                success: true,
                msg: 'Unit created successfully!',
                data: response.data.data.createUnit
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Unit. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateUnitInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => `${field}: "${input[field as keyof CreateUnitInput]}"`)
        .join(', ');

    const mutation = `
        mutation {
            updateUnit(id: "${id}", input: { ${inputFields} }) {
                id 
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateUnit) {
            return {
                success: true,
                msg: 'Unit updated successfully!',
                data: response.data.data.updateUnit
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Unit. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeUnit(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeUnit) {
            return response.data.data.removeUnit
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Unit. Please contact system administrator'
        }
    }
}