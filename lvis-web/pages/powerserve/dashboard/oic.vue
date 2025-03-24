<template>

    <div v-if="!isLoadingPage && authUser"  class="container">

        <PowerserveStatusDetails :statuses="store.task_statuses" />

        <div class="row mt-3">

            <div class="col-lg-3 mt-3">

                <div class="row">
                    <div class="col">

                        <PowerserveEscalatedComplaints :complaints="store.escalated_complaints" :show_view_btn="true" modal_id="complaint_details_modal" @on-click-view="onViewComplaint"/>

                    </div>
                </div>

                <div class="row mt-3">
                    <div class="col">
                        <PowerservePendingTasks @on-click-assign="onClickAssign" :tasks="store.pending_tasks" :show_assign_btn="true" modal_id="assign_task_modal"/>
                    </div>
                </div>

            </div>

            <div class="col-lg-9 mt-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3">
                            <client-only>
                                <font-awesome-icon class="me-1" :icon="['fas', 'clock']" />
                            </client-only>
                            Task Monitoring 
                        </h5>

                        <div v-if="store.tasks.length === 0" class="text-center text-muted small fst-italic">
                            No tasks available
                        </div>

                        <div v-else class="table-responsive">
                            <table class="table table-borderless table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white">Assignee</th>
                                        <th class="bg-secondary text-white">Description</th>
                                        <th class="bg-secondary text-white">Activity</th>
                                        <th class="bg-secondary text-white">Date</th>
                                        <th class="bg-secondary text-white">Status</th>
                                        <th class="bg-secondary text-center text-white">
                                            <client-only>
                                            <font-awesome-icon :icon="['fas', 'cog']" />
                                        </client-only>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="i, indx in store.tasks">
                                        <td class="text-muted align-middle no-wrap"> {{ i.assignee ? getFullname(i.assignee.firstname, i.assignee.middlename, i.assignee.lastname) : 'N/A' }} </td>
                                        <td class="text-muted align-middle no-wrap">
                                            <textarea rows="3" class="form-control form-control-sm small text-muted" readonly>{{ i.description }}</textarea>
                                        </td>
                                        <td class="text-muted align-middle no-wrap">
                                            <textarea rows="3" class="form-control form-control-sm small text-muted" readonly>{{ i.activity ? i.activity.name : 'N/A' }}</textarea>
                                        </td>
                                        <td class="text-muted align-middle no-wrap small"> {{ formatDate(i.created_at, true) }} </td>
                                        <td class="text-muted align-middle no-wrap">
                                            <div :class="`badge soft-badge soft-badge-${ i.status?.color_class }`">
                                                {{ i.status?.name }}
                                            </div>
                                        </td>
                                        <td class="align-middle text-center no-wrap">
                                            <button @click="onViewTask({ task: i })" class="btn btn-light btn-sm text-primary" data-bs-toggle="modal" data-bs-target="#task_details_modal">
                                                <client-only>
                                                    <font-awesome-icon class="me-1" :icon="['fas', 'eye']" />
                                                </client-only>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>

        </div>

        <PowerserveComplaintDetailsModal
          :complaint="selected_complaint"
          :is_loading="is_loading_complaint"
          :is_creating="is_creating_task"
          :employees="store.employees"
          @create-task="handle_create_task"
          header_class="soft-badge-red"
          header_text="Escalated Complaint"
          header_icon="exclamation-triangle" />

          <PowerserveAssignTaskModal
            :employees="store.employees"
            :task="selected_pending_task"
            :is_assigning="is_assigning_pending_task"
            @assign="handle_assign_pending_task" />

            <PowerserveTaskDetailsModal :task="selected_task" :is_loading_task_details="is_loading_task_details"/>

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>

</template>


<script setup lang="ts">

    import { ROUTES } from '~/utils/constants';
    import { useOicDashboardStore } from '~/composables/powerserve/oic_dashboard/oic_dashboard.store';
    import type { Complaint } from '~/composables/powerserve/complaint/complaint.types';
    import * as oicDashboardApi from '~/composables/powerserve/oic_dashboard/oic_dashboard.api'
    import { assign_task, create_task, findOne as find_task } from '~/composables/powerserve/task/task.api'
    import { findOne as get_complaint } from '~/composables/powerserve/complaint/complaint.api'
    import type { Employee } from '~/composables/hr/employee/employee.types';
    import { useToast } from "vue-toastification";
    import { TASK_STATUS } from '~/composables/powerserve/task/task.constants';
    import type { Task } from '~/composables/powerserve/task/task.types';

    definePageMeta({
        name: ROUTES.OIC_DASHBOARD,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const store = useOicDashboardStore()
    const toast = useToast();

    // FLAGS
    const is_loading_complaint = ref(false)
    const is_loading_tasks = ref(false)
    const is_creating_task = ref(false)
    const is_loading_task_details = ref(false)
    const is_assigning_pending_task = ref(false)

    const selected_complaint = ref<Complaint>()
    const selected_pending_task = ref<Task>()
    const selected_task = ref<Task>()

    onMounted( async() => {
        authUser.value = await getAuthUserAsync()

        if(!authUser.value.user.user_employee) {
            return redirectTo401Page() 
        }
        
        const { escalated_complaints, task_statuses, pending_tasks, find_tasks_response, employees, linemen } = await oicDashboardApi.init_data({
            page: store.pagination.currentPage,
            pageSize: store.pagination.pageSize,
            created_at: store.search_filters.created_at,
        })

        const { currentPage, totalPages, totalItems, data } = find_tasks_response

        store.set_escalated_complaints({ escalated_complaints })
        store.set_task_statuses({ task_statuses })
        store.set_pending_tasks({ pending_tasks })
        store.set_tasks({ tasks: data })
        store.set_employees({ employees })
        store.set_linemen({ linemen })
        store.set_pagination({ currentPage, totalPages, totalItems })

        isLoadingPage.value = false
    })


    async function onViewComplaint(payload: { complaint: Complaint }) {
        
        is_loading_complaint.value = true 
        const complaint = await get_complaint({ id: payload.complaint.id })
        is_loading_complaint.value = false 
        
        if(complaint) {
            selected_complaint.value = complaint
        }

    }

    async function onViewTask(payload: { task: Task }) {
        const { task } = payload

        console.log('payload', payload);

        is_loading_task_details.value = true
        const _task = await find_task({ id: task.id, with_task_details: true })
        is_loading_task_details.value = false

        if(_task) {
            selected_task.value = _task
        }
    }

    function onClickAssign(payload: { task: Task }) {
        
        console.log('onClickAssign2', payload);
        selected_pending_task.value = payload.task

    }

    async function handle_assign_pending_task(payload: {
        task: Task,
        assignee: Employee,
        note: string,
        closeBtn: HTMLButtonElement,
    }) {
        
        const { task, assignee, note, closeBtn } = payload

        is_assigning_pending_task.value = true
        const { success, msg, data } = await assign_task({ task, assignee, remarks: note, will_start: false })
        is_assigning_pending_task.value = false 

        if(success && data) {
            toast.success(msg)
            closeBtn.click() // close modal
            store.remove_pending_task({ task: data })
            await reload_tasks_and_task_statuses()
        } else {
            toast.error(msg)
        }

    }

    async function handle_create_task(payload: {
        complaint: Complaint,
        assignee: Employee | null,
        remarks: string,
        closeBtn: HTMLButtonElement
    }) {
        const { complaint, assignee, remarks, closeBtn } = payload

        console.log('complaint', complaint);

        is_creating_task.value = true
        const { success, msg, data } = await create_task({
            input: {
                complaint, assignee, remarks
            }
        })
        is_creating_task.value = false

        if(success && data) {
            toast.success(msg)

            // close modal
            closeBtn.click()

            if(data.status?.id === TASK_STATUS.PENDING) {
                store.add_pending_task({ task: data })
            }

            store.remove_escalated_complaint({ complaint })
            await reload_tasks_and_task_statuses()

        } else {
            toast.error(msg)
        }

    }

    // refresh task table and task statuses
    async function reload_tasks_and_task_statuses() {

        is_loading_tasks.value = true
        const { find_tasks_response, task_statuses } = await oicDashboardApi.get_tasks_and_task_statuses({
            page: store.pagination.currentPage,
            pageSize: store.pagination.pageSize,
            created_at: store.search_filters.created_at,
        })
        const { currentPage, totalPages, totalItems, data } = find_tasks_response

        store.set_task_statuses({ task_statuses })
        store.set_tasks({ tasks: data })
        store.set_pagination({ currentPage, totalPages, totalItems })
        is_loading_tasks.value = false
    }



</script>


<style scoped>

    .container {
        max-width: 1800px; 
        margin: 0 auto; 
    }

    .fixed-height-card {
        height: 400px;
        overflow-y: auto;
    }

</style>