import { sendRequest } from "~/utils/api"
import type { Department, CreateDepartmentInput, MutationResponse } from "./department";



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
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.department) {
            return response.data.data.department
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateDepartmentInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateDepartmentInput];
            const formattedValue = typeof value === 'number' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            createDepartment(input: { ${inputFields} }) {
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

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateDepartmentInput];
            const formattedValue = typeof value === 'number' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            updateDepartment(id: "${id}", input: { ${inputFields} }) {
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