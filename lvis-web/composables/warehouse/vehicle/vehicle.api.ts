import { sendRequest } from "~/utils/api"
import type { Vehicle, CreateVehicleInput, MutationResponse } from "./vehicle";



export async function findAll(): Promise<Vehicle[]> {

    const query = `
        query {
            vehicles {
                id
                name
                plate_number
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.vehicles;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Vehicle | undefined> {
    const query = `
        query {
            vehicle(id: "${id}") {
                id
                name
                plate_number
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.vehicle) {
            return response.data.data.vehicle;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateVehicleInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => `${field}: "${input[field as keyof CreateVehicleInput]}"`)
        .join(', ');

    const mutation = `
        mutation {
            createVehicle(input: { ${inputFields} }) {
                id 
                name
                plate_number
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createVehicle) {
            return {
                success: true,
                msg: 'Vehicle created successfully!',
                data: response.data.data.createVehicle
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Vehicle. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateVehicleInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => `${field}: "${input[field as keyof CreateVehicleInput]}"`)
        .join(', ');

    const mutation = `
        mutation {
            updateVehicle(id: "${id}", input: { ${inputFields} }) {
                id 
                name
                plate_number
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateVehicle) {
            return {
                success: true,
                msg: 'Vehicle updated successfully!',
                data: response.data.data.updateVehicle
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Vehicle. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeVehicle(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeVehicle) {
            return response.data.data.removeVehicle
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Vehicle. Please contact system administrator'
        }
    }
}