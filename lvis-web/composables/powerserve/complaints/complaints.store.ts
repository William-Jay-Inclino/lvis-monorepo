import { defineStore } from 'pinia';
import type { Complaint, ComplaintReportType, ComplaintStatus, CreateComplaint, NatureOfComplaint } from './complaints.types';
import type { Area, Assignment, Barangay, Municipality, Sitio } from '../common';
import { combineAddress } from './complaints.helper';
import type { Department } from '~/composables/hr/department/department';
import type { Division } from '~/composables/hr/division/division';


export const useComplaintStore = defineStore('complaint', {

    state: () => ({
        _complaints: [] as Complaint[],
        _complaint_statuses: [] as ComplaintStatus[],
        _nature_of_complaints: [] as NatureOfComplaint[],
        _areas: [] as Area[],
        _municipalities: [] as Municipality[],
        _barangays: [] as Barangay[],
        _sitios: [] as Sitio[],
        _departments: [] as Department[],
        _divisions: [] as Division[],
        _report_types: [] as ComplaintReportType[],
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize: PAGINATION_SIZE,
        },
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
            return state._municipalities
        },
        barangays: (state) => {
            return state._barangays
        },
        sitios: (state) => {
            return state._sitios
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
        set_municipalities(payload: { municipalities: Municipality[] }) {
            this._municipalities = payload.municipalities
        },
        set_barangays(payload: { barangays: Barangay[] }) {
            this._barangays = payload.barangays
        },
        set_sitios(payload: { sitios: Sitio[] }) {
            this._sitios = payload.sitios
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

        set_pagination(payload: {
            currentPage: number,
            totalPages: number,
            totalItems: number,
        }) {
            this.pagination = {...payload, pageSize: PAGINATION_SIZE}
        },

        add_complaint(payload: { complaint: CreateComplaint }) {

            const { complaint } = payload

            // this._complaints.push(complaint)

        }

    },

});