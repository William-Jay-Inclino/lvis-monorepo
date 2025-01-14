<template>

    <div class="row">
        <div v-for="item, i in items" :key="i" class="col-lg-3 col-md-6 col-sm-12 pt-3">
            <div class="card">
                <div class="card-header">
                    <div class="small fw-bold">
                        {{ get_module_label(item) }}
                    </div>
                </div>
                <div class="card-body">
                    <div class="mb-2">
                        <textarea class="form-control form-control-sm text-muted" rows="4" readonly>{{ item.description }}</textarea>
                    </div>
                    <span class="small text-muted fst-italic">Created: {{ formatDate(item.transaction_date, true) }}</span>
    
                </div>
                <div class="card-footer text-center">
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
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { db_entity_mapper, type Pending } from '~/composables/notification/notification.types';


    const emits = defineEmits([
        'view-details',
    ])

    const props = defineProps({
        items: {
            type: Array as () => Pending[],
            default: null,
        }
    });

    function get_module_label(pending: Pending) {
        return db_entity_mapper[pending.reference_table] + ': ' + pending.reference_number
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