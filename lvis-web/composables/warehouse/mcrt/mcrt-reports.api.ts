import axios from "axios";


export async function get_mcrt_summary_csv(payload: {
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
            `${apiUrl}/mcrt/summary-report-csv?${queryParams}`,
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