import type { CreateMeqsSupplierInput, UpdateMeqsSupplierInput } from "./meqs-supplier";
import type { MutationResponse } from "./meqs-supplier";


export async function create(input: CreateMeqsSupplierInput): Promise<MutationResponse> {

    const meqs_supplier_items = input.meqs_supplier_items.map(item => {
        return `
        {
          canvass_item_id: "${item.canvass_item_id}"
          price: ${item.price}
          notes: "${item.notes}"
          is_awarded: ${item.is_awarded}
          vat_type: ${item.vat_type}
        }`;
    }).join(', ');



    const mutation = `
        mutation {
            createMeqsSupplier(
                input: {
                    meqs_id: "${input.meqs_id}"
                    supplier_id: "${input.supplier_id}"
                    payment_terms: "${input.payment_terms}"
                    meqs_supplier_items: [${meqs_supplier_items}]
                }
            ) {
                id
                payment_terms 
                supplier {
                    id 
                    name 
                    address
                    is_vat_registered
                }
                attachments {
                    id 
                    src
                    filename
                }
                meqs_supplier_items {
                    id 
                    price 
                    notes 
                    is_awarded 
                    vat_type
                    canvass_item {
                        id 
                        unit {
                            id 
                            name 
                        }
                        item {
                            id
                            code 
                            description
                        }
                        description
                        quantity
                    }
                }
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createMeqsSupplier) {
            return {
                success: true,
                msg: 'Supplier created successfully!',
                data: response.data.data.createMeqsSupplier
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Supplier. Please contact system administrator'
        };
    }

}

export async function update(id: string, input: UpdateMeqsSupplierInput): Promise<MutationResponse> {

    const meqs_supplier_items = input.meqs_supplier_items.map(item => {
        return `
        {
          id: "${item.id}"
          price: ${item.price}
          notes: "${item.notes}"
          is_awarded: ${item.is_awarded}
          vat_type: ${item.vat_type}
        }`;
    }).join(', ');


    const mutation = `
        mutation {
            updateMeqsSupplier(
                id: "${id}",
                input: {
                    payment_terms: "${input.payment_terms}"
                    meqs_supplier_items: [${meqs_supplier_items}]
                }
            ) {
                id
                payment_terms 
                supplier {
                    id 
                    name 
                    address
                    is_vat_registered
                    vat_type
                }
                attachments {
                    id 
                    src
                    filename
                }
                meqs_supplier_items {
                    id 
                    price 
                    notes 
                    is_awarded 
                    vat_type
                    canvass_item {
                        id 
                        unit {
                            id 
                            name 
                        }
                        item {
                            id
                            code 
                            description
                        }
                        description
                        quantity
                    }
                }
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateMeqsSupplier) {
            return {
                success: true,
                msg: 'Supplier updated successfully!',
                data: response.data.data.updateMeqsSupplier
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Supplier. Please contact system administrator'
        };
    }

}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {

    const mutation = `
        mutation {
            removeMeqsSupplier(
                id: "${id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.removeMeqsSupplier) {
            return {
                success: response.data.data.removeMeqsSupplier.success,
                msg: response.data.data.removeMeqsSupplier.msg
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove Supplier. Please contact system administrator'
        };
    }
}

export async function awardSupplierItem(meqs_supplier_item_id: string, meqs_supplier_id: string, canvass_item_id: string): Promise<MutationResponse> {

    const mutation = `
        mutation {
            awardMeqsSupplierItem(
                id: "${meqs_supplier_item_id}",
                meqs_supplier_id: "${meqs_supplier_id}",
                canvass_item_id: "${canvass_item_id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.awardMeqsSupplierItem) {
            return {
                success: true,
                msg: 'Supplier awarded successfully!',
                data: response.data.data.awardMeqsSupplierItem
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to award Supplier Item. Please contact system administrator'
        };
    }

}

export async function attachNoteSupplierItem(meqs_id: string, canvass_item_id: string, notes: string): Promise<MutationResponse> {

    const mutation = `
        mutation {
            attachNoteMeqsSupplierItem(
                meqs_id: "${meqs_id}",
                canvass_item_id: "${canvass_item_id}"
                notes: "${notes}",
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.attachNoteMeqsSupplierItem) {
            return {
                success: true,
                msg: 'Remarks Attached!',
                data: response.data.data.attachNoteMeqsSupplierItem
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to attach remark. Please contact system administrator'
        };
    }

}