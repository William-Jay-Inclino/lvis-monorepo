import type { CreateSitioInput, MutationResponse } from "./sitio.types";


export async function create(input: CreateSitioInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateSitioInput];
            const formattedValue = typeof value === 'number' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            createSitio(input: { ${inputFields} }) {
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