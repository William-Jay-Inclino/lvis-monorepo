import type { CreateMeqsSupplierAttachmentInput, MutationResponse } from "./meqs-supplier-attachment";


export async function create(input: CreateMeqsSupplierAttachmentInput): Promise<MutationResponse> {

    const mutation = `
        mutation {
            createMeqsSupplierAttachment(
                input: {
                    meqs_supplier_id: "${input.meqs_supplier_id}"
                    src: "${input.src}"
                    filename: "${input.filename}"
                }
            ) {
                id
                meqs_supplier_id
                src
                filename
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createMeqsSupplierAttachment) {
            return {
                success: true,
                msg: 'Attachment added!',
                data: response.data.data.createMeqsSupplierAttachment
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to add Attachment. Please contact system administrator'
        };
    }

}


export async function remove(id: string): Promise<{ success: boolean, msg: string }> {

    const mutation = `
        mutation {
            removeMeqsSupplierAttachment(
                id: "${id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.removeMeqsSupplierAttachment) {
            return {
                success: response.data.data.removeMeqsSupplierAttachment.success,
                msg: response.data.data.removeMeqsSupplierAttachment.msg
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove Attachment. Please contact system administrator'
        };
    }
}