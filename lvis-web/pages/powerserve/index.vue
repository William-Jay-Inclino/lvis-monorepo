<template>
    
    <div v-if="authUser" class="ms-5 me-5 mt-5">

        <div class="row">
            <div class="col">
                <button class="btn btn-success mb-2 fw-bold">Add Complaint</button>
            </div>
        </div>

        <div class="row g-5">
            <div class="col-8">
                <div class="row">
                    <div class="col-12 mb-3">
                        <PowerserveComplaintsList :complaint-status="store.complaint_statuses[0]" />
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="row">
                    <div class="col-12 mb-3" v-for="area in store.areas">
                        <PowerserveArea :area="area" />
                    </div>
                </div>
            </div>
        </div>


    </div>


</template>



<script setup lang="ts">

    import { areas, complaintStatuses } from '~/composables/powerserve/complaints/complaints.mock-data';
    import { usePowerserveDashboardStore } from '~/composables/powerserve/dashboard.store';

    definePageMeta({
        name: ROUTES.DASHBOARD,
        layout: "layout-powerserve",
        middleware: ['auth']
    })


    const authUser = ref<AuthUser>()
    const store = usePowerserveDashboardStore()

    onMounted(() => {
        authUser.value = getAuthUser()
        store.set_areas({ areas: areas.map(i => ({...i})) })
        store.set_complaint_statuses({ complaint_status: complaintStatuses.map(i => ({...i})) })
    })


</script>


<style scoped>

</style>
