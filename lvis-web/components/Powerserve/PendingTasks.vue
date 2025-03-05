<template>
    <div class="soft-wrapper p-3 shadow-sm">
        <div class="card-body">

            <div class="mb-3 mt-3 d-flex flex-wrap justify-content-md-end gap-2 me-3">
                <button type="button" class="btn soft-btn-gray position-relative">
                    Total Pending Tasks
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red">2</span>
                </button>
            </div>


            <div class="row mb-3">
                <!-- Search Container -->
                <div class="col-12 col-md-6 mb-3">
                    <div class="border rounded p-3">
                        <PowerserveSearchTasks />
                    </div>
                </div>

                <!-- Filter Container -->
                <div class="col-12 col-md-6">
                    <div class="border rounded p-3">
                        <PowerserveFilterTasks />
                    </div>
                </div>
            </div>

            <PowerservePendingTaskList :pending_tasks="pending_tasks" @view-pending-task="handleViewPendingTask"/>

        </div>
    </div>

    <PowerservePendingTaskModal :task="selected_pending_task" @accept="handleAccept"/>

</template>


<script setup lang="ts">
    import type { Task } from '~/composables/powerserve/tasks/tasks.types';
    import { useTaskStore } from '~/composables/powerserve/tasks/tasks.store';
    import { TASK_STATUS } from '~/composables/powerserve/tasks/task.constants';
    import Swal from 'sweetalert2'

    const props = defineProps({
        pending_tasks: {
            type: Object as () => Task[],
            default: () => [],
        },
    });

    const store = useTaskStore()

    // item selected for viewing the pending task
    const selected_pending_task = ref<Task>()

    function handleViewPendingTask(payload: { task: Task }) {

        selected_pending_task.value = payload.task

    }

    function handleAccept(payload: { task: Task, accept_and_start: boolean, close_btn_modal: HTMLButtonElement }) {
        /* 
            if start = false
            - change task status to assigned
            - update assign_to_id
            - add task log
        */
        console.log('handleAccept', payload);
        const { task, accept_and_start, close_btn_modal } = payload

        if(!accept_and_start) {
            store.update_task_status({ task, status_id: TASK_STATUS.ASSIGNED })
        } else {
            store.update_task_status({ task, status_id: TASK_STATUS.ONGOING })
        }

        close_btn_modal.click()

        Swal.fire({
            title: 'Success!',
            text: 'Task successfully accepted!',
            icon: 'success',
            position: 'top',
        })

    }

</script>

<style scoped>
/* Fixed Card Height */
.soft-wrapper {
    background: #f8f9fa; /* Light gray */
    border-radius: 12px;
    /* height: 600px;  */
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Ensure the Card Body Fills the Space */
.card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Scrollable Table */
/* .table-responsive {
    flex-grow: 1;
    max-height: 500px;
    overflow-y: auto;
} */

/* Soft Header */
.soft-header {
    background: #e6e0f8; /* Pastel lavender */
    color: #4a3f78; /* Muted purple */
    font-weight: bold;
}


/* Small Textarea */
.small-textarea {
    font-size: 0.875rem; /* Small text */
    height: 60px; /* Reduce height */
    padding: 5px;
    resize: none; /* Prevent resizing */
}

/* Search & Filter */
.d-flex {
    gap: 8px; /* Reduce gap */
}

.search-input {
    width: 230px;
    border-radius: 6px;
    padding: 6px 10px;
}

.filter-dropdown {
    width: 160px;
    border-radius: 6px;
    padding: 6px 10px;
}
</style>
