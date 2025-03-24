<template>
    <div class="card fixed-height-card d-flex flex-column">
        <div v-if="tasks" class="card-body d-flex flex-column flex-grow-1">
            <h6 class="fw-bold soft-badge-gray text-center p-2 rounded mb-3">
                <client-only>
                <font-awesome-icon class="me-1" :icon="['fas', 'clipboard-list']" />
                </client-only>
                Pending Tasks 
            </h6>

            <div class="text-muted text-center fst-italic small" v-if="tasks.length === 0">
                No pending tasks
            </div>

            <ul class="list-group flex-grow-1 mb-4">
                <li v-for="task in tasks" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong class="text-muted">{{ task.description }}</strong>
                        <br />
                        <small class="text-muted">{{ formatDate(task.created_at, true) }}</small>
                    </div>
                    <button
                        @click="onClickAssign({ task })"
                        v-if="show_assign_btn"
                        class="btn btn-sm soft-btn-gray"
                        data-bs-toggle="modal"
                        :data-bs-target="`#${ modal_id }`"
                    >
                        Assign
                    </button>
                    <button
                        @click="onClickAccept({ task })"
                        v-if="show_view_btn"
                        class="btn btn-sm soft-btn-gray"
                        data-bs-toggle="modal"
                        :data-bs-target="`#${ modal_id }`"
                    >
                        View
                    </button>
                </li>
            </ul>

            <div class="alert alert-light border d-flex align-items-center mt-auto small" role="alert">
                <strong class="me-2 text-danger fst-italic">Total Pending Tasks:</strong>
                <span class="badge soft-badge soft-badge-red">{{ tasks.length }}</span>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Task } from '~/composables/powerserve/task/task.types';

    const emits = defineEmits(['onClickAssign', 'onClickAccept'])

    const props = defineProps({
        tasks: {
            type: Array as () => Task[]
        },
        modal_id: {
            type: String
        },
        show_assign_btn: {
            type: Boolean,
            default: false
        },
        show_view_btn: {
            type: Boolean,
            default: false
        }
    })

    function onClickAssign(payload: { task: Task }) {
        emits('onClickAssign', { task: {...payload.task} })
    }

    function onClickAccept(payload: { task: Task }) {
        emits('onClickAccept', { task: {...payload.task} })
    }

</script>

<style scoped>

    .fixed-height-card {
        height: 500px !important;
        overflow-y: auto;
    }

</style>