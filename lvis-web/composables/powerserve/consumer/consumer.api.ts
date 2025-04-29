import axios from "axios";
import type { Consumer } from "./consumer.types";



interface ApiResponse {
  status_message?: string;
  details?: Array<{
    'Accnt No'?: string;
    'Name'?: string;
    'Serial No'?: string;
    [key: string]: any;
  }>;
}

export async function get_consumers(payload: { consumer_name: string, baseUrl: string }): Promise<Consumer[]> {

    const API_TIMEOUT = 5000;
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000;

   const { consumer_name, baseUrl } = payload

    const endpoint = `${baseUrl}/api/fetch-account/name/${encodeURIComponent(consumer_name)}`;

    console.log('endpoint', endpoint);

    let attempt = 0;
    let lastError: unknown = null;

    while (attempt <= MAX_RETRIES) {
        try {
            attempt++;
            const response = await axios.get<ApiResponse>(endpoint, {
                timeout: API_TIMEOUT,
                // Frontend-specific config
            });


            if (response.data?.status_message === 'success' && response.data.details) {
                return response.data.details
                .map(item => {
                    const account_number = item['Accnt No']?.trim();
                    const name = item['Name']?.trim();
                    const meter_number = item['Serial No']?.trim();
                    const address = item['Address']?.trim();

                    return account_number && name && meter_number && address
                    ? { id: account_number, name, meter_number, address }
                    : null;
                })
                .filter((consumer): consumer is Consumer => consumer !== null);
            }

            return [];

        } catch (error) {
            lastError = error;
            
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                console.warn(`Request timeout (attempt ${attempt}/${MAX_RETRIES + 1})`);
                } else if (error.response) {
                console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
                if (error.response.status >= 400 && error.response.status < 500) {
                    break;
                }
                } else if (error.request) {
                console.error('No response received from server');
                } else {
                console.error('Request setup error:', error.message);
                }
            } else {
                console.error('Unexpected error:', error);
            }

            if (attempt <= MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }

    console.error(`Failed after ${attempt} attempts. Last error:`, lastError);
    return [];
}