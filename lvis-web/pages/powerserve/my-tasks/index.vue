<template>

    <div v-if="!isLoadingPage && authUser" class="container">

        <PowerserveStatusDetails :statuses="store.task_statuses" />

        <div class="row mt-3">
            <div class="col-lg-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <h2 class="text-warning">Pending Tasks</h2>
                        <hr>

                        <div class="responsive">
                            <table class="table table-striped table-sm small">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white"> Ref # </th>
                                        <th class="bg-secondary text-white"> Date </th>
                                        <th class="bg-secondary text-white"> Description </th>
                                        <th class="bg-secondary text-center text-white">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'cog']" />
                                            </client-only>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="task in store.pending_tasks">
                                        <td class="text-muted align-middle"> {{ task.ref_number }} </td>
                                        <td class="text-muted align-middle"> {{ formatDate(task.created_at) }} </td>
                                        <td class="text-muted align-middle">
                                            <textarea readonly class="form-control form-control-sm small text-muted">{{ task.description }}</textarea>
                                        </td>
                                        <td class="align-middle text-center">
                                            <button @click="onViewPendingTask({ task })" class="btn btn-sm btn-light text-primary" data-bs-toggle="modal" data-bs-target="#accept_task_modal"> View </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-lg-8 mt-3">
                <div class="card">
                    <div class="card-body">
                        <h2 class="text-warning">My Tasks</h2>
                        <hr>

                        <div v-if="store.tasks_by_assignee.length === 0" class="text-center">
                            <span class="text-muted fst-italic">No items available</span>
                        </div>

                        <div v-else class="responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white"> Ref # </th>
                                        <th class="bg-secondary text-white"> Description </th>
                                        <th class="bg-secondary text-white"> Activity </th>
                                        <th class="bg-secondary text-white"> Status </th>
                                        <th class="bg-secondary text-white"> Date </th>
                                        <th class="bg-secondary text-center text-white">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'cog']" />
                                            </client-only>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="task in store.tasks_by_assignee">
                                        <td class="text-muted align-middle"> {{ task.ref_number }} </td>
                                        <td class="text-muted align-middle">
                                            <textarea readonly class="form-control form-control-sm small text-muted">{{ task.description }}</textarea>
                                        </td>
                                        <td class="text-muted align-middle"> {{ task.activity ? task.activity.name : 'N/A' }} </td>
                                        <td class="text-muted align-middle">
                                            <div :class="`badge soft-badge soft-badge-${ task.status?.color_class }`">
                                                {{ task.status?.name }}
                                            </div>
                                        </td>
                                        <td class="text-muted align-middle"> {{ formatDate(task.created_at) }} </td>
                                        <td>
                                            <button class="btn btn-primary"> View Details </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <PowerserveAcceptTaskModal :task="selected_pending_task" @accept-task="handleAcceptTask"/>

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>


</template>


<script setup lang="ts">

    import type { Task } from '~/composables/powerserve/task/task.types';
    import { ROUTES } from '~/utils/constants';
    import * as myTaskApi from '~/composables/powerserve/task/my-task.api'
    import { useMyTaskStore } from '~/composables/powerserve/task/my-task.store';

    definePageMeta({
        name: ROUTES.PENDING_TASK_INDEX,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const store = useMyTaskStore()

    const selected_pending_task = ref<Task>()


    onMounted(async () => {

        authUser.value = await getAuthUserAsync()

        if(!authUser.value.user.user_employee) {
            return redirectTo401Page() 
        }

        const employee_id = authUser.value.user.user_employee.employee.id

        const { pending_tasks, tasks_by_assignee_response, task_statuses } = await myTaskApi.init_data({
            assignee_id: employee_id,
            page: store.pagination.pageSize,
            pageSize: store.pagination.pageSize,
        })

        const { data, totalItems, currentPage, totalPages } = tasks_by_assignee_response

        isLoadingPage.value = false

        store.set_tasks_by_assignee({ items: data })
        store.set_pending_tasks({ items: pending_tasks })
        store.set_task_statuses({ task_statuses })
        store.set_pagination({ currentPage, totalPages, totalItems })
    })


    function onViewPendingTask(payload: { task: Task }) {

        const { task } = payload

        selected_pending_task.value = task

    }

    function handleAcceptTask(payload: { task: Task, will_start: boolean, note: string, closeBtnModal: HTMLButtonElement }) {

        const { task, will_start, note, closeBtnModal } = payload

        console.log('handleAcceptTask', payload);

        selected_pending_task.value = task

    }


</script>



<style scoped>

    .container {
        max-width: 2000px; 
        margin: 0 auto; 
    }

</style>