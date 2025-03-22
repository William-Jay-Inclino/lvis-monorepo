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
                        <PowerservePendingTasks :tasks="store.pending_tasks" :show_assign_btn="true" modal_id=""/>
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

                        <div class="table-responsive">
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
                                            <textarea rows="2" class="form-control form-control-sm small text-muted" readonly>{{ i.description }}</textarea>
                                        </td>
                                        <td class="text-muted align-middle no-wrap">
                                            <textarea rows="2" class="form-control form-control-sm small text-muted" readonly>{{ i.activity ? i.activity.name : 'N/A' }}</textarea>
                                        </td>
                                        <td class="text-muted align-middle no-wrap small"> {{ formatDate(i.created_at, true) }} </td>
                                        <td class="text-muted align-middle no-wrap">
                                            <div :class="`badge soft-badge soft-badge-${ i.status?.color_class }`">
                                                {{ i.status?.name }}
                                            </div>
                                        </td>
                                        <td class="align-middle text-center no-wrap">
                                            <button class="btn btn-light btn-sm text-primary">
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
          header_class="soft-badge-red"
          header_text="Escalated Complaint"
          header_icon="exclamation-triangle" />

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
    import { findOne as get_complaint } from '~/composables/powerserve/complaint/complaint.api'

    definePageMeta({
        name: ROUTES.OIC_DASHBOARD,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const router = useRouter()
    const store = useOicDashboardStore()

    // FLAGS
    const is_loading_complaint = ref(false)

    const selected_complaint = ref<Complaint>()

    onMounted( async() => {
        authUser.value = await getAuthUserAsync()

        if(!authUser.value.user.user_employee) {
            return redirectTo401Page() 
        }
        
        const { escalated_complaints, task_statuses, pending_tasks, find_tasks_response } = await oicDashboardApi.init_data({
            page: store.pagination.currentPage,
            pageSize: store.pagination.pageSize,
            created_at: store.search_filters.created_at,
        })

        const { currentPage, totalPages, totalItems, data } = find_tasks_response

        store.set_escalated_complaints({ escalated_complaints })
        store.set_task_statuses({ task_statuses })
        store.set_pending_tasks({ pending_tasks })
        store.set_tasks({ tasks: data })
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