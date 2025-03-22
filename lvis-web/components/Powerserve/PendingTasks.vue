<template>
    <div class="card fixed-height-card">
        <div class="card-body">
            <h6 class="fw-bold soft-badge-gray text-center p-2 rounded mb-3">
                <client-only>
                    <font-awesome-icon class="me-1" :icon="['fas', 'clipboard-list']" />
                </client-only>
                Pending Tasks 
            </h6>

            <ul class="list-group">
                <li v-for="task in tasks" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong class="text-muted">{{ task.description }}</strong>
                        <br />
                        <small class="text-muted">{{ formatDate(task.created_at, true) }}</small>
                    </div>
                    <button @click="onClickAssign({ task })" v-if="show_assign_btn" class="btn btn-sm soft-btn-gray">Assign</button>
                    <button
                        @click="onClickAccept({ task })"
                        v-if="show_accept_btn"
                        class="btn btn-sm soft-btn-gray"
                        data-bs-toggle="modal"
                        :data-bs-target="`#${ modal_id }`"
                    >
                        Accept
                    </button>
                </li>
            </ul>

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
        show_accept_btn: {
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
        height: 400px;
        overflow-y: auto;
    }

</style>