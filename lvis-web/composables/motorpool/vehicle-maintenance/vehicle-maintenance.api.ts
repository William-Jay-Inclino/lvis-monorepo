import { sendRequest } from "~/utils/api"
import type { VehicleMaintenance, CreateVehicleMaintenance, MutationResponse, UpdateVehicleMaintenance, FindAllResponse } from "./vehicle-maintenance.types";
import type { VehicleService } from "../vehicle-service/vehicle-service.types";
import type { ServiceCenter } from "../service-center/service-center.types";



export async function fetchDataInSearchFilters(): Promise<{
    vehicles: Vehicle[],
    service_centers: ServiceCenter[],
}> {
    const query = `
        query {
            vehicles(page: 1, pageSize: 10) {
                data {
                    id
                    name
                    vehicle_number
                }
            }
            service_centers {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        let vehicles = []
        let service_centers = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.vehicles && data.vehicles.data) {
            vehicles = data.vehicles.data
        }

        if (data.service_centers) {
            service_centers = data.service_centers
        }

        return {
            vehicles,
            service_centers,
        }

    } catch (error) {
        console.error(error);
        return {
            vehicles: [],
            service_centers: [],
        }
    }
}

export async function findAll(payload: { 
    page: number, 
    pageSize: number, 
    vehicle_id: string | null, 
    service_center_id: string | null, 
    service_date: Date | null, 
}): Promise<FindAllResponse> {

    const { page, pageSize, vehicle_id, service_center_id, service_date } = payload;

    let vehicle_id2 = null
    let service_center_id2 = null
    let service_date2 = null

    if (vehicle_id) {
        vehicle_id2 = `"${vehicle_id}"`
    }

    if (service_center_id) {
        service_center_id2 = `"${service_center_id}"`
    }

    if (service_date) {
        service_date2 = `"${service_date}"`
    }

    const query = `
        query {
            vehicle_maintenances(
                page: ${page},
                pageSize: ${pageSize},
                vehicle_id: ${vehicle_id2},
                service_center_id: ${service_center_id2},
                service_date: ${service_date2},
            ) {
                data {
                    id
                    ref_number
                    vehicle {
                        id 
                        name
                        vehicle_number
                    }
                    service_center {
                        id 
                        name
                    }
                    service_date
                    next_service_date
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
        return response.data.data.vehicle_maintenances;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findByRefNumber(ref_number: string): Promise<VehicleMaintenance | undefined> {
    const query = `
        query {
            vehicle_maintenance(ref_number: "${ref_number}") {
                id
                ref_number
                vehicle {
                    id 
                    name
                    vehicle_number
                }
                service_center {
                    id 
                    name
                }
                service_date
                next_service_date
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.vehicle_maintenance) {
            return response.data.data.vehicle_maintenance;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<VehicleMaintenance | undefined> {
    const query = `
        query {
            vehicle_maintenance(id: "${id}") {
                id
                ref_number
                vehicle {
                    id 
                    name
                    vehicle_number
                }
                service_center {
                    id 
                    name
                }
                service_date
                next_service_date
                service_mileage
                next_service_mileage
                cost 
                remarks
                performed_by
                services {
                    id
                    name 
                    note
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.vehicle_maintenance) {
            return response.data.data.vehicle_maintenance;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateVehicleMaintenance): Promise<MutationResponse> {

    const services = input.services.map(i => {
        return `
        {
          service_id: "${i.service?.id}"
          note: "${i.note}"
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createVehicleMaintenance(
                input: {
                    vehicle_id: "${input.vehicle?.id}",
                    service_center_id: "${input.service_center?.id}",
                    service_date: "${input.service_date}",
                    service_mileage: ${input.service_mileage},
                    next_service_date: "${input.next_service_date}",
                    next_service_mileage: ${input.next_service_mileage},
                    cost: ${input.cost},
                    remarks: "${input.remarks}",
                    performed_by: "${input.performed_by}",
                    services: [${services}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createVehicleMaintenance) {
            return {
                success: true,
                msg: 'Vehicle Maintenance created successfully!',
                data: response.data.data.createVehicleMaintenance
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Vehicle Maintenance. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: UpdateVehicleMaintenance): Promise<MutationResponse> {

    const services = input.services.map(i => {
        return `
        {
          service_id: "${i.service?.id}"
          note: "${i.note}"
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            updateVehicleMaintenance(
                id: "${id}",
                input: {
                    vehicle_id: "${input.vehicle?.id}",
                    service_center_id: "${input.service_center?.id}",
                    service_date: "${input.service_date}",
                    service_mileage: ${input.service_mileage},
                    next_service_date: "${input.next_service_date}",
                    next_service_mileage: ${input.next_service_mileage},
                    cost: ${input.cost},
                    remarks: "${input.remarks}",
                    performed_by: "${input.performed_by}",
                    services: [${services}]
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateVehicleMaintenance) {
            return response.data.data.updateVehicleMaintenance
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update VehicleMaintenance. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeVehicleMaintenance(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeVehicleMaintenance) {
            return response.data.data.removeVehicleMaintenance
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove VehicleMaintenance. Please contact system administrator'
        }
    }
}

export async function fetchFormDataInCreate(): Promise<{
    vehicles: Vehicle[],
    services: VehicleService[],
    service_centers: ServiceCenter[],
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
            vehicle_services {
                id 
                name
            }
            service_centers {
                id 
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let vehicles = []
        let services = []
        let service_centers = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.vehicles && data.vehicles.data) {
            vehicles = response.data.data.vehicles.data
        }

        if (data.vehicle_services) {
            services = data.vehicle_services
        }

        if (data.service_centers) {
            service_centers = data.service_centers
        }

        return {
            vehicles,
            services,
            service_centers,
        }

    } catch (error) {
        console.error(error);
        return {
            vehicles: [],
            services: [],
            service_centers: [],
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    vehicles: Vehicle[],
    services: VehicleService[],
    service_centers: ServiceCenter[],
    vehicle_maintenance: VehicleMaintenance | undefined
}> {

    const query = `
        query {
            vehicle_maintenance(id: "${id}") {
                id
                ref_number
                vehicle {
                    id 
                    name
                    vehicle_number
                }
                service_center {
                    id 
                    name
                }
                service_date
                next_service_date
                service_mileage
                next_service_mileage
                cost 
                remarks
                performed_by
                services {
                    id
                    name 
                    note
                }
            }
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
            services(page: 1, pageSize: 200) {
                data {
                    id 
                    name
                }
            }
            service_centers(page: 1, pageSize: 200) {
                data {
                    id 
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let vehicles = []
        let services = []
        let service_centers = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.vehicle_maintenance) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const vehicle_maintenance = data.vehicle_maintenance

        if (data.vehicles && data.vehicles.data) {
            vehicles = response.data.data.vehicles.data
        }

        if (data.services && data.services.data) {
            services = response.data.data.services.data
        }

        if (data.service_centers && data.service_centers.data) {
            service_centers = response.data.data.service_centers.data
        }

        return {
            vehicle_maintenance,
            vehicles,
            service_centers,
            services,
        }

    } catch (error) {
        console.error(error);
        return {
            vehicle_maintenance: undefined,
            vehicles: [],
            service_centers: [],
            services: [],
        }
    }


}

export async function fetchRefNumbers(payload: string): Promise<VehicleMaintenance[]> {
    const query = `
        query {
            vehicle_maintenances_by_ref_number(input: "${payload}") {
                ref_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.vehicle_maintenances_by_ref_number

    } catch (error) {
        console.error(error);
        return []
    }
}