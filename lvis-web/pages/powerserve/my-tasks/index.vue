<template>

    <div v-if="!isLoadingPage && authUser" class="container">

        <div class="row">
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-body">
                        <h2 class="text-warning">Pending Tasks</h2>
                        
                        <hr>
                    </div>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-body">
                        <h2 class="text-warning">My Tasks</h2>
                    
                        <hr>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <LoaderSpinner />
    </div>


</template>


<script setup lang="ts">

import { ROUTES } from '~/utils/constants';
import { useTaskStore } from '~/composables/powerserve/task/task.store';

definePageMeta({
    name: ROUTES.PENDING_TASK_INDEX,
    layout: "layout-powerserve",
    middleware: ['auth']
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const router = useRouter()
const store = useTaskStore()
// flags

const isInitialLoad = ref(true)
const isSearching = ref(false)

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()

    // const { taskes, employees } = await api.fetchDataInSearchFilters()
    // store.set_search_filters({ taskes, employees })
    isLoadingPage.value = false

})

</script>



<style scoped>

    .container {
        max-width: 1800px; 
        margin: 0 auto; 
    }

</style>