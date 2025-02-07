import { defineStore } from 'pinia';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import type { MEQS } from './meqs.types';
import type { RV } from '../rv/rv.types';
import type { JO } from '../jo/jo.types';
import type { SPR } from '../spr/spr.types';
import type { Supplier } from '~/composables/warehouse/supplier/supplier';

export const useMeqsStore = defineStore('material_equipment_quotation_summary', {

    state: () => ({
        transactionTypes: ['RV', 'SPR', 'JO'],
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
        search_filters: {
            meqsArray: [] as MEQS[],
            rvs: [] as RV[],
            jos: [] as JO[],
            sprs: [] as SPR[],
            employees: [] as Employee[],
            suppliers: [] as Supplier[],
            transactionType: 'RV',
            meqs: null as MEQS | null,
            rv: null as RV | null,
            spr: null as SPR | null,
            jo: null as JO | null,
            date_requested: null,
            approval_status: null as IApprovalStatus | null,
            requested_by: null as Employee | null,
            supplier: null as Supplier | null,
        },
        items: [] as MEQS[]
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
        meqsArray: (state) => {
            return state.search_filters.meqsArray
        },
        rvs: (state) => {
            return state.search_filters.rvs
        },
        sprs: (state) => {
            return state.search_filters.sprs
        },
        jos: (state) => {
            return state.search_filters.jos
        },
        employees: (state) => {
            return state.search_filters.employees
        },
        suppliers: (state) => {
            return state.search_filters.suppliers
        },
        searched_results: (state) => {
            return state.items
        }

    },

    actions: {

        set_searched_results(payload: { items: MEQS[] }) {
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
            meqsArray?: MEQS[],
            rvs?: RV[],
            sprs?: SPR[],
            jos?: JO[],
            employees?: Employee[],
            suppliers?: Supplier[],
        }) {

            const { meqsArray, rvs, sprs, jos, employees, suppliers } = payload

            if(meqsArray){
                this.search_filters.meqsArray = meqsArray 
            }

            if(rvs){
                this.search_filters.rvs = rvs 
            }

            if(sprs){
                this.search_filters.sprs = sprs 
            }

            if(jos){
                this.search_filters.jos = jos 
            }

            if(employees){
                this.search_filters.employees = addPropertyFullName(employees)
            }

            if(suppliers){
                this.search_filters.suppliers = suppliers 
            }

        }

    },

});