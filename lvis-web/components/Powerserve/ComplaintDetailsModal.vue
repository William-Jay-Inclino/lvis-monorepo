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
                                                  :class="`badge soft-badge-${ complaint?.status?.color_class }`"> 
                                                    {{ complaint?.status?.name }} 
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
                                            <td class="text-muted">{{ complaint?.complaint_detail?.consumer?.name || 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Account Number</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.account_number || 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Meter Number</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.meter_number || 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Description</td>
                                            <td class="text-muted">{{ complaint?.description }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Report Type</td>
                                            <td class="text-muted">{{ complaint?.report_type?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Municipality</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.barangay?.municipality.name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Barangay</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.barangay?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Sitio</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.sitio?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Landmark</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.landmark }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted fw-bold">Remarks</td>
                                            <td class="text-muted">{{ complaint?.remarks }}</td>
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
                                                    <th class="no-wrap">Date</th>
                                                    <th class="no-wrap">Status</th>
                                                    <th class="no-wrap">Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="item in complaint?.logs">
                                                    <td class="text-muted"> {{ item.created_by }} </td>
                                                    <td class="text-muted"> {{ formatDate(item.created_at, true) }} </td>
                                                    <td class="text-muted">
                                                        <span
                                                          :class="`badge soft-badge-${ item.status?.color_class }`"> 
                                                            {{ item?.status?.name }} 
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

                                    <div class="text-center text-muted fst-italic small" v-show="is_loading_tasks">
                                        loading tasks please wait...
                                    </div>
                                    <div v-show="!is_loading_tasks" v-for="task in complaint?.tasks" class="row">
                                        <div class="col-lg-5">

                                            <h6 class="fw-bold soft-badge-green text-center p-2 rounded mb-3">Task Info</h6>
                                            
                                            <table class="table table-sm small table-bordered table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Assignee</td>
                                                        <td> {{ task.assign_to ? getFullname(task.assign_to.firstname, task.assign_to.middlename, task.assign_to.lastname) : 'N/A' }} </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Assigned at</td>
                                                        <td> {{ formatDate(task.created_at, true) }} </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Status</td>
                                                        <td>
                                                            <span
                                                            :class="`badge soft-badge-${ task.status?.color_class }`"> 
                                                                {{ task?.status?.name }} 
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
                                                        <th class="no-wrap">Date</th>
                                                        <th class="no-wrap">Status</th>
                                                        <th>Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="log in task.logs">
                                                        <td class="text-muted"> {{ log.created_at }} </td>
                                                        <td class="text-muted"> {{ formatDate(log.created_at, true) }} </td>
                                                        <td>
                                                            <span
                                                            :class="`badge soft-badge-${ log.status?.color_class }`"> 
                                                                {{ log?.status?.name }} 
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
    import type { Complaint } from '~/composables/powerserve/complaint/complaint.types';
    import { getAssignmentLabel } from '~/composables/powerserve/complaint/complaint.helper';

    const props = defineProps({
        complaint: {
            type: Object as () => Complaint,
        },
        is_loading_tasks: {
            type: Boolean,
            default: false,
        }
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