import type { ChangeApproverResponse } from "./trip-ticket-approver.types";


export async function changeApprover(id: string, approver_id: string): Promise<ChangeApproverResponse> {

    const mutation = `
        mutation {
            changeTripTicketApprover(
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

        if (response.data && response.data.data && response.data.data.changeTripTicketApprover) {
            return {
                success: true,
                msg: 'Approver changed successfully!',
                data: response.data.data.changeTripTicketApprover
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