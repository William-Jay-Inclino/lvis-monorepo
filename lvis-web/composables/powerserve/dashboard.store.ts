import { defineStore } from 'pinia';
import type { Complaint, ComplaintReportType, ComplaintStatus, NatureOfComplaint } from './complaints/complaints.types';
import type { Area } from './common';

export const usePowerserveDashboardStore = defineStore('powerserveDashboard', {

    state: () => ({
        _complaints_today: [] as Complaint[],
        _areas: [] as Area[],
        _complaint_statuses: [] as ComplaintStatus[],
    }),

    getters: {

        areas: (state) => {
            return state._areas
        },

        complaints: (state) => {
            return state._areas
        },

        complaint_statuses: (state) => {
            return state._complaint_statuses
        },

    },

    actions: {

        set_areas(payload: { areas: Area[] }) {
            this._areas = payload.areas
        },

        set_complaint_statuses(payload: { complaint_status: ComplaintStatus[] }) {
            this._complaint_statuses = payload.complaint_status
        },

    },

});