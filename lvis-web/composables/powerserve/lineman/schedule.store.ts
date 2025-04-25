import { defineStore } from 'pinia';
import type { Area } from '../area/area.types';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { LINEMAN_STATUS, type Lineman, type LinemanSchedule } from './lineman.types';
import type { Shift } from '../shift/shift.entity';

export const useLinemanScheduleStore = defineStore('lineman_schedule', {

    state: () => ({
        _linemen: [] as Lineman[],
        _areas: [] as Area[],
        _shifts: [] as Shift[],
        selected_area: null as Area | null,
        selected_supervisor: null as Employee | null,
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
            let filtered = state._linemen

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
                        (lineman.employee.id?.toLowerCase().includes(searchTerm)) ||
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
                
                i.is_updating = false

                if(!i.schedule) {
                    i['schedule'] = {
                        lineman_id: i.id,
                        general_shift: null,
                        mon_shift: null,
                        tue_shift: null,
                        wed_shift: null,
                        thu_shift: null,
                        fri_shift: null,
                        sat_shift: null,
                        sun_shift: null,
                    }
                }

                return i;
                
            });
        },
        areas: (state) => {
            return state._areas
        },
        shifts: (state) => {
            return state._shifts
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
        set_shifts(payload: { shifts: Shift[] }) {
            this._shifts = payload.shifts
        },

        update_lineman(payload: { lineman: Lineman, field: keyof LinemanSchedule }) {
            const { lineman, field } = payload
            
            const indx = this._linemen.findIndex(i => i.id === lineman.id)

            if(indx === -1) {
                console.error('Lineman not found', lineman);
                return 
            }


            if(field === 'general_shift') {

                const general_shift = deepClone(lineman.schedule.general_shift)

                lineman.schedule.mon_shift = general_shift
                lineman.schedule.tue_shift = general_shift
                lineman.schedule.wed_shift = general_shift
                lineman.schedule.thu_shift = general_shift
                lineman.schedule.fri_shift = general_shift
                lineman.schedule.sat_shift = general_shift
                lineman.schedule.sun_shift = general_shift
            }

            this._linemen.splice(indx, 1, lineman)

        },

        update_lineman_schedule(payload: { lineman_schedule: LinemanSchedule }) {
            const { lineman_schedule } = payload

            console.log('update_lineman_schedule', payload);
            
            const indx = this._linemen.findIndex(i => i.id === lineman_schedule.lineman_id)

            console.log('indx', indx);

            if(indx === -1) {
                console.error('Lineman not found with id', lineman_schedule.lineman_id);
                return 
            }

            console.log('1');

            const lineman = this._linemen[indx]

            console.log('lineman_old', lineman);
            
            lineman.schedule = lineman_schedule

            console.log('lineman_new', lineman);

            // this._linemen.splice(indx, 1, {...lineman, schedule: lineman_schedule})

        },

        set_lineman_is_updating(payload: { lineman_id: string, status: boolean }) {

            const { lineman_id, status } = payload

            const indx = this._linemen.findIndex(i => i.id === lineman_id)

            if(indx === -1) {
                console.error('Lineman not found with id: ', lineman_id);
                return 
            }

            this._linemen[indx].is_updating = status

        }

    },

});