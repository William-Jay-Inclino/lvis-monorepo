import { defineStore } from 'pinia';
import type { AssignedGroup, Complaint, ComplaintStatus } from './complaint.types';
import type { Area } from '../area/area.types';
import type { Department } from '~/composables/hr/department/department';
import type { Division } from '~/composables/hr/division/division';
import { ASSIGNED_GROUP_TYPE } from './complaint.constants';

export const useComplaintStore = defineStore('complaint', {

    state: () => ({
        selected_row_indx: null as number | null,
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
        search_filters: {
            complaints: [] as Complaint[],
            complaint: null as Complaint | null,
            created_at: null,
            complaint_statuses: [] as ComplaintStatus[],
            complaint_status: null as ComplaintStatus | null,
            complainant_name: '',
            description: '',
            areas: [] as Area[],
            departments: [] as Department[],
            divisions: [] as Division[],
            assigned_group: null as AssignedGroup | null,
        },
        items: [] as Complaint[],
        _complaint_statuses: [] as ComplaintStatus[]
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
        complaints: (state) => {
            return state.search_filters.complaints
        },
        complaint_statuses: (state) => {
            return state._complaint_statuses
        },
        areas: (state) => {
            return state.search_filters.areas
        },
        departments: (state) => {
            return state.search_filters.departments
        },
        divisions: (state) => {
            return state.search_filters.divisions
        },
        assignments: (state) => {
            return [
                ...state.search_filters.areas.map(area => {
                    return {
                        id: area.id,
                        name: area.name,
                        type: ASSIGNED_GROUP_TYPE.AREA,
                    }
                }),
                ...state.search_filters.departments.map(department => {
                    return {
                        id: department.id,
                        name: department.name,
                        type: ASSIGNED_GROUP_TYPE.DEPARTMENT,
                    }
                }),
                ...state.search_filters.divisions.map(division => {
                    return {
                        id: division.id,
                        name: division.name,
                        type: ASSIGNED_GROUP_TYPE.DIVISION,
                    }
                }),
            ];
        },
        searched_results: (state) => {
            return state.items
        },

    },

    actions: {
        set_complaint_statuses(payload: { complaint_statuses: ComplaintStatus[] }) {
            this._complaint_statuses = payload.complaint_statuses
        },
        set_searched_results(payload: { items: Complaint[] }) {
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
            complaints?: Complaint[],
            complaint_statuses?: ComplaintStatus[],
            areas?: Area[],
            departments?: Department[],
            divisions?: Division[],
        }) {

            const { complaints, departments, divisions, areas } = payload

            if(complaints){
                this.search_filters.complaints = complaints 
            }

            if(areas) {
                this.search_filters.areas = areas
            }

            if(departments) {
                this.search_filters.departments = departments
            }

            if(divisions) {
                this.search_filters.divisions = divisions
            }

        },
        remove_selected_row() {
            this.selected_row_indx = null
        }
    },

});