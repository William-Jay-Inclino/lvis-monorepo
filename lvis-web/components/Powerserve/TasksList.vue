<template>
    <div class="soft-wrapper p-3 shadow-sm">
        <div class="card-body">
            <!-- Status Buttons -->
            <div class="status-buttons text-center mb-3 mt-3">
                <button type="button" class="btn soft-btn-violet position-relative">
                    Assigned
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">7</span>
                </button>
                <button type="button" class="btn soft-btn-blue position-relative">
                    Ongoing
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">7</span>
                </button>
                <button type="button" class="btn soft-btn-green position-relative">
                    Completed
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">4</span>
                </button>
                <button type="button" class="btn soft-btn-orange position-relative">
                    Unresolved
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">49</span>
                </button>
            </div>

            <div class="row mb-3">
                <!-- Search Container -->
                <div class="col-12 col-md-6 mb-3">
                    <div class="border rounded p-3">
                        <label class="form-label small fw-semibold">🔍 Search</label>
                        <div class="d-flex gap-2 align-items-center">
                            <select class="form-select form-select-sm w-100">
                                <option>Ref #</option>
                                <option>Complainant</option>
                                <option>Barangay</option>
                                <option>Sitio</option>
                            </select>
                            <input type="text" class="form-control form-control-sm w-100" placeholder="Enter search keyword..." />
                        </div>
                    </div>
                </div>

                <!-- Filter Container -->
                <div class="col-12 col-md-6">
                    <div class="border rounded p-3">
                        <div class="row g-2">
                            <div class="col-6">
                                <label class="form-label small fw-semibold">Task</label>
                                <select class="form-select form-select-sm">
                                    <option>All</option>
                                    <option>New Connection</option>
                                    <option>Low Voltage</option>
                                    <option>DT Replacement</option>
                                    <option>Power Outage</option>
                                </select>
                            </div>

                            <div class="col-6">
                                <label class="form-label small fw-semibold">Municipality</label>
                                <select class="form-select form-select-sm">
                                    <option>Merida</option>
                                    <option>Isabel</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="table-responsive">
                <table class="table small table-hover">
                    <thead class="soft-header">
                        <tr>
                            <th>Ref #</th>
                            <th>Complainant</th>
                            <th>Task</th>
                            <th>Municipality</th>
                            <th>Barangay</th>
                            <th>Sitio</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th class="text-center">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                </client-only>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in 8" :key="i">
                            <td class="text-muted align-middle no-wrap">
                                <nuxt-link>25-00001</nuxt-link>
                            </td>
                            <td class="text-muted align-middle">William Jay Inclino</td>
                            <td class="text-muted align-middle">Power Outage Restoration</td>
                            <td class="text-muted align-middle"> Merida </td>
                            <td class="text-muted align-middle"> Puerto Bello </td>
                            <td class="text-muted align-middle"> Biasong </td>
                            <td class="text-muted align-middle">
                                <span class="badge soft-badge-green">Completed</span>
                            </td>
                            <td class="text-muted align-middle"> 01 Mar 2025 </td>
                            <td class="text-muted align-middle text-center">
                                <div class="dropdown">
                                    <button class="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'ellipsis-v']"/>
                                        </client-only>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">View Details</a></li>
                                        <li><a class="dropdown-item" href="#">Update Status</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { COMPLAINT_STATUS } from '~/composables/powerserve/complaints/complaint.constants';
import type { Complaint, ComplaintStatus } from '~/composables/powerserve/complaints/complaints.types';

const props = defineProps({
    complaint: {
        type: Object as () => Complaint,
    },
    complaintStatus: {
        type: Object as () => ComplaintStatus,
    }
});
</script>

<style scoped>
/* Base container */
.soft-wrapper {
    background: #f8f9fa;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Status buttons responsive */
.status-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
}

/* Soft Header */
.soft-header {
    background: #e6e0f8;
    color: #4a3f78;
    font-weight: bold;
}

/* Table adjustments */
.table-responsive {
    overflow-x: auto;
}

.table th,
.table td {
    white-space: nowrap;
}

/* Small Textarea */
.small-textarea {
    font-size: 0.875rem;
    height: 60px;
    padding: 5px;
    resize: none;
}

/* Form spacing */
.d-flex {
    gap: 8px;
}

select,
input {
    width: 100%;
}
</style>
