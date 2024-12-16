import { sendRequest } from "~/utils/api"
import type { Classification, CreateClassificationInput, FindAllResponse, MutationResponse } from "./classification";



export async function findAll(payload: { page: number, pageSize: number, name: string }): Promise<FindAllResponse> {

    const { page, pageSize, name } = payload;

    let name2 = null

    if (name.trim() !== '') {
        name2 = `"${name}"`
    }

    const query = `
        query {
            classifications(
                page: ${page},
                pageSize: ${pageSize},
                name: ${name2},
            ) {
                data {
                    id
                    name
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
        return response.data.data.classifications;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Classification | undefined> {
    const query = `
        query {
            classification(id: "${id}") {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.classification) {
            return response.data.data.classification
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateClassificationInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateClassificationInput];
            const formattedValue = typeof value === 'number' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            createClassification(input: { ${inputFields} }) {
                id
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createClassification) {
            return {
                success: true,
                msg: 'Classification created successfully!',
                data: response.data.data.createClassification
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Classification. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateClassificationInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateClassificationInput];
            const formattedValue = typeof value === 'number' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            updateClassification(id: "${id}", input: { ${inputFields} }) {
                id
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateClassification) {
            return {
                success: true,
                msg: 'Classification updated successfully!',
                data: response.data.data.updateClassification
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Classification. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeClassification(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeClassification) {
            return response.data.data.removeClassification
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Classification. Please contact system administrator'
        }
    }
}


export async function fetchClassificationsByName(payload: string): Promise<Classification[]> {
    const query = `
        query {
            classificationsByName(input: "${payload}") {
                id
                name
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.classificationsByName

    } catch (error) {
        console.error(error);
        return []
    }
}