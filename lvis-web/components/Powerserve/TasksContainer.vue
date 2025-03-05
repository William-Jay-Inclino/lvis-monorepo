<template>
    <div class="soft-wrapper p-3 shadow-sm">
        <div class="card-body">
            <div class="mb-3 mt-3 d-flex flex-wrap justify-content-md-end gap-2 me-3">
                <button
                    v-for="status in store.not_pending_task_statuses"
                    type="button"
                    class="btn position-relative"
                    :class="`soft-btn-${status.color_class}`"
                  >
                    {{ status.name }}
                    <span class="position-absolute top-0 start-100 translate-middle badge soft-badge-red"> {{ status.total }} </span>
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

            <PowerserveTasksList :tasks="tasks" />
            
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Task, TaskStatus } from '~/composables/powerserve/tasks/tasks.types';
    import { useTaskStore } from '~/composables/powerserve/tasks/tasks.store';

    const emits = defineEmits(['view_pending_task'])

    const props = defineProps({
        tasks: {
            type: Object as () => Task[],
            default: () => [],
        },
        task_statuses: {
            type: Array as () => TaskStatus[],
            default: () => [],
        }
    });

    const store = useTaskStore()

    function onViewPendingTask(payload: { task: Task }) {
        emits('view_pending_task', payload)
    }

</script>

<style scoped>
/* Base container */
.soft-wrapper {
    background: #f8f9fa;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Status buttons responsive */
.status-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
}

/* Soft Header */
.soft-header {
    background: #e6e0f8;
    color: #4a3f78;
    font-weight: bold;
}

/* Table adjustments */
.table-responsive {
    overflow-x: auto;
}

.table th,
.table td {
    white-space: nowrap;
}

/* Small Textarea */
.small-textarea {
    font-size: 0.875rem;
    height: 60px;
    padding: 5px;
    resize: none;
}

/* Form spacing */
.d-flex {
    gap: 8px;
}

select,
input {
    width: 100%;
}
</style>
