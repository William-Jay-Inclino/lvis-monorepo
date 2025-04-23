import { sendRequest } from "~/utils/api"
import type { Barangay, MutationResponse, CreateBarangay, UpdateBarangay} from "./barangay";
import type { Municipality } from "../municipality/municipality";
import type { Area } from "../area/area.types";


export async function barangay_create_init(): Promise<{
    municipalities: Municipality[]
}> {

    const query = `
        query {
            municipalities {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            municipalities: response.data.data.municipalities
        }
    } catch (error) {
        return {
            municipalities: []
        }
    }
}

export async function barangay_update_init(payload: { id: string }): Promise<{
    municipalities: Municipality[],
    barangay: Barangay | undefined
}> {

    const { id } = payload

    const query = `
        query {
            barangay(id: "${id}") {
                id
                name
                municipality {
                    id 
                    name
                }
            }
            municipalities {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            municipalities: response.data.data.municipalities,
            barangay: response.data.data.barangay,
        }
    } catch (error) {
        return {
            municipalities: [],
            barangay: undefined
        }
    }
}

export async function findAll(): Promise<Barangay[]> {

    const query = `
        query {
            barangays {
                id
                municipality {
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
        return response.data.data.barangays;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Barangay | undefined> {
    const query = `
        query {
            barangay(id: "${id}") {
                id
                name
                municipality {
                    id 
                    name
                }
                sitios {
                    id 
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.barangay) {
            return response.data.data.barangay
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateBarangay): Promise<MutationResponse> {

    const mutation = `
        mutation {
            createBarangay(input: {
                municipality_id: "${input.municipality?.id}",
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

        if (response.data && response.data.data && response.data.data.createBarangay) {
            return response.data.data.createBarangay
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Barangay. Please contact system administrator'
        }

    }
}

export async function update(payload: { id: string, input: UpdateBarangay }): Promise<MutationResponse> {

    const { id, input } = payload

    const mutation = `
        mutation {
            updateBarangay(id: "${id}", input: { 
                municipality_id: "${input.municipality?.id}",
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

        if (response.data && response.data.data && response.data.data.updateBarangay) {
            return response.data.data.updateBarangay
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Barangay. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<MutationResponse> {
    const mutation = `
        mutation {
            removeBarangay(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeBarangay) {
            return response.data.data.removeBarangay
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Barangay. Please contact system administrator'
        }
    }
}