import axios from "axios";


export async function get_seriv_summary_report(payload: {
    startDate: string,
    endDate: string,
    authUser: AuthUser,
    apiUrl: string
}): Promise<{ pdfUrl: string }> {

    const { startDate, endDate, authUser, apiUrl } = payload

    console.log('payload', payload);

    try {

        const accessToken = authUser.access_token

        const queryParams = new URLSearchParams();

        queryParams.append('startDate', startDate);
        queryParams.append('endDate', endDate);

        const response = await axios.get(
            `${apiUrl}/seriv/summary-report/?${queryParams}`,
            {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        console.log('response', response);

        const blob = new Blob([response.data], { type: 'application/pdf' });

        return {
            pdfUrl: window.URL.createObjectURL(blob)
        }

    } catch (error) {
        console.error('Error loading PDF:', error);
        return { pdfUrl: '' }
    }

}


export async function get_seriv_summary_csv(payload: {
    startDate: string,
    endDate: string,
    authUser: AuthUser,
    apiUrl: string
}): Promise<{ csvUrl: string }> {

    const { startDate, endDate, authUser, apiUrl } = payload;

    try {
        const accessToken = authUser.access_token;

        const queryParams = new URLSearchParams();
        queryParams.append('startDate', startDate);
        queryParams.append('endDate', endDate);

        const response = await axios.get(
            `${apiUrl}/seriv/summary-report-csv?${queryParams}`,
            {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const blob = new Blob([response.data], { type: 'text/csv' });

        return {
            csvUrl: window.URL.createObjectURL(blob)
        };

    } catch (error) {
        console.error('Error loading CSV:', error);
        return { csvUrl: '' };
    }
}