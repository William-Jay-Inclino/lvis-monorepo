import { sendRequest } from "~/utils/api"
import type { Project, CreateProjectInput, FindAllResponse, MutationResponse } from "./project.types";



export async function findAll(payload: { page: number, pageSize: number, name: string }): Promise<FindAllResponse> {

    const { page, pageSize, name } = payload;

    let name2 = null

    if (name.trim() !== '') {
        name2 = `"${name}"`
    }

    const query = `
        query {
            projects(
                page: ${page},
                pageSize: ${pageSize},
                name: ${name2},
            ) {
                data {
                    id
                    name
                }
                totalItems
                currentPage
                totalPages
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.projects;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Project | undefined> {
    const query = `
        query {
            project(id: "${id}") {
                id
                name
                project_items {
                    item {
                        code 
                        description
                        total_quantity
                        unit {
                            name
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.project) {
            return response.data.data.project
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateProjectInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateProjectInput];
            const formattedValue = typeof value === 'number' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            createProject(input: { ${inputFields} }) {
                id
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createProject) {
            return {
                success: true,
                msg: 'Project created successfully!',
                data: response.data.data.createProject
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Project. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateProjectInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateProjectInput];
            const formattedValue = typeof value === 'number' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            updateProject(id: "${id}", input: { ${inputFields} }) {
                id
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateProject) {
            return {
                success: true,
                msg: 'Project updated successfully!',
                data: response.data.data.updateProject
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Project. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeProject(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeProject) {
            return response.data.data.removeProject
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Project. Please contact system administrator'
        }
    }
}


export async function fetchProjectsByName(payload: string): Promise<Project[]> {
    const query = `
        query {
            projectsByName(input: "${payload}") {
                id
                name
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.projectsByName

    } catch (error) {
        console.error(error);
        return []
    }
}