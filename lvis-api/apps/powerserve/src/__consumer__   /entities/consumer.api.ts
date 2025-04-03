import axios from "axios";
import { Consumer } from "./consumer.entity";
import * as https from 'https'; 

interface ApiResponse {
    status_message?: string;
    details?: Array<{
        'Accnt No'?: string;
        'Name'?: string;
        'Serial No'?: string;
        [key: string]: any;
    }>;
}


export async function get_consumer(payload: { account_number: string }): Promise<Consumer | null> {

    const DEFAULT_TIMEOUT = 5000;
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000;

    const endpoint = `${ process.env.LEYECO_API }/api/fetch-account/account_no/${encodeURIComponent(payload.account_number)}`;

    const axiosInstance = axios.create({
        timeout: DEFAULT_TIMEOUT,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });

    let attempt = 0;
    let lastError: unknown = null;

    while (attempt <= MAX_RETRIES) {
        try {
            attempt++;
            const response = await axiosInstance.get<ApiResponse>(endpoint);

            if (response.data?.status_message === 'success' && response.data.details?.[0]) {
                const consumer = response.data.details[0];
                return {
                    id: consumer['Accnt No']?.trim() || 'N/A',
                    name: consumer['Name']?.trim() || 'N/A',
                    meter_number: consumer['Serial No']?.trim() || 'N/A',
                };
            }

            return null;

        } catch (error) {
            lastError = error;
            
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    console.warn(`Request timeout (attempt ${attempt}/${MAX_RETRIES + 1})`);
                } else if (error.response) {
                    // Server responded with error status (4xx, 5xx)
                    console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
                    // Don't retry on client errors (4xx)
                    if (error.response.status >= 400 && error.response.status < 500) {
                        break;
                    }
                } else if (error.request) {
                    // Request was made but no response received
                    console.error('No response received from server');
                } else {
                    // Something happened in setting up the request
                    console.error('Request setup error:', error.message);
                }
            } else {
                console.error('Unexpected error:', error);
            }

            // Wait before retrying (if we're going to retry)
            if (attempt <= MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }

    console.error(`Failed after ${attempt} attempts. Last error:`, lastError);
    return null;
}
