<template>
    <div v-if="authUser" class="container-fluid px-3 px-md-5 mt-md-5">
        <div class="row">
            <div class="col">
                <button class="btn btn-success mb-2 fw-bold">Add Complaint</button>
            </div>
        </div>

        <div class="row g-5">
            <div class="col-lg-8 col-md-12">
                <div class="row">
                    <div class="col-12 mb-3">
                        <PowerserveComplaintsContainer :complaint_statuses="store.complaint_statuses" />
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
    </div>
</template>

<script setup lang="ts">
import { useComplaintStore } from '~/composables/powerserve/complaints/complaints.store';
import {
    complaints,
    complaintStatuses,
    natureOfComplaints,
    areas,
    municipalities,
    departments,
    divisions,
} from '~/composables/powerserve/complaints/complaints.mock-data'

definePageMeta({
    name: ROUTES.CUSTCARE_DASHBOARD,
    layout: "layout-powerserve",
    middleware: ['auth']
})

const authUser = ref<AuthUser>()
const store = useComplaintStore()

onMounted(() => {
    authUser.value = getAuthUser()
    store.set_complaints({ complaints: complaints.map(i => ({...i})) })
    store.set_complaint_statuses({ complaint_statuses: complaintStatuses.map(i => ({...i})) })
    store.set_nature_of_complaints({ nature_of_complaints: natureOfComplaints.map(i => ({...i})) })
    store.set_areas({ areas: areas.map(i => ({...i})) })
    store.set_municipalities({ municipalities: municipalities.map(i => ({...i})) })
    store.set_departments({ departments: departments.map(i => ({...i})) })
    store.set_divisions({ divisions: divisions.map(i => ({...i})) })
})
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
