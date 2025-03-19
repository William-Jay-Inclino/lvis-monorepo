import type { Area } from "./area.types";


export async function findOne(id: string): Promise<Area | undefined> {

    console.log('findOne', id);
    const query = `
        query {
            area(id: "${ id }") {
                id
                name
                linemen {
                    id 
                    employee {
                        id
                        firstname
                        middlename
                        lastname
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.area) {
            return response.data.data.area;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}