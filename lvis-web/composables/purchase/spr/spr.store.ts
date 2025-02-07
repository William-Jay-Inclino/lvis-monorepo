import { defineStore } from 'pinia';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import type { Canvass } from '../canvass/canvass.types';
import type { SPR } from './spr.types';

export const useSprStore = defineStore('spare_parts_request', {

    state: () => ({
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
        search_filters: {
            canvass: null as Canvass | null,
            canvasses: [] as Canvass[],
            spr: null as SPR | null,
            sprs: [] as SPR[],
            employees: [] as Employee[],
            requested_by: null as Employee | null,
            date_requested: null,
            approval_status: null as IApprovalStatus | null,
        },
        items: [] as SPR[]
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
        canvasses: (state) => {
            return state.search_filters.canvasses
        },
        sprs: (state) => {
            return state.search_filters.sprs
        },
        employees: (state) => {
            return state.search_filters.employees
        },
        searched_results: (state) => {
            return state.items
        }

    },

    actions: {

        set_searched_results(payload: { items: SPR[] }) {
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
            canvasses?: Canvass[],
            sprs?: SPR[],
            employees?: Employee[],
        }) {

            const { canvasses, sprs, employees } = payload

            if(canvasses){
                this.search_filters.canvasses = canvasses 
            }

            if(sprs){
                this.search_filters.sprs = sprs 
            }

            if(employees){
                this.search_filters.employees = addPropertyFullName(employees)
            }

        }

    },

});