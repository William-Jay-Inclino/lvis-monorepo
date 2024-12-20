
import type { CreateVehicleService, MutationResponse, VehicleService } from "./vehicle-service.types";


export async function findAll(): Promise<VehicleService[]> {

    const query = `
        query {
            vehicle_services {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.vehicle_services;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<VehicleService | undefined> {
    const query = `
        query {
            vehicle_service(id: "${id}") {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.vehicle_service) {
            return response.data.data.vehicle_service
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateVehicleService): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateVehicleService];
            const formattedValue = typeof value === 'number' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            createVehicleService(input: { ${inputFields} }) {
                id
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createVehicleService) {
            return {
                success: true,
                msg: 'Service created successfully!',
                data: response.data.data.createVehicleService
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Service. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateVehicleService): Promise<MutationResponse> {

    const mutation = `
        mutation {
            updateVehicleService(id: "${id}", input: { 
                name: "${input.name}",
            }) {
                id
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateVehicleService) {
            return {
                success: true,
                msg: 'Service updated successfully!',
                data: response.data.data.updateVehicleService
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Service. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeVehicleService(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeVehicleService) {
            return response.data.data.removeVehicleService
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Service. Please contact system administrator'
        }
    }
}