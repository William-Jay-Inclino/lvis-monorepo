import { sendRequest } from "~/utils/api"
import type { Division, CreateDivisionInput, MutationResponse } from "./division.ts";
import { permissions } from '~/composables/system/user/user.permissions'
import type { Department } from "../department/department.js";


export async function findAll(): Promise<Division[]> {

    const query = `
        query {
            divisions {
                id
                code
                name
                status
                permissions
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.divisions;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Division | undefined> {
    const query = `
        query {
            division(id: "${id}") {
                id
                code
                name
                status
                permissions
                department {
                    id 
                    code 
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.division) {
            const division = response.data.data.division

            if(!division.permissions) {
                division.permissions = JSON.parse(JSON.stringify(permissions))
            } else {
                division.permissions = JSON.parse(division.permissions)
            }

            return division
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateDivisionInput): Promise<MutationResponse> {

    const escapeQuotes = (jsonString: string) => jsonString.replace(/"/g, '\\"')

    const mutation = `
        mutation {
            createDivision(input: { 
                code: "${input.code}",
                department_id: "${input.department?.id}",
                name: "${input.name}",
                permissions: ${input.permissions != null ? `"${escapeQuotes(JSON.stringify(input.permissions))}"` : null}
            }) {
                id
                code
                name
                permissions
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createDivision) {
            return {
                success: true,
                msg: 'Division created successfully!',
                data: response.data.data.createDivision
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Division. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateDivisionInput): Promise<MutationResponse> {

    const escapeQuotes = (jsonString: string) => jsonString.replace(/"/g, '\\"')

    const mutation = `
        mutation {
            updateDivision(id: "${id}", input: {
                code: "${input.code}",
                name: "${input.name}",
                department_id: "${input.department?.id}",
                permissions: ${input.permissions != null ? `"${escapeQuotes(JSON.stringify(input.permissions))}"` : null}
            }) {
                id
                code
                name
                permissions
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateDivision) {
            return {
                success: true,
                msg: 'Division updated successfully!',
                data: response.data.data.updateDivision
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Division. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeDivision(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeDivision) {
            return response.data.data.removeDivision
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Division. Please contact system administrator'
        }
    }
}

export async function fetchFormDataInCreate(): Promise<{ departments: Department[] }> {

    const query = `
        query {
            departments {
                id 
                code
                name 
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let departments = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(data.departments) {
            departments = data.departments
        }

        return {
            departments,
        }

    } catch (error) {
        console.error(error);
        return {
            departments: [],
        }
    }

}

export async function fetchFormDataInUpdate(id: string): Promise<{
    departments: Department[],
    division: Division | undefined
}> {

    const query = `
        query {
            division(id: "${id}") {
                id
                code
                name
                status
                permissions
                department {
                    id 
                    code 
                    name
                }
            }
            departments {
                id 
                code
                name 
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let departments = []


        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(!data.division) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const division = data.division

        if(!division.permissions) {
            division.permissions = JSON.parse(JSON.stringify(permissions))
        } else {
            division.permissions = JSON.parse(division.permissions)
        }

        if(data.departments) {
            departments = data.departments
        }

        return {
            departments,
            division,
        }

    } catch (error) {
        console.error(error);
        return {
            division: undefined,
            departments: [],
        }
    }

}