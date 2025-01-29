<template>

    <div class="row">
        <div v-for="item, i in items" :key="i" class="col-lg-3 col-md-6 col-sm-12 pt-3">
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="small fw-bold">
                            {{ get_module_label(item) }}
                        </div>
                        <div>
                            <button 
                                :data-testid="`test-${ item.reference_table }-${ item.reference_number }`"
                                @click="emits('view-details', item)"
                                class="btn pending-btn"
                            >
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'circle-info']" />
                                </client-only> 
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="mb-2">
                        <textarea class="form-control form-control-sm text-muted" rows="4" readonly>{{ item.description }}</textarea>
                    </div>
                    <span class="small text-muted fst-italic">Created: {{ formatDate(item.transaction_date, true) }}</span>
    
                </div>
                <div class="card-footer text-center">
                    <div v-if="isBudgetOfficer || isFinanceManager">
                        <button 
                            :data-testid="`test-${ item.reference_table }-${ item.reference_number }`"
                            @click="emits('view-details', item)"
                            class="btn pending-btn"
                        >
                            View Details
                            <client-only>
                                <font-awesome-icon class="ms-1" :icon="['fas', 'paper-plane']" />
                            </client-only> 
                        </button>
                    </div>
                    <div v-else class="d-flex w-100">
                        <button 
                            @click="onClickDisapprove(item)" 
                            class="btn btn-light btn-sm text-danger flex-fill d-flex align-items-center justify-content-center me-2"
                        >
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'times-circle']" class="me-2" />
                            </client-only>
                            Disapprove
                        </button>
                        <button 
                            @click="onClickApprove(item)" 
                            class="btn btn-light btn-sm text-success flex-fill d-flex align-items-center justify-content-center" 
                        >
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'check-circle']" class="me-2" />
                            </client-only>
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { db_entity_mapper, type Pending } from '~/composables/notification/notification.types';


    const emits = defineEmits([
        'view-details',
        'approve',
        'disapprove',
    ])

    const props = defineProps({
        items: {
            type: Array as () => Pending[],
            default: null,
        },
        isBudgetOfficer: {
            type: Boolean,
            default: false,
        },
        isFinanceManager: {
            type: Boolean,
            default: false,
        },
    });

    function get_module_label(pending: Pending) {
        return db_entity_mapper[pending.reference_table] + ': ' + pending.reference_number
    }

    function onClickApprove(item: Pending) {
        emits('approve', { 
            pending_data: {...item}, 
            action: 'approve', 
        })
    }

    function onClickDisapprove(item: Pending) {
        emits('disapprove', { pending_data: {...item}, action: 'disapprove' })
    }

</script>



<style scoped>
    .card-header {
        background-color: #FFFACD; /* Soft Yellow - Lemon Chiffon */
        color: #333333; 
    }

    .pending-btn {
        background-color: #4A90E2; 
        color: #ffffff; 
        border: none; 
        border-radius: 0.375rem; 
        padding: 0.25rem 0.5rem; 
        font-size: 0.7rem; 
        font-weight: 500; 
        transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    }

    .pending-btn:hover {
        background-color: #357ABD; 
        transform: translateY(-1px); 
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
        color: #ffffff; 
    }

    .pending-btn:focus {
        outline: none;
        background-color: #357ABD; 
        box-shadow: 0 0 0 0.25rem rgba(74, 144, 226, 0.5); 
    }

    .pending-btn:active {
        background-color: #2C6AA5; 
        transform: scale(0.98);
        box-shadow: none; 
    }
</style>