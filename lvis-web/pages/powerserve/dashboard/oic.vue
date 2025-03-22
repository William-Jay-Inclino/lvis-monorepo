<template>

    <div v-if="!isLoadingPage && authUser"  class="container">

        <PowerserveStatusDetails :statuses="store.task_statuses" />

        <div class="row mt-3">

            <div class="col-lg-3 mt-3">

                <div class="row">
                    <div class="col">
                        <div class="card fixed-height-card">
                            <div class="card-body">
                                <h6 class="fw-bold soft-badge-orange text-center p-2 rounded mb-3">
                                    <client-only>
                                        <font-awesome-icon class="me-1" :icon="['fas', 'exclamation-triangle']" />
                                    </client-only>
                                    Escalated Complaints 
                                </h6>
        
                                <div class="responsive">
                                    <table class="table table-borderless table-hover table-sm small">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white"> Description </th>
                                                <th class="bg-secondary text-white"> Date </th>
                                                <th class="bg-secondary text-center text-white">
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'cog']" />
                                                    </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="complaint in store.escalated_complaints">
                                                <td class="text-muted align-middle">
                                                    <textarea readonly class="form-control form-control-sm small text-muted" rows="3">{{ complaint.description }}</textarea>
                                                </td>
                                                <td class="text-muted align-middle no-wrap"> {{ formatDate(complaint.created_at, true) }} </td>
                                                <td class="align-middle text-center">
                                                    <button @click="onViewComplaint({ complaint })" class="btn btn-sm btn-light text-primary" data-bs-toggle="modal" data-bs-target="#complaint_details_modal"> View </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-3">
                    <div class="col">
                        <div class="card fixed-height-card">
                            <div class="card-body">
                                <h6 class="fw-bold soft-badge-gray text-center p-2 rounded mb-3">
                                    <client-only>
                                        <font-awesome-icon class="me-1" :icon="['fas', 'clipboard-list']" />
                                    </client-only>
                                    Pending Tasks 
                                </h6>

                                <div class="responsive">
                                    <table class="table table-borderless table-hover table-sm small">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white"> Description </th>
                                                <th class="bg-secondary text-white"> Date </th>
                                                <th class="bg-secondary text-center text-white">
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'cog']" />
                                                    </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="task in store.pending_tasks">
                                                <td class="text-muted align-middle">
                                                    <textarea readonly class="form-control form-control-sm small text-muted" rows="3">{{ task.description }}</textarea>
                                                </td>
                                                <td class="text-muted align-middle no-wrap"> {{ formatDate(task.created_at, true) }} </td>
                                                <td class="align-middle text-center">
                                                    <button class="btn btn-sm btn-light text-primary"> Assign </button>
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
                                        <td class="text-muted align-middle no-wrap"> {{ formatDate(i.created_at, true) }} </td>
                                        <td class="text-muted align-middle no-wrap">
                                            <div :class="`badge soft-badge soft-badge-${ i.status?.color_class }`">
                                                {{ i.status?.name }}
                                            </div>
                                        </td>
                                        <td class="align-middle text-center no-wrap">
                                            <button class="btn btn-light btn-sm text-primary">View</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>

        </div>

        <PowerserveComplaintDetailsModal :complaint="selected_complaint" :is_loading="is_loading_complaint" />

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