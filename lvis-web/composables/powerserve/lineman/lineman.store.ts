import { defineStore } from 'pinia';
import type { Area } from '../area/area.types';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { LINEMAN_STATUS, type Lineman } from './lineman.types';

export const useLinemanStore = defineStore('lineman', {

    state: () => ({
        _linemen: [] as Lineman[],
        _areas: [] as Area[],
        selected_area: null as Area | null,
        selected_supervisor: null as Employee | null,
        selected_status: LINEMAN_STATUS.ACTIVE as LINEMAN_STATUS,
        search_value: '',
    }),

    getters: {

        supervisors: (state) => {
            // Get all supervisors from linemen
            const allSupervisors = state._linemen.map(lineman => lineman.supervisor)
            
            // Filter out duplicates by employee_id
            const uniqueSupervisors = allSupervisors.filter(
              (supervisor, index, self) =>
                index === self.findIndex(s => s.id === supervisor.id)
            )
            
            return uniqueSupervisors.map(i => ({...i, fullname: getFullnameWithTitles(i.firstname, i.lastname, i.middlename, i.name_prefix, i.name_suffix)}))
        },

        linemen: (state) => {
            let filtered = state._linemen;

            // Filter by status
            filtered = filtered.filter(lineman => lineman.status === state.selected_status);

            // Filter by area if selected
            if (state.selected_area) {
                filtered = filtered.filter(lineman => lineman.area.id === state.selected_area?.id);
            }

            // Filter by supervisor if selected
            if (state.selected_supervisor) {
                filtered = filtered.filter(lineman => lineman.supervisor.id === state.selected_supervisor?.id);
            }

            // Filter by search value if not empty
            if (state.search_value.trim() !== '') {
                const searchTerm = state.search_value.toLowerCase().trim();
                filtered = filtered.filter(lineman => {
                    const fullname = getFullnameWithTitles(
                        lineman.employee.firstname,
                        lineman.employee.lastname,
                        lineman.employee.middlename,
                        lineman.employee.name_prefix,
                        lineman.employee.name_suffix
                    ).toLowerCase();
                    
                    const position = lineman.employee.position?.toLowerCase() || '';
                    
                    return (
                        fullname.includes(searchTerm) ||
                        position.includes(searchTerm) ||
                        // (lineman.employee.id?.toLowerCase().includes(searchTerm)) ||
                        lineman.area.name.toLowerCase().includes(searchTerm) ||
                        lineman.supervisor.fullname?.toLowerCase().includes(searchTerm)
                    );
                });
            }

            // Format the filtered results
            return filtered.map(i => {
                i.fullname = getFullnameWithTitles(
                    i.employee.firstname, 
                    i.employee.lastname, 
                    i.employee.middlename, 
                    i.employee.name_prefix, 
                    i.employee.name_suffix
                );
                i.supervisor.fullname = getFullnameWithTitles(
                    i.supervisor.firstname, 
                    i.supervisor.lastname, 
                    i.supervisor.middlename, 
                    i.supervisor.name_prefix, 
                    i.supervisor.name_suffix
                );
                i.employee.fullname = getFullname(i.employee.firstname, i.employee.middlename, i.employee.lastname)
                return i;
            });
        },
        areas: (state) => {
            return state._areas
        },
        lineman_statuses: (state): LINEMAN_STATUS[] => {
            return [LINEMAN_STATUS.ACTIVE, LINEMAN_STATUS.INACTIVE]
        }            

    },

    actions: {
        
        set_linemen(payload: { linemen: Lineman[] }) {
            this._linemen = payload.linemen
        },
        set_areas(payload: { areas: Area[] }) {
            this._areas = payload.areas
        },
        add_lineman(payload: { lineman: Lineman }) {
            this._linemen.unshift(payload.lineman)
        },
        update_lineman(payload: { lineman: Lineman }) {
            const { lineman } = payload
            const indx = this._linemen.findIndex(i => i.id === lineman.id)

            if(indx === -1) {
                console.error('Lineman not found', lineman);
                return 
            }

            this._linemen.splice(indx, 1, lineman)

        },
        remove_lineman(payload: { lineman: Lineman }) {
            const { lineman } = payload
            const indx = this._linemen.findIndex(i => i.id === lineman.id)

            if(indx === -1) {
                console.error('Lineman not found', lineman);
                return 
            }

            this._linemen.splice(indx, 1)
        },
    },

});