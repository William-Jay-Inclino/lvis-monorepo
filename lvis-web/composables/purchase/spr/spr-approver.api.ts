import type { SprApproverMutationResponse, UpdateApproverOrderResponse } from "./spr-approver.types";

export async function updateApproverOrder(inputs: { id: string, order: number }[]): Promise<UpdateApproverOrderResponse> {
    const inputsString = inputs.map(({ id, order }) => `{ id: "${id}", order: ${order} }`).join('\n');
    const mutation = `
        mutation {
            updateSPRApproverOrder(
                inputs: [
                    ${inputsString}
                ]
            ) {
                success
                approvers {
                    id
                    spr_id
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

        if (response.data && response.data.data && response.data.data.updateSPRApproverOrder) {

            if (response.data.data.updateSPRApproverOrder.success) {
                return {
                    success: true,
                    msg: 'Order updated successfully!',
                    approvers: response.data.data.updateSPRApproverOrder.approvers
                };
            } else {
                return {
                    success: false,
                    msg: 'Failed to update SPR Approver Order. Please contact system administrator',
                    approvers: []
                }
            }

        }

        throw new Error(JSON.stringify(response.data.errors));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update SPR Approver Order. Please contact system administrator',
            approvers: []
        };
    }
}

export async function create(sprId: string, input: CreateApproverInput): Promise<SprApproverMutationResponse> {

    const mutation = `
        mutation {
            createSprApprover(
                input: {
                    spr_id: "${sprId}"
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                    order: ${input.order}
                }
            ) {
                id
                spr_id
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

        if (response.data && response.data.data && response.data.data.createSprApprover) {
            return {
                success: true,
                msg: 'Approver added!',
                data: response.data.data.createSprApprover
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create SPR Approver. Please contact system administrator'
        };
    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {

    const mutation = `
        mutation {
            removeSprApprover(
                id: "${id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.removeSprApprover) {
            return {
                success: response.data.data.removeSprApprover.success,
                msg: response.data.data.removeSprApprover.msg
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove SPR Approver. Please contact system administrator'
        };
    }
}

export async function update(input: UpdateApproverInput): Promise<SprApproverMutationResponse> {

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
            updateSprApprover(
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
                spr_id
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

        if (response.data && response.data.data && response.data.data.updateSprApprover) {
            return {
                success: true,
                msg: 'Approver updated!',
                data: response.data.data.updateSprApprover
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update SPR Approver. Please contact system administrator'
        };
    }
}