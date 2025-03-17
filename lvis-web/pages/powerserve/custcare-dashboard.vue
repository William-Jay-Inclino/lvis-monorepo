<template>
    <div v-if="authUser" class="container-fluid px-3 px-md-5 mt-md-3">

        <div class="row g-5 mb-3">
            <div class="col-lg-8 col-md-10 col-sm-12">
                <PowerserveComplaintStatusCount />
            </div>
            <div class="col-lg-4 col-md-2 col-sm-12 d-flex align-items-center justify-content-center">
                <button
                    type="button"
                    class="soft-emphasis-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#complaint_form_modal"
                >
                    <client-only>
                        <font-awesome-icon :icon="['fas', 'plus']" class="me-2" />
                    </client-only>
                    Add Complaint
                </button>
            </div>
        </div>


        <div class="row g-5">
            <div class="col-lg-8 col-md-12">

                <PowerserveComplaintsContainer
                    :complaint_statuses="store.complaint_statuses" 
                    @view_complaint_details="handleViewDetails"
                />

            </div>

            <div class="col-lg-4 col-md-12">
                <div class="row">
                    <div class="col-12 mb-3" v-for="area in store.areas" :key="area.id">
                        <PowerserveArea :area="area" />
                    </div>
                </div>
            </div>

        </div>

        <PowerserveComplaintFormModal
            :nature_of_complaints="store.nature_of_complaints" 
            :municipalities="store.municipalities"
            :report_types="store.report_types"
            :assignments="store.assignments"
        />

        <PowerserveComplaintDetailsModal :complaint="selected_complaint" />

    </div>
</template>

<script setup lang="ts">
    import { useComplaintStore } from '~/composables/powerserve/complaints/complaints.store';
    import { PowerserveComplaintFormModal } from '#components';
    import type { Complaint } from '~/composables/powerserve/complaints/complaints.types';
    import * as complaintApi from '~/composables/powerserve/complaints/complaints.api'

    definePageMeta({
        name: ROUTES.CUSTCARE_DASHBOARD,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const authUser = ref<AuthUser>()
    const store = useComplaintStore()

    // item selected for viewing the details
    const selected_complaint = ref<Complaint>()

    onMounted( async() => {
        authUser.value = getAuthUser()

        const { 
            complaints, 
            complaint_statuses,
            nature_of_complaints,
            areas,
            departments,
            divisions,
            report_types 
        } = await complaintApi.init_data()

        store.set_complaints({ complaints })
        store.set_complaint_statuses({ complaint_statuses })
        store.set_nature_of_complaints({ nature_of_complaints })
        store.set_areas({ areas })
        store.set_departments({ departments })
        store.set_divisions({ divisions })
        store.set_report_types({ report_types })
    })

    function handleViewDetails(payload: { complaint: Complaint }) {

        selected_complaint.value = payload.complaint

    }

</script>

<style scoped>
/* Remove margins on small screens */
@media (max-width: 768px) {
    .container-fluid {
        padding-left: 1rem;
        padding-right: 1rem;
        margin-top: 0;
    }
}


.soft-emphasis-btn {
    background-color: #50c878; /* Soft green */
    color: white;
    border-radius: 15px;
    border: none;
    padding: 40px;
    font-size: 2rem;
    font-weight: bold;
    width: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Soft shadow */
    transition: all 0.3s ease-in-out;
}

.soft-emphasis-btn:hover {
    background-color: #45b36b; /* Slightly darker green on hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* More depth on hover */
}


</style>
