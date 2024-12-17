import type { ChangeApproverResponse } from "./gas-slip.approver.types";


export async function changeApprover(id: string, approver_id: string): Promise<ChangeApproverResponse> {

    const mutation = `
        mutation {
            changeGasSlipApprover(
                id: "${id}",
                input: {
                    new_approver_id: "${approver_id}"
                }
            ) {
                id
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

        if (response.data && response.data.data && response.data.data.changeGasSlipApprover) {
            return {
                success: true,
                msg: 'Approver changed successfully!',
                data: response.data.data.changeGasSlipApprover
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to change approver. Please contact system administrator'
        };
    }
}