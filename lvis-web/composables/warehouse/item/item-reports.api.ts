import axios from "axios";
import type { ItemType } from "./item.type";

export async function fetchFilterData(): Promise<{
    item_types: ItemType[],
}> {

    const query = `
        query {
            item_types {
                id
                name
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let item_types = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.item_types) {
            item_types = data.item_types
        }

        return {
            item_types,
        }

    } catch (error) {
        console.error(error);
        return {
            item_types: [],
        }
    }

}


export async function get_item_transactions_summary_report(payload: {
    startDate: string;
    endDate: string;
    item_type_ids: number[];
    authUser: AuthUser;
    apiUrl: string;
    filterByCode: boolean;
}): Promise<{ pdfUrl: string }> {
    const { startDate, endDate, authUser, apiUrl, filterByCode, item_type_ids } = payload;

    console.log('Payload:', payload);

    try {
        const accessToken = authUser.access_token;

        // Build query parameters
        const queryParams = new URLSearchParams({
            startDate,
            endDate,
        });

        // Append item_type_ids as a comma-separated string (better for backend parsing)
        if (item_type_ids.length > 0) {
            queryParams.append('item_type_ids', item_type_ids.join(','));
        }

        // Determine endpoint
        const endPoint = filterByCode ? 'summary-report-transactions-by-code' : 'summary-report-transactions';

        // Send request
        const response = await axios.get(`${apiUrl}/item/${endPoint}/?${queryParams.toString()}`, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Response:', response);

        // Create a URL for the PDF blob
        const blob = new Blob([response.data], { type: 'application/pdf' });

        return {
            pdfUrl: window.URL.createObjectURL(blob),
        };
    } catch (error) {
        console.error('Error loading PDF:', error);
        return { pdfUrl: '' };
    }
}
