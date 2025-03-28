<template>
    <div class="modal fade" id="complaint_details_modal" tabindex="-1" aria-labelledby="complaintDetailsLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-xl modal-fullscreen-md-down custom-modal-width">
            <div class="modal-content">
                <div :class="`modal-header ${ header_class }`">
                    <h5 class="modal-title fw-bold" id="complaintDetailsLabel">
                        <client-only>
                            <font-awesome-icon class="me-1" :icon="['fas', header_icon]" />
                        </client-only>
                        {{ header_text }}
                    </h5>
                    <button @click="onClickCloseBtn()" ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body modal-body-scroll">
                    <div v-if="complaint && !is_loading" class="row g-5">
                        <div class="col-lg-6 col-md-12 col-sm-12">
                            <h5 class="fw-bold soft-badge-blue text-center p-2 rounded mb-3">
                                <client-only>
                                    <font-awesome-icon class="me-1" :icon="['fas', 'info-circle']" />
                                </client-only>
                                Complaint Info
                            </h5>
                            <div class="table-responsive">
                                <table class="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <td width="40%">Status</td>
                                            <td class="text-muted">
                                                <span
                                                  :class="`badge soft-badge-${ complaint?.status?.color_class }`"> 
                                                    {{ complaint?.status?.name }} 
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Ref Number: </td>
                                            <td class="text-muted">{{ complaint?.ref_number }}</td>
                                        </tr>
                                        <tr>
                                            <td>Date: </td>
                                            <td class="text-muted">{{ formatDate(complaint?.created_at, true) }}</td>
                                        </tr>
                                        <tr>
                                            <td>Complainant</td>
                                            <td class="text-muted">{{ complaint?.complainant_name }}</td>
                                        </tr>
                                        <tr>
                                            <td>Complainant Contact #</td>
                                            <td class="text-muted">{{ complaint?.complainant_contact_no }}</td>
                                        </tr>
                                        <tr>
                                            <td>Consumer</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.consumer?.name || 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td>Account Number</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.consumer ? complaint?.complaint_detail?.consumer.id : 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td>Meter Number</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.consumer ? complaint?.complaint_detail?.consumer.meter_number : 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td class="align-middle">Description</td>
                                            <td class="text-muted">
                                                <textarea readonly class="form-control form-control-sm small text-muted" rows="3">{{ complaint.description }}</textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Report Type</td>
                                            <td class="text-muted">{{ complaint?.report_type?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td>Municipality</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.barangay?.municipality.name }}</td>
                                        </tr>
                                        <tr>
                                            <td>Barangay</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.barangay?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td>Sitio</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.sitio ? complaint?.complaint_detail?.sitio.name : 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td>Landmark</td>
                                            <td class="text-muted">{{ complaint?.complaint_detail?.landmark }}</td>
                                        </tr>
                                        <tr>
                                            <td>Assigned Group</td>
                                            <td class="text-muted">{{ complaint?.assigned_group ? complaint?.assigned_group.name : 'N/A' }}</td>
                                        </tr>
                                        <tr>
                                            <td>Remarks</td>
                                            <td class="text-muted">
                                                <textarea readonly class="form-control form-control-sm small text-muted" rows="2">{{ complaint.remarks }}</textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h6 class="fw-bold soft-badge-gray text-center p-2 rounded mb-3">
                                <client-only>
                                    <font-awesome-icon class="me-1" :icon="['fas', 'clock']" />
                                </client-only>
                                Complaint Logs
                            </h6>
                            <div class="table-responsive">
                                <table class="table table-sm small table-bordered">
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
                                            <td class="text-muted align-middle"> {{ item.created_by }} </td>
                                            <td class="text-muted align-middle"> {{ formatDate(item.created_at, true) }} </td>
                                            <td class="text-muted align-middle">
                                                <span
                                                    :class="`badge soft-badge-${ item.status?.color_class }`"> 
                                                    {{ item?.status?.name }} 
                                                </span>
                                            </td>
                                            <td class="text-muted align-middle">
                                                <textarea readonly class="form-control form-control-sm small text-muted" rows="2">{{ item.remarks }}</textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div class="col-lg-6 col-md-12 col-sm-12">

                            <h5 class="fw-bold soft-badge-blue text-center p-2 rounded mb-3">
                                <client-only>
                                    <font-awesome-icon class="me-1" :icon="['fas', 'info-circle']" />
                                </client-only>
                                Tasks Info
                            </h5>
                            <div v-for="task, indx in complaint?.tasks">

                                <div class="h5wrapper mb-1 mt-3">
                                    <hr class="result">
                                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                                        Task # {{ indx + 1 }}
                                    </h5>
                                    <hr class="result">
                                </div>

                                <div class="responsive">
                                    <table class="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <td width="40%">Status</td>
                                                <td>
                                                    <span
                                                    :class="`badge soft-badge-${ task.status?.color_class }`"> 
                                                        {{ task?.status?.name }} 
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Ref Number</td>
                                                <td class="text-muted"> {{ task.ref_number }} </td>
                                            </tr>
                                            <tr>
                                                <td>Assignee</td>
                                                <td class="text-muted"> {{ task.assignee ? getFullname(task.assignee.firstname, task.assignee.middlename, task.assignee.lastname) : 'N/A' }} </td>
                                            </tr>
                                            <tr>
                                                <td class="align-middle">Remarks</td>
                                                <td>
                                                    <textarea readonly class="form-control form-control-sm small text-muted" rows="3">{{ task.remarks ? task.remarks : 'N/A' }}</textarea> 
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="align-middle">Accomplishments</td>
                                                <td>
                                                    <textarea readonly class="form-control form-control-sm small text-muted" rows="3">{{ task.accomplishment ? task.accomplishment : 'N/A' }}</textarea> 
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="align-middle">Action Taken</td>
                                                <td>
                                                    <textarea readonly class="form-control form-control-sm small text-muted" rows="3">{{ task.action_taken ? task.action_taken : 'N/A' }}</textarea> 
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Created at</td>
                                                <td class="text-muted"> {{ formatDate(task.created_at, true) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-align-middle">Attachments</td>
                                                <td> </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <PowerserveTaskDetailPowerInterruption :task_detail="task.task_detail_power_interruption" />
                                <PowerserveTaskDetailKwhMeter :task_detail="task.task_detail_kwh_meter" />

                                <h6 class="fw-bold soft-badge-gray text-center p-2 rounded mb-3">
                                    <client-only>
                                        <font-awesome-icon class="me-1" :icon="['fas', 'clock']" />
                                    </client-only>
                                    Task Logs
                                </h6>

                                <div class="responsive">
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
                                                <td class="text-muted align-middle"> {{ log.created_by }} </td>
                                                <td class="text-muted align-middle"> {{ formatDate(log.created_at, true) }} </td>
                                                <td class="align-middle">
                                                    <span
                                                    :class="`badge soft-badge-${ log.status?.color_class }`"> 
                                                        {{ log?.status?.name }} 
                                                    </span>
                                                </td>
                                                <td class="text-muted">
                                                    <textarea readonly class="form-control form-control-sm small text-muted" rows="2">{{ complaint.remarks }}</textarea> 
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div v-else>
                        <LoaderSpinner />
                    </div>
                </div>

                <div class="modal-footer soft-badge-gray d-flex flex-column flex-md-row w-100 gap-2">
                    <div class="d-flex flex-column flex-md-row align-items-center w-100 gap-2 mt-4 mb-3">
                        
                        <client-only>
                            <v-select
                              placeholder="Select Assignee"
                              class="w-100 w-md-auto custom-select"
                              :options="employees"
                              label="fullname"
                              v-model="assignee"></v-select>
                        </client-only>

                        <!-- Textarea -->
                        <!-- <textarea rows="3" class="form-control form-control-sm flex-grow-1" placeholder="Add notes here if needed..."></textarea> -->
                        <input type="text" class="form-control " placeholder="Add notes here if needed..." v-model="remarks">
                    </div>

                    <!-- Buttons -->
                    <div class="d-flex gap-2">
                        <button @click="create_task()" :disabled="is_creating" type="button" class="btn btn-primary">
                            <client-only>
                                <font-awesome-icon class="me-1" :icon="['fas', 'plus']" />
                            </client-only>
                            {{ is_creating ? 'Creating task please wait...' : 'Create a Task for This Complaint' }}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Employee } from '~/composables/hr/employee/employee.types';
    import type { Complaint } from '~/composables/powerserve/complaint/complaint.types';

    const emits = defineEmits(['create-task'])

    const props = defineProps({
        complaint: {
            type: Object as () => Complaint,
        },
        employees: {
            type: Array as () => Employee[],
        },
        is_loading: {
            type: Boolean,
            default: false,
        },
        header_class: {
            type: String,
            default: 'soft-badge-blue'
        },
        header_text: {
            type: String,
            default: 'Complaint Details'
        },
        header_icon: {
            type: String,
            default: 'info-circle'
        },
        is_creating: {
            type: Boolean,
            default: false
        }

    })

    const assignee = ref<Employee>()
    const remarks = ref('')
    const closeBtn = ref<HTMLButtonElement>()

    function create_task() {
        emits('create-task', {
            complaint: {...props.complaint},
            assignee: assignee.value ? {...assignee.value} : null,
            remarks: remarks.value,
            closeBtn: closeBtn.value
        })
    }

    function onClickCloseBtn() {
        assignee.value = undefined
        remarks.value = ''
    }

</script>


<style scoped>

    @media (min-width: 1024px) {
        .custom-modal-width {
            max-width: 70%;
            width: 70%;
        }

        .modal-body-scroll {
            max-height: 900px;
            overflow-y: auto;
            overflow-x:hidden
        }
    }

    .custom-select {
        background: white !important;
        border-radius: 4px;
        /* padding: 5px; */
    }

</style>