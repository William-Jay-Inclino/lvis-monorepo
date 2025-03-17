<template>
    
    <div v-if="authUser" class="container-fluid px-3 px-md-5 mt-md-3">

        <div class="row g-5 mb-3">
            <div class="col-lg-8">
                <PowerserveStatusDetails :statuses="store.task_statuses"/>
            </div>
            <div class="col-lg-4">
                <PowerserveTaskRating :score="5" />
            </div>
        </div>

        <div class="row g-5 justify-content-center mt-3">
            <div class="col-lg-8">
                <PowerserveTasksContainer :tasks="store.tasks_by_assignee" :task_statuses="store.task_statuses" />
            </div>
            <div class="col-lg-4">
                <PowerservePendingTasks :pending_tasks="store.pending_tasks"/>
            </div>
        </div>

        

    </div>


</template>



<script setup lang="ts">

    import { useTaskStore } from '~/composables/powerserve/tasks/tasks.store'
    import * as taskApi from '~/composables/powerserve/tasks/task.api'

    definePageMeta({
        name: ROUTES.LINEMAN_DASHBOARD,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const authUser = ref<AuthUser>()
    const store = useTaskStore()


    onMounted(async() => {
        authUser.value = await getAuthUserAsync()

        const assignee_id = authUser.value.user.user_employee?.employee_id

        if(!assignee_id) {
            console.error('assignee_id is undefined');
            return 
        }

        const { tasks_by_assignee, task_statuses, pending_tasks } = await taskApi.init_data({ assignee_id })

        store.set_tasks_by_assignee({ tasks_by_assignee })
        store.set_pending_tasks({ pending_tasks })
        store.set_task_statuses({ task_statuses })

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
