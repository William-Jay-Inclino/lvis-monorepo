import { sendRequest } from "~/utils/api"
import type { Activity, MutationResponse, CreateActivity, UpdateActivity} from "./activity";
import type { ActivityCategory, PowerserveUnit } from "../common";


export async function activity_create_init(): Promise<{
    activity_categories: ActivityCategory[],
    units: PowerserveUnit[],
}> {

    const query = `
        query {
            activity_categories {
                id
                name
            }
            powerserve_units {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            activity_categories: deepClone(response.data.data.activity_categories),
            units: deepClone(response.data.data.powerserve_units),
        }
    } catch (error) {
        return {
            activity_categories: [],
            units: [],
        }
    }
}

export async function activity_update_init(payload: { id: string }): Promise<{
    activity_categories: ActivityCategory[],
    units: PowerserveUnit[],
    activity: Activity | undefined
}> {

    const { id } = payload

    const query = `
        query {
            activity(id: "${id}") {
                id
                code
                name
                quantity
                num_of_personnel
                category {
                    id 
                    name
                }
                unit {
                    id 
                    name
                }
            }
            activity_categories {
                id
                name
            }
            powerserve_units {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            activity_categories: deepClone(response.data.data.activity_categories),
            units: deepClone(response.data.data.powerserve_units),
            activity: response.data.data.activity ? deepClone(response.data.data.activity) : undefined,
        }
    } catch (error) {
        return {
            activity_categories: [],
            units: [],
            activity: undefined
        }
    }
}

export async function findAll(): Promise<Activity[]> {

    const query = `
        query {
            activities {
                id
                code
                name
                quantity
                num_of_personnel
                category {
                    id 
                    name
                }
                unit {
                    id 
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return deepClone(response.data.data.activities);
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Activity | undefined> {
    const query = `
        query {
            activity(id: "${id}") {
                id
                code
                name
                quantity
                num_of_personnel
                category {
                    id 
                    name
                }
                unit {
                    id 
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.activity) {
            return deepClone(response.data.data.activity)
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateActivity): Promise<MutationResponse> {

    const mutation = `
        mutation {
            createPowerserveActivity(input: {
                category_id: ${input.category?.id},
                unit_id: "${input.unit?.id}",
                code: "${input.code}",
                name: "${input.name}",
                quantity: ${input.quantity},
                num_of_personnel: ${input.num_of_personnel},
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

        if (response.data && response.data.data && response.data.data.createPowerserveActivity) {
            return deepClone(response.data.data.createPowerserveActivity)
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Activity. Please contact system administrator'
        }

    }
}

export async function update(payload: { id: string, input: UpdateActivity }): Promise<MutationResponse> {

    const { id, input } = payload

    const mutation = `
        mutation {
            updatePowerserveActivity(id: "${id}", input: { 
                category_id: ${input.category?.id},
                unit_id: "${input.unit?.id}",
                code: "${input.code}",
                name: "${input.name}",
                quantity: ${input.quantity},
                num_of_personnel: ${input.num_of_personnel},
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

        if (response.data && response.data.data && response.data.data.updatePowerserveActivity) {
            return deepClone(response.data.data.updatePowerserveActivity)
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Activity. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<MutationResponse> {
    const mutation = `
        mutation {
            removePowerserveActivity(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removePowerserveActivity) {
            return deepClone(response.data.data.removePowerserveActivity)
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Activity. Please contact system administrator'
        }
    }
}