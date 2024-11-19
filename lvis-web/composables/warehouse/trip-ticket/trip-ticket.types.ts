import type { Employee } from "~/composables/system/employee/employee.types";
import type { CreateTripTicketApprover, TripTicketApprover } from "./trip-ticket-approver.types";
import type { TRIP_TICKET_STATUS } from "./trip-ticket.enums";


export interface TripTicket {
    id: string 
    trip_number: string;
    vehicle_id: string;
    driver_id: string;
    passengers: string;
    destination: string;
    purpose : string;
    start_time: Date;
    end_time: Date;
    actual_start_time: Date | null;
    actual_end_time: Date | null;
    is_operation: boolean 
    is_stay_in: boolean 
    is_personal: boolean 
    is_out_of_coverage: boolean 
    prepared_by_id: string;
    status: TRIP_TICKET_STATUS;



    // =============== audit fields =============== 

    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date

    

    // derived / resolvers
    vehicle: Vehicle;
    driver: Employee;
    prepared_by: Employee;
    trip_ticket_approvers: TripTicketApprover[]
    can_update?: boolean;
}


export interface CreateTripTicket {
    vehicle: Vehicle | null 
    driver: Employee | null 
    passengers: string[]
    destination: string 
    purpose: string 
    start_time: string 
    end_time: string 
    is_operation: boolean 
    is_stay_in: boolean 
    is_personal: boolean 
    is_out_of_coverage: boolean 
    prepared_by: Employee | null 
    approvers: CreateTripTicketApprover[]
}

export interface UpdateTripTicket {
    vehicle: Vehicle | null 
    driver: Employee | null 
    passengers: string[]
    destination: string 
    purpose: string 
    start_time: string 
    end_time: string 
    is_operation: boolean 
    is_stay_in: boolean 
    is_personal: boolean 
    is_out_of_coverage: boolean 
    prepared_by: Employee | null 
}


export interface FindAllResponse {
	data: TripTicket[]
	totalItems: number
	currentPage: number
	totalPages: number
}


export interface MutationResponse {
	success: boolean
	msg: string
	data?: TripTicket
}

export interface ChangeApproverResponse {
	success: boolean
	msg: string
	data?: TripTicketApprover
}