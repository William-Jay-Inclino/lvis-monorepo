<template>

    <div v-if="!isLoadingPage && authUser && item" class="container">
        <div class="row">
            <div class="col pt-3">
                <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3"> Complaint </h5>
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-borderless table-hover">
                                <tbody>
                                    <tr>
                                        <td class="text-muted">Status</td>
                                        <td data-testid="status">
                                            <div :class="`badge soft-badge soft-badge-${ item.status?.color_class }`">
                                                {{ item.status?.name }}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Ref Number</td>
                                        <td data-testid="ref-number"> {{ item.ref_number }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Complainant</td>
                                        <td> {{ item.complainant_name }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Complainant Contact #</td>
                                        <td> {{ item.complainant_contact_no }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Report type</td>
                                        <td> {{ item.report_type.name }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted align-middle">Description</td>
                                        <td>
                                            <textarea readonly rows="3" class="form-control form-control-sm small">{{ item.description }}</textarea>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted align-middle">Remarks</td>
                                        <td>
                                            <textarea readonly rows="3" class="form-control form-control-sm small">{{ item.remarks }}</textarea>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Date</td>
                                        <td> {{ formatDate(item.created_at, true) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Consumer name</td>
                                        <td> {{ item.complaint_detail.consumer ? item.complaint_detail.consumer.name : 'N/A' }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Account number</td>
                                        <td> {{ item.complaint_detail.consumer ? item.complaint_detail.consumer.id : 'N/A' }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Meter number</td>
                                        <td> {{ item.complaint_detail.consumer ? item.complaint_detail.consumer.meter_number : 'N/A' }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Municipality</td>
                                        <td> {{ item.complaint_detail.barangay?.municipality.name }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Barangay</td>
                                        <td> {{ item.complaint_detail.barangay.name }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Sitio</td>
                                        <td> {{ item.complaint_detail.sitio ? item.complaint_detail.sitio.name : 'N/A' }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Landmark</td>
                                        <td> {{ item.complaint_detail.landmark }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Assigned Group</td>
                                        <td> {{ item.assigned_group ? item.assigned_group.name : 'N/A' }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Created by</td>
                                        <td> {{ item.created_by }} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <h6 class="fw-bold soft-badge-gray text-center p-2 rounded mb-3">Logs</h6>
                        <div class="table-responsive">
                            <table class="table table-bordered table-small small">
                                <thead>
                                    <tr>
                                        <th class="no-wrap">Updated by</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="log in item.logs">
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
                        <div class="row mb-3 pt-3">
                            <div class="col">
                                <div class="d-flex justify-content-center flex-wrap gap-2">
                                    <nuxt-link v-if="canRead(authUser, 'canManageComplaint', SERVICES.POWERSERVE)" class="btn soft-btn-gray" :class="{'w-100 w-md-auto': isMobile}"
                                        to="/powerserve/complaint">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'search']" />
                                        </client-only> 
                                        Search
                                    </nuxt-link>
                                    <nuxt-link v-if="can_update" class="btn soft-btn-violet" :class="{'w-100 w-md-auto': isMobile}"
                                        :to="`/powerserve/complaint/${item.id}`">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'sync']"/>
                                        </client-only> Update
                                    </nuxt-link>
                                    <nuxt-link v-if="canCreate(authUser, 'canManageComplaint', SERVICES.POWERSERVE)" class="btn soft-btn-blue" :class="{'w-100 w-md-auto': isMobile}"
                                        to="/powerserve/complaint/create">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'plus']"/>
                                        </client-only> Add New
                                    </nuxt-link>
                                    <button v-if="can_cancel" @click="update_status({ status_id: COMPLAINT_STATUS.CANCELLED })" class="btn soft-btn-red" :class="{'w-100 w-md-auto': isMobile}">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'trash']"/>
                                        </client-only> 
                                        Cancel
                                    </button>
                                    <button v-if="item.status.id === COMPLAINT_STATUS.FOR_REVIEW" @click="update_status({ status_id: COMPLAINT_STATUS.ESCALATED })" class="btn soft-btn-orange" :class="{'w-100 w-md-auto': isMobile}">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'exclamation-triangle']"/>
                                        </client-only> 
                                        Escalate
                                    </button>
                                    <button v-if="item.status.id === COMPLAINT_STATUS.FOR_REVIEW" @click="update_status({ status_id: COMPLAINT_STATUS.CLOSED })" class="btn soft-btn-green" :class="{'w-100 w-md-auto': isMobile}">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'lock']"/>
                                        </client-only> 
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col pt-3">
                <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3"> Tasks </h5>

                <div v-if="item.tasks.length === 0">
                    <div class="alert alert-light text-center fst-italic small text-muted" role="alert">
                        No tasks available
                    </div>
                </div>

                <div v-for="task in item.tasks" class="row mb-3">
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-borderless table-hover">
                                        <tbody>
                                            <tr>
                                                <td class="text-muted">Ref Number</td>
                                                <td> {{ task.ref_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Status</td>
                                                <td>
                                                    <div :class="`badge soft-badge soft-badge-${ task.status?.color_class }`">
                                                        {{ task.status?.name }}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Assignee</td>
                                                <td> {{ task.assignee ? getFullnameWithTitles(task.assignee.firstname, task.assignee.lastname, task.assignee.middlename, task.assignee.name_prefix, task.assignee.name_suffix) : 'N/A' }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted align-middle">Description</td>
                                                <td>
                                                    <textarea readonly class="form-control form-control-sm small text-muted" rows="3">{{ task.description }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted align-middle">Action Taken</td>
                                                <td>
                                                    <textarea readonly class="form-control form-control-sm small text-muted" rows="3">{{ task.remarks }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted align-middle">Remarks</td>
                                                <td>
                                                    <textarea readonly class="form-control form-control-sm small text-muted" rows="3">{{ task.remarks }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Attachments</td>
                                                 <td>
                                                    <div class="d-flex flex-wrap">
                                                        <div v-for="file in task.files" class="p-1 image-container">
                                                            <a href="javascript:void(0)" @click="onClickFile(file)" data-bs-toggle="modal" data-bs-target="#image_modal">
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
                                <h6 class="fw-bold soft-badge-gray text-center p-2 rounded mb-3">Logs</h6>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-small small">
                                        <thead>
                                            <tr>
                                                <th class="no-wrap">Updated by</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Notes</th>
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
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="modal fade" tabindex="-1" id="image_modal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <button @click="handle_close_image_viewer" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <PowerserveImageViewer @close-image="handle_close_image_viewer" :task_file="selected_task_file" :show_back_btn="false"/>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>

</template>


<script setup lang="ts">
    import Swal from 'sweetalert2'
    import * as api from '~/composables/powerserve/complaint/complaint.api'
    import { COMPLAINT_STATUS } from '~/composables/powerserve/complaint/complaint.constants';
    import type { Complaint } from '~/composables/powerserve/complaint/complaint.types';
    import { TASK_STATUS } from '~/composables/powerserve/task/task.constants';
    import type { TaskFile, TaskStatus } from '~/composables/powerserve/task/task.types';
    import { ROUTES } from '~/utils/constants';

    definePageMeta({
        name: ROUTES.COMPLAINT_VIEW,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)

    const authUser = ref<AuthUser>({} as AuthUser)
    const route = useRoute()
    const item = ref<Complaint | undefined>()
    const screenWidth = ref(0);
    const task_statuses = ref<TaskStatus[]>([])
    
    const selected_task_file = ref<TaskFile>()
    const show_image = ref(false)

    const config = useRuntimeConfig()
    const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload'

    const isMobile = computed(() => screenWidth.value <= MOBILE_WIDTH);

    onMounted(async () => {

        screenWidth.value = window.innerWidth;

        window.addEventListener('resize', () => {
            screenWidth.value = window.innerWidth;
        });

        authUser.value = getAuthUser()

        const response = await api.fetchDataInView({ id: Number(route.params.id) })

        if(!response.complaint) {
            return redirectTo401Page()
        }

        item.value = response.complaint
        task_statuses.value = response.task_statuses

        isLoadingPage.value = false

    })

    const can_update = computed( () => {
        
        if(!item.value) return false 
        
        if(item.value.status.id === COMPLAINT_STATUS.CLOSED || item.value.status.id === COMPLAINT_STATUS.CANCELLED) {
            return false 
        }

        return true

    })

    const can_cancel = computed( () => {
        
        if(!item.value) return false 
        
        if(item.value.status.id !== COMPLAINT_STATUS.CLOSED && item.value.status.id !== COMPLAINT_STATUS.CANCELLED) {
            return true
        }

        return false

    })

    async function update_status(payload: { status_id: COMPLAINT_STATUS }) {
        const { status_id } = payload;

        // Define status-specific configurations
        const statusConfig = {
            [COMPLAINT_STATUS.CLOSED]: {
                title: 'Close Complaint?',
                text: 'Are you sure you want to close this complaint? It cannot be updated once closed.',
                confirmButtonText: 'Close!',
                confirmButtonColor: '#198754',
                icon: 'warning'
            },
            [COMPLAINT_STATUS.ESCALATED]: {
                title: 'Escalate Complaint?',
                text: "Are you sure you want to escalate this complaint? The assignee's supervisor will be notified",
                confirmButtonText: 'Escalate!',
                confirmButtonColor: '#e65100',
                icon: 'warning'
            },
            [COMPLAINT_STATUS.CANCELLED]: {
                title: 'Cancel Complaint?',
                text: 'Are you sure you want to cancel this complaint? Please provide a reason for cancellation.',
                confirmButtonText: 'Cancel!',
                confirmButtonColor: '#dc3545',
                icon: 'question'
            }
        };

        // @ts-ignore
        const config = statusConfig[status_id];

        Swal.fire({
            title: config.title,
            text: config.text,
            input: 'text',
            inputValue: '',
            inputPlaceholder: 'Add remarks here...',
            position: "top",
            icon: config.icon,
            showCancelButton: true,
            confirmButtonColor: config.confirmButtonColor,
            cancelButtonColor: "#6c757d",
            confirmButtonText: config.confirmButtonText,
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async (confirm) => {
                const inputValue = Swal.getInput()?.value || '';
                
                // Additional validation for cancellation
                if ((status_id === COMPLAINT_STATUS.CANCELLED || status_id === COMPLAINT_STATUS.ESCALATED) && !inputValue.trim()) {
                    Swal.showValidationMessage('Remarks is required');
                    return false;
                }

                const remarks = inputValue.trim();

                const { success, msg, data } = await api.update_complaint_status({ 
                    complaint: item.value!, 
                    status_id, 
                    remarks 
                });

                if (success && data) {
                    Swal.fire({
                        title: 'Success!',
                        text: msg,
                        icon: 'success',
                        position: 'top',
                    });

                    on_complaint_cancelled({ complaint: data })

                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: msg,
                        icon: 'error',
                        position: 'top',
                    });
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    }

    function on_complaint_cancelled(payload: { complaint: Complaint }) {
        
        const { complaint } = payload

        if(!item.value) return

        item.value.status = {...complaint.status};
        item.value.logs = deepClone(complaint.logs);

        // Remove tasks with status PENDING and update ASSIGNED tasks to CANCELLED

        const tasks = deepClone(item.value.tasks)

        const new_tasks = tasks
            .filter(task => task.status?.id !== TASK_STATUS.PENDING) // Remove pending tasks
            .map(task => { // update assigned task to cancelled

                if(task.status?.id === TASK_STATUS.ASSIGNED) {
                    const task_status_cancelled = task_statuses.value.find(i => i.id === TASK_STATUS.CANCELLED)

                    if(task_status_cancelled) {
                        task.status = deepClone(task_status_cancelled)
                    }

                    if(task.logs) {
                        task.logs.push({
                            status: deepClone(task_status_cancelled),
                            task_status_id: TASK_STATUS.CANCELLED,
                            remarks: 'System: The reference complaint has been canceled',
                            id: 0,
                            task_id: task.id,
                            created_by: authUser.value.user.username,
                            created_at: new Date().toISOString()
                        })
                    }


                }

                return task

            });


        console.log('new_tasks', new_tasks);

        item.value.tasks = new_tasks

    }

    function onClickFile(task_file: TaskFile) {
        selected_task_file.value = task_file
        show_image.value = true
    }

    function getUploadsPath(src: string) {

        const path = src.replace(UPLOADS_PATH, '')
        console.log('PATH', path)

        const uploadsPath = API_FILE_ENDPOINT + path
        return uploadsPath

    }

    function handle_close_image_viewer() {
        show_image.value = false 
        selected_task_file.value = undefined
    }


</script>



<style scoped>

    .container {
        max-width: 1800px; 
        margin: 0 auto; 
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