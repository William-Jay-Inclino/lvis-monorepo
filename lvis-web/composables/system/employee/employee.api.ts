import { sendRequest } from "~/utils/api"
import type { Employee, CreateEmployeeInput, MutationResponse, FindAllResponse } from "./employee.types";
import axios from "axios";
import type { Position } from "../position/position";


export async function findAll(payload: { page: number, pageSize: number, searchValue: string | null }): Promise<FindAllResponse> {

    const { page, pageSize, searchValue } = payload;

    let value = null

    if (searchValue) {
        value = `"${searchValue}"`
    }


    const query = `
        query {
            employees(
                page: ${page},
                pageSize: ${pageSize},
                searchValue: ${value},
            ) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                    signature_src
                    position {
                        id 
                        name
                    }
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
        return response.data.data.employees;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Employee | undefined> {
    const query = `
        query {
            employee(id: "${id}") {
                id
                firstname
                middlename
                lastname
                signature_src
                position {
                    id 
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.employee) {
            return response.data.data.employee;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateEmployeeInput): Promise<MutationResponse> {
    
    console.log('input', input);

    let signature_src = (input.signature_src && input.signature_src.trim() !== '') ? `"${input.signature_src}"` : null

    const mutation = `
        mutation {
            createEmployee(input: {
                firstname: "${input.firstname}",
                middlename: "${input.middlename}",
                lastname: "${input.lastname}",
                signature_src: ${signature_src},
                position_id: "${input.position?.id}",
            }) {
                id
                firstname
                middlename
                lastname
                position {
                    id 
                    name
                }
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createEmployee) {
            return {
                success: true,
                msg: 'Employee created successfully!',
                data: response.data.data.createEmployee
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Employee. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateEmployeeInput): Promise<MutationResponse> {

    console.log('input', input);

    let signature_src = (input.signature_src && input.signature_src.trim() !== '') ? `"${input.signature_src}"` : null

    const mutation = `
        mutation {
            updateEmployee(id: "${id}", input: {
                firstname: "${input.firstname}",
                middlename: "${input.middlename}",
                lastname: "${input.lastname}",
                signature_src: ${signature_src},
                position_id: "${input.position?.id}",
            }) {
                id
                firstname
                middlename
                lastname
                position {
                    id 
                    name
                }
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateEmployee) {
            return {
                success: true,
                msg: 'Employee updated successfully!',
                data: response.data.data.updateEmployee
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Employee. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeEmployee(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeEmployee) {
            return response.data.data.removeEmployee
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Employee. Please contact system administrator'
        }
    }
}

export async function uploadSingleAttachment(attachment: any, apiUrl: string): Promise<string | null> {

    console.log('uploadSingleAttachment', attachment)

    const image = attachment

    console.log('image', image)

    const formData = new FormData();

    formData.append('file', image)

    const fileUploadApi = apiUrl + '/api/v1/file-upload/system/employee/single'

    try {
        const response = await axios.post(fileUploadApi, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('response', response.data);

        if (response.data && response.data.success && response.data.data) {
            return response.data.data as string
        }

        return null

    } catch (error) {
        console.error('Error uploading image:', error);
        return null
    }

}


export async function fetchFormDataInCreate(): Promise<{ positions: Position[] }> {

    const query = `
        query {
            positions {
                id 
                name 
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let positions = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.positions) {
            positions = data.positions.map((i: Position) => {
                i.permissions = i.permissions ? JSON.parse(JSON.stringify(i.permissions)) : null
                return i
            })
        }

        return {
            positions
        }

    } catch (error) {
        console.error(error);
        return {
            positions: [],
        }
    }

}

export async function fetchFormDataInUpdate(id: string): Promise<{ positions: Position[], employee: Employee | undefined }> {

    const query = `
        query {
            employee(id: "${id}") {
                id
                firstname
                middlename
                lastname
                signature_src
                position {
                    id 
                    name
                }
            }
            positions {
                id 
                name 
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let positions = []
        let employee

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(!data.employee) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        employee = data.employee

        if (data.positions) {
            positions = data.positions.map((i: Position) => {
                i.permissions = i.permissions ? JSON.parse(JSON.stringify(i.permissions)) : null
                return i
            })
        }

        return {
            positions,
            employee
        }

    } catch (error) {
        console.error(error);
        return {
            positions: [],
            employee: undefined
        }
    }

}

export async function fetchEmployees(payload: string): Promise<Employee[]> {
    const query = `
        query {
            employeesByName(name: "${payload}") {
                id 
                firstname 
                middlename 
                lastname
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.employeesByName

    } catch (error) {
        console.error(error);
        return []
    }
}