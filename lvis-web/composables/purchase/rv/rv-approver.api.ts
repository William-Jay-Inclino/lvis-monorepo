import type { RvApproverMutationResponse, UpdateApproverOrderResponse } from "./rv-approver.types";

export async function updateApproverOrder(inputs: { id: string, order: number }[]): Promise<UpdateApproverOrderResponse> {
    const inputsString = inputs.map(({ id, order }) => `{ id: "${id}", order: ${order} }`).join('\n');
    const mutation = `
        mutation {
            updateRVApproverOrder(
                inputs: [
                    ${inputsString}
                ]
            ) {
                success
                approvers {
                    id
                    rv_id
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

        if (response.data && response.data.data && response.data.data.updateRVApproverOrder) {

            if (response.data.data.updateRVApproverOrder.success) {
                return {
                    success: true,
                    msg: 'Order updated successfully!',
                    approvers: response.data.data.updateRVApproverOrder.approvers
                };
            } else {
                return {
                    success: false,
                    msg: 'Failed to update RV Approver Order. Please contact system administrator',
                    approvers: []
                }
            }

        }

        throw new Error(JSON.stringify(response.data.errors));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update RV Approver Order. Please contact system administrator',
            approvers: []
        };
    }
}

export async function create(rvId: string, input: CreateApproverInput): Promise<RvApproverMutationResponse> {

    const mutation = `
        mutation {
            createRvApprover(
                input: {
                    rv_id: "${rvId}"
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                    order: ${input.order}
                }
            ) {
                id
                rv_id
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

        if (response.data && response.data.data && response.data.data.createRvApprover) {
            return {
                success: true,
                msg: 'Approver added!',
                data: response.data.data.createRvApprover
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create RV Approver. Please contact system administrator'
        };
    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {

    const mutation = `
        mutation {
            removeRvApprover(
                id: "${id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.removeRvApprover) {
            return {
                success: response.data.data.removeRvApprover.success,
                msg: response.data.data.removeRvApprover.msg
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove RV Approver. Please contact system administrator'
        };
    }
}

export async function update(input: UpdateApproverInput): Promise<RvApproverMutationResponse> {

    let notes = null
    let date_approval = null

    if (input.notes) {
        notes = `"${input.notes}"`
    } else {
        notes = `""`
    }

    if (input.date_approval) {
        date_approval = `"${input.date_approval}"`
    }

    const mutation = `
        mutation {
            updateRvApprover(
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
                rv_id
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

        if (response.data && response.data.data && response.data.data.updateRvApprover) {
            return {
                success: true,
                msg: 'Approver updated!',
                data: response.data.data.updateRvApprover
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update RV Approver. Please contact system administrator'
        };
    }
}