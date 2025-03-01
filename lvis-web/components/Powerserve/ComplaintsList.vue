<template>
    <div class="soft-wrapper p-4 shadow-sm">
        <div class="card-body">
            <div class="text-end mb-3 mt-3 d-flex flex-wrap justify-content-center justify-content-md-end gap-2 me-3">
                <button type="button" class="btn soft-btn-gray position-relative">
                    Pending
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">3</span>
                </button> 
                <button type="button" class="btn soft-btn-blue position-relative">
                    In Progress
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">15</span>
                </button>
                <button type="button" class="btn soft-btn-yellow position-relative">
                    For Review
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">7</span>
                </button>
                <button type="button" class="btn soft-btn-orange position-relative">
                    Escalated
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">4</span>
                </button>
                <button type="button" class="btn soft-btn-green position-relative">
                    Closed - last 7 days
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">49</span>
                </button>
                <button type="button" class="btn soft-btn-red position-relative">
                    Cancelled
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">8</span>
                </button>
            </div>

            <div class="row mb-3 g-3">
                <div class="col-lg-6">
                    <div class="border rounded p-3">
                        <label class="form-label small fw-semibold">🔍 Search</label>
                        <div class="d-flex flex-wrap gap-2 align-items-center">
                            <select class="form-select form-select-sm w-auto">
                                <option>Ref #</option>
                                <option>Complainant</option>
                                <option>Contact #</option>
                                <option>Barangay</option>
                                <option>Sitio</option>
                                <option>Description</option>
                            </select>
                            <input type="text" class="form-control form-control-sm" placeholder="Enter search keyword..."/>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="border rounded p-3">
                        <div class="row g-2">
                            <div class="col-md-4">
                                <label class="form-label small fw-semibold">Nature of Complaint</label>
                                <select class="form-select form-select-sm">
                                    <option>All</option>
                                    <option>New Connection</option>
                                    <option>Low Voltage</option>
                                    <option>DT Replacement</option>
                                    <option>Power Outage</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label small fw-semibold">Municipality</label>
                                <select class="form-select form-select-sm">
                                    <option>Matagob</option>
                                    <option>Merida</option>
                                    <option>Isabel</option>
                                    <option>Kanangga</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label small fw-semibold">Assignment</label>
                                <select class="form-select form-select-sm">
                                    <option>Area 1</option>
                                    <option>Area 2</option>
                                    <option>Area 3</option>
                                    <option>Area 4</option>
                                    <option>Billing</option>
                                    <option>Line Construction</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="soft-header">
                        <tr>
                            <th class="text-nowrap">Ref #</th>
                            <th class="text-nowrap">Complainant</th>
                            <th class="text-nowrap">Contact #</th>
                            <th class="text-nowrap">Nature of Complaint</th>
                            <th class="text-nowrap">Assigned</th>
                            <th class="text-nowrap">Municipality</th>
                            <th class="text-nowrap">Barangay</th>
                            <th class="text-nowrap">Sitio</th>
                            <th class="text-nowrap">Status</th>
                            <th class="text-nowrap">Description</th>
                            <th class="text-center text-nowrap">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                </client-only>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in 8">
                            <td class="text-muted align-middle text-nowrap">
                                <nuxt-link>25-00001</nuxt-link>
                            </td>
                            <td class="text-muted align-middle text-nowrap">William Jay Inclino</td>
                            <td class="text-muted align-middle text-nowrap">09106024370</td>
                            <td class="text-muted align-middle text-nowrap">Power Outage</td>
                            <td class="text-muted align-middle text-nowrap">Area 1</td>
                            <td class="text-muted align-middle text-nowrap">Merida</td>
                            <td class="text-muted align-middle text-nowrap">Puerto Bello</td>
                            <td class="text-muted align-middle text-nowrap">Biasong</td>
                            <td class="text-muted align-middle text-nowrap">
                                <span class="badge soft-badge-blue">In Progress</span>
                            </td>
                            <td>
                                <textarea class="form-control text-muted small-textarea" readonly>Nibuto daw ang transformer ganina alas 9 sa buntag</textarea>
                            </td>
                            <td class="text-muted align-middle text-center text-nowrap">
                                <div class="dropdown">
                                    <button class="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'ellipsis-v']"/>
                                        </client-only>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">View Details</a></li>
                                        <li v-if="complaintStatus?._id !== COMPLAINT_STATUS.ACTED"><a class="dropdown-item" href="#">Edit Complaint</a></li>
                                        <li v-if="complaintStatus?._id === COMPLAINT_STATUS.PENDING"><a class="dropdown-item text-danger" href="#">Delete Complaint</a></li>
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
/* Fixed Card Height */
.soft-wrapper {
    background: #f8f9fa; /* Light gray */
    border-radius: 12px;
    /* height: 600px;  */
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Ensure the Card Body Fills the Space */
.card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Scrollable Table */
/* .table-responsive {
    flex-grow: 1;
    max-height: 500px;
    overflow-y: auto;
} */

/* Soft Header */
.soft-header {
    background: #e6e0f8; /* Pastel lavender */
    color: #4a3f78; /* Muted purple */
    font-weight: bold;
}


/* Small Textarea */
.small-textarea {
    font-size: 0.875rem; /* Small text */
    height: 60px; /* Reduce height */
    padding: 5px;
    resize: none; /* Prevent resizing */
}

/* Search & Filter */
.d-flex {
    gap: 8px; /* Reduce gap */
}

.search-input {
    width: 230px;
    border-radius: 6px;
    padding: 6px 10px;
}

.filter-dropdown {
    width: 160px;
    border-radius: 6px;
    padding: 6px 10px;
}
</style>
