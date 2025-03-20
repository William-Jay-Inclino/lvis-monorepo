<template>
    <div class="modal fade" id="accept_task_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-fullscreen-md-down">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title fw-bold">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> 
                        Pending Task
                    </h5>
                    <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div v-show="!show_content">
                        <LoaderSpinner />
                    </div>
                    <div v-show="show_content">
                        <div class="responsive">
                            <table class="table table-sm table-bordered">
                                <tbody>
                                    <tr>
                                        <td width="40%">Ref #</td>
                                        <td class="text-muted"> {{ task?.ref_number }} </td>
                                    </tr>
                                    <tr>
                                        <td>Task Description</td>
                                        <td class="text-muted">
                                            <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task?.description }}</textarea>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                Complaint Details
                            </h5>
                            <hr class="result">
                        </div>
                        <table class="table table-sm table-bordered">
                            <tbody>
                                <tr>
                                    <td width="40%"> Ref # </td>
                                    <td class="text-muted"> {{ task?.complaint?.ref_number }} </td>
                                </tr>
                                <tr>
                                    <td> Status </td>
                                    <td class="text-muted">
                                        <div :class="`badge soft-badge soft-badge-${ task?.complaint?.status?.color_class }`">
                                            {{ task?.complaint?.status?.name }}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td> Complainant Name </td>
                                    <td class="text-muted"> {{ task?.complaint?.complainant_name }} </td>
                                </tr>
                                <tr>
                                    <td> Complainant Contact # </td>
                                    <td class="text-muted"> {{ task?.complaint?.complainant_contact_no }} </td>
                                </tr>
                                <tr>
                                    <td> Date </td>
                                    <td class="text-muted"> {{ formatDate(task?.complaint?.created_at) }} </td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td class="text-muted">
                                        <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task?.description }}</textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td> Remarks </td>
                                    <td class="text-muted">
                                        <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task?.remarks }}</textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td> Account number </td>
                                    <td class="text-muted"> {{ task?.complaint?.complaint_detail.account_number || 'N/A' }} </td>
                                </tr>
                                <tr>
                                    <td> Meter number </td>
                                    <td class="text-muted"> {{ task?.complaint?.complaint_detail.account_number || 'N/A' }} </td>
                                </tr>
                                <tr>
                                    <td> Consumer </td>
                                    <td class="text-muted"> {{ task?.complaint?.complaint_detail.consumer?.name || 'N/A' }} </td>
                                </tr>
                                <tr>
                                    <td> Municipality </td>
                                    <td class="text-muted"> {{ task?.complaint?.complaint_detail.barangay.municipality.name }} </td>
                                </tr>
                                <tr>
                                    <td> Barangay </td>
                                    <td class="text-muted"> {{ task?.complaint?.complaint_detail.barangay.name }} </td>
                                </tr>
                                <tr>
                                    <td> Sitio </td>
                                    <td class="text-muted"> {{ task?.complaint?.complaint_detail.sitio?.name || 'N/A' }} </td>
                                </tr>
                                <tr>
                                    <td> Landmark </td>
                                    <td class="text-muted"> {{ task?.complaint?.complaint_detail.landmark || 'N/A' }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-if="show_content" class="modal-footer d-flex flex-column flex-md-row w-100 gap-2">
                    <textarea v-model="note" class="form-control w-100 w-md-auto flex-grow-1" placeholder="Add notes here if needed..."></textarea>
                    <div class="d-flex gap-2">
                        <button :disabled="is_accepting" @click="handleAccept({ will_start: false })" type="button" class="btn btn-success">
                            {{ is_accepting ? 'Accepting...' : 'Accept' }}
                        </button>
                        <button :disabled="is_accepting_and_starting" @click="handleAccept({ will_start: true })" type="button" class="btn btn-primary">
                            {{ is_accepting_and_starting ? 'Accepting...' : 'Accept & Start' }}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Task } from '~/composables/powerserve/task/task.types';

    const emits = defineEmits([
        'accept-task',
    ])

    const props = defineProps({
        task: {
            type: Object as () => Task,
        },
        is_accepting: {
            type: Boolean,
            default: false,
        },
        is_loading_pending_task_details: {
            type: Boolean,
            default: false,
        },
        is_accepting_and_starting: {
            type: Boolean,
            default: false,
        },
    });

    const note = ref('')
    const closeBtn = ref<HTMLButtonElement>()

    const show_content = computed(() => {
        if(!props.is_loading_pending_task_details && props.task) {
            return true 
        }
        return false
    })
 
    function handleAccept(payload: { will_start: boolean }) {
        
        const { will_start } = payload

        emits('accept-task', {
            task: props.task,
            will_start,
            note: note.value,
            closeBtn: closeBtn.value
        })
    }

</script>