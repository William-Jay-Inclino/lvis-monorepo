import type { Employee } from "~/composables/hr/employee/employee.types";
import type { ApproverMutationResponse, ApproverSetting, CreateApproverSetting, UpdateApproverOrderResponse, UpdateApproverSetting } from "./warehouse.types";



export async function findAllDefaultApprovers(model: string): Promise<ApproverSetting[]> {

    const query = `
        query {
            ${model} {
                id
                approver {
                    id
                    firstname
                    middlename
                    lastname
                }
                label
                order
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        const approvers = response.data.data[model] as ApproverSetting[]

        return approvers.map(i => {
            i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
            return i
        })

    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function initPurchasingTabData(): Promise<{
    employees: Employee[]
}> {

    const query = `
        query {
            employees(page: 1, pageSize: 100) {
                data {
                    id 
                    firstname
                    middlename
                    lastname
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        return {
            employees: response.data.data.employees.data
        }

    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function createApprover(input: CreateApproverSetting, transaction: string): Promise<ApproverMutationResponse> {

    const mutation = `
        mutation {
            ${transaction}(
                input: {
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                    order: ${input.order}
                }
            ) {
                id
                approver {
                    id
                    firstname
                    middlename
                    lastname
                }
                label
                order
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data[transaction]) {
            return {
                success: true,
                msg: 'Approver added!',
                data: response.data.data[transaction]
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Approver. Please contact system administrator'
        };
    }
}

export async function removeApprover(id: string, transaction: string): Promise<{ success: boolean, msg: string, approvers: ApproverSetting[] }> {

    const mutation = `
        mutation {
            ${transaction}(
                id: "${id}"
            ) {
                success
                msg
                approvers{
                    id
                    approver {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    label
                    order
                }
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data[transaction]) {
            return {
                success: response.data.data[transaction].success,
                msg: response.data.data[transaction].msg,
                approvers: response.data.data[transaction].approvers
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove Approver. Please contact system administrator',
            approvers: []
        };
    }
}

export async function updateApprover(input: UpdateApproverSetting, transaction: string): Promise<ApproverMutationResponse> {

    const mutation = `
        mutation {
            ${transaction}(
                id: "${input.id}",
                input: {
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                }
            ) {
                id
                approver {
                    id
                    firstname
                    middlename
                    lastname
                }
                label
                order
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data[transaction]) {
            return {
                success: true,
                msg: 'Approver updated!',
                data: response.data.data[transaction]
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Approver. Please contact system administrator'
        };
    }
}

export async function updateApproverOrder(inputs: { id: string, order: number }[], transaction: string): Promise<UpdateApproverOrderResponse> {
    const inputsString = inputs.map(({ id, order }) => `{ id: "${id}", order: ${order} }`).join('\n');
    const mutation = `
        mutation {
            ${transaction}(
                inputs: [
                    ${inputsString}
                ]
            ) {
                success
                approvers {
                    id
                    approver {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    label
                    order
                }
            }
        }
    `;

    console.log('mutation', mutation)

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data[transaction]) {

            if (response.data.data[transaction].success) {
                return {
                    success: response.data.data[transaction].success,
                    msg: 'Order updated successfully!',
                    approvers: response.data.data[transaction].approvers
                };
            } else {
                return {
                    success: false,
                    msg: 'Failed to update Approver Order. Please contact system administrator',
                    approvers: []
                }
            }

        }

        throw new Error(JSON.stringify(response.data.errors));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Approver Order. Please contact system administrator',
            approvers: []
        };
    }
}