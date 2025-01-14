import axios from "axios";
import type { VehicleType } from "../vehicle/vehicle.types";


export async function fetchFilterData(): Promise<{
    vehicles: Vehicle[],
}> {

    const query = `
        query {
            vehicles(page: 1, pageSize: 10) {
                data {
                    id
                    vehicle_number
                    plate_number
                    name
                    classification_id
                    date_acquired
                    status
                    assignee {
                        id 
                        firstname 
                        middlename 
                        lastname
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let vehicles = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.vehicles && data.vehicles.data) {
            vehicles = response.data.data.vehicles.data
        }
        return {
            vehicles,
        }

    } catch (error) {
        console.error(error);
        return {
            vehicles: [],
        }
    }

}


export async function get_trip_ticket_summary_report(payload: {
    startDate: string,
    endDate: string,
    vehicleNumber?: string,
    vehicleType?: VehicleType,
    allVehicles?: boolean,
    authUser: AuthUser,
    apiUrl: string
}): Promise<{ pdfUrl: string }> {

    const { startDate, endDate, vehicleNumber, vehicleType, allVehicles, authUser, apiUrl } = payload

    console.log('payload', payload);

    try {

        const accessToken = authUser.access_token

        const _filters = {
            startDate: startDate,
            endDate: endDate,
            vehicleType: vehicleType,
            allVehicles: allVehicles,
            vehicleNumber: vehicleNumber,
        }

        console.log('_filters', _filters);

        // Convert filters to query parameters
        const queryParams = new URLSearchParams(
            Object.entries(_filters).reduce((acc: Record<string, string>, [key, value]) => {
                if (value !== undefined && value !== null) {
                    acc[key] = String(value);
                }
                return acc;
            }, {})
        );

        const response = await axios.get(
            `${apiUrl}/trip-ticket/summary-report/?${queryParams}`,
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