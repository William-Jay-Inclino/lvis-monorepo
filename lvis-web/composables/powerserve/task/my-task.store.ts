import { defineStore } from 'pinia';
import type { Employee } from '~/composables/hr/employee/employee.types';
import type { Task } from './task.types';

export const useMyTaskStore = defineStore('my_task', {

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
        _tasks_by_assignee: [] as Task[],
        _pending_tasks: [] as Task[],
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
        tasks_by_assignee: (state) => {
            return state._tasks_by_assignee
        },
        pending_tasks: (state) => {
            return state._pending_tasks
        }

    },

    actions: {

        set_tasks_by_assignee(payload: { items: Task[] }) {
            this._tasks_by_assignee = payload.items
        },
        set_pending_tasks(payload: { items: Task[] }) {
            this._pending_tasks = payload.items
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