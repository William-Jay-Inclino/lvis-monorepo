<template>
    <div class="soft-wrapper p-4 shadow-sm">
        <div class="row d-flex align-items-center mb-3">
            <div class="col">
                <h5 class="display-6 fw-bold text-muted text-center no-wrap">
                    <client-only>
                        <font-awesome-icon class="soft-blue" :icon="['fas', 'map-marker-alt']"/>
                    </client-only> 
                    {{ area?.name }}
                </h5>
                <div class="text-muted small fst-italic text-center">
                    <div>
                        Area Head: <span class="fw-bold"> Brixnel Emping </span>
                    </div>
                    <div>
                        Contact No: <span class="fw-bold"> 0910-602-4370 </span>
                    </div>
                </div>
            </div>
            <div class="col d-flex flex-column gap-2 mb-3">
                <button type="button" class="btn soft-btn-yellow">
                    Municipalities - 3
                </button> 
                <button type="button" class="btn soft-btn-blue">
                    Barangays - 20
                </button> 
                <button type="button" class="btn soft-btn-green">
                    Sitios - 50
                </button> 
            </div>
            <hr>
        </div>
        <div class="row align-items-center mb-2">
            <div class="col-md-6">
                <input
                    type="text"
                    class="form-control form-control-sm search-input"
                    placeholder="🔍 Search barangay..."
                />
            </div>
            <div class="col-md-6 d-flex gap-2">
                <button class="btn btn-sm soft-btn-gray active">All Barangays</button>
                <button class="btn btn-sm soft-btn-orange">Barangays w/ complaints</button>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-sm small table-striped">
                <thead>
                    <tr>
                        <th>Municipality</th>
                        <th>Barangay</th>
                        <th class="no-wrap">Nature of Complaint</th>
                        <th class="no-wrap">No. of complaints today</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in 50">
                        <td class="text-muted align-middle no-wrap">Merida</td>
                        <td class="text-muted align-middle no-wrap">Puerto Bello</td>
                        <td class="text-muted align-middle no-wrap">Power Outage</td>
                        <td class="text-muted align-middle text-center">1</td>
                    </tr>
                </tbody>
            </table>
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
    background: #f8f9fa; /* Light gray */
    border-radius: 12px;
    max-height: 600px; /* Fixed height */
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Main row for area name & buttons */
.row {
    flex-shrink: 0; /* Prevents it from stretching */
}

/* Table section should take up remaining space and be scrollable */
.table-responsive {
    flex-grow: 1;
    overflow-y: auto;
    max-height: 400px; /* Adjust based on remaining space */
}

/* Ensures the table does not overflow */
.table {
    width: 100%;
    table-layout: fixed; /* Prevents stretching */
}

/* Soft headers */
.soft-header {
    background: #e6e0f8; /* Soft pastel lavender */
    color: #4a3f78; /* Deep muted purple for contrast */
    font-weight: bold;
    padding: 10px;
}



.search-input {
    width: 230px;
    border-radius: 6px;
    padding: 6px 10px;
}


/* Soft Button Styles */
.soft-btn-gray {
    background: #e2e3e5; /* Soft Gray */
    color: #6c757d;
    border: none;
    padding: 5px 12px;
    font-size: 12px;
    border-radius: 5px;
}

.soft-btn-orange {
    background: #ffe5d0; /* Soft Orange */
    color: #b45309;
    border: none;
    padding: 5px 12px;
    font-size: 12px;
    border-radius: 5px;
}

/* Active Button */
.btn.active {
    font-weight: bold;
    opacity: 0.9;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
}

</style>
