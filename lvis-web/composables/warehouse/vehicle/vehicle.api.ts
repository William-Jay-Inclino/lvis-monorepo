import { sendRequest } from "~/utils/api"
import type { Vehicle, CreateVehicleInput, MutationResponse, UpdateVehicleInput } from "./vehicle.types";
import type { Employee } from "~/composables/system/employee/employee.types";



export async function findAll(): Promise<Vehicle[]> {

    const query = `
        query {
            vehicles {
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
        return response.data.data.vehicles;
    } catch (error) {
        console.error(error);
        throw error
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
                    vehicle_number: "${input.vehicle_number}",
                    plate_number: "${input.plate_number}",
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
                    vehicle_number: "${input.vehicle_number}",
                    plate_number: "${input.plate_number}",
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

        if (response.data && response.data.data && response.data.data.updateVehicle) {
            return {
                success: true,
                msg: 'Vehicle updated successfully!',
                data: response.data.data.updateVehicle
            }
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