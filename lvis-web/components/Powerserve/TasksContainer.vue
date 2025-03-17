<template>
    <div class="soft-wrapper p-3 shadow-sm">
        <div class="card-body">

            <div class="row mb-3">
                <!-- Search Container -->
                <div class="col-lg-4">
                    <div class="border rounded p-3">
                        <PowerserveSearchTasks />
                    </div>
                </div>

                <!-- Filter Container -->
                <div class="col-lg-8">
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
