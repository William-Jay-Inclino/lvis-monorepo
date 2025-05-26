<template>
    <div v-if="authUser" class="position-relative">
        <nuxt-link class="nav-link position-relative me-3"  to="/pendings">
            <span class="small fw-bold text-white d-none d-md-inline me-1">
                Pendings
            </span>
            <font-awesome-icon class="text-white me-1" :icon="['fas', 'hourglass-half']" />
            <span v-if="isApprover(authUser)" class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                  {{ store.total_pendings }}
            </span>
        </nuxt-link>
    </div>
</template>


<script setup lang="ts">

    import { fetchTotalNotifications } from '~/composables/system/user/user.api';
    import { usePendingStore } from '~/composables/pending/pending.store';
    
    const config = useRuntimeConfig()
    const WAREHOUSE_API_URL = config.public.warehouseApiUrl
    const store = usePendingStore()

    const authUser = ref<AuthUser >()
    let updateUserInterval: ReturnType<typeof setInterval>;

    onMounted(async() => {

        authUser.value = await getAuthUserAsync()
        await updateTotalNotifications()
        updateUserInterval = setInterval(updateTotalNotifications, UPDATE_TOTAL_NOTIFS_INTERVAL);
    })

    // const totalPendings = computed(() => {
    //     if (!authUser.value) return
    //     if (authUser.value.user.user_employee?.employee.total_pending_approvals) {
    //         return authUser.value.user.user_employee?.employee.total_pending_approvals
    //     }
    //     return 0
    // })

    async function updateTotalNotifications() {
        console.log('updateTotalNotifications');
        
        if(!authUser.value) return 

        if(authUser.value.user.user_employee) {
            const response = await fetchTotalNotifications(authUser.value.user.user_employee.employee_id, WAREHOUSE_API_URL)
            if(response !== undefined) {
                store.set_total_pendings({ total: response });
                console.log('total_pendings from store', store.total_pendings);
                // authUser.value.user.user_employee.employee.total_pending_approvals = response
                // const newAuthUser = JSON.stringify(authUser.value);
                // localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, newAuthUser);
            }
        }

    }

    const isApprover = (authUser: AuthUser) => {

        if(store.total_pendings && store.total_pendings > 0) {
            return true
        }
        return false

    }

</script>