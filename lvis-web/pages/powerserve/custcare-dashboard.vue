<template>
    <div v-if="authUser" class="container-fluid px-3 px-md-5 mt-md-5">
        <div class="row">
            <div class="col">
                <button
                  type="button"
                  class="btn btn-success mb-2 fw-bold"
                  data-bs-toggle="modal"
                  data-bs-target="#complaint_form_modal"
                >
                Add Complaint
                </button>
            </div>
        </div>

        <div class="row g-5">
            <div class="col-lg-8 col-md-12">
                <div class="row">
                    <div class="col-12 mb-3">
                       <PowerserveComplaintsContainer
                            :complaint_statuses="store.complaint_statuses" 
                            @view_complaint_details="handleViewDetails"
                        />
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-12">
                <div class="row">
                    <div class="col-12 mb-3" v-for="area in store.areas" :key="area._id">
                        <PowerserveArea :area="area" :show_linemen_assigned="true" />
                    </div>
                </div>
            </div>
        </div>

        <PowerserveComplaintFormModal
            :nature_of_complaints="store.nature_of_complaints" 
            :municipalities="store.municipalities"
            :barangays="store.barangays"
            :sitios="store.sitios"
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

        const { complaints_response, complaint_statuses } = await complaintApi.init_data({
            complaint: {
                page: store.pagination.currentPage,
                pageSize: store.pagination.pageSize,
                created_at: null,
            }
        })

        const { data, currentPage, totalPages, totalItems } = complaints_response

        store.set_complaints({ complaints: data })
        store.set_pagination({ currentPage, totalPages, totalItems })
        store.set_complaint_statuses({ complaint_statuses })
        // store.set_nature_of_complaints({ nature_of_complaints: natureOfComplaints.map(i => ({...i})) })
        // store.set_areas({ areas: areas.map(i => ({...i})) })
        // store.set_municipalities({ municipalities: municipalities.map(i => ({...i})) })
        // store.set_barangays({ barangays: barangays.map(i => ({...i})) })
        // store.set_sitios({ sitios: sitios.map(i => ({...i})) })
        // store.set_departments({ departments: departments.map(i => ({...i})) })
        // store.set_divisions({ divisions: divisions.map(i => ({...i})) })
        // store.set_report_types({ report_types: complaintReportTypes.map(i => ({...i})) })
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
</style>
