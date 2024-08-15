import type { JoApproverMutationResponse, UpdateApproverOrderResponse } from "./jo-approver.types";

export async function updateApproverOrder(inputs: { id: string, order: number }[]): Promise<UpdateApproverOrderResponse> {
    const inputsString = inputs.map(({ id, order }) => `{ id: "${id}", order: ${order} }`).join('\n');
    const mutation = `
        mutation {
            updateJOApproverOrder(
                inputs: [
                    ${inputsString}
                ]
            ) {
                success
                approvers {
                    id
                    jo_id
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
                    is_supervisor
                }
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateJOApproverOrder) {

            if (response.data.data.updateJOApproverOrder.success) {
                return {
                    success: true,
                    msg: 'Order updated successfully!',
                    approvers: response.data.data.updateJOApproverOrder.approvers
                };
            } else {
                return {
                    success: false,
                    msg: 'Failed to update JO Approver Order. Please contact system administrator',
                    approvers: []
                }
            }

        }

        throw new Error(JSON.stringify(response.data.errors));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update JO Approver Order. Please contact system administrator',
            approvers: []
        };
    }
}

export async function create(joId: string, input: CreateApproverInput): Promise<JoApproverMutationResponse> {

    const mutation = `
        mutation {
            createJoApprover(
                input: {
                    jo_id: "${joId}"
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                    order: ${input.order}
                }
            ) {
                id
                jo_id
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
                is_supervisor
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createJoApprover) {
            return {
                success: true,
                msg: 'Approver added!',
                data: response.data.data.createJoApprover
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create JO Approver. Please contact system administrator'
        };
    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {

    const mutation = `
        mutation {
            removeJoApprover(
                id: "${id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.removeJoApprover) {
            return {
                success: response.data.data.removeJoApprover.success,
                msg: response.data.data.removeJoApprover.msg
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove JO Approver. Please contact system administrator'
        };
    }
}

export async function update(input: UpdateApproverInput): Promise<JoApproverMutationResponse> {

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
            updateJoApprover(
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
                jo_id
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
                is_supervisor
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateJoApprover) {
            return {
                success: true,
                msg: 'Approver updated!',
                data: response.data.data.updateJoApprover
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update JO Approver. Please contact system administrator'
        };
    }
}