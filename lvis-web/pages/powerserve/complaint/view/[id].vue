<template>

    <div v-if="!isLoadingPage && authUser && item" class="container">
        <div class="row">
            <div class="col">

            </div>
        </div>
        <div class="row">
            <div class="col pt-3">
                <div class="row mb-3">
                    <div class="col">
                        <div class="card soft-badge-yellow">
                            <div class="card-body text-center">
                                <h5>Complaint</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 data-testid="complaint-info" class="text-warning fst-italic">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'info-circle']"/>
                                </client-only> Complaint Info
                            </h5>
                            <hr class="result">
                        </div>
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover">
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
                                        <td class="text-muted">Description</td>
                                        <td>
                                            <textarea rows="3" class="form-control form-control-sm small">{{ item.description }}</textarea>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Remarks</td>
                                        <td>
                                            <textarea rows="3" class="form-control form-control-sm small">{{ item.remarks }}</textarea>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Date</td>
                                        <td> {{ formatDate(item.created_at, true) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Account number</td>
                                        <td> {{ item.complaint_detail.account_number || 'N/A' }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Meter number</td>
                                        <td> {{ item.complaint_detail.meter_number || 'N/A' }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Consumer name</td>
                                        <td> {{ item.complaint_detail.consumer ? item.complaint_detail.consumer.name : 'N/A' }} </td>
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
                                        <td> {{ item.complaint_detail.sitio?.name }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Landmark</td>
                                        <td> {{ item.complaint_detail.landmark }} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'info-circle']"/>
                                </client-only> Logs
                            </h5>
                            <hr class="result">
                        </div>
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
                                        <td class="text-muted align-middle"> {{ formatDate(log.created_at) }} </td>
                                        <td class="text-muted align-middle">
                                            <div :class="`badge soft-badge soft-badge-${ log.status?.color_class }`">
                                                {{ log.status?.name }}
                                            </div>
                                        </td>
                                        <td class="text-muted">
                                            <textarea class="form-control form-control-sm small text-muted">{{ log.remarks }}</textarea>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row mb-3 pt-3">
                            <div class="col">
                                <div class="d-flex justify-content-center flex-wrap gap-2">
                                    <nuxt-link v-if="canSearch(authUser, 'canManageComplaint')" class="btn btn-secondary" :class="{'w-100 w-md-auto': isMobile}"
                                        to="/powerserve/complaint">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'search']" />
                                        </client-only> 
                                        Search Complaint
                                    </nuxt-link>
                                    <nuxt-link class="btn btn-success" :class="{'w-100 w-md-auto': isMobile}"
                                        :to="`/powerserve/complaint/${item.id}`">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'sync']"/>
                                        </client-only> Update Complaint
                                    </nuxt-link>
                                    <nuxt-link v-if="canCreate(authUser, 'canManageComplaint')" class="btn btn-primary" :class="{'w-100 w-md-auto': isMobile}"
                                        to="/powerserve/complaint/create">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'plus']"/>
                                    </client-only> Add New Complaint
                                    </nuxt-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col pt-3">
                <div class="row mb-3">
                    <div class="col">
                        <div class="card soft-badge-orange">
                            <div class="card-body text-center">
                                <h5>Tasks</h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-for="task in item.tasks" class="row">
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 data-testid="complaint-info" class="text-warning fst-italic">
                                        Ref Number:  {{ task.ref_number }}
                                    </h5>
                                    <hr class="result">
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <tbody>
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
                                                <td> {{ task.assignee ? task.assignee.firstname : 'N/A' }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Action Taken</td>
                                                <td>
                                                    <textarea class="form-control form-control-sm small text-muted" rows="3">{{ task.remarks }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Remarks</td>
                                                <td>
                                                    <textarea class="form-control form-control-sm small text-muted" rows="3">{{ task.remarks }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Attachments</td>
                                                <td> </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                                        </client-only> Logs
                                    </h5>
                                    <hr class="result">
                                </div>
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
                                                <td class="text-muted align-middle"> {{ formatDate(log.created_at) }} </td>
                                                <td class="text-muted align-middle">
                                                    <div :class="`badge soft-badge soft-badge-${ log.status?.color_class }`">
                                                        {{ log.status?.name }}
                                                    </div>
                                                </td>
                                                <td class="text-muted">
                                                    <textarea class="form-control form-control-sm small text-muted">{{ log.remarks }}</textarea>
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

    <div v-else>
        <LoaderSpinner />
    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/powerserve/complaint/complaint.api'
import type { Complaint } from '~/composables/powerserve/complaint/complaint.types';
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


const isMobile = computed(() => screenWidth.value <= MOBILE_WIDTH);

onMounted(async () => {

    screenWidth.value = window.innerWidth;

    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth;
    });

    authUser.value = getAuthUser()

    item.value = await api.findOne(route.params.id as string)

    isLoadingPage.value = false

})

</script>



<style scoped>

    .container {
        max-width: 1800px; 
        margin: 0 auto; 
    }

</style>