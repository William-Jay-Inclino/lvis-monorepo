<template>
    <div class="soft-wrapper p-3 shadow-sm">
        <div class="card-body">
            <div class="row mb-3">

                <!-- Filter Container -->
                <div class="col-lg-12">
                    <div class="border rounded p-3">
                        <PowerserveFilterPendingTasks />
                    </div>
                </div>
            </div>

            <PowerservePendingTaskList :pending_tasks="pending_tasks" @view-pending-task="handleViewPendingTask"/>

        </div>
    </div>

    <PowerservePendingTaskModal
        :task="selected_pending_task"
        :is_accepting_task="is_accepting_task" 
        :is_accept_and_starting_task="is_accept_and_starting_task" 
        @accept="handleAccept"
    />

</template>


<script setup lang="ts">
    import type { AssignTaskInput, Task } from '~/composables/powerserve/tasks/tasks.types';
    import { useTaskStore } from '~/composables/powerserve/tasks/tasks.store';
    import Swal from 'sweetalert2'
    import * as taskApi from '~/composables/powerserve/tasks/task.api'

    const props = defineProps({
        pending_tasks: {
            type: Object as () => Task[],
            default: () => [],
        },
    });

    const store = useTaskStore()
    const authUser = ref<AuthUser>()

    // item selected for viewing the pending task
    const selected_pending_task = ref<Task>()
    const is_accepting_task = ref(false)
    const is_accept_and_starting_task = ref(false)

    onMounted(async() => {
        authUser.value = await getAuthUserAsync()
    })

    function handleViewPendingTask(payload: { task: Task }) {

        selected_pending_task.value = payload.task

    }

    async function handleAccept(payload: { task: Task, accept_and_start: boolean, close_btn_modal: HTMLButtonElement }) {
        console.log('handleAccept', payload);
        const { task, accept_and_start, close_btn_modal } = payload
        
        if(!authUser.value?.user.user_employee?.employee) {
            console.error('authUser is not an employee');
            return 
        }

        const assign_to = authUser.value?.user.user_employee?.employee

        const input: AssignTaskInput = {
            task,
            assign_to,
            remarks: 'TBA',
            will_start: accept_and_start,
        }

        if(accept_and_start) {
            is_accept_and_starting_task.value = true
        }

        set_accept_task_loader({ accept_and_start, is_loading: true })
        const result = await taskApi.asign_task(input)
        set_accept_task_loader({ accept_and_start, is_loading: false })

        if(result.success && result.data) {

            store.add_tasks_by_assignee({ task: result.data })
            store.remove_pending_task({ task_id: task.id })

            Swal.fire({
                title: 'Success!',
                text: result.msg,
                icon: 'success',
                position: 'top',
            })

            close_btn_modal.click()

        } else {
            Swal.fire({
                title: 'Error!',
                text: result.msg,
                icon: 'error',
                position: 'top',
            })
        }



    }

    function set_accept_task_loader(payload: { accept_and_start: boolean, is_loading: boolean }) {
        const { accept_and_start, is_loading } = payload

        if(accept_and_start) {
            is_accept_and_starting_task.value = is_loading 
        } else {
            is_accepting_task.value = is_loading
        }

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
