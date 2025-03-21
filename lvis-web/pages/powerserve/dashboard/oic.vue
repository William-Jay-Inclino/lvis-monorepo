<template>

    <div class="container">
        
    </div>


</template>


<script setup lang="ts">

import { ROUTES } from '~/utils/constants';
import { useComplaintStore } from '~/composables/powerserve/complaint/complaint.store';

definePageMeta({
    name: ROUTES.OIC_DASHBOARD,
    layout: "layout-powerserve",
    middleware: ['auth']
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const router = useRouter()
const store = useComplaintStore()
</script>


<style scoped>

    .container {
        max-width: 1600px; 
        margin: 0 auto; 
    }

</style>