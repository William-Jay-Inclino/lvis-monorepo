import { defineStore } from 'pinia';
import type { Employee } from '~/composables/hr/employee/employee.types';
import type { Task, TaskStatus } from './task.types';
import type { Activity, ActivityCategoryCause, Device, Equipment, Feeder, MeterBrand, Substation, WeatherCondition } from '../common';

export const useMyTaskStore = defineStore('my_task', {

    state: () => ({
        pendings_selected_row_indx: null as number | null,
        assignee_tasks_selected_row_indx: null as number | null,
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
        _task_statuses: [] as TaskStatus[],
        _activities: [] as Activity[],
        _feeders: [] as Feeder[],
        _weather_conditions: [] as WeatherCondition[],
        _devices: [] as Device[],
        _meter_brands: [] as MeterBrand[],
        _substations: [] as Substation[],
        _causes: [] as ActivityCategoryCause[],
        _equipments: [] as Equipment[],
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
        },
        task_statuses: (state) => {
            return state._task_statuses.map(i => ({...i, total: i.total_count_by_assignee}))
        },
        activities: (state) => {
            return state._activities
        },
        feeders: (state) => {
            return state._feeders
        },
        weather_conditions: (state) => {
            return state._weather_conditions
        },
        devices: (state) => {
            return state._devices
        },
        meter_brands: (state) => {
            return state._meter_brands
        },
        substations: (state) => {
            return state._substations
        },
        causes: (state) => {
            return state._causes
        },
        equipments: (state) => {
            return state._equipments
        },
    },

    actions: {
        set_feeders(payload: { feeders: Feeder[] }) {
            this._feeders = payload.feeders
        },
        set_weather_conditions(payload: { weather_conditions: WeatherCondition[] }) {
            this._weather_conditions = payload.weather_conditions
        },
        set_devices(payload: { devices: Device[] }) {
            this._devices = payload.devices
        },
        set_activities(payload: { activities: Activity[] }) {
            this._activities = payload.activities
        },
        set_meter_brands(payload: { meter_brands: MeterBrand[] }) {
            this._meter_brands = payload.meter_brands
        },
        set_causes(payload: { causes: ActivityCategoryCause[] }) {
            this._causes = payload.causes
        },
        set_substations(payload: { substations: Substation[] }) {
            this._substations = payload.substations
        },
        set_equipments(payload: { equipments: Equipment[] }) {
            this._equipments = payload.equipments
        },
        set_task_statuses(payload: { task_statuses: TaskStatus[] }) {
            this._task_statuses = payload.task_statuses
        },
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
        remove_selected_row_in_pendings() {
            this.pendings_selected_row_indx = null
        },
        remove_selected_row_in_assignee_tasks() {
            this.assignee_tasks_selected_row_indx = null
        },
        remove_pending_task(payload: { task: Task }) {

            const { task } = payload 

            const indx = this._pending_tasks.findIndex(i => i.id === task.id)

            if(indx === -1) {
                console.error('pending task not found with id ', task.id);
                return 
            }

            this._pending_tasks.splice(indx, 1)

        },
        update_assignee_task(payload: { task: Task }) {
            const { task } = payload;
        
            const taskIndx = this._tasks_by_assignee.findIndex(i => i.id === task.id);
        
            if (taskIndx === -1) {
                console.error('Task by assignee not found with id', task.id);
                return;
            }
        
            this._tasks_by_assignee.splice(taskIndx, 1, { ...task });
        }

    },

});