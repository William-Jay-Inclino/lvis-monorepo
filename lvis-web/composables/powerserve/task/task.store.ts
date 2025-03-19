import { defineStore } from 'pinia';
import type { Employee } from '~/composables/hr/employee/employee.types';
import type { Task, TaskStatus } from './task.types';

export const useTaskStore = defineStore('task', {

    state: () => ({
        selected_row_indx: null as number | null,
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
        search_filters: {
            tasks: [] as Task[],
            task: null as Task | null,
            created_at: null,
        },
        items: [] as Task[],
        _task_statuses: [] as TaskStatus[]
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
        tasks: (state) => {
            return state.search_filters.tasks
        },
        searched_results: (state) => {
            return state.items
        },
        task_statuses: (state) => {
            return state._task_statuses
        },

    },

    actions: {
        set_task_statuses(payload: { task_statuses: TaskStatus[] }) {
            this._task_statuses = payload.task_statuses
        },
        set_searched_results(payload: { items: Task[] }) {
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
            tasks?: Task[],
            employees?: Employee[],
        }) {

            const { tasks, employees } = payload

            if(tasks){
                this.search_filters.tasks = tasks 
            }

        },
        remove_selected_row() {
            this.selected_row_indx = null
        }

    },

});