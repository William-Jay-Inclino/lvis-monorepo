<template>

    <div class="row justify-content-center pt-3">
        <div class="col-lg-12">

            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Reference No.</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Comment</th>
                                    <th class="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody> 
                                <tr v-for="item, i in items" :key="i">
                                    <td style="white-space: nowrap;" class="text-muted align-middle">
                                        {{ get_module_label(item) }}
                                        <button 
                                            :data-testid="`view-${ item.reference_table }-${ item.reference_number }`"
                                            v-if="!isBudgetOfficer && !isFinanceManager" 
                                            @click="emits('view-details', item)" 
                                            class="btn btn-outline-light btn-sm"
                                        >
                                            <small class="text-primary fst-italic"> View details </small>
                                        </button>
                                    </td>
                                    <td class="text-muted align-middle small" style="white-space: pre-line;">{{ item.description }}</td>
                                    <td style="white-space: nowrap;" class="text-muted align-middle small">{{ formatDate(item.transaction_date, true) }}</td>
                                    <td>
                                        <NotificationComment
                                            :pending_id="item.id"
                                            :is_editing="item.is_editing"
                                            :is_saving="item.is_saving"
                                            :notes="item.approver_notes" 
                                            @start-edit="handleStartEditComment"
                                            @cancel="handleCancelEditComment"
                                            @save="handleSaveComment"
                                        />
                                    </td>
                                    <td class="align-middle text-center">
                                        <div v-if="isBudgetOfficer || isFinanceManager">
                                            <button 
                                                :data-testid="`view2-${ item.reference_table }-${ item.reference_number }`"
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
    import { db_entity_mapper, type Pending } from '~/composables/notification/notification.types';


    const emits = defineEmits([
        'view-details',
        'approve',
        'disapprove',
        'save-comment',
        'cancel-comment',
        'start-edit-comment',
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

    // =============================== Comment.vue Handlers =============================== 

    async function handleSaveComment(pending_id: number, comment: string) {
        emits('save-comment', { pending_id, comment })
    }

    function handleCancelEditComment(pending_id: number) {
        emits('cancel-comment', { pending_id })
    }

    function handleStartEditComment(pending_id: number) {
        emits('start-edit-comment', { pending_id })
    }

</script>



<style scoped>
    .card-header {
        background-color: #FFFACD; /* Soft Yellow - Lemon Chiffon */
        color: #333333; 
    }

    .pending-btn {
        background-color: #4A90E2; /* Bright and vibrant blue */
        color: #ffffff; /* Clear and contrasting white text */
        border: none; /* Clean border */
        border-radius: 0.375rem; /* Rounded corners for a soft look */
        padding: 0.5rem 1rem; /* Adequate spacing */
        font-size: 0.8rem; /* Readable text size */
        font-weight: 500; /* Slightly bolder text for emphasis */
        transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    }

    .pending-btn:hover {
        background-color: #357ABD; /* Slightly darker shade for hover */
        transform: translateY(-1px); /* Slight lift effect */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
        color: #ffffff; /* Ensure the text is still visible */
    }

    .pending-btn:focus {
        outline: none; /* Remove default outline */
        background-color: #357ABD; /* Keep the hover color for focus */
        box-shadow: 0 0 0 0.25rem rgba(74, 144, 226, 0.5); /* Glow effect */
    }

    .pending-btn:active {
        background-color: #2C6AA5; /* Even darker blue for active state */
        transform: scale(0.98); /* Pressed-in effect */
        box-shadow: none; /* Remove shadow for active state */
    }
</style>