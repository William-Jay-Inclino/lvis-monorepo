<template>
    <div class="modal fade" id="task_details_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-fullscreen-md-down custom-modal-width">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title fw-bold"> Task Details </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div v-if="task"  class="modal-body">
                    <div v-show="!show_content">
                        <LoaderSpinner />
                    </div>
                    <div v-show="show_content" class="row">
                        <div class="col">
                            <h5 class="fw-bold soft-badge-orange text-center p-2 rounded mb-3">Task Info</h5>
                            <div class="responsive">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td width="40%">Ref #</td>
                                            <td class="text-muted"> {{ task.ref_number }} </td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td>
                                                <div :class="`badge soft-badge soft-badge-${ task.status?.color_class }`">
                                                    {{ task.status?.name }}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Activity</td>
                                            <td class="text-muted"> {{ task.activity ? task.activity.name : 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td>Assignee</td>
                                            <td class="text-muted">
                                                {{ task.assignee ? getFullname(task.assignee.firstname, task.assignee.middlename, task.assignee.lastname) : 'M/A' }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Description</td>
                                            <td>
                                                <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.description }}</textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Remarks</td>
                                            <td>
                                                <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.remarks }}</textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Accomplishment</td>
                                            <td>
                                                <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.accomplishment }}</textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Action taken</td>
                                            <td>
                                                <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.action_taken }}</textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Attachments</td>
                                            <td class="text-muted"> [TBA] </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <h5 class="fw-bold soft-badge-blue text-center p-2 rounded mb-3">Task Logs</h5>
                            <div class="responsive">
                                <table class="table table-sm table bordered small">
                                    <thead>
                                        <tr>
                                            <th> Updated by </th>
                                            <th> Date </th>
                                            <th> Status </th>
                                            <th> Notes </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="log in task.logs">
                                            <td class="text-muted align-middle"> {{ log.created_by }} </td>
                                            <td class="text-muted align-middle"> {{ formatDate(log.created_at, true) }} </td>
                                            <td class="text-muted align-middle">
                                                <div :class="`badge soft-badge soft-badge-${ log.status?.color_class }`">
                                                    {{ log.status?.name }}
                                                </div>
                                            </td>
                                            <td class="text-muted">
                                                <textarea readonly class="form-control form-control-sm small text-muted">{{ log.remarks }}</textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col">
                            <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3">Complaint Info</h5>
                            <div class="responsive">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td>Ref #</td>
                                            <td> {{ task.complaint?.ref_number }} </td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td>
                                                <div :class="`badge soft-badge soft-badge-${ task.complaint?.status?.color_class }`">
                                                    {{ task.complaint?.status?.name }}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Report type</td>
                                            <td> {{ task.complaint?.report_type.name }} </td>
                                        </tr>
                                        <tr>
                                            <td>Complainant</td>
                                            <td> {{ task.complaint?.complainant_name }} </td>
                                        </tr>
                                        <tr>
                                            <td>Complainant contact #</td>
                                            <td> {{ task.complaint?.complainant_contact_no }} </td>
                                        </tr>
                                        <tr>
                                            <td>Description</td>
                                            <td>
                                                <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.complaint?.description }}</textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Remarks</td>
                                            <td>
                                                <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.complaint?.remarks }}</textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Assigned Group</td>
                                            <td> {{ task.complaint?.assigned_group?.name }} </td>
                                        </tr>
                                        <tr>
                                            <td>Account number</td>
                                            <td> {{ task.complaint?.complaint_detail.account_number || 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td>Meter number</td>
                                            <td> {{ task.complaint?.complaint_detail.account_number || 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td>Consumer</td>
                                            <td> {{ task.complaint?.complaint_detail.consumer ? task.complaint?.complaint_detail.consumer.name : 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td> Municipality </td>
                                            <td> {{ task.complaint?.complaint_detail.barangay.municipality.name }} </td>
                                        </tr>
                                        <tr>
                                            <td> Barangay </td>
                                            <td> {{ task.complaint?.complaint_detail.barangay.name }} </td>
                                        </tr>
                                        <tr>
                                            <td> Sitio </td>
                                            <td> {{ task.complaint?.complaint_detail.sitio ? task.complaint?.complaint_detail.sitio.name : 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td> Landmark </td>
                                            <td> {{ task.complaint?.complaint_detail.landmark || 'N/A' }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <h5 class="fw-bold soft-badge-blue text-center p-2 rounded mb-3">Complaint Logs</h5>
                            <div class="responsive">
                                <table class="table table-sm table bordered small">
                                    <thead>
                                        <tr>
                                            <th> Updated by </th>
                                            <th> Date </th>
                                            <th> Status </th>
                                            <th> Notes </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="log in task.complaint?.logs">
                                            <td class="text-muted align-middle"> {{ log.created_by }} </td>
                                            <td class="text-muted align-middle"> {{ formatDate(log.created_at, true) }} </td>
                                            <td class="text-muted align-middle">
                                                <div :class="`badge soft-badge soft-badge-${ log.status?.color_class }`">
                                                    {{ log.status?.name }}
                                                </div>
                                            </td>
                                            <td class="text-muted">
                                                <textarea readonly class="form-control form-control-sm small text-muted">{{ log.remarks }}</textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Task } from '~/composables/powerserve/task/task.types';


    const props = defineProps({
        task: {
            type: Object as () => Task,
        },
        is_loading_task_details: {
            type: Boolean,
            default: false,
        },
    })


    const show_content = computed(() => {
        if(!props.is_loading_task_details && props.task) {
            return true 
        }
        return false
    })

</script>



<style scoped>

    @media (min-width: 1024px) {
        .custom-modal-width {
            max-width: 70%;
            width: 70%;
        }
    }

</style>