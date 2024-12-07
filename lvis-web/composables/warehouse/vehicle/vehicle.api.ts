import { sendRequest } from "~/utils/api"
import type { Vehicle, CreateVehicleInput, MutationResponse, UpdateVehicleInput, FindAllResponse } from "./vehicle.types";
import type { Employee } from "~/composables/system/employee/employee.types";



export async function fetchDataInSearchFilters(): Promise<{
    vehicles: Vehicle[],
    employees: Employee[],
}> {
    const query = `
        query {
            vehicles(page: 1, pageSize: 10) {
                data {
                    id
                    vehicle_number
                    name
                }
            }
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
        let vehicles = []
        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.vehicles && data.vehicles.data) {
            vehicles = data.vehicles.data
        }

        if (data.employees && data.employees.data) {
            employees = data.employees.data
        }

        return {
            vehicles,
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            vehicles: [],
            employees: [],
        }
    }
}

export async function findAll(payload: { 
    page: number, 
    pageSize: number, 
    assignee_id: string | null, 
}): Promise<FindAllResponse> {

    const { page, pageSize, assignee_id } = payload;

    let assignee_id2 = null

    if (assignee_id) {
        assignee_id2 = `"${assignee_id}"`
    }

    const query = `
        query {
            vehicles(
                page: ${page},
                pageSize: ${pageSize},
                assignee_id: ${assignee_id2},
            ) {
                data {
                    id
                    vehicle_number
                    plate_number
                    classification_id
                    assignee {
                        id 
                        firstname
                        middlename
                        lastname
                    }
                    name
                    date_acquired
                    status
                }
                totalItems
                currentPage
                totalPages
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.vehicles;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findByVehicleNumber(vehicle_number: string): Promise<Vehicle | undefined> {
    const query = `
        query {
            vehicle(vehicle_number: "${vehicle_number}") {
                id
                vehicle_number
                plate_number
                classification_id
                assignee {
                    id 
                    firstname
                    middlename
                    lastname
                }
                name
                date_acquired
                status
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.vehicle) {
            return response.data.data.vehicle;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}
export async function findOne(id: string): Promise<Vehicle | undefined> {
    const query = `
        query {
            vehicle(id: "${id}") {
                id
                vehicle_number
                plate_number
                classification_id
                total_unposted_gas_slips
                rf_id
                assignee {
                    id 
                    firstname
                    middlename
                    lastname
                }
                name
                date_acquired
                status
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.vehicle) {
            return response.data.data.vehicle;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateVehicleInput): Promise<MutationResponse> {

    const mutation = `
        mutation {
            createVehicle(
                input: {
                    vehicle_number: "${input.vehicle_number.toUpperCase()}",
                    plate_number: "${input.plate_number.toUpperCase()}",
                    name: "${input.name}",
                    classification_id: ${input.classification?.id},
                    assignee_id: "${input.assignee?.id}",
                    date_acquired: "${input.date_acquired}",
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createVehicle) {
            return {
                success: true,
                msg: 'Vehicle created successfully!',
                data: response.data.data.createVehicle
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Vehicle. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: UpdateVehicleInput): Promise<MutationResponse> {

    const mutation = `
        mutation {
            updateVehicle(
                id: "${id}",
                input: {
                    vehicle_number: "${input.vehicle_number.toUpperCase()}",
                    plate_number: "${input.plate_number.toUpperCase()}",
                    name: "${input.name}",
                    classification_id: ${input.classification?.id},
                    assignee_id: "${input.assignee?.id}",
                    date_acquired: "${input.date_acquired}",
                }
            ) {
                success
                msg 
                data {
                    id
                }
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateVehicle) {
            return response.data.data.updateVehicle
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Vehicle. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeVehicle(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeVehicle) {
            return response.data.data.removeVehicle
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Vehicle. Please contact system administrator'
        }
    }
}

export async function fetchFormDataInCreate(): Promise<{
    employees: Employee[],
}> {

    const query = `
        query {
            employees(page: 1, pageSize: 500) {
                data{
                    id
                    firstname
                    middlename
                    lastname
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        return {
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    vehicle: Vehicle | undefined,
    employees: Employee[],
}> {

    const query = `
        query {
            vehicle(id: "${id}") {
                id
                vehicle_number
                plate_number
                name
                classification_id
                date_acquired
                total_unposted_gas_slips
                assignee {
                    id 
                    firstname 
                    middlename 
                    lastname
                }
            }
            employees(page: 1, pageSize: 500) {
                data{
                    id
                    firstname
                    middlename
                    lastname
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees: Employee[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.vehicle) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const vehicle = data.vehicle

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        return {
            vehicle,
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            vehicle: undefined,
            employees: [],
        }
    }


}

export async function assignRFID(vehicleId: string, rfID: string): Promise<MutationResponse> {

    const mutation = `
        mutation {
            updateVehicle(
                id: "${vehicleId}",
                input: {
                    rf_id: "${rfID}",
                }
            ) {
                success
                msg
                data {
                    id
                    rf_id
                }
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateVehicle) {

            return response.data.data.updateVehicle

        } else {

            console.error(JSON.stringify(response.data.errors))

            return {
                success: false,
                msg: response.data.errors?.[0]?.message || 'Failed to assign RFID. Please contact the system administrator',
            }

        }

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to assign RFID. Please contact the system administrator'
        }

    }
}

export async function fetchVehicles(payload: string): Promise<Vehicle[]> {
    const query = `
        query {
            vehiclesByName(input: "${payload}") {
                id
                vehicle_number
                plate_number
                name
                classification_id
                date_acquired
                status
                total_unposted_gas_slips
                assignee {
                    id 
                    firstname 
                    middlename 
                    lastname
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.vehiclesByName

    } catch (error) {
        console.error(error);
        return []
    }
}