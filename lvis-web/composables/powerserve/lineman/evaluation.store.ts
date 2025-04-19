import { defineStore } from 'pinia';
import type { Area } from '../area/area.types';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { LINEMAN_STATUS, type Lineman } from './lineman.types';
import type { Remarks } from '../common';

export const useEvaluationStore = defineStore('lineman_evaluation', {

    state: () => ({
        _linemen: [] as Lineman[],
        _areas: [] as Area[],
        _remarks: [] as Remarks[],
        selected_area: null as Area | null,
        selected_supervisor: null as Employee | null,
        search_value: '',
    }),

    getters: {

        linemen: (state): Lineman[] => {
            let filtered = state._linemen;


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
                    
                    return (
                        fullname.includes(searchTerm)
                    );
                });
            }

            return filtered.map(lineman => ({...lineman, fullname: getFullnameWithTitles(lineman.employee.firstname, lineman.employee.lastname, lineman.employee.middlename, lineman.employee.name_prefix, lineman.employee.name_suffix)}));

        },
        areas: (state) => {
            return state._areas
        },
        remarks: (state) => {
            return state._remarks
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
        set_remarks(payload: { remarks: Remarks[] }) {
            this._remarks = payload.remarks
        },
    },

});