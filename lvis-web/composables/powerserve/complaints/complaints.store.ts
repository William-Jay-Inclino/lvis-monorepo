import { defineStore } from 'pinia';
import type { Complaint, ComplaintReportType, ComplaintStatus, NatureOfComplaint } from './complaints.types';
import type { Area, Assignment } from '../common';
import { combineAddress } from './complaints.helper';
import type { Department } from '~/composables/hr/department/department';
import type { Division } from '~/composables/hr/division/division';
import type { Task } from '../tasks/tasks.types';


export const useComplaintStore = defineStore('complaint', {

    state: () => ({
        _complaints: [] as Complaint[],
        _complaint_statuses: [] as ComplaintStatus[],
        _nature_of_complaints: [] as NatureOfComplaint[],
        _areas: [] as Area[],
        _departments: [] as Department[],
        _divisions: [] as Division[],
        _report_types: [] as ComplaintReportType[],
    }),

    getters: {
        complaint_statuses: (state) => {
            return state._complaint_statuses
        },
        nature_of_complaints: (state) => {
            return state._nature_of_complaints
        },
        areas: (state) => {
            return state._areas
        },
        municipalities: (state) => {
            return state._areas.flatMap(area => area.municipalities)
        },
        departments: (state) => {
            return state._departments
        },
        divisions: (state) => {
            return state._divisions
        },
        report_types: (state) => {
            return state._report_types
        },
        assignments: (state): Assignment[] => {
            return [
                ...state._areas.map(area => ({ ...area, type: "area" } as Assignment)),
                ...state._departments.map(department => ({ ...department, type: "department" } as Assignment)),
                ...state._divisions.map(division => ({ ...division, type: "division" } as Assignment))
            ];
        },
        complaints: (state) => {

            return state._complaints.map(i => {

                if(i.complaint_detail) {
                    i.complaint_detail['location'] = combineAddress({
                        municipality: i.complaint_detail?.barangay?.municipality.name,
                        barangay: i.complaint_detail?.barangay?.name,
                        sitio: i.complaint_detail?.sitio?.name,
                    })
                }

                return i

            })
        }
    },

    actions: {

        set_complaints(payload: { complaints: Complaint[] }) {
            this._complaints = payload.complaints
        },
        set_complaint_statuses(payload: { complaint_statuses: ComplaintStatus[] }) {
            this._complaint_statuses = payload.complaint_statuses
        },
        set_nature_of_complaints(payload: { nature_of_complaints: NatureOfComplaint[] }) {
            this._nature_of_complaints = payload.nature_of_complaints
        },
        set_areas(payload: { areas: Area[] }) {
            this._areas = payload.areas
        },
        set_departments(payload: { departments: Department[] }) {
            this._departments = payload.departments
        },
        set_divisions(payload: { divisions: Division[] }) {
            this._divisions = payload.divisions
        },
        set_report_types(payload: { report_types: ComplaintReportType[] }) {
            this._report_types = payload.report_types
        },
        get_complaint_by(payload: { complaint_id: number }): Complaint | null {
            const { complaint_id } = payload
            const complaint = this._complaints.find(i => i.id === complaint_id)

            if(!complaint) {
                console.error('complaint not found with id ', complaint_id);
                return null
            }

            return complaint
        },
        save_complaint(payload: { complaint: Complaint }) {

            const { complaint } = payload

            this._complaints.unshift(complaint)

        },
        assign_tasks_to_complaint(payload: {complaint_id: number, tasks: Task[] }) {
            const { complaint_id, tasks } = payload
            const complaint = this._complaints.find(i => i.id === complaint_id)

            if(!complaint) {
                console.error('complaint not found with id of ', complaint_id);
                return 
            }

            complaint['tasks'] = tasks

        }

    },

});