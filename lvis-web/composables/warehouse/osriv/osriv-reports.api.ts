import axios from "axios";
import type { Department } from "~/composables/hr/department/department";
import type { Employee } from "~/composables/hr/employee/employee.types";


export async function fetchFilterData(): Promise<{
    departments: Department[],
    employees: Employee[],
}> {

    const query = `
        query {
            departments {
                id
                code 
                name
            },
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let departments = []
        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.departments) {
            departments = data.departments
        }

        if (data.employees && data.employees.data) {
            employees = data.employees.data
        }

        return {
            departments,
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            departments: [],
            employees: [],
        }
    }

}


export async function get_osriv_summary_report(payload: {
    startDate: string,
    endDate: string,
    departmentIds: string[],
    requested_by_id: string | null,
    code: string,
    authUser: AuthUser,
    apiUrl: string
}): Promise<{ pdfUrl: string }> {

    const { startDate, endDate, departmentIds, requested_by_id, code, authUser, apiUrl } = payload

    console.log('payload', payload);

    try {

        const accessToken = authUser.access_token

        const queryParams = new URLSearchParams();

        queryParams.append('startDate', startDate);
        queryParams.append('endDate', endDate);
        queryParams.append('code', code);
        
        if (departmentIds.length > 0) {
            const ids = Array.isArray(departmentIds) ? departmentIds : [departmentIds]; // Ensure it's always an array
            ids.forEach((id) => queryParams.append('departmentIds', id));
        }
        
        if (requested_by_id) {
            queryParams.append('requested_by_id', requested_by_id);
        }

        const response = await axios.get(
            `${apiUrl}/osriv/summary-report/?${queryParams}`,
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