<template>
    <div class="modal fade" id="complaint_details_modal" tabindex="-1" aria-labelledby="complaintDetailsLabel" aria-hidden="true">
        <div class="modal-dialog modal-xlmodal-dialog-scrollable custom-modal-width">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary fw-bold" id="complaintDetailsLabel">Complaint Details</h5>
                    <button ref="close_modal_btn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-4 mb-3">
                            <h5 class="fw-bold soft-badge-blue text-center p-2 rounded mb-3">Complaint Info</h5>
                            <div class="table-responsive">
                                <table class="table table table-bordered table-hover">
                                    <tbody>
                                        <tr>
                                            <td class="text-muted fw-bold">Status</td>
                                            <td class="text-muted">
                                                <span
                                                  :class="`badge soft-badge-${ complaint?.complaint_status?.color_class }`"> 
                                                    {{ complaint?.complaint_status?.name }} 
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Ref Number: </td>
                                            <td class="text-muted">{{ complaint?.ref_number }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Date: </td>
                                            <td class="text-muted">{{ complaint?.created_at }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Complainant</td>
                                            <td class="text-muted">{{ complaint?.complainant_name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Complainant Contact #</td>
                                            <td class="text-muted">{{ complaint?.complainant_contact_no }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Consumer</td>
                                            <td class="text-muted">{{ complaint?.detail?.consumer?.name || 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Account Number</td>
                                            <td class="text-muted">{{ complaint?.detail?.account_number || 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Meter Number</td>
                                            <td class="text-muted">{{ complaint?.detail?.meter_number || 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Description</td>
                                            <td class="text-muted">{{ complaint?.description }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Nature of Complaint</td>
                                            <td class="text-muted">{{ complaint?.nature_of_complaint?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Report Type</td>
                                            <td class="text-muted">{{ complaint?.report_type?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Municipality</td>
                                            <td class="text-muted">{{ complaint?.detail?.municipality?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Barangay</td>
                                            <td class="text-muted">{{ complaint?.detail?.barangay?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Sitio</td>
                                            <td class="text-muted">{{ complaint?.detail?.sitio?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Landmark</td>
                                            <td class="text-muted">{{ complaint?.detail?.landmark }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Remarks</td>
                                            <td class="text-muted">{{ complaint?.remarks }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Assigned to</td>
                                            <td class="text-muted">{{ getAssignmentLabel(complaint?.assigned_to) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="col-lg-8">

                            <div class="row">
                                <div class="col">
                                    <h5 class="fw-bold soft-badge-blue text-center p-2 rounded mb-3">Complaint Logs</h5>
                                    <div class="table-responsive">
                                        <table class="table table-sm small table-bordered table-hover">
                                            <thead class="table-light">
                                                <tr>
                                                    <th class="no-wrap">Updated by</th>
                                                    <th class="no-wrap">Updated at</th>
                                                    <th class="no-wrap">Status</th>
                                                    <th class="no-wrap">Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="item in complaint?.logs">
                                                    <td class="text-muted"> {{ item.updated_by }} </td>
                                                    <td class="text-muted"> {{ item.updated_at }} </td>
                                                    <td class="text-muted">
                                                        <span
                                                          :class="`badge soft-badge-${ item.complaint_status?.color_class }`"> 
                                                            {{ item?.complaint_status?.name }} 
                                                        </span>
                                                    </td>
                                                    <td class="text-muted"> {{ item.remarks }} </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">
                                    <h5 class="fw-bold soft-badge-blue text-center p-2 rounded mb-3">Tasks</h5>
                                    <div v-for="task in complaint?.tasks" class="row">
                                        <div class="col-lg-5">

                                            <h6 class="fw-bold soft-badge-green text-center p-2 rounded mb-3">Task Info</h6>
                                            
                                            <table class="table table-sm small table-bordered table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Assignee</td>
                                                        <td> {{ task.assign_to?.name }} </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Assigned at</td>
                                                        <td> {{ task.created_at }} </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Status</td>
                                                        <td>
                                                            <span
                                                            :class="`badge soft-badge-${ task.task_status?.color_class }`"> 
                                                                {{ task?.task_status?.name }} 
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Remarks</td>
                                                        <td> {{ task.remarks }} </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Accomplishments</td>
                                                        <td> {{ task.accomplishment }} </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Action Taken</td>
                                                        <td> {{ task.action_taken }} </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-center align-middle">Images</td>
                                                        <td>
                                                            <img src="/img/housewiring2.png" class="img-thumbnail w-25">
                                                            <img src="/img/housewiring2.png" class="img-thumbnail w-25">
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="col-lg-7">
                                            <h6 class="fw-bold soft-badge-green text-center p-2 rounded mb-3">Task Logs</h6>

                                            <table class="table table-sm small table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th class="no-wrap">Updated by</th>
                                                        <th class="no-wrap">Updated at</th>
                                                        <th class="no-wrap">Status</th>
                                                        <th>Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="log in task.logs">
                                                        <td class="text-muted"> {{ log.updated_by }} </td>
                                                        <td class="text-muted"> {{ log.updated_at }} </td>
                                                        <td>
                                                            <span
                                                            :class="`badge soft-badge-${ log.task_status?.color_class }`"> 
                                                                {{ log?.task_status?.name }} 
                                                            </span>
                                                        </td>
                                                        <td class="text-muted"> {{ log.remarks }} </td>
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

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button class="btn btn-primary">Edit</button>
                    <button class="btn btn-success">Update Status</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Complaint } from '~/composables/powerserve/complaints/complaints.types';
    import { getAssignmentLabel } from '~/composables/powerserve/complaints/complaints.helper';

    const props = defineProps({
        complaint: {
            type: Object as () => Complaint,
        },
    })

</script>


<style scoped>

    .custom-modal-width {
        max-width: 80%; /* Expands modal width but keeps it responsive */
        width: 80%;
    }

    @media (max-width: 768px) {
        .custom-modal-width {
            width: 95%; /* Slightly smaller on mobile for better fit */
        }
    }

</style>