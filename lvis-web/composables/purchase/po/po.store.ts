import { defineStore } from 'pinia';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import type { PO } from './po.types';
import type { MEQS } from '../meqs/meqs.types';
import type { Supplier } from '~/composables/warehouse/supplier/supplier';

export const usePoStore = defineStore('purchase_order', {

    state: () => ({
        selected_row_indx: null as number | null,
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
        search_filters: {
            po: null as PO | null,
            pos: [] as PO[],
            meq: null as MEQS | null,
            meqs: [] as MEQS[],
            suppliers: [] as Supplier[],
            supplier: null as Supplier | null,
            employees: [] as Employee[],
            requested_by: null as Employee | null,
            date_requested: null,
            approval_status: null as IApprovalStatus | null,
        },
        items: [] as PO[]
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
        pos: (state) => {
            return state.search_filters.pos
        },
        meqs: (state) => {
            return state.search_filters.meqs
        },
        suppliers: (state) => {
            return state.search_filters.suppliers
        },
        employees: (state) => {
            return state.search_filters.employees
        },
        searched_results: (state) => {
            return state.items
        }

    },

    actions: {

        set_searched_results(payload: { items: PO[] }) {
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
            pos?: PO[],
            meqs?: MEQS[],
            suppliers?: Supplier[],
            employees?: Employee[],
        }) {

            const { pos, meqs, suppliers, employees } = payload

            if(pos){
                this.search_filters.pos = pos 
            }

            if(meqs){
                this.search_filters.meqs = meqs 
            }

            if(suppliers){
                this.search_filters.suppliers = suppliers 
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