<template>
    <div class="soft-wrapper p-4 shadow-sm">
        <div class="card-body">

            <div class="row">
                <div class="col">
                    <div class="alert alert-warning small fst-italic" role="alert">
                        Keeping it fresh! Only active items are shown. Looking for closed or canceled complaints? Check them out <nuxt-link to="/powerserve/complaints"> here. </nuxt-link>
                    </div>
                </div>
            </div>

            <div class="row mb-3 g-3">
                <div class="col-lg-4">
                    <div class="border rounded p-3">
                        <PowerserveSearchComplaints />
                    </div>
                </div>
                <div class="col-lg-8">
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

            <div class="row">
                <div class="col">
                    <PowerserveComplaintsList
                        :complaints="store.complaints" 
                        @view-details="onViewComplaintDetails"
                    />
                </div>
            </div>
            
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
.soft-wrapper {
    background: #f8f9fa;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}


</style>
