import { defineStore } from 'pinia';
import type { Area } from '../area/area.types';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { LINEMAN_STATUS, type Lineman, type LinemanActivity, type LinemanTask, type LinemanWithActivities } from './lineman.types';
import type { Remarks } from '../common';
import { get_numerical_rating, get_remarks } from './helpers';

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

        linemen: (state): LinemanWithActivities[] => {
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

            return filtered.map(lineman => {
                // Get all activities from all task types
                const activities: LinemanActivity[] = [];
                let total_standard_qty = 0
                let total_accomplishment_qty = 0
                let total_distance_travelled = 0

                // Helper function to collect activities from a task array
                const collectActivities = (tasks: LinemanTask[]) => {
                   for(let task of tasks) {
                        if(task.task_detail.task.activity) {

                            const numerical_rating = get_numerical_rating({ 
                                standard_qty: task.task_detail.task.activity.quantity,
                                accomplishment_qty:  task.task_detail.task.accomplishment_qty
                            })

                            const remark = get_remarks({ numerical_rating, remarks: state._remarks })

                            activities.push({
                                ...task.task_detail.task.activity, 
                                accomplishment_qty: task.task_detail.task.accomplishment_qty,
                                // @ts-ignore
                                barangay: task.task_detail.barangay,
                                // @ts-ignore
                                distance_travelled_in_km: task.task_detail.distance_travel_in_km,
                                complaint_number: task.task_detail.task.complaint?.ref_number,
                                numerical_rating,
                                remark: remark
                            })
                        }
                   }
                };
        
                // Collect from all task types
                collectActivities(lineman.power_interruptions || []);
                collectActivities(lineman.kwh_meters || []);
                collectActivities(lineman.line_services || []);
                collectActivities(lineman.dles || []);
                collectActivities(lineman.lmdgas || []);


                for(let activity of activities) {
                    total_standard_qty += activity.quantity
                    total_accomplishment_qty += activity.accomplishment_qty
                    total_distance_travelled += activity.distance_travelled_in_km
                }
                
                const total_numerical_rating = get_numerical_rating({ standard_qty: total_standard_qty, accomplishment_qty: total_accomplishment_qty })

                return {
                    ...lineman,
                    fullname: getFullnameWithTitles(
                        lineman.employee.firstname, 
                        lineman.employee.lastname, 
                        lineman.employee.middlename, 
                        lineman.employee.name_prefix, 
                        lineman.employee.name_suffix
                    ),
                    activities,
                    total_numerical_rating: total_numerical_rating,
                    remark: get_remarks({ numerical_rating: total_numerical_rating, remarks: state._remarks }),
                    total_distance_travelled,
                };
            });
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