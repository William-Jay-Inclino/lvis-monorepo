import type { ChangeApproverResponse } from "./mrv.types";


export async function changeApprover(id: string, approver_id: string): Promise<ChangeApproverResponse> {

    const mutation = `
        mutation {
            changeMrvApprover(
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

        if (response.data && response.data.data && response.data.data.changeMrvApprover) {
            return {
                success: true,
                msg: 'Approver changed successfully!',
                data: response.data.data.changeMrvApprover
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