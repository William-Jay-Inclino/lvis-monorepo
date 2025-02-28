<template>
    
    <div v-if="authUser" class="ms-3 me-3 mt-5">

        <div class="row g-5">
            <div class="col-6">
                <div class="row">
                    <div class="col-6 mb-3" v-for="area in store.areas">
                        <PowerserveArea :area="area" />
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="row">
                    <div class="col-12 mb-3" v-for="status in store.complaint_statuses">
                        <PowerserveComplaintsList :complaint-status="status" />
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
