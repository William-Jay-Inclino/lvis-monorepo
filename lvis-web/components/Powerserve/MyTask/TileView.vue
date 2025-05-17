<template>
    <div class="tile-view-container">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold m-0">
                <client-only>
                    <font-awesome-icon class="me-2" :icon="['fas', 'tasks']" />
                </client-only>
                My Tasks
            </h3>
            <div v-if="store.tasks_by_assignee.length > 0" class="text-muted small">
                {{ store.pagination.totalItems }} tasks
            </div>
        </div>

        <div v-if="store.tasks_by_assignee.length === 0 && !is_loading_assignee_task_table" 
             class="empty-state bg-light rounded-3 p-5 text-center">
            <client-only>
                <font-awesome-icon :icon="['fas', 'inbox']" class="text-muted mb-3" size="2x" />
            </client-only>
            <p class="text-muted mb-0">No tasks assigned to you yet</p>
        </div>

        <div v-else-if="is_loading_assignee_task_table" class="loading-state text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mt-2 mb-0">Loading your tasks...</p>
        </div>

        <div v-else class="tile-grid">
            <div v-for="task in store.tasks_by_assignee" class="task-tile">
                <div class="tile-header">
                    <span :class="`badge soft-badge soft-badge-${ task.status?.color_class }`">
                        {{ task.status?.name }}
                    </span>
                    <span class="task-date text-muted small">{{ formatDate(task.created_at, true) }}</span>
                </div>
                
                <h6 class="task-title">
                    <template v-if="task.activity?.name">
                        {{ task.activity.name }}
                    </template>
                    <template v-else>
                        <span class="text-muted fst-italic">No activity</span>
                    </template>
                </h6>
                
                <p class="task-description text-muted">
                    {{ task.description || 'No description provided' }}
                </p>
                
                <div class="tile-actions">
                    <button @click="onViewAssigneeTask({ task })" 
                            class="btn btn-sm btn-action view-btn"
                            data-bs-toggle="modal" 
                            data-bs-target="#task_details_modal">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'eye']" />
                        </client-only>
                        Details
                    </button>

                    <button v-if="task.status?.id === TASK_STATUS.ASSIGNED" 
                            @click="setOngoingStatus({ task })" 
                            class="btn btn-sm btn-action update-btn">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'edit']" />
                        </client-only>
                        Start
                    </button>

                    <button v-else 
                            :disabled="!can_update_task_info({ status_id: task.status!.id })" 
                            @click="onViewAssigneeTask({ task })" 
                            class="btn btn-sm btn-action update-btn"
                            data-bs-toggle="modal" 
                            data-bs-target="#update_task_modal">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'edit']" />
                        </client-only>
                        Update
                    </button>
                </div>
            </div>
        </div>

        <div v-if="store.tasks_by_assignee.length > 0" class="pagination-container mt-4">
            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: store.pagination.currentPage === 1 }">
                        <a class="page-link" @click="changePageAssigneeTask(store.pagination.currentPage - 1)" href="#">
                            &laquo; Previous
                        </a>
                    </li>

                    <li v-if="store.visiblePages[0] > 1" class="page-item">
                        <a class="page-link" @click="changePageAssigneeTask(1)" href="#">1</a>
                    </li>
                    <li v-if="store.visiblePages[0] > 2" class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>

                    <li v-for="page in store.visiblePages"
                        :key="page"
                        class="page-item"
                        :class="{ active: store.pagination.currentPage === page }">
                        <a class="page-link" @click="changePageAssigneeTask(page)" href="#">{{ page }}</a>
                    </li>

                    <li v-if="store.visiblePages[store.visiblePages.length - 1] < store.pagination.totalPages - 1" 
                        class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                    <li v-if="store.visiblePages[store.visiblePages.length - 1] < store.pagination.totalPages" 
                        class="page-item">
                        <a class="page-link" @click="changePageAssigneeTask(store.pagination.totalPages)" href="#">
                            {{ store.pagination.totalPages }}
                        </a>
                    </li>

                    <li class="page-item" :class="{ disabled: store.pagination.currentPage === store.pagination.totalPages }">
                        <a class="page-link" @click="changePageAssigneeTask(store.pagination.currentPage + 1)" href="#">
                            Next &raquo;
                        </a>
                    </li>
                </ul>
            </nav>
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

    const emits = defineEmits(['view-assignee-task', 'set-ongoing-status', 'change-page-assignee-task'])

    const store = useMyTaskStore()

    const onViewAssigneeTask = (payload: { task: Task }) => {
        emits('view-assignee-task', { task: deepClone(payload.task) })
    }

    const setOngoingStatus = (payload: { task: Task }) => {
        emits('set-ongoing-status', { task: deepClone(payload.task) })
    }

    const changePageAssigneeTask = (page: number) => {
        emits('change-page-assignee-task', page)
    }
</script>

<style scoped>
    .tile-view-container {
        padding: 1.5rem;
        background: white;
        border-radius: 0.75rem;
    }

    .empty-state {
        border: 1px dashed var(--bs-border-color);
    }

    .loading-state {
        background: rgba(255, 255, 255, 0.8);
        border-radius: 0.5rem;
    }

    .tile-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.25rem;
    }

    .task-tile {
        background: white;
        border-radius: 0.75rem;
        padding: 1.25rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--bs-border-color-translucent);
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .task-tile:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        border-color: var(--bs-primary);
    }

    .tile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }

    .status-badge {
        font-size: 0.7rem;
        padding: 0.35em 0.65em;
        border-radius: 0.5rem;
    }

    .task-date {
        font-size: 0.75rem;
    }

    .task-title {
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--bs-heading-color);
    }

    .task-description {
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 1.25rem;
        flex-grow: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .tile-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: auto;
    }

    .btn-action {
        border-radius: 0.5rem;
        padding: 0.375rem 0.75rem;
        font-size: 0.8rem;
        flex: 1;
    }

    .view-btn {
        background-color: var(--bs-primary-bg-subtle);
        color: var(--bs-primary);
        border: 1px solid var(--bs-primary-border-subtle);
    }

    .update-btn {
        background-color: var(--bs-success-bg-subtle);
        color: var(--bs-success);
        border: 1px solid var(--bs-success-border-subtle);
    }

    .btn-action:hover {
        opacity: 0.9;
    }

    .page-link {
        cursor: pointer;
    }
</style>