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
                vehicle_number
                driver {
                    id 
                    firstname 
                    middlename 
                    lastname
                }
                created_at
                start_time
                status
                cancelled_at
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