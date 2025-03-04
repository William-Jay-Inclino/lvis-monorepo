<template>
    <div class="soft-wrapper p-4 shadow-sm">
        <div class="card-body">
            <div class="mb-3 mt-3 d-flex flex-wrap justify-content-md-end gap-2 me-3">
                <button
                    v-for="status in store.complaint_statuses"
                    type="button"
                    class="btn position-relative"
                    :class="`soft-btn-${status.color_class}`"
                  >
                    {{ status.name }}
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red"> {{ status.total }} </span>
                </button> 
            </div>

            <div class="row mb-3 g-3">

                <div class="col-lg-3">
                    <div class="border rounded p-3">
                        <powerserve-search-complaints />
                    </div>
                </div>

                <div class="col-lg-9">
                    <div class="border rounded p-3">
                        <powerserve-filter-complaints
                            :nature_of_complaints="store.nature_of_complaints" 
                            :municipalities="store.municipalities"
                            :assignments="store.assignments"
                            :complaint_statuses="store.complaint_statuses"
                        />
                    </div>
                </div>
                
            </div>

            <PowerserveComplaintsList
                :complaints="store.complaints" 
                @view-details="onViewComplaintDetails"
            />
            
        </div>
    </div>
</template>


<script setup lang="ts">
    import { useComplaintStore } from '~/composables/powerserve/complaints/complaints.store';
    import type { Complaint } from '~/composables/powerserve/complaints/complaints.types';

    const emits = defineEmits(['view_complaint_details'])

    const store = useComplaintStore()

    function onViewComplaintDetails(payload: { complaint: Complaint }) {
        emits('view_complaint_details', payload)
    }
    

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
