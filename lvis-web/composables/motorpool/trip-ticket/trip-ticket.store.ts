import { defineStore } from 'pinia';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import type { TripTicket } from './trip-ticket.types';
import type { ITripStatus } from './trip-ticket.enums';

export const useTripTicketStore = defineStore('trip_ticket', {

    state: () => ({
        selected_row_indx: null as number | null,
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
        search_filters: {
            trip_ticket: null as TripTicket | null,
            trip_tickets: [] as TripTicket[],
            vehicle: null as Vehicle | null,
            date_prepared: null,
            date_departure: null,
            employees: [] as Employee[],
            vehicles: [] as Vehicle[],
            driver: null as Employee | null,
            trip_status: null as ITripStatus | null,
        },
        items: [] as TripTicket[]
    }),

    getters: {

        visiblePages: (state) => {
            const maxVisible = PAGINATION_MAX_VISIBLE_PAGES; 
            const currentPage = state.pagination.currentPage;
            const totalPages = state.pagination.totalPages;

            let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(totalPages, start + maxVisible - 1);

            // Adjust start if we're near the end
            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            const pages: number[] = [];
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },

        trip_tickets: (state) => {
            return state.search_filters.trip_tickets
        },

        employees: (state) => {
            return state.search_filters.employees
        },

        vehicles: (state) => {
            return state.search_filters.vehicles
        },

        searched_results: (state) => {
            return state.items
        }

    },

    actions: {
        
        set_searched_results(payload: { items: TripTicket[] }) {
            this.items = payload.items
        },

        set_pagination(payload: {
            currentPage: number,
            totalPages: number,
            totalItems: number,
        }) {
            this.pagination = {...payload, pageSize: PAGINATION_SIZE}
        },

        set_search_filters(payload: {
            trip_tickets?: TripTicket[],
            employees?: Employee[],
            vehicles?: Vehicle[],
        }) {

            const {
                trip_tickets,
                vehicles,
                employees,
            } = payload

            if(trip_tickets){
                this.search_filters.trip_tickets = trip_tickets 
            }

            if(vehicles){
                this.search_filters.vehicles = vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
            }
            if(employees){
                this.search_filters.employees = addPropertyFullName(employees)
            }

        },

        remove_selected_row() {
            this.selected_row_indx = null
        }

    },

});