import type { RrApproverMutationResponse, UpdateApproverOrderResponse } from "./rr-approver.types";
import type { CreateApproverInput, UpdateApproverInput } from '~/composables/common.types'

export async function updateApproverOrder(inputs: {id: string, order: number}[]): Promise<UpdateApproverOrderResponse> {
    const inputsString = inputs.map(({ id, order }) => `{ id: "${id}", order: ${order} }`).join('\n');
    const mutation = `
        mutation {
            updateRRApproverOrder(
                inputs: [
                    ${inputsString}
                ]
            ) {
                success
                approvers {
                    id
                    rr_id
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

        if (response.data && response.data.data && response.data.data.updateRRApproverOrder) {

            if(response.data.data.updateRRApproverOrder.success) {
                return {
                    success: true,
                    msg: 'Order updated successfully!',
                    approvers: response.data.data.updateRRApproverOrder.approvers
                };
            }else{
                return {
                    success: false,
                    msg: 'Failed to update RR Approver Order. Please contact system administrator',
                    approvers: []
                }
            }

        }

        throw new Error(JSON.stringify(response.data.errors));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update RR Approver Order. Please contact system administrator',
            approvers: []
        };
    }
}

export async function create(rrId: string, input: CreateApproverInput): Promise<RrApproverMutationResponse> {

    const mutation = `
        mutation {
            createRrApprover(
                input: {
                    rr_id: "${rrId}"
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                    order: ${input.order}
                }
            ) {
                id
                rr_id
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

        if(response.data && response.data.data && response.data.data.createRrApprover) {
            return {
                success: true,
                msg: 'Approver added!',
                data: response.data.data.createRrApprover 
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to create RR Approver. Please contact system administrator'
        };
    }
}

export async function remove(id: string): Promise<{success: boolean, msg: string}> {

    const mutation = `
        mutation {
            removeRrApprover(
                id: "${id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if(response.data && response.data.data && response.data.data.removeRrApprover) {
            return {
                success: response.data.data.removeRrApprover.success,
                msg: response.data.data.removeRrApprover.msg
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to remove RR Approver. Please contact system administrator'
        };
    }
}

export async function update(input: UpdateApproverInput): Promise<RrApproverMutationResponse> {

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
            updateRrApprover(
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
                rr_id
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

        if(response.data && response.data.data && response.data.data.updateRrApprover) {
            return {
                success: true,
                msg: 'Approver updated!',
                data: response.data.data.updateRrApprover 
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to update RR Approver. Please contact system administrator'
        };
    }
}