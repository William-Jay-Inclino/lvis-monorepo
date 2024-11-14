import type { CreateTripTicket, FindAllResponse, MutationResponse, TripTicket } from "./trip-ticket.types";
import { sendRequest } from "~/utils/api"
import type { Employee } from "~/composables/system/employee/employee.types";

export async function fetchDataInSearchFilters(): Promise<{
    trip_tickets: TripTicket[],
    employees: Employee[],
    vehicles: Vehicle[]
}> {
    const query = `
        query {
            trip_tickets(page: 1, pageSize: 10) {
                data{
                    trip_number
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
            vehicles {
                vehicle_number
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let trip_tickets = []
        let employees = []
        let vehicles = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.trip_tickets && data.trip_tickets.data) {
            trip_tickets = data.trip_tickets.data
        }

        if(data.vehicles) {
            vehicles = data.vehicles
        }

        return {
            trip_tickets,
            employees,
            vehicles,
        }

    } catch (error) {
        console.error(error);
        return {
            trip_tickets: [],
            employees: [],
            vehicles: [],
        }
    }
}

export async function findByTripNumber(tripNumber: string): Promise<TripTicket | undefined> {
    const query = `
        query {
            trip_ticket(trip_number: "${tripNumber}") {
                id
                trip_number
                vehicle {
                    id
                    vehicle_number
                }
                driver {
                    id 
                    firstname
                    middlename
                    lastname
                }
                start_time
                status
                cancelled_at
                created_at
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.trip_ticket) {
            return response.data.data.trip_ticket;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<TripTicket | undefined> {

    console.log('isValidRcNumber(id)', isValidRcNumber(id));
    let args = ''
    if(isValidRcNumber(id)){
        args = `trip_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            trip_ticket(${args}) {
                id
                trip_number
                vehicle {
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
                passengers 
                destination
                purpose 
                start_time 
                end_time 
                actual_start_time 
                actual_end_time 
                is_operation
                is_stay_in 
                is_personal 
                is_out_of_coverage
                prepared_by {
                    id 
                    firstname 
                    middlename 
                    lastname
                }
                status
                can_update
                cancelled_at
                trip_ticket_approvers{
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

        if (response.data && response.data.data && response.data.data.trip_ticket) {
            return response.data.data.trip_ticket;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function get_scheduled_trips(startDate: Date, endDate: Date): Promise<TripTicket[]> {

    const startDateString = startDate.toLocaleDateString('en-US')
    const endDateString = endDate.toLocaleDateString('en-US')

    const query = `
        query {
            scheduled_trips(
                startDate: "${startDateString}",
                endDate: "${endDateString}",
            ) {   
                id 
                trip_number
                driver {
                    id
                    firstname
                    middlename
                    lastname
                }
                start_time 
                end_time
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.scheduled_trips) {
            return response.data.data.scheduled_trips;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return []
    }
}

export async function findAll(payload: { 
    page: number, 
    pageSize: number, 
    vehicle_id?: string, 
    driver_id?: string, 
    date_prepared?: string, 
    estimated_departure?: string 
  }): Promise<FindAllResponse> {
  
    const query = `
      query {
        trip_tickets(
          page: ${payload.page}, 
          pageSize: ${payload.pageSize}, 
          ${payload.vehicle_id ? `vehicle_id: "${payload.vehicle_id}",` : ""}
          ${payload.driver_id ? `driver_id: "${payload.driver_id}",` : ""}
          ${payload.date_prepared ? `date_prepared: "${payload.date_prepared}",` : ""}
          ${payload.estimated_departure ? `estimated_departure: "${payload.estimated_departure}",` : ""}
        ) {
          data {
            id
            trip_number
            vehicle {
                id
                vehicle_number
            }
            driver {
                id 
                firstname
                middlename
                lastname
            }
            start_time
            status
            cancelled_at
            created_at
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
      return response.data.data.trip_tickets as FindAllResponse;
    } catch (error) {
      console.error(error);
      throw error;
    }
}

export async function fetchFormDataInCreate(): Promise<{
    vehicles: Vehicle[],
    employees: Employee[],
    fmsd_chief: Employee | null,
    general_manager: Employee | null,
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
            vehicles {
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
            fmsd_chief {
                id 
                firstname
                middlename
                lastname
            }
            general_manager {
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
        let vehicles = []
        let fmsd_chief: Employee | null = null
        let general_manager: Employee | null = null

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.vehicles) {
            vehicles = data.vehicles
        }

        if (data.fmsd_chief) {
            fmsd_chief = data.fmsd_chief
        }

        if (data.general_manager) {
            general_manager = data.general_manager
        }

        return {
            employees,
            vehicles,
            fmsd_chief,
            general_manager,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            vehicles: [],
            fmsd_chief: null,
            general_manager: null
        }
    }


}

export async function fetchTripNumbers(payload: string): Promise<TripTicket[]> {
    const query = `
        query {
            trip_tickets_by_trip_number(trip_number: "${payload}") {
                trip_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.trip_tickets_by_trip_number

    } catch (error) {
        console.error(error);
        return []
    }
}

export async function create(input: CreateTripTicket): Promise<MutationResponse> {

    console.log('create', input);

    const passengers = input.passengers.join(", ");

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
            createTripTicket(
                input: {
                    vehicle_id: "${input.vehicle?.id}"
                    driver_id: "${input.driver?.id}"
                    passengers: "${passengers}"
                    destination: "${input.destination}"
                    purpose: "${input.purpose}"
                    start_time: "${input.start_time}"
                    end_time: "${input.end_time}"
                    is_operation: ${input.is_operation}
                    is_stay_in: ${input.is_stay_in}
                    is_personal: ${input.is_personal}
                    is_out_of_coverage: ${input.is_out_of_coverage}
                    prepared_by_id: "${input.prepared_by?.id}"
                    approvers: [${approvers}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createTripTicket) {
            return {
                success: true,
                msg: 'Trip Ticket created successfully!',
                data: response.data.data.createTripTicket
            };
        } else {

            console.error(JSON.stringify(response.data.errors))

            return {
                success: false,
                msg: response.data.errors?.[0]?.message || 'Failed to create Trip Ticket. Please contact the system administrator',
            }
        }

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Trip Ticket. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelTripTicket(
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

        if (response.data && response.data.data && response.data.data.cancelTripTicket) {
            return response.data.data.cancelTripTicket
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel Trip Ticket. Please contact system administrator'
        };
    }
}

export async function remove_actual_start_time(id: string): Promise<MutationResponse> {

    const mutation = `
        mutation {
            removeActualStartTime(
                id: "${id}"
            ) {
                success
                msg 
                data {
                    actual_start_time
                    status
                }
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.removeActualStartTime) {

            return response.data.data.removeActualStartTime

        } else {

            console.error(JSON.stringify(response.data.errors))

            return {
                success: false,
                msg: response.data.errors?.[0]?.message || 'Failed to remove actual start time. Please contact the system administrator',
            }
        }

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update remove start time. Please contact system administrator'
        };
    }
}

export async function remove_actual_end_time(id: string): Promise<MutationResponse> {

    const mutation = `
        mutation {
            removeActualEndTime(
                id: "${id}"
            ) {
                success
                msg 
                data {
                    actual_end_time
                    status
                }
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.removeActualEndTime) {

            return response.data.data.removeActualEndTime

        } else {

            console.error(JSON.stringify(response.data.errors))

            return {
                success: false,
                msg: response.data.errors?.[0]?.message || 'Failed to remove actual end time. Please contact the system administrator',
            }
        }

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove actual end time. Please contact system administrator'
        };
    }
}

export async function update_actual_start_time(id: string, start_time: string): Promise<MutationResponse> {

    const mutation = `
        mutation {
            updateActualStartTime(
                input: {
                    trip_ticket_id: "${id}",
                    actual_start_time: "${ start_time }"
                }
            ) {
                success
                msg 
                data {
                    actual_start_time
                    status
                }
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateActualStartTime) {

            return response.data.data.updateActualStartTime

        } else {

            console.error(JSON.stringify(response.data.errors))

            return {
                success: false,
                msg: response.data.errors?.[0]?.message || 'Failed to update actual start time. Please contact the system administrator',
            }
        }

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update actual start time. Please contact system administrator'
        };
    }
}

export async function update_actual_end_time(id: string, end_time: string): Promise<MutationResponse> {

    const mutation = `
        mutation {
            updateActualEndTime(
                input: {
                    trip_ticket_id: "${id}",
                    actual_end_time: "${ end_time }"
                }
            ) {
                success
                msg 
                data {
                    actual_end_time
                    status
                }
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateActualEndTime) {

            return response.data.data.updateActualEndTime

        } else {

            console.error(JSON.stringify(response.data.errors))

            return {
                success: false,
                msg: response.data.errors?.[0]?.message || 'Failed to update actual end time. Please contact the system administrator',
            }
        }

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update actual end time. Please contact system administrator'
        };
    }
}

export async function updateActualTime(rf_id: string): Promise<MutationResponse> {

    const mutation = `
        mutation {
            updateActualTime(
                input: {
                    rf_id: "${ rf_id }"
                }
            ) {
                success
                msg
                data {
                    id
                    trip_number
                    vehicle {
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
                    passengers 
                    destination
                    purpose 
                    start_time 
                    end_time 
                    actual_start_time 
                    actual_end_time 
                    is_operation
                    is_stay_in 
                    is_personal 
                    is_out_of_coverage
                    prepared_by {
                        id 
                        firstname 
                        middlename 
                        lastname
                    }
                    status
                    cancelled_at
                    trip_ticket_approvers{
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
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateActualTime) {

            return response.data.data.updateActualTime

        } else {

            console.error(JSON.stringify(response.data.errors))

            return {
                success: false,
                msg: response.data.errors?.[0]?.message || 'Failed to update actual time. Please contact the system administrator',
            }
        }

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update actual time. Please contact system administrator'
        };
    }
}