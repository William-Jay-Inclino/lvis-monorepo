import { sendRequest } from "~/utils/api"
import type { Supplier, CreateSupplierInput, MutationResponse, FindAllResponse } from "./supplier";



export async function findAll(payload: { page: number, pageSize: number, name: string }): Promise<FindAllResponse> {

    const { page, pageSize, name } = payload;

    let name2 = null

    if (name.trim() !== '') {
        name2 = `"${name}"`
    }

    const query = `
        query {
            suppliers(
                page: ${page},
                pageSize: ${pageSize},
                name: ${name2},
            ) {
                data {
                    id
                    name
                    contact
                    tin
                    address
                    is_vat_registered
                    vat_type
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
                tin
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
    
    const mutation = `
        mutation {
            createSupplier(
                input: {
                    name: "${input.name}"
                    contact: "${input.contact}"
                    address: "${input.address.replace(/\n/g, '\\n')}"
                    tin: "${input.tin}"
                    is_vat_registered: ${input.is_vat_registered}
                    vat_type: ${input.vat_type}
                }
            ) {
                id
                name
                contact
                tin
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

    const mutation = `
        mutation {
            updateSupplier(
                id: "${id}",
                input: {
                    name: "${input.name}"
                    contact: "${input.contact}"
                    address: "${input.address.replace(/\n/g, '\\n')}"
                    tin: "${input.tin}"
                    is_vat_registered: ${input.is_vat_registered}
                    vat_type: ${input.vat_type}
                }
            ) {
                id
                name
                contact
                tin
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

export async function fetchSuppliers(payload: string): Promise<Supplier[]> {
    const query = `
        query {
            suppliersByName(input: "${payload}") {
                id 
                name
                address
                is_vat_registered
                vat_type
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.suppliersByName

    } catch (error) {
        console.error(error);
        return []
    }
}