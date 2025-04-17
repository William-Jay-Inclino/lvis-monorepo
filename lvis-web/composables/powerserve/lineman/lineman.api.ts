import type { Area } from "../area/area.types";
import type { Lineman } from "./lineman.types";


export async function lineman_index_init(): Promise<{
    linemen: Lineman[],
    areas: Area[],
}> {

    const query = `
        query {
            linemen {
                id
                status
                employee {
                    id 
                    firstname
                    middlename
                    lastname
                    name_prefix
                    name_suffix
                    position
                } 
                supervisor {
                    id 
                    firstname
                    middlename
                    lastname
                    name_prefix
                    name_suffix
                } 
                area {
                    id 
                    name
                }
            }
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
            linemen: response.data.data.linemen,
            areas: response.data.data.areas,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}