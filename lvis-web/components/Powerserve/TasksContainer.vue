<template>
    <div class="soft-wrapper p-4 shadow-sm">
        <div class="card-body">

            <div class="row mb-3 g-3">
                <div class="col-lg-4">
                    <div class="border rounded p-3">
                        <PowerserveSearchTasks />
                    </div>
                </div>

                <div class="col-lg-8">
                    <div class="border rounded p-3">
                        <PowerserveFilterTaskList />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <PowerserveTasksList :tasks="tasks" />
                </div>
            </div>
            
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

</script>

<style scoped>
.soft-wrapper {
    background: #f8f9fa;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

</style>
