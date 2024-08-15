import type { RrItem, UpdateRrItemsInput, UpdateRrItemsResponse } from "./rr-item.types";



export async function updateRrItems(rrItems: RrItem[]): Promise<UpdateRrItemsResponse> {

    const inputs = rrItems.map(item => {

        return `
        {
          id: "${item.id}"
          quantity_accepted: ${item.quantity_accepted}
        }`;
    }).join(', ');


    const mutation = `
        mutation {
            updateRrItems(
                inputs: [${inputs}]
            ) {
                success
                msg
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateRrItems) {
            return {
                success: response.data.data.updateRrItems.success,
                msg: 'Items updated!'
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update RR Items. Please contact system administrator',
        };
    }
}