import type { PoApproverMutationResponse, UpdateApproverOrderResponse } from "./po-approver.types";
import type { CreateApproverInput, UpdateApproverInput } from '~/composables/common.types'

export async function updateApproverOrder(inputs: {id: string, order: number}[]): Promise<UpdateApproverOrderResponse> {
    const inputsString = inputs.map(({ id, order }) => `{ id: "${id}", order: ${order} }`).join('\n');
    const mutation = `
        mutation {
            updatePOApproverOrder(
                inputs: [
                    ${inputsString}
                ]
            ) {
                success
                approvers {
                    id
                    po_id
                    approver {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    date_approval 
                    notes
                    status
                    label
                    order
                }
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updatePOApproverOrder) {

            if(response.data.data.updatePOApproverOrder.success) {
                return {
                    success: true,
                    msg: 'Order updated successfully!',
                    approvers: response.data.data.updatePOApproverOrder.approvers
                };
            }else{
                return {
                    success: false,
                    msg: 'Failed to update PO Approver Order. Please contact system administrator',
                    approvers: []
                }
            }

        }

        throw new Error(JSON.stringify(response.data.errors));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update PO Approver Order. Please contact system administrator',
            approvers: []
        };
    }
}

export async function create(poId: string, input: CreateApproverInput): Promise<PoApproverMutationResponse> {

    const mutation = `
        mutation {
            createPoApprover(
                input: {
                    po_id: "${poId}"
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                    order: ${input.order}
                }
            ) {
                id
                po_id
                approver {
                    id
                    firstname
                    middlename
                    lastname
                }
                date_approval 
                notes
                status
                label
                order
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if(response.data && response.data.data && response.data.data.createPoApprover) {
            return {
                success: true,
                msg: 'Approver added!',
                data: response.data.data.createPoApprover 
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to create PO Approver. Please contact system administrator'
        };
    }
}

export async function remove(id: string): Promise<{success: boolean, msg: string}> {

    const mutation = `
        mutation {
            removePoApprover(
                id: "${id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if(response.data && response.data.data && response.data.data.removePoApprover) {
            return {
                success: response.data.data.removePoApprover.success,
                msg: response.data.data.removePoApprover.msg
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to remove PO Approver. Please contact system administrator'
        };
    }
}

export async function update(input: UpdateApproverInput): Promise<PoApproverMutationResponse> {

    let notes = null 
    let date_approval = null

    if(input.notes) {
        notes = `"${input.notes}"`
    }else{
        notes = `""`
    }

    if(input.date_approval) {
        date_approval = `"${input.date_approval}"`
    }

    const mutation = `
        mutation {
            updatePoApprover(
                id: "${input.id}",
                input: {
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                    order: ${input.order}
                    date_approval: ${date_approval}
                    notes: ${notes}
                    status: ${input.status.id}
                }
            ) {
                id
                po_id
                approver {
                    id
                    firstname
                    middlename
                    lastname
                }
                date_approval 
                notes
                status
                label
                order
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if(response.data && response.data.data && response.data.data.updatePoApprover) {
            return {
                success: true,
                msg: 'Approver updated!',
                data: response.data.data.updatePoApprover 
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to update PO Approver. Please contact system administrator'
        };
    }
}