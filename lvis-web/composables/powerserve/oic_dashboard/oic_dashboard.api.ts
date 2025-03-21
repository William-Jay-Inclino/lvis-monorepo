import type { Complaint } from "../complaint/complaint.types";

export async function init_data(): Promise<{ 
    escalated_complaints: Complaint[],
}> {


    const query = `
        query {
            escalated_complaints_by_group {
                id
                ref_number
                status {
                    id 
                    name
                    color_class
                }
                description
                created_at
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            escalated_complaints: response.data.data.escalated_complaints_by_group,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}