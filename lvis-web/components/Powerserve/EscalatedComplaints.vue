<template>
    <div class="card fixed-height-card">
        <div class="card-body">
            <h6 class="fw-bold soft-badge-red text-center p-2 rounded mb-3">
                <client-only>
                    <font-awesome-icon class="me-1" :icon="['fas', 'clipboard-list']" />
                </client-only>
                Escalated Complaints
            </h6>

            <ul class="list-group">
                <li v-for="complaint in complaints" :key="complaint.id" class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong class="text-muted">{{ complaint.description }}</strong>
                        <br />
                        <small class="text-muted">{{ formatDate(complaint.created_at, true) }}</small>
                    </div>
                    <button
                        @click="onClickView({ complaint })"
                        v-if="show_view_btn"
                        class="btn btn-sm soft-btn-gray"
                        data-bs-toggle="modal"
                        :data-bs-target="`#${ modal_id }`"
                    >
                        View
                    </button>
                </li>
            </ul>

        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Complaint } from '~/composables/powerserve/complaint/complaint.types';

    const emits = defineEmits(['onClickView'])

    const props = defineProps({
        complaints: {
            type: Array as () => Complaint[]
        },
        modal_id: {
            type: String
        },
        show_view_btn: {
            type: Boolean,
            default: false
        },
    })

    function onClickView(payload: { complaint: Complaint }) {
        emits('onClickView', { complaint: {...payload.complaint} })
    }

</script>

<style scoped>

    .fixed-height-card {
        height: 400px;
        overflow-y: auto;
    }

</style>