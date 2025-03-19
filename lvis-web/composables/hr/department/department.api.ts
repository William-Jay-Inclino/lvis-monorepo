import { sendRequest } from "~/utils/api"
import type { Department, CreateDepartmentInput, MutationResponse } from "./department";
import { permissions } from "~/composables/system/user/user.permissions";
import { mergeUserPermissions } from "~/composables/system/user/user.helpers";



export async function findAll(): Promise<Department[]> {

    const query = `
        query {
            departments {
                id
                code
                name
                status
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.departments;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Department | undefined> {
    const query = `
        query {
            department(id: "${id}") {
                id
                code
                name
                status
                permissions
                employees {
                    id 
                    firstname
                    middlename
                    lastname
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.department) {

            const department = response.data.data.department

            if(!department.permissions) {
                department.permissions = JSON.parse(JSON.stringify(permissions))
            } else {
                // department.permissions = JSON.parse(department.permissions)
                department.permissions = mergeUserPermissions(JSON.parse(JSON.stringify(permissions)), JSON.parse(department.permissions))
                
            }

            return department
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateDepartmentInput): Promise<MutationResponse> {

    const escapeQuotes = (jsonString: string) => jsonString.replace(/"/g, '\\"')

    const mutation = `
        mutation {
            createDepartment(input: {
                code: "${input.code}",
                name: "${input.name}",
                permissions: ${input.permissions != null ? `"${escapeQuotes(JSON.stringify(input.permissions))}"` : null}
            }) {
                id
                code
                name
                status
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createDepartment) {
            return {
                success: true,
                msg: 'Department created successfully!',
                data: response.data.data.createDepartment
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Department. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateDepartmentInput): Promise<MutationResponse> {

    const escapeQuotes = (jsonString: string) => jsonString.replace(/"/g, '\\"')

    const mutation = `
        mutation {
            updateDepartment(id: "${id}", input: { 
                code: "${input.code}",
                name: "${input.name}",
                permissions: ${input.permissions != null ? `"${escapeQuotes(JSON.stringify(input.permissions))}"` : null}
            }) {
                id
                code
                name
                status
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateDepartment) {
            return {
                success: true,
                msg: 'Department updated successfully!',
                data: response.data.data.updateDepartment
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Department. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeDepartment(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeDepartment) {
            return response.data.data.removeDepartment
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Department. Please contact system administrator'
        }
    }
}