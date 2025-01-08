import type { CreateGasSlip, FindAllResponse, MutationResponse, GasSlip, PostGasSlip, UpdateGasSlip } from "./gas-slip.types";
import { sendRequest } from "~/utils/api"
import type { Employee } from "~/composables/hr/employee/employee.types";
import type { FuelType, GasStation } from "~/composables/common.types";

export async function fetchDataInSearchFilters(): Promise<{
    gas_slips: GasSlip[],
    employees: Employee[],
    vehicles: Vehicle[]
}> {
    const query = `
        query {
            gas_slips(page: 1, pageSize: 10) {
                data{
                    gas_slip_number
                }
            },
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            },
            vehicles(page: 1, pageSize: 10) {
                data {
                    id
                    vehicle_number
                    name
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let gas_slips = []
        let employees = []
        let vehicles = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.gas_slips && data.gas_slips.data) {
            gas_slips = data.gas_slips.data
        }

        if (data.vehicles && data.vehicles.data) {
            vehicles = data.vehicles.data
        }

        return {
            gas_slips,
            employees,
            vehicles,
        }

    } catch (error) {
        console.error(error);
        return {
            gas_slips: [],
            employees: [],
            vehicles: [],
        }
    }
}

export async function findByGasSlipNumber(gasSlipNumber: string): Promise<GasSlip | undefined> {
    const query = `
        query {
            gas_slip(gas_slip_number: "${gasSlipNumber}") {
                id
                gas_slip_number
                is_posted
                cancelled_at
                vehicle {
                    id 
                    vehicle_number
                    name 
                }
                driver {
                    id 
                    firstname
                    middlename
                    lastname
                }
                requested_by {
                    id 
                    firstname
                    middlename
                    lastname
                }
                created_at
                status
                cancelled_at
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.gas_slip) {
            return response.data.data.gas_slip;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<GasSlip | undefined> {

    console.log('isValidRcNumber(id)', isValidRcNumber(id));
    let args = ''
    if(isValidRcNumber(id)){
        args = `gas_slip_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            gas_slip(${args}) {
                id
                gas_slip_number
                vehicle {
                    id
                    total_unposted_gas_slips
                    vehicle_number
                    plate_number
                    name
                    classification_id
                    date_acquired
                    assignee {
                        id 
                        firstname 
                        middlename 
                        lastname
                    }
                }
                driver {
                    id 
                    firstname 
                    middlename 
                    lastname
                } 
                gas_station {
                    id 
                    name
                }
                fuel_type {
                    id 
                    name
                    }
                requested_by {
                    id 
                    firstname 
                    middlename 
                    lastname
                }
                with_container
                liter_in_text
                actual_liter
                price_per_liter
                purpose 
                used_on
                is_posted
                status
                cancelled_at
                can_update
                can_post
                can_print
                gas_slip_approvers{
                    approver {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    status
                    label
                    order
                    notes
                    date_approval
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.gas_slip) {
            return response.data.data.gas_slip;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findAll(payload: { 
    page: number, 
    pageSize: number, 
    vehicle_id?: string, 
    approval_status: APPROVAL_STATUS | null, 
    is_posted: boolean | null, 
    }): Promise<FindAllResponse> {

        console.log('payload', payload);
    
    let approval_status2 = null

    if (payload.approval_status) {
        approval_status2 = payload.approval_status
    }


    const query = `
      query {
        gas_slips(
          page: ${payload.page}, 
          pageSize: ${payload.pageSize}, 
          ${payload.vehicle_id ? `vehicle_id: "${payload.vehicle_id}",` : ""}
          ${payload.is_posted !== null && payload.is_posted !== undefined ? `is_posted: ${payload.is_posted},` : ""}
            approval_status: ${approval_status2},
        ) {
          data {
            id
            gas_slip_number
            status
            created_at
            is_posted
            cancelled_at
            vehicle {
                id 
                vehicle_number
                name 
            }
            driver {
                id 
                firstname
                middlename
                lastname
            }
            requested_by {
                id 
                firstname
                middlename
                lastname
            }
          }
          totalItems
          currentPage
          totalPages
        }
      }
    `;
  
    try {
      const response = await sendRequest(query);
      console.log('response', response.data);
      return response.data.data.gas_slips as FindAllResponse;
    } catch (error) {
      console.error(error);
      throw error;
    }
}

export async function fetchFormDataInCreate(): Promise<{
    vehicles: Vehicle[],
    employees: Employee[],
    department_heads: Employee[],
    gas_stations: GasStation[],
    fuel_types: FuelType[]
}> {

    const query = `
        query {
            employees(page: 1, pageSize: 1000) {
                data{
                    id
                    firstname
                    middlename
                    lastname
                    rank_number
                }
            },
            vehicles(page: 1, pageSize: 10) {
                data {
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
            }
            gas_stations {
                id 
                name
            }
            fuel_types {
                id 
                name
            }
            department_heads {
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
        let department_heads = []
        let vehicles = []
        let gas_stations = []
        let fuel_types = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.vehicles && data.vehicles.data) {
            vehicles = response.data.data.vehicles.data
        }

        if (data.department_heads) {
            department_heads = data.department_heads
        }

        if (data.gas_stations) {
            gas_stations = data.gas_stations
        }

        if (data.fuel_types) {
            fuel_types = data.fuel_types
        }


        return {
            employees,
            department_heads,
            vehicles,
            gas_stations,
            fuel_types
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            department_heads: [],
            vehicles: [],
            gas_stations: [],
            fuel_types: []
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    gas_slip: GasSlip | undefined,
    vehicles: Vehicle[],
    employees: Employee[],
    department_heads: Employee[],
    gas_stations: GasStation[],
    fuel_types: FuelType[]
}> {

    const query = `
        query {
            gas_slip(id: "${ id }") {
                id
                gas_slip_number
                vehicle {
                    id
                    total_unposted_gas_slips
                    vehicle_number
                    plate_number
                    name
                    classification_id
                    date_acquired
                    assignee {
                        id 
                        firstname 
                        middlename 
                        lastname
                    }
                }
                driver {
                    id 
                    firstname 
                    middlename 
                    lastname
                } 
                gas_station {
                    id 
                    name
                }
                fuel_type {
                    id 
                    name
                    }
                requested_by {
                    id 
                    firstname 
                    middlename 
                    lastname
                }
                with_container
                liter_in_text
                purpose 
                used_on
                status
                cancelled_at
                can_update
                gas_slip_approvers{
                    id
                    approver {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    status
                    label
                    order
                    notes
                    date_approval
                }
            }
            employees(page: 1, pageSize: 1000) {
                data{
                    id
                    firstname
                    middlename
                    lastname
                    rank_number
                }
            },
            vehicles(page: 1, pageSize: 10) {
                data {
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
            }
            gas_stations {
                id 
                name
            }
            fuel_types {
                id 
                name
            }
            department_heads {
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
        let department_heads = []
        let vehicles = []
        let gas_stations = []
        let fuel_types = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.gas_slip) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const gas_slip = data.gas_slip

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.vehicles && data.vehicles.data) {
            vehicles = response.data.data.vehicles.data
        }

        if (data.department_heads) {
            department_heads = data.department_heads
        }

        if (data.gas_stations) {
            gas_stations = data.gas_stations
        }

        if (data.fuel_types) {
            fuel_types = data.fuel_types
        }


        return {
            gas_slip,
            employees,
            department_heads,
            vehicles,
            gas_stations,
            fuel_types
        }

    } catch (error) {
        console.error(error);
        return {
            gas_slip: undefined,
            employees: [],
            department_heads: [],
            vehicles: [],
            gas_stations: [],
            fuel_types: []
        }
    }

}

export async function fetchGasSlipNumbers(payload: string): Promise<GasSlip[]> {
    const query = `
        query {
            gas_slips_by_gas_slip_number(gas_slip_number: "${payload}") {
                gas_slip_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.gas_slips_by_gas_slip_number

    } catch (error) {
        console.error(error);
        return []
    }
}

export async function create(input: CreateGasSlip): Promise<MutationResponse> {

    console.log('create', input);

    const approvers = input.approvers.map(i => {
        return `
        {
          approver_id: "${i.approver?.id}"
          label: "${i.label}"
          order: ${i.order}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createGasSlip(
                input: {
                    vehicle_id: "${input.vehicle?.id}"
                    driver_id: "${input.driver?.id}"
                    gas_station_id: ${input.gas_station?.id}
                    fuel_type_id: ${input.fuel_type?.id}
                    requested_by_id: "${input.requested_by?.id}"
                    with_container: ${input.with_container}
                    liter_in_text: "${input.liter_in_text}"
                    purpose: "${input.purpose.replace(/\n/g, '\\n')}"
                    used_on: "${input.used_on}"
                    approvers: [${approvers}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createGasSlip) {
            return {
                success: true,
                msg: 'Gas Slip created successfully!',
                data: response.data.data.createGasSlip
            };
        } else {

            console.error(JSON.stringify(response.data.errors))

            return {
                success: false,
                msg: response.data.errors?.[0]?.message || 'Failed to create Gas Slip. Please contact the system administrator',
            }
        }

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Gas Slip. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateGasSlip): Promise<MutationResponse> {

    const mutation = `
        mutation {
            updateGasSlip(
                id: "${id}",
                input: {
                    vehicle_id: "${input.vehicle?.id}"
                    driver_id: "${input.driver?.id}"
                    gas_station_id: ${input.gas_station?.id}
                    fuel_type_id: ${input.fuel_type?.id}
                    requested_by_id: "${input.requested_by?.id}"
                    with_container: ${input.with_container}
                    liter_in_text: "${input.liter_in_text}"
                    purpose: "${input.purpose.replace(/\n/g, '\\n')}"
                    used_on: "${input.used_on}"
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateGasSlip) {
            return {
                success: true,
                msg: 'Gas Slip updated successfully!',
                data: response.data.data.updateGasSlip
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Gas Slip. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelGasSlip(
                id: "${id}"
            ) {
                msg
                success
                cancelled_at
                cancelled_by
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.cancelGasSlip) {
            return response.data.data.cancelGasSlip
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel Gas Slip. Please contact system administrator'
        };
    }
}

export async function postGasSlip(id: string, input: PostGasSlip): Promise<MutationResponse> {

    const mutation = `
        mutation {
            postGasSlip(
                id: "${id}",
                input: {
                    actual_liter: ${input.actual_liter}
                    price_per_liter: ${input.price_per_liter}
                }
            ) {
                is_posted
                actual_liter
                price_per_liter
                can_post
                can_print
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.postGasSlip) {
            return {
                success: true,
                msg: 'Gas Slip posted successfully!',
                data: response.data.data.postGasSlip
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to post Gas Slip. Please contact system administrator'
        };
    }
}