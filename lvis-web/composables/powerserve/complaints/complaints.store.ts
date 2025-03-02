import { defineStore } from 'pinia';
import type { Complaint, ComplaintStatus, NatureOfComplaint } from './complaints.types';
import type { Area, Assignments, Department, Division, Municipality } from '../common';
import { complaintReportTypes, natureOfComplaints, complaintStatuses, complaintAssignments, complaintDetails, municipalities, barangays, sitios } from './complaints.mock-data';

export const useComplaintStore = defineStore('complaint', {

    state: () => ({
        _complaints: [] as Complaint[],
        _complaint_statuses: [] as ComplaintStatus[],
        _nature_of_complaints: [] as NatureOfComplaint[],
        _areas: [] as Area[],
        _municipalities: [] as Municipality[],
        _departments: [] as Department[],
        _divisions: [] as Division[],
    }),

    getters: {
        complaints: (state) => {
            return state._complaints
        },
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
        departments: (state) => {
            return state._departments
        },
        divisions: (state) => {
            return state._divisions
        },
        assignments: (state): Assignments => {
            return [...state._areas, ...state._departments, ...state._divisions]
        }
    },

    actions: {

        set_complaints(payload: { complaints: Complaint[] }) {
            
            this._complaints = payload.complaints.map(complaint => ({
                ...complaint,
                report_type: complaintReportTypes.find(i => i._id === complaint.report_type_id),
                nature_of_complaint: natureOfComplaints.find(i => i._id === complaint.nature_of_complaint_id),
                complaint_status: complaintStatuses.find(i => i._id === complaint.complaint_status_id),
                assigned_to: complaintAssignments.find(i => i.complaint_id === complaint._id),
                detail: (() => {
                    const detail = complaintDetails.find(i => i.complaint_id === complaint._id);
                    if (detail) {

                        const barangay = barangays.find(b => b._id === detail.barangay_id)

                        return {
                            ...detail,
                            barangay,
                            municipality: municipalities.find(m => m._id === barangay?.municipality_id),
                            sitio: sitios.find(s => s._id === detail.sitio_id),
                        };
                    }
                    return undefined;
                })(),
            }))
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
        set_departments(payload: { departments: Department[] }) {
            this._departments = payload.departments
        },
        set_divisions(payload: { divisions: Division[] }) {
            this._divisions = payload.divisions
        },

    },

});