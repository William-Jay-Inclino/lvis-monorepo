<template>
    <div class="soft-wrapper p-4 rounded shadow-sm">
        <div class="row d-flex align-items-center mb-3">
            <div class="col">
                <h5 class="display-6 fw-bold text-muted text-center no-wrap">
                    <client-only>
                        <font-awesome-icon class="soft-blue" :icon="['fas', 'map-marker-alt']"/>
                    </client-only> 
                    {{ area?.name }}
                </h5>
            </div>
            <div class="col d-flex flex-column gap-2 mb-3">
                <button type="button" class="btn soft-btn-warning position-relative">
                    Pending
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-danger">
                        20
                    </span>
                </button> 
                <button type="button" class="btn soft-btn-primary position-relative">
                    Ongoing
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-danger">
                        20
                    </span>
                </button> 
                <button type="button" class="btn soft-btn-success position-relative">
                    Acted - last 7 days
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-danger">
                        20
                    </span>
                </button> 
            </div>
            <hr>
        </div>
        <div class="row">
            <div class="col">
                <div class="mb-2">
                    <input
                        type="text"
                        class="form-control form-control-sm search-input"
                        placeholder="🔍 Search barangay..."
                    />
                </div>
    
                <div class="table-responsive">
                    <div class="p-2 soft-header text-center rounded-top">
                        Merida Leyte
                    </div>
                    <div class="responsive">
                        <table class="table table-sm small table-striped">
                            <thead>
                                <tr>
                                    <th>Barangay</th>
                                    <th>Complaint</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="i in 50">
                                    <td class="no-wrap"> Puerto Bello </td>
                                    <td class="no-wrap"> Power Outage </td>
                                    <td>
                                        <span class="badge soft-badge-success">Acted</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
    background: #f8f9fa; /* Light gray */
    height: 600px; /* Fixed height */
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

/* Soft button styles */
.soft-btn-warning {
    background: #fff3cd; /* Soft pastel yellow */
    color: #856404;
    border: none;
}

.soft-btn-primary {
    background: #cce5ff; /* Light blue */
    color: #004085;
    border: none;
}

.soft-btn-success {
    background: #d4edda; /* Pastel green */
    color: #155724;
    border: none;
}

/* Soft status badges */
.soft-badge-primary {
    background: #b8daff;
    color: #004085;
}

.soft-badge-warning {
    background: #fff3cd;
    color: #856404;
}

.soft-badge-success {
    background: #d4edda;
    color: #155724;
}

.soft-badge-danger {
    background: #f8d7da;
    color: #721c24;
}

.soft-blue {
    color: #b8daff;
}

.search-input {
    width: 230px;
    border-radius: 6px;
    padding: 6px 10px;
}

</style>
