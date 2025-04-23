import type { Barangay } from "../barangay/barangay";
import type { CreateSitioInput, MutationResponse, Sitio, UpdateSitioInput } from "./sitio.types";

export async function sitio_create_init(): Promise<{
    barangays: Barangay[]
}> {

    const query = `
        query {
            barangays {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            barangays: response.data.data.barangays
        }
    } catch (error) {
        return {
            barangays: []
        }
    }
}

export async function sitio_update_init(payload: { id: string }): Promise<{
    barangays: Barangay[],
    sitio: Sitio | undefined
}> {

    const { id } = payload

    const query = `
        query {
            sitio(id: "${id}") {
                id
                name
                barangay {
                    id 
                    name
                }
            }
            barangays {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            barangays: response.data.data.barangays,
            sitio: response.data.data.sitio,
        }
    } catch (error) {
        return {
            barangays: [],
            sitio: undefined
        }
    }
}

export async function findAll(): Promise<Sitio[]> {

    const query = `
        query {
            sitios {
                id
                barangay {
                    id
                    name
                }
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.sitios;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Sitio | undefined> {
    const query = `
        query {
            sitio(id: "${id}") {
                id
                name
                barangay {
                    id 
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.sitio) {
            return response.data.data.sitio
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateSitioInput): Promise<MutationResponse> {

    const mutation = `
        mutation {
            createSitio(input: {
                barangay_id: "${input.barangay?.id}",
                name: "${input.name}",
            }) {
                success
                msg 
                data {
                    id
                    name
                    barangay {
                        id 
                        name
                        municipality {
                            id 
                            name
                        }
                    }
                }
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createSitio) {
            return response.data.data.createSitio
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Sitio. Please contact system administrator'
        }

    }
}

export async function update(payload: {
    id: string, 
    input: UpdateSitioInput
}): Promise<MutationResponse> {

    const { id, input } = payload

    const mutation = `
        mutation {
            updateSitio(id: "${id}", input: { 
                barangay_id: "${input.barangay?.id}",
                name: "${input.name}",
            }) {
                success
                msg 
                data {
                    id
                }
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateSitio) {
            return response.data.data.updateSitio
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Sitio. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<MutationResponse> {
    const mutation = `
        mutation {
            removeSitio(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeSitio) {
            return response.data.data.removeSitio
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Sitio. Please contact system administrator'
        }
    }
}