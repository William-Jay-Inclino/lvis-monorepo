import type { Area } from "../area/area.types";
import type { CreateLineman, Lineman, MutationResponse, UpdateLineman } from "./lineman.types";


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
                created_at
            }
            areas {
                id
                name
                oic {
                    id 
                    firstname
                    middlename
                    lastname
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
            linemen: response.data.data.linemen,
            areas: response.data.data.areas,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function create(payload: { input: CreateLineman }): Promise<MutationResponse> {

    const { input } = payload
    
    const mutation = `
        mutation {
            createLineman(
                input: {
                    employee_id: "${ input.employee?.id }",
                    area_id: "${ input.area?.id }",
                    supervisor_id: "${ input.supervisor?.id }",
                }
            ) {
                success
                msg
                data {
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
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log("response", response);

        if (response?.data?.data?.createLineman) {
            return response.data.data.createLineman;
        }

        throw new Error(JSON.stringify(response?.data?.errors || "Unknown error"));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: "Failed to create lineman. Please contact the system administrator.",
        };
    }
}

export async function update(payload: { input: UpdateLineman, lineman_id: string }): Promise<MutationResponse> {

    const { input, lineman_id } = payload
    
    const mutation = `
        mutation {
            updateLineman(
                input: {
                    area_id: "${ input.area?.id }",
                    supervisor_id: "${ input.supervisor?.id }",
                },
                id: "${ lineman_id }"
            ) {
                success
                msg
                data {
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
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log("response", response);

        if (response?.data?.data?.updateLineman) {
            return response.data.data.updateLineman;
        }

        throw new Error(JSON.stringify(response?.data?.errors || "Unknown error"));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: "Failed to update lineman. Please contact the system administrator.",
        };
    }
}

export async function remove(id: string): Promise<MutationResponse> {
    const mutation = `
        mutation {
            removeLineman(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeLineman) {
            return response.data.data.removeLineman
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Lineman. Please contact system administrator'
        }
    }
}