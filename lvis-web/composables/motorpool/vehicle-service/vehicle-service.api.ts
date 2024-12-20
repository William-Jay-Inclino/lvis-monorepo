
import type { CreateVehicleService, MutationResponse } from "./vehicle-service.types";



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