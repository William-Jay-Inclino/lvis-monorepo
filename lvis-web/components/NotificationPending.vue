<template>
    <div v-if="authUser" class="position-relative">
        <nuxt-link class="nav-link position-relative"  to="/notifications/pendings">
            <font-awesome-icon class="text-white" :icon="['fas', 'clock']" />
            <span v-if="isApprover(authUser)" class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                {{ totalPendings }}
            </span>
        </nuxt-link>
    </div>
</template>


<script setup lang="ts">

    import { fetchTotalNotifications } from '~/composables/system/user/user.api';
    
    const config = useRuntimeConfig()
    const WAREHOUSE_API_URL = config.public.warehouseApiUrl

    const authUser = ref<AuthUser >()
    let updateUserInterval: ReturnType<typeof setInterval>;

    onMounted(async() => {

        authUser.value = await getAuthUserAsync()
        await updateTotalNotifications()
        updateUserInterval = setInterval(updateTotalNotifications, UPDATE_TOTAL_NOTIFS_INTERVAL);
    })

    const totalPendings = computed(() => {
        if (!authUser.value) return
        if (authUser.value.user.user_employee?.employee.total_pending_approvals) {
            return authUser.value.user.user_employee?.employee.total_pending_approvals
        }
        return 0
    })

    async function updateTotalNotifications() {
        console.log('updateTotalNotifications');
        
        if(!authUser.value) return 

        if(authUser.value.user.user_employee) {
            const response = await fetchTotalNotifications(authUser.value.user.user_employee.employee_id, WAREHOUSE_API_URL)
            if(response !== undefined) {
                authUser.value.user.user_employee.employee.total_pending_approvals = response
                const newAuthUser = JSON.stringify(authUser.value);
                localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, newAuthUser);
            }
        }

    }

    const isApprover = (authUser: AuthUser) => {

        const total_pendings = authUser.user.user_employee?.employee.total_pending_approvals
        if (total_pendings && total_pendings > 0) {
            return true
        }

    }

</script>