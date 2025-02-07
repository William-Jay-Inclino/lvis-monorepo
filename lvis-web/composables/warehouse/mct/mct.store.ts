import { defineStore } from 'pinia';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import type { MCT } from './mct.types';

export const useMctStore = defineStore('mct', {

    state: () => ({
        selected_row_indx: null as number | null,
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
        search_filters: {
            mct: null as MCT | null,
            mcts: [] as MCT[],
            employees: [] as Employee[],
            requested_by: null as Employee | null,
            date_requested: null,
            approval_status: null as IApprovalStatus | null,
        },
        items: [] as MCT[]
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
        mcts: (state) => {
            return state.search_filters.mcts
        },
        employees: (state) => {
            return state.search_filters.employees
        },
        searched_results: (state) => {
            return state.items
        }

    },

    actions: {

        set_searched_results(payload: { items: MCT[] }) {
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
            mcts?: MCT[],
            employees?: Employee[],
        }) {

            const { mcts, employees } = payload
            
            if(mcts){
                this.search_filters.mcts = mcts 
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