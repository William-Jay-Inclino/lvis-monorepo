<template>
    <div class="soft-wrapper p-4 shadow-sm">
        <div class="row d-flex flex-column flex-md-row align-items-center text-center mb-3">
    <div class="col-12 col-md">
        <h5 class="display-6 fw-bold text-muted no-wrap d-flex justify-content-center align-items-center">
            <client-only>
                <font-awesome-icon class="soft-blue" :icon="['fas', 'map-marker-alt']"/>
            </client-only> 
            {{ area?.name }}
        </h5>
        <div class="text-muted small fst-italic">
            <div>
                Area Head: <span class="fw-bold"> Brixnel Emping </span>
            </div>
            <div>
                Contact No: <span class="fw-bold"> 0910-602-4370 </span>
            </div>
        </div>
    </div>
    <div class="col-12 col-md d-flex flex-wrap justify-content-center gap-2 mb-3">
        <button type="button" class="btn soft-btn-yellow text-nowrap w-100 w-md-auto">
            Municipalities - 3
        </button> 
        <button type="button" class="btn soft-btn-blue text-nowrap w-100 w-md-auto">
            Barangays - 20
        </button> 
        <button type="button" class="btn soft-btn-green text-nowrap w-100 w-md-auto">
            Sitios - 50
        </button> 
    </div>

    <hr class="d-md-none">
</div>

        <div class="row">
            <div class="col">
                <div class="mb-2 text-center text-md-start">
                    <input
                        type="text"
                        class="form-control form-control-sm search-input"
                        placeholder="🔍 Search barangay..."
                    />
                </div>
    
                <div class="table-responsive">
                    <table class="table table-sm small table-striped">
                        <thead>
                            <tr>
                                <th>Municipality</th>
                                <th>Barangay</th>
                                <th class="no-wrap">Nature of Complaint</th>
                                <th class="no-wrap text-center">Complaints Today</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i in 50" :key="i">
                                <td class="text-muted align-middle no-wrap">Merida</td>
                                <td class="text-muted align-middle no-wrap">Puerto Bello</td>
                                <td class="text-muted align-middle no-wrap">Power Outage</td>
                                <td class="text-muted align-middle text-center">1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Area } from '~/composables/powerserve/common';

const props = defineProps({
    area: {
        type: Object as () => Area,
    },
});
</script>

<style scoped>
/* Soft gray background wrapper */
.soft-wrapper {
    background: #f8f9fa;
    border-radius: 12px;
    height: auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Table responsiveness */
.table-responsive {
    overflow-x: auto;
    max-height: 400px;
}

/* Ensure buttons are responsive */
@media (max-width: 768px) {
    .btn {
        width: 100%;
    }
}

/* Search input */
.search-input {
    width: 100%;
    max-width: 230px;
    border-radius: 6px;
    padding: 6px 10px;
}

/* Prevent table from breaking */
.table {
    width: 100%;
    table-layout: auto;
    white-space: nowrap;
}

/* Make sure text doesn't overflow */
.no-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
