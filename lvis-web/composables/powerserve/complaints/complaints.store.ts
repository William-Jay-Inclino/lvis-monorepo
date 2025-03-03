import { defineStore } from 'pinia';
import type { Complaint, ComplaintAssignment, ComplaintDetail, ComplaintReportType, ComplaintStatus, CreateComplaint, NatureOfComplaint } from './complaints.types';
import type { Area, Assignment, Barangay, Department, Division, Municipality, Sitio } from '../common';
import { complaintReportTypes, natureOfComplaints, complaintStatuses, complaintAssignments, complaintDetails, municipalities, barangays, sitios, areas, departments, divisions } from './complaints.mock-data';
import { COMPLAINT_STATUS } from './complaint.constants';
import { generateRandomId, generateReferenceNumber } from './complaints.helper';

export const useComplaintStore = defineStore('complaint', {

    state: () => ({
        _complaints: [] as Complaint[],
        // temp
        _complaint_assignments: [...complaintAssignments] as ComplaintAssignment[],
        // temp
        _complaint_details: [...complaintDetails] as ComplaintDetail[],
        _complaint_statuses: [] as ComplaintStatus[],
        _nature_of_complaints: [] as NatureOfComplaint[],
        _areas: [] as Area[],
        _municipalities: [] as Municipality[],
        _barangays: [] as Barangay[],
        _sitios: [] as Sitio[],
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

            // temp
            return state._complaints.map(complaint => ({
                ...complaint,
                report_type: complaintReportTypes.find(i => i._id === complaint.report_type_id),
                nature_of_complaint: natureOfComplaints.find(i => i._id === complaint.nature_of_complaint_id),
                complaint_status: complaintStatuses.find(i => i._id === complaint.complaint_status_id),
                assigned_to: (() => {
                    const complaint_assignment = state._complaint_assignments.find(i => i.complaint_id === complaint._id)

                    if(complaint_assignment) {
                        return {
                            ...complaint_assignment,
                            area: areas.find(i => i._id === complaint_assignment.area_id),
                            department: departments.find(i => i._id === complaint_assignment.department_id),
                            division: divisions.find(i => i._id === complaint_assignment.division_id),
                        } as ComplaintAssignment
                    }
                    return undefined
                })(),
                detail: (() => {
                    const detail = state._complaint_details.find(i => i.complaint_id === complaint._id);
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

        add_complaint(payload: { complaint: CreateComplaint }) {

            const { complaint } = payload

            const complaint_id = generateRandomId()
            const ref_number = generateReferenceNumber('25-00005')

            const _complaint_detail: ComplaintDetail = {
                _id: 123,
                complaint_id,
                account_number: complaint.detail.account_number,
                meter_number: complaint.detail.meter_number,
                consumer_id: complaint.detail.consumer ? complaint.detail.consumer.id : null,
                barangay_id: complaint.detail.barangay!._id,
                sitio_id: complaint.detail.sitio ? complaint.detail.sitio._id : null,
                landmark: complaint.detail.landmark
            }

            const _complaint_assignment: ComplaintAssignment = {
                _id: 123,
                complaint_id,
                area_id: complaint.assigned_to!.type === 'area' ? complaint.assigned_to!._id : null,
                department_id: complaint.assigned_to!.type === 'department' ? complaint.assigned_to!._id : null,
                division_id: complaint.assigned_to!.type === 'division' ? complaint.assigned_to!._id : null,
                assigned_at: '03-03-2025',
            }

            const _complaint: Complaint = {
                _id: complaint_id,
                report_type_id: complaint.report_type._id,
                nature_of_complaint_id: complaint.nature_of_complaint!._id,
                complaint_status_id: COMPLAINT_STATUS.PENDING,
                ref_number,
                complainant_name: complaint.complainant_name,
                complainant_contact_no: complaint.complainant_contact_number,
                description: complaint.description,
                remarks: complaint.remarks,
                created_at: '03-03-2025',
            }

            // temp
            this._complaints.push(_complaint)
            this._complaint_details.push(_complaint_detail)
            this._complaint_assignments.push(_complaint_assignment)

            

        }

    },

});