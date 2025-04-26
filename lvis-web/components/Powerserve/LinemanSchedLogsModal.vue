<template>
    <div class="modal fade" id="lineman_sched_logs_modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable modal-fullscreen-md-down custom-modal-width">
            <div class="modal-content border-0">
                <!-- Header -->
                <div class="modal-header bg-gradient-primary text-white">
                    <h5 class="modal-title d-flex align-items-center gap-2">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'clipboard-list']" class="me-2" />
                        </client-only>
                        Schedule History: {{ lineman_fullname }}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <!-- Body -->
                <div class="modal-body p-0">
                    <!-- Loading State -->
                    <div v-if="is_loading" class="d-flex justify-content-center py-5">
                        <div class="spinner-grow text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="logs.length === 0" class="text-center py-5">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'calendar-xmark']" class="text-muted mb-3" size="2xl" />
                        </client-only>
                        <h5 class="text-muted">No schedule history found</h5>
                    </div>

                    <!-- Logs Table -->
                    <div v-else class="table-responsive">
                        <table class="table table-borderless align-middle mb-0">
                            <thead class="sticky-top">
                                <tr class="bg-light">
                                    <th class="ps-4">Date</th>
                                    <th class="no-wrap">Updated By</th>
                                    <th class="text-center">Shift</th>
                                    <th v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" 
                                        :key="day"
                                        class="text-center">
                                        {{ day }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(log, index) in logs" :key="index" class="border-bottom">
                                    <td class="ps-4 text-nowrap">
                                        <span class="d-block fw-medium text-primary">{{ formatDate(log.recorded_at, true) }}</span>
                                        <small class="text-muted">{{ formatTimeTo12Hour(log.recorded_at) }}</small>
                                    </td>
                                    <td>
                                        <span class="badge bg-soft-dark rounded-pill">
                                            {{ log.recorded_by || 'System' }}
                                        </span>
                                    </td>
                                    <td>
                                        <div v-if="log.general_shift" class="text-center">
                                            <span 
                                                class="badge rounded-pill px-3 py-1"
                                                :class="[
                                                    {
                                                    'text-bg-primary': log.general_shift?.name.toLowerCase().includes('day'),
                                                    'text-bg-info': log.general_shift?.name.toLowerCase().includes('night'),
                                                    'text-bg-success': log.general_shift?.name.toLowerCase().includes('noon')
                                                    }
                                                ]"
                                                >
                                                {{ log.general_shift.name }}
                                            </span>
                                        </div>
                                        <div v-else class="text-muted">-</div>
                                    </td>
                                    <td v-for="day in daysOfWeek" :key="day" class="text-center no-wrap">
                                        <template v-if="log[`${day}_shift`]">
                                            <template v-if="log[`${day}_shift`]?.is_day_off">
                                                <span class="badge bg-soft-danger rounded-pill px-3 py-1">DAY OFF</span>
                                            </template>
                                            <template v-else>
                                                <div class="d-flex flex-column bg-soft-light rounded-3 p-2">
                                                    <span class="fw-medium text-dark">
                                                        {{ formatTimeTo12Hour(log[`${day}_shift`]?.start_time) }}
                                                    </span>
                                                    <span class="text-muted small">to</span>
                                                    <span class="fw-medium text-dark">
                                                        {{ formatTimeTo12Hour(log[`${day}_shift`]?.end_time) }}
                                                    </span>
                                                </div>
                                            </template>
                                        </template>
                                        <div v-else class="text-muted">-</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Footer -->
                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Lineman, LinemanScheduleLog } from '~/composables/powerserve/lineman/lineman.types';

const props = defineProps({
    lineman: {
        type: Object as () => Lineman,
    },
    logs: {
        type: Array as () => LinemanScheduleLog[],
        default: () => []
    },
    is_loading: {
        type: Boolean,
        default: false
    }
});

const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

const lineman_fullname = computed(() => {
    const emp = props.lineman?.employee;
    return emp ? getFullnameWithTitles(
        emp.firstname, 
        emp.lastname, 
        emp.middlename, 
        emp.name_prefix, 
        emp.name_suffix
    ) : '';
});
</script>

<style scoped>

    @media (min-width: 1024px) {
        .custom-modal-width {
            max-width: 80%;
            width: 80%;
        }
    }

.modal-content {
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.modal-header {
    padding: 1.25rem 1.5rem;
    background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
}

.bg-gradient-primary {
    background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
}

.table th {
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #6c757d;
    padding: 0.75rem 1rem;
}

.table td {
    vertical-align: middle;
    padding: 1rem;
}

.bg-soft-primary {
    background-color: rgba(78, 115, 223, 0.1);
    color: #4e73df;
}

.bg-soft-danger {
    background-color: rgba(220, 53, 69, 0.1);
    color: #dc3545;
}

.bg-soft-dark {
    background-color: rgba(52, 58, 64, 0.1);
    color: #343a40;
}

.bg-soft-light {
    background-color: rgba(248, 249, 250, 0.7);
}

.border-bottom {
    border-bottom: 1px solid #f0f0f0 !important;
}

.spinner-grow {
    width: 2.5rem;
    height: 2.5rem;
}

.btn-outline-primary {
    border-width: 2px;
    font-weight: 500;
}
</style>