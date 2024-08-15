import { sendRequest } from "~/utils/api"
import type { Supplier, CreateSupplierInput, MutationResponse } from "./supplier";



export async function findAll(): Promise<Supplier[]> {

    const query = `
        query {
            suppliers {
                id
                name
                contact
                tin_no
                address
                is_vat_registered
                vat_type
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.suppliers;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Supplier | undefined> {
    const query = `
        query {
            supplier(id: "${id}") {
                id
                name
                contact
                tin_no
                address
                is_vat_registered
                vat_type
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.supplier) {
            return response.data.data.supplier
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateSupplierInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateSupplierInput];
            const formattedValue = typeof value !== 'string' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            createSupplier(input: { ${inputFields} }) {
                id
                name
                contact
                tin_no
                address
                is_vat_registered
                vat_type
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createSupplier) {
            return {
                success: true,
                msg: 'Supplier created successfully!',
                data: response.data.data.createSupplier
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Supplier. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateSupplierInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => {
            const value = input[field as keyof CreateSupplierInput];
            const formattedValue = typeof value !== 'string' ? value : `"${value}"`;
            return `${field}: ${formattedValue}`;
        })
        .join(', ');

    const mutation = `
        mutation {
            updateSupplier(id: "${id}", input: { ${inputFields} }) {
                id
                name
                contact
                tin_no
                address
                is_vat_registered
                vat_type
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateSupplier) {
            return {
                success: true,
                msg: 'Supplier updated successfully!',
                data: response.data.data.updateSupplier
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Supplier. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeSupplier(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeSupplier) {
            return response.data.data.removeSupplier
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Supplier. Please contact system administrator'
        }
    }
}