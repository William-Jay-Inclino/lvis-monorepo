<template>
    <div class="card">
        <div class="card-body">
            <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3">
                <client-only>
                    <font-awesome-icon class="me-1" :icon="['fas', 'tasks']" />
                </client-only>
                My Tasks 
            </h5>

            <div v-if="store.tasks_by_assignee.length === 0" class="text-center small">
                <span class="text-muted fst-italic">No items available</span>
            </div>

            <div v-else-if="is_loading_assignee_task_table" class="text-center">
                <span class="text-muted fst-italic">Loading please wait...</span>
            </div>

            <div v-else class="table-responsive">
                <table class="table table-hover table-borderless">
                    <thead>
                        <tr>
                            <th class="bg-secondary text-white"> Description </th>
                            <th class="bg-secondary text-white"> Activity </th>
                            <th class="bg-secondary text-white"> Date </th>
                            <th class="bg-secondary text-white"> Status </th>
                            <th class="bg-secondary text-center text-white">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                </client-only>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="task in store.tasks_by_assignee">
                            <td class="text-muted align-middle">
                                <textarea readonly class="form-control form-control-sm small text-muted">{{ task.description }}</textarea>
                            </td>
                            <td class="text-muted align-middle">
                                <textarea readonly class="form-control form-control-sm small text-muted">{{ task.activity ? task.activity.name : 'N/A' }}</textarea>
                            </td>
                            <td class="text-muted align-middle text-nowrap"> {{ formatDate(task.created_at, true) }} </td>
                            <td class="text-muted align-middle">
                                <div :class="`badge soft-badge soft-badge-${ task.status?.color_class }`">
                                    {{ task.status?.name }}
                                </div>
                            </td>
                            <td class="text-center align-middle text-nowrap">
                                <button @click="onViewAssigneeTask({ task })" class="btn btn-light text-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#task_details_modal">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'eye']" />
                                    </client-only>
                                    View 
                                </button>

                                <button v-if="task.status?.id === TASK_STATUS.ASSIGNED" @click="setOngoingStatus({ task })" class="btn btn-light text-success btn-sm me-2">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'edit']" />
                                    </client-only> 
                                    Update 
                                </button>

                                <button v-if="task.status?.id === TASK_STATUS.ASSIGNED" @click="cancelTask({ task })" class="btn btn-light text-danger btn-sm">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'times']" />
                                    </client-only> 
                                    Cancel 
                                </button>

                                <button :disabled="!can_update_task_info({ status_id: task.status!.id })" v-else @click="onViewAssigneeTask({ task })" class="btn btn-light text-success btn-sm me-2" data-bs-toggle="modal" data-bs-target="#update_task_modal">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'edit']" />
                                    </client-only> 
                                    Update 
                                </button>

                                <!-- UI purposes only for alignment -->
                                <button v-show="task.status?.id !== TASK_STATUS.ASSIGNED" class="btn btn-light text-secondary btn-sm" disabled>
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'times']" />
                                    </client-only> 
                                    Cancel 
                                </button>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="store.tasks_by_assignee.length > 0" class="row pt-4">
                <div class="col">
                    <nav>
                        <ul class="pagination justify-content-center">
                            <!-- Previous Button -->
                            <li class="page-item" :class="{ disabled: store.pagination.currentPage === 1 }">
                                <a class="page-link" @click="changePageAssigneeTask(store.pagination.currentPage - 1)" href="#">Previous</a>
                            </li>

                            <!-- First Page -->
                            <li v-if="store.visiblePages[0] > 1" class="page-item">
                                <a class="page-link" @click="changePageAssigneeTask(1)" href="#">1</a>
                            </li>
                            <li v-if="store.visiblePages[0] > 2" class="page-item disabled">
                                <span class="page-link">...</span>
                            </li>

                            <!-- Visible Pages -->
                            <li
                                v-for="page in store.visiblePages"
                                :key="page"
                                class="page-item"
                                :class="{ active: store.pagination.currentPage === page }"
                                >
                                <a class="page-link" @click="changePageAssigneeTask(page)" href="#">{{ page }}</a>
                            </li>

                            <!-- Last Page -->
                            <li v-if="store.visiblePages[store.visiblePages.length - 1] < store.pagination.totalPages - 1" class="page-item disabled">
                                <span class="page-link">...</span>
                            </li>
                            <li v-if="store.visiblePages[store.visiblePages.length - 1] < store.pagination.totalPages" class="page-item">
                                <a class="page-link" @click="changePageAssigneeTask(store.pagination.totalPages)" href="#">{{ store.pagination.totalPages }}</a>
                            </li>

                            <!-- Next Button -->
                            <li class="page-item" :class="{ disabled: store.pagination.currentPage === store.pagination.totalPages }">
                                <a class="page-link" @click="changePageAssigneeTask(store.pagination.currentPage + 1)" href="#">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

        </div>
        </div>
</template>


<script setup lang="ts">
    import { useMyTaskStore } from '~/composables/powerserve/task/my-task.store';
    import { TASK_STATUS } from '~/composables/powerserve/task/task.constants';
    import type { Task } from '~/composables/powerserve/task/task.types';
    import { can_update_task_info } from '~/composables/powerserve/task/task.helpers';

    const props = defineProps({
        is_loading_assignee_task_table: {
            type: Boolean,
            default: false
        },
    });

    const emits = defineEmits(['view-assignee-task', 'set-ongoing-status', 'change-page-assignee-task', 'cancel-task']);

    const store = useMyTaskStore()


    const onViewAssigneeTask = (payload: { task: Task }) => {
        emits('view-assignee-task', { task: deepClone(payload.task) })
    }

    const setOngoingStatus = (payload: { task: Task }) => {
        emits('set-ongoing-status', { task: deepClone(payload.task) })
    }

    const cancelTask = (payload: { task: Task }) => {
        emits('cancel-task', { task: deepClone(payload.task) })
    }

    const changePageAssigneeTask = (page: number) => {
        emits('change-page-assignee-task', page)
    }

</script>