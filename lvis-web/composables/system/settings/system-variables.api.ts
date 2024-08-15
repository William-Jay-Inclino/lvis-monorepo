import type { MutationResponse } from "./system-variable.types";


export async function fetchFormData(): Promise<{
    employees: Employee[],
    budgetOfficers: Employee[],
    financeManagers: Employee[],
}> {


    const query = `
        query {
            employees(page: 1, pageSize: 100) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            },
            budget_officers{
                id 
                firstname
                middlename
                lastname
            }
            finance_managers{
                id 
                firstname
                middlename
                lastname
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []
        let budgetOfficers = []
        let financeManagers = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.budget_officers) {
            budgetOfficers = data.budget_officers
        }

        if (data.finance_managers) {
            financeManagers = data.finance_managers
        }

        return {
            employees,
            budgetOfficers,
            financeManagers,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            budgetOfficers: [],
            financeManagers: [],
        }
    }


}

export async function addBudgetOfficer(employeeId: string): Promise<MutationResponse> {
    const mutation = `
        mutation {
            updateEmployee(id: "${employeeId}", input: {
                is_budget_officer: true
            }) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateEmployee) {
            return {
                success: true,
                msg: 'Budget Officer Added!',
                data: response.data.data.updateEmployee
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to add budget Officer. Please contact system administrator'
        }

    }
}

export async function removeBudgetOfficer(employeeId: string): Promise<MutationResponse> {
    const mutation = `
        mutation {
            updateEmployee(id: "${employeeId}", input: {
                is_budget_officer: false
            }) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateEmployee) {
            return {
                success: true,
                msg: 'Budget Officer Removed!',
                data: response.data.data.updateEmployee
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove budget Officer. Please contact system administrator'
        }

    }
}

export async function addFinanceManager(employeeId: string): Promise<MutationResponse> {
    const mutation = `
        mutation {
            updateEmployee(id: "${employeeId}", input: {
                is_finance_manager: true
            }) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateEmployee) {
            return {
                success: true,
                msg: 'Finance Manager Added!',
                data: response.data.data.updateEmployee
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to add finance manager. Please contact system administrator'
        }

    }
}

export async function removeFinanceManager(employeeId: string): Promise<MutationResponse> {
    const mutation = `
        mutation {
            updateEmployee(id: "${employeeId}", input: {
                is_finance_manager: false
            }) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateEmployee) {
            return {
                success: true,
                msg: 'Finance Manager Removed!',
                data: response.data.data.updateEmployee
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove finance manager. Please contact system administrator'
        }

    }
}