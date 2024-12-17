import { sendRequest } from "~/utils/api"
import type { Employee, CreateEmployeeInput, MutationResponse, FindAllResponse } from "./employee.types";
import axios from "axios";
import type { Department } from "../department/department";


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
                    employee_number
                    firstname
                    middlename
                    lastname
                    status
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
                employee_number
                rank_number
                name_prefix
                name_suffix
                status
                firstname
                middlename
                lastname
                signature_src
                position
                status
                division {
                    id 
                    name
                }
                department {
                    id 
                    name
                }   
                user_employee {
                        user {
                        id
                    }
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

    const signature_src = (input.signature_src && input.signature_src.trim() !== '') ? `"${input.signature_src}"` : null
    const division_id = input.division ? `"${input.division.id}"` : null
    const name_prefix = input.name_prefix.trim() === '' ? null : `"${input.name_prefix}"`
    const name_suffix = input.name_suffix.trim() === '' ? null : `"${input.name_suffix}"`

    const mutation = `
        mutation {
            createEmployee(input: {
                employee_number: "${input.employee_number}",
                rank_number: ${input.rank_number},
                firstname: "${input.firstname}",
                middlename: "${input.middlename}",
                lastname: "${input.lastname}",
                name_prefix: ${name_prefix},
                name_suffix: ${name_suffix},
                signature_src: ${signature_src},
                position: "${input.position}",
                department_id: "${input.department?.id}",
                division_id: ${division_id},
            }) {
                id
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

    const signature_src = (input.signature_src && input.signature_src.trim() !== '') ? `"${input.signature_src}"` : null
    const division_id = input.division ? `"${input.division.id}"` : null
    const name_prefix = input.name_prefix.trim() === '' ? null : `"${input.name_prefix}"`
    const name_suffix = input.name_suffix.trim() === '' ? null : `"${input.name_suffix}"`

    const mutation = `
        mutation {
            updateEmployee(id: "${id}", input: {
                employee_number: "${input.employee_number}",
                rank_number: ${input.rank_number},
                firstname: "${input.firstname}",
                middlename: "${input.middlename}",
                lastname: "${input.lastname}",
                name_prefix: ${name_prefix},
                name_suffix: ${name_suffix},
                signature_src: ${signature_src},
                position: "${input.position}",
                department_id: "${input.department?.id}",
                division_id: ${division_id},
            }) {
                id
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

export async function fetchFormDataInCreate(): Promise<{ departments: Department[] }> {

    const query = `
        query {
            departments {
                id 
                code
                name 
                divisions {
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

export async function fetchFormDataInUpdate(id: string): 
    Promise<{ 
        departments: Department[], 
        employee: Employee | undefined, 
    }> {

    const query = `
        query {
            employee(id: "${id}") {
                id
                employee_number
                rank_number
                firstname
                middlename
                lastname
                name_prefix
                name_suffix
                signature_src
                position
                division {
                    id 
                    name
                }
                department {
                    id 
                    name
                    divisions {
                        id 
                        code 
                        name
                    }
                }
            }
            departments {
                id 
                name 
                divisions {
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

        let departments = []
        let employee

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(!data.employee) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        employee = data.employee

        if(data.departments) {
            departments = data.departments
        }

        return {
            departments,
            employee,
        }

    } catch (error) {
        console.error(error);
        return {
            departments: [],
            employee: undefined,
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
                rank_number
                division {
                    id 
                    code
                    name 
                    permissions
                }
                department {
                    id 
                    code
                    name 
                    permissions
                }
                user_employee {
                    id
                }
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