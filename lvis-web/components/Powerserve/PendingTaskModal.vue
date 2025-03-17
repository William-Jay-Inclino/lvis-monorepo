<template>
    <div class="modal fade" id="pending_task_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">
                        <client-only>
                            <font-awesome-icon class="me-2" :icon="['fas', 'exclamation-circle']" ></font-awesome-icon>
                        </client-only>
                        Accept Task Confirmation
                    </h5>
                    <button ref="close_btn_modal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>Date</td>
                                <td class="text-muted"> {{ formatDate(task?.created_at, true) }} </td>
                            </tr>
                            <tr>
                                <td class="align-middle">Task</td>
                                <td>
                                    <textarea class="form-control text-muted small-textarea" readonly>{{ task?.complaint?.nature_of_complaint?.name }}</textarea> 
                                </td>
                            </tr>
                            <tr>
                                <td>Municipality</td>
                                <td class="text-muted"> {{ task?.complaint?.complaint_detail?.barangay?.municipality.name }} </td>
                            </tr>
                            <tr>
                                <td>Barangay</td>
                                <td class="text-muted"> {{ task?.complaint?.complaint_detail?.barangay?.name }} </td>
                            </tr>
                            <tr>
                                <td>Sitio</td>
                                <td class="text-muted"> {{ task?.complaint?.complaint_detail?.sitio?.name }} </td>
                            </tr>
                            <tr>
                                <td>Landmark</td>
                                <td class="text-muted"> {{ task?.complaint?.complaint_detail?.landmark }} </td>
                            </tr>
                            <tr>
                                <td class="align-middle">Description</td>
                                <td>
                                    <textarea class="form-control text-muted small-textarea" readonly>{{ task?.complaint?.description }}</textarea> 
                                </td>
                            </tr>
                            <tr>
                                <td>Complainant</td>
                                <td class="text-muted"> {{ task?.complaint?.complainant_name }} </td>
                            </tr>
                            <tr>
                                <td>Contact #</td>
                                <td class="text-muted"> {{ task?.complaint?.complainant_contact_no }} </td>
                            </tr>
                            <tr>
                                <td>Consumer</td>
                                <td class="text-muted"> {{ task?.complaint?.complaint_detail?.consumer?.name }} </td>
                            </tr>
                            <tr>
                                <td>Account #</td>
                                <td class="text-muted"> {{ task?.complaint?.complaint_detail?.account_number }} </td>
                            </tr>
                            <tr>
                                <td>Meter #</td>
                                <td class="text-muted"> {{ task?.complaint?.complaint_detail?.meter_number }} </td>
                            </tr>
                            <tr>
                                <td class="align-middle">Remarks</td>
                                <td>
                                    <textarea class="form-control text-muted small-textarea" readonly>{{ task?.complaint?.remarks }}</textarea> 
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        @click="onAccept({ accept_and_start: false })"
                        class="btn btn-success"
                        :disabled="is_accepting_task"
                    >
                        {{ is_accepting_task ? 'Accepting...' : 'Accept' }}
                    </button>
                    <button
                        type="button"
                        @click="onAccept({ accept_and_start: true })"
                        class="btn btn-primary"
                        :disabled="is_accept_and_starting_task"
                    >
                        {{ is_accept_and_starting_task ? 'Accepting...' : 'Accept & Start' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Task } from '~/composables/powerserve/tasks/tasks.types';

    const emits = defineEmits(['accept'])

    const props = defineProps({
        task: {
            type: Object as () => Task,
        },
        is_accepting_task: {
            type: Boolean,
            default: false,
        },
        is_accept_and_starting_task: {
            type: Boolean,
            default: false,
        },
    })

    const close_btn_modal = ref<HTMLButtonElement>()

    function onAccept(payload: { accept_and_start: boolean }) {
        const { accept_and_start } = payload

        emits('accept', { task: props.task, accept_and_start, close_btn_modal: close_btn_modal.value })
        
    }

</script>