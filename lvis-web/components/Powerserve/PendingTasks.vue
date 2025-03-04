<template>
    <div class="soft-wrapper p-4 shadow-sm">
        <div class="card-body">

            <div class="status-buttons mb-3 mt-3">
                <button type="button" class="btn soft-btn-gray position-relative">
                    Total Pending Tasks
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">8</span>
                </button>
            </div>

            <div class="row mb-3">
                <!-- Search Container -->
                <div class="col-12 mb-3">
                    <div class="border rounded p-3">
                        <label class="form-label small fw-semibold">🔍 Search</label>
                        <div class="d-flex gap-2 align-items-center">
                            <select class="form-select form-select-sm w-50">
                                <option>Ref #</option>
                                <option>Complainant</option>
                                <option>Municipality</option>
                                <option>Barangay</option>
                                <option>Sitio</option>
                            </select>
                            <input type="text" class="form-control form-control-sm w-100" placeholder="Enter search keyword..." />
                        </div>
                    </div>
                </div>

            </div>

            <div class="table-responsive">
                <table class="table small table-hover">
                    <thead class="soft-header">
                        <tr>
                            <th class="text-nowrap">Task</th>
                            <th class="text-nowrap">Municipality</th>
                            <th class="text-nowrap">Barangay</th>
                            <th class="text-nowrap">Sitio</th>
                            <th class="text-nowrap">Date</th>
                            <th class="text-center text-nowrap">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                </client-only>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in pending_tasks">
                            <td class="text-muted align-middle"> {{ item.complaint?.nature_of_complaint?.name }} </td>
                            <td class="text-muted align-middle text-nowrap"> {{ item.complaint?.detail?.municipality?.name }} </td>
                            <td class="text-muted align-middle text-nowrap"> {{ item.complaint?.detail?.barangay?.name }} </td>
                            <td class="text-muted align-middle text-nowrap"> {{ item.complaint?.detail?.sitio?.name }} </td>
                            <td class="text-muted align-middle"> {{ item.created_at }} </td>
                            <td class="align-middle text-center no-wrap">
                                <button class="btn btn-light btn-sm text-success">
                                    <client-only>
                                        <font-awesome-icon class="me-2" :icon="['fas', 'check-circle']" />
                                    </client-only>
                                    Accept
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import type { Task } from '~/composables/powerserve/tasks/tasks.types';

    const props = defineProps({
        pending_tasks: {
            type: Object as () => Task[],
            default: () => [],
        },
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
