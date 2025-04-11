<template>
    <div class="container-fluid py-3">
        <!-- Header Section -->
        <div class="row align-items-center mb-3">
            <div class="col-12 col-md-6 mb-2 mb-md-0">
                <h1 class="h4 text-muted mb-0">Activity Logs</h1>
            </div>
            <div class="col-12 col-md-6 text-md-end">
                <div class="badge bg-light text-dark p-2">
                    <span class="fw-bold">{{ total_logs }}</span>
                    <span class="text-muted ms-1">logs (last 2 months)</span>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingPage" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 mb-0 small">Loading activity logs...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="activity_logs.length === 0" class="text-center py-5">
            <div class="text-muted mb-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <p class="text-muted mb-0">No activity logs found</p>
        </div>

        <!-- Logs List -->
        <div v-else class="row g-2">
            <div v-for="log in activity_logs" :key="log.id" class="col-12">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-3">
                        <!-- Log Header -->
                        <div class="d-flex align-items-start">
                            <!-- Icon -->
                            <div class="flex-shrink-0 me-2 mt-1">
                                <div class="p-1 rounded" :class="{
                                    'bg-primary bg-opacity-10': 'table' in log && log.table === 'system',
                                    'bg-success bg-opacity-10': !('table' in log) || log.table !== 'system'
                                }">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path v-if="'table' in log && log.table === 'system'" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                        <path v-else d="M3 3h18v18H3z M3 9h18 M9 9v12"></path>
                                    </svg>
                                </div>
                            </div>
                            
                            <!-- Content -->
                            <div class="flex-grow-1" style="min-width: 0;"> <!-- min-width: 0 prevents flex overflow -->
                                <!-- Username and Action -->
                                <div class="d-flex flex-wrap align-items-center gap-1 mb-1">
                                    <span class="fw-bold text-truncate">{{ log.username }}</span>
                                    <span class="badge rounded-pill" :class="{
                                        'bg-success': getActionClass(log.action) === 'success',
                                        'bg-warning text-dark': getActionClass(log.action) === 'warning',
                                        'bg-danger': getActionClass(log.action) === 'danger',
                                        'bg-info': getActionClass(log.action) === 'info',
                                        'bg-secondary': getActionClass(log.action) === 'neutral'
                                    }" style="font-size: 0.7rem;">
                                        {{ formatAction(log.action) }}
                                    </span>
                                </div>
                                
                                <!-- Reference ID -->
                                <div class="small text-muted mb-2 text-truncate">
                                    ID: {{ log.reference_id }}
                                </div>
                                
                                <!-- Meta Info -->
                                <div class="d-flex flex-wrap gap-1 mb-2 small">
                                    <div class="bg-light rounded-pill px-2 py-1 small d-flex align-items-center">
                                        <span class="text-muted me-1 small">Date:</span>
                                        <span class="fw-medium">{{ formatDate(log.created_at, true) }}</span>
                                    </div>
                                    <div class="bg-light rounded-pill px-2 py-1 small d-flex align-items-center">
                                        <span class="text-muted me-1 small">IP:</span>
                                        <span class="font-monospace">{{ log.ip_address }}</span>
                                    </div>
                                    <div v-if="log.device_info" class="bg-light rounded-pill px-2 py-1 small d-flex align-items-center">
                                        <span class="text-muted me-1 small">Device:</span>
                                        <span class="text-truncate">{{ log.device_info }}</span>
                                    </div>
                                </div>
                                
                                <!-- Metadata -->
                                <div v-if="log.metadata" class="mb-2">
                                    <div class="d-flex align-items-center bg-light px-2 py-1 small rounded-top">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="me-1">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H9H8"></path>
                                        </svg>
                                        <span class="fw-medium">Metadata</span>
                                    </div>
                                    <pre class="bg-light text-secondary p-2 small mb-0 rounded-bottom" style="white-space: pre-wrap; overflow-x: auto; max-height: 150px; margin: 0; font-size: 0.75rem;">{{ formatMetadata(log.metadata) }}</pre>
                                </div>
                                
                                <!-- Notes -->
                                <div v-if="'notes' in log && log.notes" class="alert alert-success p-2 mb-0 small">
                                    <span class="fw-bold">Notes:</span> {{ log.notes }}
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
    import { ref, computed, onMounted } from 'vue';
    import type { SystemAudit, WarehouseAudit } from '~/composables/activity-log/activity-log';
    import * as api from '~/composables/activity-log/acitivity-log.api';

    definePageMeta({
        layout: "layout-home"
    });

    const isLoadingPage = ref(true);
    const authUser = ref<AuthUser>();
    const system_logs = ref<SystemAudit[]>([]);
    const warehouse_logs = ref<WarehouseAudit[]>([]);

    onMounted(async () => {
        authUser.value = await getAuthUserAsync();
        const response = await api.get_activity_logs({ username: authUser.value.user.username });
        system_logs.value = response.system_logs || [];
        warehouse_logs.value = response.warehouse_logs || [];
        isLoadingPage.value = false;
    });

    const activity_logs = computed(() => {
        const combined = [...system_logs.value, ...warehouse_logs.value];
        return combined.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    });

    const total_logs = computed(() => activity_logs.value.length);

    const formatAction = (action: string) => {
        return action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
    };

    const getActionClass = (action: string) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('create') || lowerAction.includes('add') || lowerAction.includes('insert')) return 'success';
        if (lowerAction.includes('update') || lowerAction.includes('edit') || lowerAction.includes('modify')) return 'warning';
        if (lowerAction.includes('delete') || lowerAction.includes('remove') || lowerAction.includes('erase')) return 'danger';
        if (lowerAction.includes('login') || lowerAction.includes('signin') || lowerAction.includes('authenticate')) return 'info';
        if (lowerAction.includes('logout') || lowerAction.includes('signout')) return 'info';
        return 'neutral';
    };

    const formatMetadata = (metadata: string) => {
        try {
            const parsed = JSON.parse(metadata);
            return JSON.stringify(parsed, null, 4); // 4-space indentation
        } catch {
            return metadata;
        }
    };
</script>

<style scoped>
    /* Custom scrollbar for metadata */
    pre {
        scrollbar-width: thin;
        /* scrollbar-color: #4a5568 #2d3748; */
    }
    pre::-webkit-scrollbar {
        height: 4px;
    }
    pre::-webkit-scrollbar-track {
        background: #2d3748;
    }
    pre::-webkit-scrollbar-thumb {
        background: #4a5568;
        border-radius: 2px;
    }
    
    /* Better text truncation */
    .text-truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        vertical-align: bottom;
        max-width: 100%;
    }
    
    /* Card adjustments for mobile */
    .card {
        overflow: hidden;
    }
    .card-body {
        padding: 0.75rem;
    }
    
    /* Smaller badges on mobile */
    @media (max-width: 576px) {
        .badge {
            padding: 0.25em 0.4em;
            font-size: 0.65rem;
        }
    }
</style>