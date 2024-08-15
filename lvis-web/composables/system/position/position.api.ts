import { sendRequest } from "~/utils/api"
import type { Position, CreatePositionInput, MutationResponse } from "./position";
import { permissions } from '~/composables/system/user/user.permissions'


export async function findAll(): Promise<Position[]> {

    const query = `
        query {
            positions {
                id
                name
                permissions
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.positions;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Position | undefined> {
    const query = `
        query {
            position(id: "${id}") {
                id
                name
                permissions
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.position) {
            const position = response.data.data.position

            if(!position.permissions) {
                position.permissions = JSON.parse(JSON.stringify(permissions))
            } else {
                position.permissions = JSON.parse(position.permissions)
            }

            return position
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreatePositionInput): Promise<MutationResponse> {

    const escapeQuotes = (jsonString: string) => jsonString.replace(/"/g, '\\"')

    const mutation = `
        mutation {
            createPosition(input: { 
                name: "${input.name}",
                permissions: ${input.permissions != null ? `"${escapeQuotes(JSON.stringify(input.permissions))}"` : null}
            }) {
                id
                name
                permissions
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createPosition) {
            return {
                success: true,
                msg: 'Position created successfully!',
                data: response.data.data.createPosition
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Position. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreatePositionInput): Promise<MutationResponse> {

    const escapeQuotes = (jsonString: string) => jsonString.replace(/"/g, '\\"')

    const mutation = `
        mutation {
            updatePosition(id: "${id}", input: {
                name: "${input.name}",
                permissions: ${input.permissions != null ? `"${escapeQuotes(JSON.stringify(input.permissions))}"` : null}
            }) {
                id
                name
                permissions
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updatePosition) {
            return {
                success: true,
                msg: 'Position updated successfully!',
                data: response.data.data.updatePosition
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Position. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removePosition(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removePosition) {
            return response.data.data.removePosition
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Position. Please contact system administrator'
        }
    }
}