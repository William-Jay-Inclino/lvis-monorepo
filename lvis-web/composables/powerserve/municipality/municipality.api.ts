import { sendRequest } from "~/utils/api"
import type { Municipality, MutationResponse, CreateMunicipality, UpdateMunicipality} from "./municipality";
import type { Area } from "../area/area.types";

export async function municipality_create_init(): Promise<{
    areas: Area[]
}> {

    const query = `
        query {
            areas {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            areas: response.data.data.areas
        }
    } catch (error) {
        return {
            areas: []
        }
    }
}

export async function findAll(): Promise<Municipality[]> {

    const query = `
        query {
            municipalities {
                id
                area {
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
        return response.data.data.municipalities;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Municipality | undefined> {
    const query = `
        query {
            municipality(id: "${id}") {
                id
                name
                area {
                    id 
                    name
                }
                barangays {
                    id 
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.municipality) {
            return response.data.data.municipality
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateMunicipality): Promise<MutationResponse> {

    const mutation = `
        mutation {
            createMunicipality(input: {
                area_id: "${input.area?.id}",
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

        if (response.data && response.data.data && response.data.data.createMunicipality) {
            return response.data.data.createMunicipality
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Municipality. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: UpdateMunicipality): Promise<MutationResponse> {

    const mutation = `
        mutation {
            updateMunicipality(id: "${id}", input: { 
                area_id: "${input.area?.id}",
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

        if (response.data && response.data.data && response.data.data.updateMunicipality) {
            return response.data.data.updateMunicipality
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Municipality. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<MutationResponse> {
    const mutation = `
        mutation {
            removeMunicipality(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeMunicipality) {
            return response.data.data.removeMunicipality
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Municipality. Please contact system administrator'
        }
    }
}