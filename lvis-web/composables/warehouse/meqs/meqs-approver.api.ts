import type { MeqsApproverMutationResponse, UpdateApproverOrderResponse } from "./meqs-approver.types";

export async function updateApproverOrder(inputs: { id: string, order: number }[]): Promise<UpdateApproverOrderResponse> {
    const inputsString = inputs.map(({ id, order }) => `{ id: "${id}", order: ${order} }`).join('\n');
    const mutation = `
        mutation {
            updateMEQSApproverOrder(
                inputs: [
                    ${inputsString}
                ]
            ) {
                success
                approvers {
                    id
                    meqs_id
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

        if (response.data && response.data.data && response.data.data.updateMEQSApproverOrder) {

            if (response.data.data.updateMEQSApproverOrder.success) {
                return {
                    success: true,
                    msg: 'Order updated successfully!',
                    approvers: response.data.data.updateMEQSApproverOrder.approvers
                };
            } else {
                return {
                    success: false,
                    msg: 'Failed to update MEQS Approver Order. Please contact system administrator',
                    approvers: []
                }
            }

        }

        throw new Error(JSON.stringify(response.data.errors));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update MEQS Approver Order. Please contact system administrator',
            approvers: []
        };
    }
}

export async function create(meqsId: string, input: CreateApproverInput): Promise<MeqsApproverMutationResponse> {

    const mutation = `
        mutation {
            createMeqsApprover(
                input: {
                    meqs_id: "${meqsId}"
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                    order: ${input.order}
                }
            ) {
                id
                meqs_id
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

        if (response.data && response.data.data && response.data.data.createMeqsApprover) {
            return {
                success: true,
                msg: 'Approver added!',
                data: response.data.data.createMeqsApprover
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create MEQS Approver. Please contact system administrator'
        };
    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {

    const mutation = `
        mutation {
            removeMeqsApprover(
                id: "${id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.removeMeqsApprover) {
            return {
                success: response.data.data.removeMeqsApprover.success,
                msg: response.data.data.removeMeqsApprover.msg
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove MEQS Approver. Please contact system administrator'
        };
    }
}

export async function update(input: UpdateApproverInput): Promise<MeqsApproverMutationResponse> {

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
            updateMeqsApprover(
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
                meqs_id
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

        if (response.data && response.data.data && response.data.data.updateMeqsApprover) {
            return {
                success: true,
                msg: 'Approver updated!',
                data: response.data.data.updateMeqsApprover
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update MEQS Approver. Please contact system administrator'
        };
    }
}