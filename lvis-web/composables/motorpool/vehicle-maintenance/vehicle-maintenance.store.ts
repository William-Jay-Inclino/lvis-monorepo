import { defineStore } from 'pinia';
import type { VehicleMaintenance } from './vehicle-maintenance.types';
import type { ServiceCenter } from '../service-center/service-center.types';

export const useVehicleMaintenanceStore = defineStore('vehicle_maintenance', {

    state: () => ({
        selected_row_indx: null as number | null,
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
        search_filters: {
            vehicle_maintenance: null as VehicleMaintenance | null,
            vehicle_maintenances: [] as VehicleMaintenance[],
            vehicle_status: null as 'Completed' | 'Pending' | null,
            vehicles: [] as Vehicle[],
            service_centers: [] as ServiceCenter[],
            selected_vehicle: null as Vehicle | null,
            selected_service_center: null as ServiceCenter | null,
            service_date: null,
        },
        items: [] as VehicleMaintenance[]
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
        vehicle_maintenances: (state) => {
            return state.search_filters.vehicle_maintenances
        },
        vehicles: (state) => {
            return state.search_filters.vehicles
        },
        service_centers: (state) => {
            return state.search_filters.service_centers
        },
        searched_results: (state) => {
            return state.items
        }

    },

    actions: {

        set_searched_results(payload: { items: VehicleMaintenance[] }) {
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
            vehicle_maintenances?: VehicleMaintenance[],
            vehicles?: Vehicle[],
            service_centers?: ServiceCenter[],
        }) {

            const {
                vehicle_maintenances,
                vehicles,
                service_centers,
            } = payload

            if(vehicles){
                this.search_filters.vehicles = vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
            }
            if(vehicle_maintenances){
                this.search_filters.vehicle_maintenances = vehicle_maintenances
            }
            if(service_centers){
                this.search_filters.service_centers = service_centers
            }

        },
        
        remove_selected_row() {
            this.selected_row_indx = null
        }

    },

});