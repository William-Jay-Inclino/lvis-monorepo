import { defineStore } from 'pinia';
import type { GasSlip } from './gas-slip.types';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { addPropertyFullName } from '~/composables/hr/employee/employee';

interface PostStatus {
    id: boolean,
    label: string
}

export const useGasSlipStore = defineStore('gas_slip', {

    state: () => ({
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
        search_filters: {
            gas_slip: null as GasSlip | null,
            gas_slips: [] as GasSlip[],
            vehicle: null as Vehicle | null,
            used_on_date: null,
            employees: [] as Employee[],
            vehicles: [] as Vehicle[],
            approval_status: null as IApprovalStatus | null,
            post_status: null as PostStatus | null,
        },
        post_status_array: [
            { id: false, label: 'Unposted' },
            { id: true, label: 'Posted' },
        ] as PostStatus[],
        items: [] as GasSlip[]
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

        gas_slips: (state) => {
            return state.search_filters.gas_slips
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
        
        set_searched_results(payload: { items: GasSlip[] }) {
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
            gas_slips?: GasSlip[],
            employees?: Employee[],
            vehicles?: Vehicle[],
        }) {

            const {
                gas_slips,
                vehicles,
                employees,
            } = payload

            if(gas_slips){
                this.search_filters.gas_slips = gas_slips 
            }

            if(vehicles){
                this.search_filters.vehicles = vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
            }
            if(employees){
                this.search_filters.employees = addPropertyFullName(employees)
            }



        }

    },

});