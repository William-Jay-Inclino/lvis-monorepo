<template>
    <div v-if="lineman" class="lineman-card">
        <div class="lineman-header p-4 rounded-top" style="background-color: #f0f7fa;">
            <div class="d-flex justify-content-between align-items-center">
                <h3 class="mb-0 text-dark">
                    <i class="bi bi-person-badge me-2" style="color: #5a7d9a;"></i>
                    {{ lineman.fullname }}
                    <span class="badge ms-2 fs-6" style="background-color: #e1f0f7; color: #4a6b8a;">
                        {{ lineman.employee.position }}  <!-- Added position here -->
                    </span>
                </h3>
                <div>
                    <span class="badge fs-6" style="background-color: #e1f0f7; color: #4a6b8a;">
                        <i class="bi bi-star-fill me-1" style="color: #f59e0b;"></i>
                        Rating: {{ lineman.total_numerical_rating }}%
                    </span>
                </div>
            </div>
        </div>

        <div class="card border-0 rounded-top-0" style="box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0 small">
                        <thead style="background-color: #f8fafc;">
                            <tr>
                                <th class="ps-4" style="color: #6b7c93;">Acted at</th>
                                <th style="color: #6b7c93;">Activity</th>
                                <th style="color: #6b7c93;">Location</th>
                                <th style="color: #6b7c93;">Task #</th>
                                <th class="text-center" style="color: #6b7c93;">Personnel Req.</th>
                                <th class="text-end pe-4" style="color: #6b7c93;">Rating</th>
                                <th class="text-end pe-4" style="color: #6b7c93;">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(lineman_activity, index) in lineman.activities" :key="index" class="activity-row">
                                <td class="ps-4">
                                    <div class="fw-medium" style="color: #4a5568;">
                                        {{ formatDate(lineman_activity.acted_at) }} 
                                        <small class="text-muted ms-1">{{ formatDayName(lineman_activity.acted_at) }}</small>
                                    </div>
                                    <small class="text-muted">{{ formatTimeTo12Hour(lineman_activity.acted_at) }}</small>
                                </td>
                                <td>
                                    <div class="fw-medium" style="color: #4a5568;">{{ lineman_activity.activity.name }}</div>
                                    <small class="text-muted">
                                        Standard: {{ lineman_activity.activity.quantity }} {{ lineman_activity.activity.unit.name }}
                                    </small>
                                </td>
                                <td>
                                    <div style="color: #4a5568;">{{ lineman_activity.barangay.name }}</div>
                                    <small class="text-muted">Distance: {{ lineman_activity.distance_travelled_in_km }} km</small>
                                </td>
                                <td>
                                    <div style="color: #4a5568;">{{ lineman_activity.task.ref_number }}</div>
                                    <a href="#"
                                        @click.prevent="on_view_task({ task: lineman_activity.task })"
                                        class="text-decoration-none small"
                                        data-bs-toggle="modal"
                                        data-bs-target="#task_details_modal"
                                        style="color: #0d6efd;">
                                        View details
                                    </a>
                                </td>
                                <td class="text-center">
                                    <span class="badge" style="background-color: #e0f2fe; color: #3b82f6;">
                                        {{ lineman_activity.activity.num_of_personnel }}
                                    </span>
                                </td>
                                <td class="text-end pe-4">
                                    <div style="line-height: 1; margin-bottom: 4px;">
                                        <div style="display: inline-block; width: 80px; margin-right: 8px; vertical-align: middle;">
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar" 
                                                :style="`width: ${lineman_activity.numerical_rating}%`"
                                                :title="`${lineman_activity.numerical_rating}%`">
                                            </div>
                                        </div>
                                        </div>
                                        <small class="text-muted" style="vertical-align: middle;">{{ lineman_activity.numerical_rating }}%</small>
                                    </div>
                                    <div class="text-muted small" style="font-size: 0.75rem; line-height: 1.2;">
                                        Accomplishment: {{ lineman_activity.accomplishment_qty }}
                                    </div>
                                </td>
                                <td class="text-end pe-4">
                                    <span class="badge" 
                                          :style="`background-color: ${getStatusBgColor(lineman_activity)}; color: ${getStatusTextColor(lineman_activity)};`">
                                        {{ lineman_activity.remarks?.label || 'N/A' }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="summary-section p-4 border-top" style="background-color: #f9fbfd;">
                    <div class="row">
                        <div class="col-md-4 mb-3 mb-md-0">
                            <div class="d-flex align-items-center">
                                <div class="p-3 rounded me-3" style="background-color: #e0f2fe;">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'road']" style="color: #3b82f6;"/>
                                    </client-only>
                                </div>
                                <div>
                                    <h6 class="mb-0" style="color: #6b7c93;">Total Distance Travelled</h6>
                                    <p class="fs-5 fw-bold mb-0" style="color: #4a5568;">{{ lineman.total_distance_travelled }} km</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3 mb-md-0">
                            <div class="d-flex align-items-center">
                                <div class="p-3 rounded me-3" style="background-color: #e0f7f6;">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'star']" style="color: #0d9488;"/>
                                    </client-only>
                                </div>
                                <div>
                                    <h6 class="mb-0" style="color: #6b7c93;">Numerical Rating</h6>
                                    <p class="fs-5 fw-bold mb-0" style="color: #4a5568;">{{ lineman.total_numerical_rating }}%</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="d-flex align-items-center">
                                <div class="p-3 rounded me-3" style="background-color: #fef3c7;">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'medal']" style="color: #d97706;"/>
                                    </client-only>
                                </div>
                                <div>
                                    <h6 class="mb-0" style="color: #6b7c93;">Adjectival Rating</h6>
                                    <p class="fs-5 fw-bold mb-0" :style="`color: ${getRatingColor(lineman)};`">
                                        {{ lineman.remarks?.label || 'N/A' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Lineman } from '~/composables/powerserve/lineman/lineman.types';
import type { Task } from '~/composables/powerserve/task/task.types';

    const emits = defineEmits(['view_task'])

    const props = defineProps({
        lineman: {
            type: Object as () => Lineman,
        },
    });

    const getStatusBgColor = (activity: any) => {
        if (!activity.remarks) return '#f0f1f3';
        switch(activity.remarks.label.toLowerCase()) {
            case 'excellent': return '#dcfce7';
            case 'good': return '#dbeafe';
            case 'fair': return '#fef3c7';
            case 'poor': return '#fee2e2';
            default: return '#f0f1f3';
        }
    };

    const getStatusTextColor = (activity: any) => {
        if (!activity.remarks) return '#7a7f8a';
        switch(activity.remarks.label.toLowerCase()) {
            case 'excellent': return '#166534';
            case 'good': return '#1e40af';
            case 'fair': return '#92400e';
            case 'poor': return '#991b1b';
            default: return '#7a7f8a';
        }
    };

    const getRatingColor = (lineman: Lineman) => {
        if (!lineman.remarks) return '#4a5568';
        switch(lineman.remarks.label.toLowerCase()) {
            case 'excellent': return '#166534';
            case 'good': return '#1e40af';
            case 'fair': return '#92400e';
            case 'poor': return '#991b1b';
            default: return '#4a5568';
        }
    };


    const on_view_task = (payload: { task: Task }) => {
        const { task } = payload
        emits('view_task', { task })
    }

</script>

<style scoped>
    .lineman-card {
        border-radius: 0.75rem;
        overflow: hidden;
    }

    .lineman-header {
        transition: all 0.3s ease;
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .activity-row:hover {
        background-color: rgba(0, 0, 0, 0.015);
        cursor: pointer;
    }

    .badge {
        padding: 0.35em 0.65em;
        font-weight: 500;
        border-radius: 0.375rem;
    }

    .table {
        --bs-table-color: #4a5568;
        --bs-table-striped-bg: rgba(240, 247, 250, 0.3);
    }

    .table th {
        font-weight: 600;
        letter-spacing: 0.02em;
    }

    .clickable-badge {
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .clickable-badge:hover {
        background-color: #d0e3ff !important;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .clickable-badge:active {
        transform: translateY(0);
    }
</style>