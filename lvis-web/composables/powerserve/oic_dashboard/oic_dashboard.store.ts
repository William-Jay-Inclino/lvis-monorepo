import { defineStore } from 'pinia';
import type { Complaint } from '../complaint/complaint.types';
import type { Task, TaskStatus } from '../task/task.types';
import type { Employee } from '~/composables/hr/employee/employee.types';
import type { Lineman } from '../common';

export const useOicDashboardStore = defineStore('oic_dashboard', {

    state: () => ({
        _escalated_complaints: [] as Complaint[],
        _task_statuses: [] as TaskStatus[],
        _pending_tasks: [] as Task[],
        _tasks: [] as Task[],
        _employees: [] as Employee[],
        _linemen: [] as Lineman[],
        search_filters: {
            tasks: [] as Task[],
            task: null as Task | null,
            created_at: null,
        },
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
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
        escalated_complaints: (state) => {
            return state._escalated_complaints
        },
        task_statuses: (state) => {
            return state._task_statuses.map(i => ({...i, total: i.total_count_by_group}))
        },
        pending_tasks: (state) => {
            return state._pending_tasks
        },
        tasks: (state) => {
            return state._tasks
        },
        employees: (state) => {
            const lineman_employees = state._linemen.map(i => ({
                ...i.employee,
                fullname: getFullname(i.employee.firstname, i.employee.middlename, i.employee.lastname)
            }));
        
            const employees = state._employees.map(emp => ({
                ...emp,
                fullname: getFullname(emp.firstname, emp.middlename, emp.lastname)
            }));
        
            // Combine both arrays and filter unique values based on employee.id
            const uniqueEmployees = new Map(
                [...employees, ...lineman_employees].map(emp => [emp.id, emp])
            );
        
            return Array.from(uniqueEmployees.values());
        }
    },

    actions: {
        set_pagination(payload: {
            currentPage: number,
            totalPages: number,
            totalItems: number,
        }) {
            this.pagination = {...payload, pageSize: PAGINATION_SIZE}
        },
        set_escalated_complaints(payload: { escalated_complaints: Complaint[] }) {
            this._escalated_complaints = payload.escalated_complaints
        },
        set_task_statuses(payload: { task_statuses: TaskStatus[] }) {
            this._task_statuses = payload.task_statuses
        },
        set_pending_tasks(payload: { pending_tasks: Task[] }) {
            this._pending_tasks = payload.pending_tasks
        },
        set_tasks(payload: { tasks: Task[] }) {
            this._tasks = payload.tasks
        },
        set_employees(payload: { employees: Employee[] }) {
            console.log('set_employees', payload);
            this._employees = payload.employees
        },
        set_linemen(payload: { linemen: Lineman[] }) {
            console.log('set_linemen', payload);
            this._linemen = payload.linemen
        },
    },

});