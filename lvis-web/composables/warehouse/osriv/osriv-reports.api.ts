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