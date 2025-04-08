<template>

    <div v-if="!isLoadingPage && authUser" class="container">

        <PowerserveStatusDetails :statuses="store.task_statuses" />

        <div class="row mt-3">
            <div class="col-lg-3 mt-3">
                <PowerservePendingTasks :tasks="store.pending_tasks" :show_view_btn="true" modal_id="accept_task_modal" @on-click-accept="onViewPendingTask" />
            </div>
            <div class="col-lg-9 mt-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3">
                            <client-only>
                                <font-awesome-icon class="me-1" :icon="['fas', 'tasks']" />
                            </client-only>
                            My Tasks 
                        </h5>

                        <div v-if="store.tasks_by_assignee.length === 0" class="text-center small">
                            <span class="text-muted fst-italic">No items available</span>
                        </div>

                        <div v-else-if="is_loading_assignee_task_table" class="text-center">
                            <span class="text-muted fst-italic">Loading please wait...</span>
                        </div>

                        <div v-else class="responsive">
                            <table class="table table-hover table-borderless">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white"> Description </th>
                                        <th class="bg-secondary text-white"> Activity </th>
                                        <th class="bg-secondary text-white"> Date </th>
                                        <th class="bg-secondary text-white"> Status </th>
                                        <th class="bg-secondary text-center text-white">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'cog']" />
                                            </client-only>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="task in store.tasks_by_assignee">
                                        <td class="text-muted align-middle">
                                            <textarea readonly class="form-control form-control-sm small text-muted">{{ task.description }}</textarea>
                                        </td>
                                        <td class="text-muted align-middle">
                                            <textarea readonly class="form-control form-control-sm small text-muted">{{ task.activity ? task.activity.name : 'N/A' }}</textarea>
                                        </td>
                                        <td class="text-muted align-middle"> {{ formatDate(task.created_at, true) }} </td>
                                        <td class="text-muted align-middle">
                                            <div :class="`badge soft-badge soft-badge-${ task.status?.color_class }`">
                                                {{ task.status?.name }}
                                            </div>
                                        </td>
                                        <td class="text-center align-middle">
                                            <button @click="onViewAssigneeTask({ task })" class="btn btn-light text-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#task_details_modal">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'eye']" />
                                                </client-only>
                                                View 
                                            </button>

                                            <button v-if="task.status?.id === TASK_STATUS.ASSIGNED" @click="setOngoingStatus({ task })" class="btn btn-light text-success btn-sm">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'edit']" />
                                                </client-only> 
                                                Update 
                                            </button>

                                            <button :disabled="!can_update_task_info({ status_id: task.status!.id })" v-else @click="onViewAssigneeTask({ task })" class="btn btn-light text-success btn-sm" data-bs-toggle="modal" data-bs-target="#update_task_modal">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'edit']" />
                                                </client-only> 
                                                Update 
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div v-if="store.tasks_by_assignee.length > 0" class="row pt-4">
                            <div class="col">
                                <nav>
                                    <ul class="pagination justify-content-center">
                                        <!-- Previous Button -->
                                        <li class="page-item" :class="{ disabled: store.pagination.currentPage === 1 }">
                                            <a class="page-link" @click="changePageAssigneeTask(store.pagination.currentPage - 1)" href="#">Previous</a>
                                        </li>

                                        <!-- First Page -->
                                        <li v-if="store.visiblePages[0] > 1" class="page-item">
                                            <a class="page-link" @click="changePageAssigneeTask(1)" href="#">1</a>
                                        </li>
                                        <li v-if="store.visiblePages[0] > 2" class="page-item disabled">
                                            <span class="page-link">...</span>
                                        </li>

                                        <!-- Visible Pages -->
                                        <li
                                            v-for="page in store.visiblePages"
                                            :key="page"
                                            class="page-item"
                                            :class="{ active: store.pagination.currentPage === page }"
                                            >
                                            <a class="page-link" @click="changePageAssigneeTask(page)" href="#">{{ page }}</a>
                                        </li>

                                        <!-- Last Page -->
                                        <li v-if="store.visiblePages[store.visiblePages.length - 1] < store.pagination.totalPages - 1" class="page-item disabled">
                                            <span class="page-link">...</span>
                                        </li>
                                        <li v-if="store.visiblePages[store.visiblePages.length - 1] < store.pagination.totalPages" class="page-item">
                                            <a class="page-link" @click="changePageAssigneeTask(store.pagination.totalPages)" href="#">{{ store.pagination.totalPages }}</a>
                                        </li>

                                        <!-- Next Button -->
                                        <li class="page-item" :class="{ disabled: store.pagination.currentPage === store.pagination.totalPages }">
                                            <a class="page-link" @click="changePageAssigneeTask(store.pagination.currentPage + 1)" href="#">Next</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <PowerserveAcceptTaskModal
            :task="selected_pending_task"
            :is_accepting="is_accepting_task"
            :is_accepting_and_starting="is_accepting_and_starting_task"
            @accept-task="handleAcceptTask" 
        />

        <PowerserveTaskDetailsModal :task="selected_assignee_task" :is_loading_task_details="is_loading_task_details"/>

        <PowerserveUpdateTaskModal
            :files="files"
            :task="selected_assignee_task"
            :activities="store.activities" 
            :task_statuses="store.task_statuses"
            :linemen="linemen_incharge_options"
            :feeders="store.feeders"
            :weather_conditions="store.weather_conditions"
            :devices="store.devices"
            :meter_brands="store.meter_brands"
            :substations="store.substations"
            :is_updating="is_updating_task"
            @update-task="handleUpdateTask"
          />

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>


</template>


<script setup lang="ts">

    import Swal from 'sweetalert2'
    import type { Task, TaskFile } from '~/composables/powerserve/task/task.types';
    import { ROUTES } from '~/utils/constants';
    import * as myTaskApi from '~/composables/powerserve/task/my-task.api'
    import * as taskApi from '~/composables/powerserve/task/task.api'
    import { useMyTaskStore } from '~/composables/powerserve/task/my-task.store';
    import { TASK_STATUS } from '~/composables/powerserve/task/task.constants';
    import { useToast } from "vue-toastification";
    import type { Lineman } from '~/composables/powerserve/common';
    import type { AssignTaskInput, UpdateTaskInput } from '~/composables/powerserve/task/task.dto';
    import { can_update_task_info } from '~/composables/powerserve/task/task.helpers';

    definePageMeta({
        name: ROUTES.MY_TASK_INDEX,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const store = useMyTaskStore()
    const toast = useToast();
    const config = useRuntimeConfig()
    const API_URL = config.public.apiUrl
    const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload'
    const files = ref<File[]>([])

    // Flags
    const is_updating_task = ref(false)
    const is_accepting_task = ref(false)
    const is_accepting_and_starting_task = ref(false)
    const is_loading_pending_task_details = ref(false)
    const is_loading_task_details = ref(false)
    const is_loading_assignee_task_table = ref(false)

    const selected_pending_task = ref<Task>()
    const selected_assignee_task = ref<Task>()
    const linemen_incharge = ref<Lineman[]>([])

    onMounted(async () => {

        authUser.value = await getAuthUserAsync()

        if(!authUser.value.user.user_employee) {
            return redirectTo401Page() 
        }

        const employee_id = authUser.value.user.user_employee.employee.id

        const { pending_tasks, tasks_by_assignee_response, task_statuses, activities, feeders, weather_conditions, devices, meter_brands, substations } = await myTaskApi.init_data({
            assignee_id: employee_id,
            page: store.pagination.currentPage,
            pageSize: store.pagination.pageSize,
        })

        const { data, totalItems, currentPage, totalPages } = tasks_by_assignee_response

        store.set_tasks_by_assignee({ items: data })
        store.set_feeders({ feeders })
        store.set_weather_conditions({ weather_conditions })
        store.set_devices({ devices })
        store.set_activities({ activities })
        store.set_meter_brands({ meter_brands })
        store.set_substations({ substations })
        store.set_pending_tasks({ items: pending_tasks })
        store.set_task_statuses({ task_statuses })
        store.set_pagination({ currentPage, totalPages, totalItems })

        isLoadingPage.value = false
    })

    const linemen_incharge_options = computed( () => {
        return linemen_incharge.value.map(i => ({...i, fullname: getFullname(i.employee.firstname, i.employee.middlename, i.employee.lastname)})) 
    })

    async function onViewAssigneeTask(payload: { task: Task }) {

        const { task } = payload

        is_loading_task_details.value = true
        const area_id = task.task_assignment ? task.task_assignment.area_id || undefined : undefined 
        const response = await myTaskApi.get_data_on_view_assignee_task({ id: task.id, area_id })
        files.value = await getFiles({ files: response.task.files })

        is_loading_task_details.value = false

        selected_assignee_task.value = response.task
        linemen_incharge.value = response.linemen

    }

    async function onViewPendingTask(payload: { task: Task }) {

        const { task } = payload

        console.log('payload', payload);

        is_loading_pending_task_details.value = true
        const _task = await myTaskApi.get_task_with_complaint({ id: task.id })
        is_loading_pending_task_details.value = false

        if(_task) {
            selected_pending_task.value = _task
        }

    }

    async function handleAcceptTask(payload: { task: Task, will_start: boolean, note: string, closeBtn: HTMLButtonElement }) {

        const { task, will_start, note, closeBtn } = payload

        console.log('handleAcceptTask', payload);

        if(!authUser.value.user.user_employee) return 

        const assignee = authUser.value.user.user_employee.employee 

        const data: AssignTaskInput = {
            task,
            assignee,
            will_start,
            remarks: note || '',
        }

        set_accept_btns_loader({ will_start, is_loading: true })
        const response = await taskApi.assign_task(data)
        set_accept_btns_loader({ will_start, is_loading: false })

        if (response.success && response.data) {

            toast.success(response.msg)

            store.remove_pending_task({ task })
            closeBtn.click()

            is_loading_assignee_task_table.value = true
            const { tasks_by_assignee_response } = await myTaskApi.get_tasks_by_assignee({
                assignee_id: assignee.id,
                page: store.pagination.currentPage,
                pageSize: store.pagination.pageSize
            })
            is_loading_assignee_task_table.value = false

            const { data, totalItems, currentPage, totalPages } = tasks_by_assignee_response
            
            store.set_tasks_by_assignee({ items: data })
            store.set_pagination({ currentPage, totalPages, totalItems })

        } else {
            
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })

            if(response.msg === 'Task is already assigned') {
                closeBtn.click()
                store.remove_pending_task({ task })
            }

        }

    }

    async function handleUpdateTask(payload: { task_id: number, form: UpdateTaskInput, closeBtn: HTMLButtonElement }) {

        const { task_id, form, closeBtn } = payload

        is_updating_task.value = true

        if(form.attachments.length > 0) {
            form.attachments = await upload_attachments({ attachments: form.attachments, apiUrl: API_URL })
        }

        console.log('form', form);

        const { success, msg, data } = await taskApi.update_task({ task_id, input: form })
        is_updating_task.value = false

        if(success && data) {
            closeBtn.click()
            toast.success(msg)
            store.update_assignee_task({ task: data })
        } else {
            toast.error(msg)
        }

    }

    function set_accept_btns_loader(payload: { will_start: boolean, is_loading: boolean }) {
        const { will_start, is_loading } = payload 

        if(will_start) {
            is_accepting_and_starting_task.value = is_loading
        } else {
            is_accepting_task.value = is_loading
        }

    }

    async function changePageAssigneeTask(page: number) {

        if(!authUser.value.user.user_employee) return 

        const assignee = authUser.value.user.user_employee.employee 
    
        store.remove_selected_row_in_assignee_tasks()

        is_loading_assignee_task_table.value = true
        const { tasks_by_assignee_response } = await myTaskApi.get_tasks_by_assignee({
            assignee_id: assignee.id,
            page,
            pageSize: store.pagination.pageSize
        })
        is_loading_assignee_task_table.value = false

        const { data, totalItems, currentPage, totalPages } = tasks_by_assignee_response
        
        store.set_tasks_by_assignee({ items: data })
        store.set_pagination({ currentPage, totalPages, totalItems })
    }

    async function setOngoingStatus(payload: { task: Task }) {

        const { task } = payload

        Swal.fire({
            title: "Update Status to Ongoing",
            text: `Are you sure you want to update status to ongoing?`,
            input: 'text',
            inputValue: '', 
            inputPlaceholder: 'Add notes here if needed...',
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#198754",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Update!",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async (confirm) => {

                const inputValue = Swal.getInput()?.value;
                const remarks = inputValue || '';

                const { success, msg, data } = await taskApi.update_task_status({ task, status_id: TASK_STATUS.ONGOING, remarks })

                if(success && data) {
                    toast.success(msg)
                    store.update_assignee_task({ task: data })
                } else {
                    toast.error(msg)
                }

            },
            allowOutsideClick: () => !Swal.isLoading()
        })

    }

    async function upload_attachments(payload: { attachments: any[], apiUrl: string }): Promise<{src: string, filename: string}[]> {
        const { attachments, apiUrl } = payload

        let _file_paths = []

        const fileSources = await taskApi.uploadAttachments(attachments, apiUrl)

        if(fileSources) {

            const file_paths = deepClone(fileSources)

            for (let file_path of file_paths) {

                const firstUnderscoreIndex = file_path.indexOf('_');
                const filename = file_path.substring(firstUnderscoreIndex + 1);

                _file_paths.push({
                    src: file_path,
                    filename
                })

            }

        }

        return _file_paths
        
    }

    function getUploadsPath(src: string) {

        const path = src.replace(UPLOADS_PATH, '')
        console.log('PATH', path)

        const uploadsPath = API_FILE_ENDPOINT + path
        return uploadsPath

    }

    async function getFiles(payload: { files: TaskFile[] }) {

        const { files } = payload

        const result = [];

        for (const file of files) {
            if (file instanceof File) {
                result.push(file);
                continue;
            }
            
            const path = getUploadsPath(file.source_path);
            const response = await fetch(path);
            const blob = await response.blob();
            // @ts-ignore
            result.push(new File([blob], path.split('/').pop(), {
                type: blob.type || 'application/octet-stream',
                lastModified: new Date().getTime()
            }));
        }

        return result;
    }


</script>



<style scoped>

    .container {
        max-width: 1800px; 
        margin: 0 auto; 
    }

</style>