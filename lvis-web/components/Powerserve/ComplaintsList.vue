<template>
    <div class="soft-wrapper p-4 shadow-sm">
        <div class="card-body">
            <!-- Status Badge -->
            <div class="text-end mb-3">
                <span class="soft-badge fs-6" :class="`soft-${complaintStatus?.color_class}`">
                    {{ complaintStatus?.name }} Complaints
                </span>
            </div>

            <!-- Search and Filter -->
            <div class="d-flex gap-2 align-items-center mb-3">
                <!-- Search Input -->
                <input
                    type="text"
                    class="form-control form-control-sm search-input"
                    placeholder="🔍 Search here..."
                />

                <!-- Dropdown Filter -->
                <select class="form-select form-select-sm filter-dropdown">
                    <option>Ref number</option>
                    <option>Complainant</option>
                    <option>NOC</option>
                    <option>Location</option>
                    <option>Remarks</option>
                </select>
            </div>

            <!-- Table -->
            <div class="table-responsive">
                <table class="table table-sm small table-striped">
                    <thead class="soft-header">
                        <tr>
                            <th>Ref #</th>
                            <th>Complainant</th>
                            <th>Contact #</th>
                            <th>Nature of Complaint</th>
                            <th>Location</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in 10">
                            <td class="text-muted align-middle no-wrap">
                                <nuxt-link :to="'/powerserve/complaints'">25-00001</nuxt-link>
                            </td>
                            <td class="text-muted align-middle no-wrap">William Jay Inclino</td>
                            <td class="text-muted align-middle">09106024370</td>
                            <td class="text-muted align-middle"> Power Outage </td>
                            <td>
                                <textarea class="form-control text-muted small-textarea" readonly>Puerto Bello, Merida Leyte - Sitio Biasong</textarea>
                            </td>
                            <td>
                                <textarea class="form-control text-muted small-textarea" readonly>Nibuto daw ang transformer ganina alas 9 sa buntag</textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
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
    height: 600px; /* Set a fixed height */
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
.table-responsive {
    flex-grow: 1;
    max-height: 500px; /* Adjust for scrolling */
    overflow-y: auto;
}

/* Soft Header */
.soft-header {
    background: #e6e0f8; /* Pastel lavender */
    color: #4a3f78; /* Muted purple */
    font-weight: bold;
}

/* Soft Badges */
.soft-badge {
    border-radius: 12px;
    font-weight: bold;
    padding: 6px 12px;
}

/* Status Colors */
.soft-primary {
    background: #b8daff; /* Soft Blue */
    color: #004085;
}

.soft-warning {
    background: #fbe9c6; /* Softer Pastel Orange instead of Yellow */
    color: #8b5e34;
}

.soft-success {
    background: #d8f3dc; /* Softer Pastel Green */
    color: #22543d;
}

.soft-danger {
    background: #f8d7da; /* Soft Red */
    color: #721c24;
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
