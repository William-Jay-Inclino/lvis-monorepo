<template>
    <div class="d-flex justify-content-end">
        <button class="btn btn-sm soft-btn-yellow mb-1">
            <client-only>
                <font-awesome-icon :icon="['fas', 'refresh']" />
            </client-only>
            Refresh
        </button>
    </div>
    <div class="table-responsive">
        <table class="table small table-hover">
            <thead class="soft-header">
                <tr>
                    <th class="text-nowrap">Task</th>
                    <th class="text-nowrap">Date</th>
                    <th class="text-center text-nowrap">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'cog']" />
                        </client-only>
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-if="pending_tasks.length === 0">
                    <tr>
                        <td colspan="6" class="text-muted text-center fst-italic">No pending tasks</td>
                    </tr>
                </template>
                <template v-else>
                    <tr v-for="item in pending_tasks">
                        <td class="text-muted align-middle"> 
                            <textarea class="form-control form-control-sm text-muted small" readonly>{{ item.complaint?.nature_of_complaint?.name }}</textarea> 
                        </td>
                        <td class="text-muted align-middle"> {{ formatDate(item.created_at) }} </td>
                        <td class="align-middle text-center no-wrap">
                            <button @click="onViewPendingTask(item)" class="btn btn-light btn-sm text-success" data-bs-toggle="modal" data-bs-target="#pending_task_modal">
                                <client-only>
                                    <font-awesome-icon class="me-2" :icon="['fas', 'check-circle']" />
                                </client-only>
                                Accept
                            </button>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>


<script setup lang="ts">
    import type { Task } from '~/composables/powerserve/tasks/tasks.types';

    const emits = defineEmits(['view-pending-task'])

    const props = defineProps({
        pending_tasks: {
            type: Object as () => Task[],
            default: () => [],
        },
    });

    function onViewPendingTask(item: Task) {
        emits('view-pending-task', { task: deepClone(item) })
    }

</script>