<template>
    
    <div v-if="authUser" class="container-fluid px-3 px-md-5 mt-md-5">

        <div class="row justify-content-center">
            <div class="col-lg-7 col-md-6 col-sm-12">
                <PowerserveTasksList :tasks="store.not_pending_tasks" :task_statuses="store.task_statuses" />
            </div>
        <div class="col-lg-5 col-md-6 col-sm-12">
            <PowerservePendingTasks :pending_tasks="store.pending_tasks"/>
        </div>
        </div>

    </div>


</template>



<script setup lang="ts">

    import { useTaskStore } from '~/composables/powerserve/tasks/tasks.store'

    definePageMeta({
        name: ROUTES.LINEMAN_DASHBOARD,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const store = useTaskStore()

    const authUser = ref<AuthUser>()

    onMounted(() => {
        authUser.value = getAuthUser()
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
