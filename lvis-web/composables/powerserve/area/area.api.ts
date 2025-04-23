import type { Area, CreateArea, MutationResponse, UpdateArea } from "./area.types";


export async function findOne(id: string): Promise<Area | undefined> {

    console.log('findOne', id);
    const query = `
        query {
            area(id: "${ id }") {
                id
                name
                oic {
                    id
                    firstname
                    middlename
                    lastname
                    position
                    name_prefix
                    name_suffix
                }
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

export async function area_update_init(payload: { id: string }): Promise<{
    area: Area | undefined
}> {

    const { id } = payload

    const query = `
        query {
            area(id: "${id}") {
                id
                name
                oic {
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
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            area: response.data.data.area,
        }
    } catch (error) {
        return {
            area: undefined
        }
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

export async function create(input: CreateArea): Promise<MutationResponse> {

    const mutation = `
        mutation {
            createArea(input: {
                oic_id: "${input.oic?.id}",
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

        if (response.data && response.data.data && response.data.data.createArea) {
            return response.data.data.createArea
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Area. Please contact system administrator'
        }

    }
}

export async function update(payload: { id: string, input: UpdateArea }): Promise<MutationResponse> {

    const { id, input } = payload

    const mutation = `
        mutation {
            updateArea(id: "${id}", input: { 
                oic_id: "${input.oic?.id}",
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

        if (response.data && response.data.data && response.data.data.updateArea) {
            return response.data.data.updateArea
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Area. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<MutationResponse> {
    const mutation = `
        mutation {
            removeArea(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeArea) {
            return response.data.data.removeArea
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Area. Please contact system administrator'
        }
    }
}