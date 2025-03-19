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


export async function findAll(): Promise<Area[]> {

    const query = `
        query {
            areas {
                id
                name
                total_municipalities
                total_barangays
                total_sitios
                total_lineman
                oic {
                    id
                    firstname
                    middlename
                    lastname
                    position
                    name_prefix
                    name_suffix
                }
                municipalities {
                    id 
                    name 
                    barangays {
                        id 
                        name
                        sitios {
                            id 
                            name
                        }
                    }
                }
                linemen {
                    id 
                    employee {
                        id
                        firstname
                        middlename
                        lastname
                        position
                        name_prefix
                        name_suffix
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.areas) {
            return response.data.data.areas;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return []
    }
}