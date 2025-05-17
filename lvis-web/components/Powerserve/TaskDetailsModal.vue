<template>

    <div>
        <div class="modal fade" id="task_details_modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-fullscreen-md-down custom-modal-width">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title fw-bold"> Task Details </h5>
                        <button @click="onCloseModal()" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div v-if="task"  class="modal-body">
                        <div v-show="!show_content">
                            <LoaderSpinner />
                        </div>
                        <div v-show="show_image">
                            <PowerserveImageViewer @close-image="handle_close_image_viewer" :task_file="selected_task_file"/>
                        </div>
                        <div v-show="show_content && !show_image" class="row">
                            <div class="col">
                                <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3">Task Info</h5>
                                <div class="responsive">
                                    <table class="table table-borderless">
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
                                                <td class="align-middle">Description</td>
                                                <td>
                                                    <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.description }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="align-middle">Remarks</td>
                                                <td>
                                                    <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.remarks }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="align-middle">Accomplishment</td>
                                                <td class="text-muted"> {{ task.accomplishment_qty ? task.accomplishment_qty : 'N/A' }} </td>
                                            </tr>
                                            <tr>
                                                <td class="align-middle">Action taken</td>
                                                <td>
                                                    <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.action_taken }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Attachments</td>
                                                <td>
                                                    <div class="d-flex flex-wrap">
                                                        <div v-for="file in task.files" class="p-1 image-container">
                                                            <a href="javascript:void(0)" @click="onClickFile(file)">
                                                                <img :src="getUploadsPath(file.source_path)"
                                                                    class="img-thumbnail small-image" alt="Image not found">
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
    
                                <div class="accordion mt-3 mb-3" id="accordionFlushExample">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="flush-headingOne">
                                            <button class="accordion-button collapsed text-primary" type="button" data-bs-toggle="collapse" 
                                                data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                View Task Details
                                            </button>
                                        </h2>
                                        <div id="flush-collapseOne" class="accordion-collapse collapse" 
                                            aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body small">
    
                                                <div v-if="!task.activity" class="text-muted text-center fst-italic"> No details </div>
    
                                                <PowerserveTaskDetailPowerInterruption v-if="task.activity?.category.id === ACTIVITY_CATEGORY.Power_Interruption" :task_detail="task.task_detail_power_interruption" />
                                                <PowerserveTaskDetailKwhMeter v-else-if="task.activity?.category.id === ACTIVITY_CATEGORY.KWH_Meter" :task_detail="task.task_detail_kwh_meter" />
                                                <PowerserveTaskDetailLineServices v-else-if="task.activity?.category.id === ACTIVITY_CATEGORY.Line_Services" :task_detail="task.task_detail_line_services" />
                                                <PowerserveTaskDetailDles v-else-if="task.activity?.category.id === ACTIVITY_CATEGORY.DLES" :task_detail="task.task_detail_dles" />
                                                <PowerserveTaskDetailLmdga v-else-if="task.activity?.category.id === ACTIVITY_CATEGORY.LMDGA" :task_detail="task.task_detail_lmdga" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
    
                                <h6 class="fw-bold soft-badge-gray text-center p-2 rounded mb-3">Task Logs</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm table-bordered small">
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
                                                <td class="text-muted align-middle text-nowrap"> {{ formatDate(log.created_at, true) }} </td>
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
                                    <table class="table table-borderless">
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
                                                <td class="align-middle">Description</td>
                                                <td>
                                                    <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.complaint?.description }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="align-middle">Remarks</td>
                                                <td>
                                                    <textarea class="form-control form-control-sm small text-muted" rows="3" readonly>{{ task.complaint?.remarks }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Assigned Group</td>
                                                <td> {{ task.complaint?.assigned_group?.name }} </td>
                                            </tr>
                                            <tr>
                                                <td>Consumer</td>
                                                <td> {{ task.complaint?.complaint_detail.consumer ? task.complaint?.complaint_detail.consumer.name : 'N/A' }} </td>
                                            </tr>
                                            <tr>
                                                <td>Account number</td>
                                                <td> {{ task.complaint?.complaint_detail.consumer ? task.complaint?.complaint_detail.consumer.id : 'N/A' }} </td>
                                            </tr>
                                            <tr>
                                                <td>Meter number</td>
                                                <td> {{ task.complaint?.complaint_detail.consumer ? task.complaint?.complaint_detail.consumer.meter_number : 'N/A' }} </td>
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
                                            <tr>
                                                <td> Created by </td>
                                                <td> {{ task.complaint?.created_by }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <h6 class="fw-bold soft-badge-gray text-center p-2 rounded mb-3">Complaint Logs</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm table-bordered small">
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
                                                <td class="text-muted align-middle text-nowrap"> {{ formatDate(log.created_at, true) }} </td>
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
        
    </div>

</template>

<script setup lang="ts">
    import { PowerserveTaskDetailPowerInterruption } from '#components';
    import { ACTIVITY_CATEGORY } from '~/composables/powerserve/task/task.constants';
    import type { Task, TaskFile } from '~/composables/powerserve/task/task.types';


    const props = defineProps({
        task: {
            type: Object as () => Task,
        },
        is_loading_task_details: {
            type: Boolean,
            default: false,
        },
    })

    const config = useRuntimeConfig()
    const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload'


    const show_content = computed(() => {
        if(!props.is_loading_task_details && props.task) {
            return true 
        }
        return false
    })

    const selected_task_file = ref<TaskFile>()
    const show_image = ref(false)


    function getUploadsPath(src: string) {

        const path = src.replace(UPLOADS_PATH, '')
        console.log('PATH', path)

        const uploadsPath = API_FILE_ENDPOINT + path
        return uploadsPath

    }

    function onClickFile(task_file: TaskFile) {
        selected_task_file.value = task_file
        show_image.value = true
    }

    function handle_close_image_viewer() {
        show_image.value = false 
        selected_task_file.value = undefined
    }

    function onCloseModal() {
        handle_close_image_viewer()
    }

</script>



<style scoped>

    @media (min-width: 1024px) {
        .custom-modal-width {
            max-width: 80%;
            width: 80%;
        }
    }


    .accordion-button {
      background-color: #f8f9fa; /* Soft light background */
      border-radius: 8px;
      transition: all 0.3s ease-in-out;
  }

  .accordion-button:hover {
      background-color: #e9ecef;
  }

  .accordion-body {
      background-color: #f1f3f5; /* Light grayish-blue background */
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow */
  }

  .accordion-item {
      border: none; /* Remove default border */
      margin-bottom: 10px;
  }

  .small-image {
        max-width: 200px;
        max-height: 200px;
    }

    .image-container {
        overflow: hidden;
    }

    .image-container img {
        transition: transform 0.3s ease;
    }

    .image-container:hover img {
        transform: scale(1.2);
    }

</style>