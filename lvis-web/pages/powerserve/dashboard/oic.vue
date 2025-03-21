<template>

    <div class="container">
        
    </div>


</template>


<script setup lang="ts">

    import { ROUTES } from '~/utils/constants';
    import { useOicDashboardStore } from '~/composables/powerserve/oic_dashboard/oic_dashboard.store';
    import type { Complaint } from '~/composables/powerserve/complaint/complaint.types';
    import * as oicDashboardApi from '~/composables/powerserve/oic_dashboard/oic_dashboard.api'

    definePageMeta({
        name: ROUTES.OIC_DASHBOARD,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const router = useRouter()
    const store = useOicDashboardStore()

    onMounted( async() => {
        authUser.value = getAuthUser()
        isLoadingPage.value = false

        const { escalated_complaints } = await oicDashboardApi.init_data()
        store.set_escalated_complaints({ escalated_complaints })

    })

</script>


<style scoped>

    .container {
        max-width: 1600px; 
        margin: 0 auto; 
    }

</style>