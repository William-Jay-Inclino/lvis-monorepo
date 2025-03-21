import { defineStore } from 'pinia';
import type { Complaint } from '../complaint/complaint.types';

export const useOicDashboardStore = defineStore('oic_dashboard', {

    state: () => ({
        _escalated_complaints: [] as Complaint[]
    }),

    getters: {

        escalated_complaints: (state) => {
            return state._escalated_complaints
        },

    },

    actions: {

        set_escalated_complaints(payload: { escalated_complaints: Complaint[] }) {
            this._escalated_complaints = payload.escalated_complaints
        }

    },

});