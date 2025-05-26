import { defineStore } from 'pinia';

export const usePendingStore = defineStore('pending', {

    state: () => ({
        _total_pendings: 0
    }),

    getters: {

        total_pendings: (state) => {
            return state._total_pendings
        },

    },

    actions: {
        
        set_total_pendings(payload: { total: number }) {
            console.log('set_total_pendings', payload);
            this._total_pendings = payload.total
        },

        increment_total_pendings() {
            this._total_pendings += 1
        },

        decrement_total_pendings() {
            this._total_pendings -= 1
        },

    },

});