import { sendRequest } from "~/utils/api"
import type { User, CreateUserInput, MutationResponse, FindAllResponse, UpdateUserInput, UserPermissions } from "./user.types";
import type { Employee } from "../employee/employee.types";
import axios from "axios";



export async function findAll(payload: { page: number, pageSize: number, searchValue: string | null }): Promise<FindAllResponse> {

    const { page, pageSize, searchValue } = payload;

    let value = null

    if (searchValue) {
        value = `"${searchValue}"`
    }


    const query = `
        query {
            users(
                page: ${page},
                pageSize: ${pageSize},
                searchValue: ${value},
            ) {
                data {
                    id
                    username
                    firstname
                    middlename
                    lastname
                    status
                    role
                    user_employee {
                        employee {
                            id 
                            firstname
                            middlename
                            lastname
                        }
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
        return response.data.data.users;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<User | undefined> {
    const query = `
        query {
            user(id: "${id}") {
                id
                username
                firstname
                middlename
                lastname
                role
                status
                permissions
                user_employee {
                    employee {
                        id 
                        firstname
                        middlename
                        lastname
                        position
                        department {
                            id 
                            code 
                            name
                        }
                        division {
                            id 
                            code 
                            name
                        }
                        is_budget_officer
                        is_finance_manager
                        total_pending_approvals
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.user) {
            response.data.data.user.permissions = JSON.parse(response.data.data.user.permissions)
            return response.data.data.user;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateUserInput): Promise<MutationResponse> {

    const escapeQuotes = (jsonString: string) => jsonString.replace(/"/g, '\\"')

    const mutation = `
        mutation {
            createUser(
                input: {
                    employee_id: ${input.employee ? `"${input.employee.id}"` : null},
                    username: "${input.username}",
                    password: "${input.password}",
                    firstname: "${input.firstname}",
                    middlename: ${input.middlename ? `"${input.middlename}"` : null},
                    lastname: "${input.lastname}",
                    role: ${input.role},
                    permissions: ${input.permissions != null ? `"${escapeQuotes(JSON.stringify(input.permissions))}"` : null}
                }
            ) {
                id
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createUser) {
            return {
                success: true,
                msg: 'User created successfully!',
                data: response.data.data.createUser
            };
        }

        throw new Error(JSON.stringify(response.data.errors));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create User. Please contact system administrator'
        };
    }
}

export async function updateUserInfo(id: string, input: UpdateUserInput): Promise<MutationResponse> {

    let middlename = null

    if (input.middlename) {
        middlename = `"${input.middlename}"`
    }

    const mutation = `
        mutation {
            updateUser(
                id: "${id}",
                input: {
                    firstname: "${input.firstname}",
                    middlename: ${middlename},
                    lastname: "${input.lastname}",
                    role: ${input.role},
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateUser) {
            return {
                success: true,
                msg: 'User updated successfully!',
                data: response.data.data.updateUser
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update User. Please contact system administrator'
        }

    }
}

export async function changePassword(id: string, password: string): Promise<MutationResponse> {

    const mutation = `
        mutation {
            change_password(
                user_id: "${id}",
                password: "${password}",
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.change_password) {
            return response.data.data.change_password
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to change Password. Please contact system administrator'
        }

    }
}

export async function changeOwnPassword(current_pw: string, new_pw: string): Promise<{success: boolean, msg: string}> {

    const mutation = `
        mutation {
            change_own_password(
                current_pw: "${current_pw}",
                new_pw: "${new_pw}",
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.change_own_password) {
            return response.data.data.change_own_password
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to change Password. Please contact system administrator'
        }

    }
}

export async function updatePermissions(id: string, permissions: UserPermissions): Promise<MutationResponse> {

    const escapeQuotes = (jsonString: string) => jsonString.replace(/"/g, '\\"')

    const mutation = `
        mutation {
            updateUser(
                id: "${id}",
                input: {
                    permissions: ${permissions != null ? `"${escapeQuotes(JSON.stringify(permissions))}"` : null}
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateUser) {
            return {
                success: true,
                msg: 'Permissions updated successfully!',
                data: response.data.data.updateUser
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Permissions. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeUser(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeUser) {
            return response.data.data.removeUser
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove User. Please contact system administrator'
        }
    }
}

export async function fetchFormDataInCreate(): Promise<{
    employees: Employee[],
}> {


    const query = `
        query {
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                    position
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
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        return {
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
        }
    }


}

export async function isUsernameExist(username: string): Promise<{
    success: boolean,
    msg: string
    data: boolean
}> {

    console.log('isUsernameExist()', username)

    const query = `
        query {
            isUsernameExist(
                username: "${username}",
            )
        }`;

    try {
        const response = await sendRequest(query);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.isUsernameExist !== undefined) {
            return {
                success: true,
                msg: 'Finish checking username availability',
                data: response.data.data.isUsernameExist
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to check username availability. Please contact system administrator',
            data: false
        }

    }

}

export async function fetchTotalNotifications(employee_id: string, URL: string): Promise<number | undefined> {
    try {
        const response = await axios.get(
            `${URL}/employee/${employee_id}/get-total-notifications`,
        );
        return response.data

    } catch (err) {
        console.error('Error fetching total notifications of user', err);
    }
  } 