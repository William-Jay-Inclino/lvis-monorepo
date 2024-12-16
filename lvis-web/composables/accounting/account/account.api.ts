import { sendRequest } from "~/utils/api"
import type { Account, CreateAccountInput, FindAllResponse, MutationResponse } from "./account";



export async function findAll(payload: { page: number, pageSize: number, name: string }): Promise<FindAllResponse> {

    const { page, pageSize, name } = payload;

    let name2 = null

    if (name.trim() !== '') {
        name2 = `"${name}"`
    }

    const query = `
        query {
            accounts(
                page: ${page},
                pageSize: ${pageSize},
                name: ${name2},
            ) {
                data {
                    id
                    code 
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
        return response.data.data.accounts;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Account | undefined> {
    const query = `
        query {
            account(id: "${id}") {
                id
                code
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.account) {
            return response.data.data.account
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateAccountInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateAccountInput];
            const formattedValue = typeof value === 'number' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            createAccount(input: { ${inputFields} }) {
                id
                code
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createAccount) {
            return {
                success: true,
                msg: 'Account created successfully!',
                data: response.data.data.createAccount
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Account. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateAccountInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateAccountInput];
            const formattedValue = typeof value === 'number' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            updateAccount(id: "${id}", input: { ${inputFields} }) {
                id
                code
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateAccount) {
            return {
                success: true,
                msg: 'Account updated successfully!',
                data: response.data.data.updateAccount
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Account. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeAccount(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeAccount) {
            return response.data.data.removeAccount
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Account. Please contact system administrator'
        }
    }
}

export async function fetchAccountsByName(payload: string): Promise<Account[]> {
    const query = `
        query {
            accountsByName(input: "${payload}") {
                id
                code 
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
        return response.data.data.accountsByName

    } catch (error) {
        console.error(error);
        return []
    }
}