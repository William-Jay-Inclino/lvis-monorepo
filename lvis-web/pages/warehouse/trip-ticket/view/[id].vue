<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center">
        
                <div class="col-lg-10">
        
                    <div v-if="item">
        
                        <div class="row pt-3">
                            <div class="col">
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <i class="fas fa-info-circle"></i> Trip Ticket Info
                                    </h5>
                                    <hr class="result">
                                </div>

                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="text-muted">Status</td>
                                            <td>
                                                <div :class="{ [`badge bg-${tripTicketStatus[item.status].color}`]: true }">
                                                    {{ tripTicketStatus[item.status].label }}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Trip Number</td>
                                            <td> {{ item.trip_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Vehicle</td>
                                            <td> {{ item.vehicle.vehicle_number + " " + item.vehicle.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Driver</td>
                                            <td> {{ getFullname(item.driver.firstname, item.driver.middlename, item.driver.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Passengers</td>
                                            <td> {{ item.passengers }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Destination</td>
                                            <td> {{ item.destination }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Purpose</td>
                                            <td> {{ item.purpose }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Prepared By</td>
                                            <td> {{ getFullname(item.prepared_by.firstname, item.prepared_by.middlename, item.prepared_by.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Estimated Departure</td>
                                            <td> {{ formatDate(item.start_time, true) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Estimated Arrival</td>
                                            <td> {{ formatDate(item.end_time, true) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Actual Departure</td>
                                            <td> {{ item.actual_start_time ? formatDate(item.actual_start_time, true) : 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Actual Arrival</td>
                                            <td> {{ item.actual_end_time ? formatDate(item.actual_end_time, true) : 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Is Operation</td>
                                            <td> {{ item.is_operation ? 'Yes' : 'No' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Is Stay In</td>
                                            <td> {{ item.is_stay_in ? 'Yes' : 'No' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Is Personal</td>
                                            <td> {{ item.is_personal ? 'Yes' : 'No' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Is Out Of Coverage</td>
                                            <td> {{ item.is_out_of_coverage ? 'Yes' : 'No' }} </td>
                                        </tr>
                                    </tbody>
                                </table>
        
                            </div>
        
                        </div>
        
        
        
        
                        <div class="row pt-3">
                            <div class="col">
        
        
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <i class="fas fa-users"></i> Signatories
                                    </h5>
                                    <hr class="result">
                                </div>
        
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white"> Label </th>
                                                <th class="bg-secondary text-white"> Approver </th>
                                                <th class="bg-secondary text-white"> Status </th>
                                                <th class="bg-secondary text-white"> Notes </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i, count in item.trip_ticket_approvers">
                                                <td class="align-middle"> {{ i.label }} </td>
                                                <td class="align-middle"> 
                                                    {{ getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname) }} 
                                                </td>
                                                <td v-if="!isBlankStatus(item.status, i.status)" class="text-muted text-center align-middle">
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                    <div class="fst-italic" v-if="i.date_approval">
                                                        <small> {{ formatDate(i.date_approval, true) }} </small>
                                                    </div>
                                                </td>
                                                <td v-else class="text-muted text-center align-middle fst-italic">
                                                    N/A
                                                </td>
                                                <td>
                                                    <textarea rows="3" class="form-control" disabled
                                                        :value="i.notes"></textarea>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
        
                            </div>
                        </div>
        
                        <hr>
        
                        <div class="row mb-3 pt-3">
                            <div class="col">
                                <div class="d-flex justify-content-end">
                                    <div class="me-2">
                                        <nuxt-link v-if="canSearch(authUser, 'canManageTripTicket')" class="btn btn-secondary me-2"
                                            to="/warehouse/trip-ticket">
                                            <i class="fas fa-search"></i> Search Trip Ticket
                                        </nuxt-link>
                                        <button disabled v-if="item.status === TRIP_TICKET_STATUS.APPROVED && canPrint(authUser, 'canManageTripTicket')" @click="onClickPrint" class="btn btn-danger">
                                            <i class="fas fa-print"></i> Print Trip Ticket
                                        </button>
                                        <button ref="printBtn" v-show="false" data-bs-toggle="modal"
                                            data-bs-target="#purchasingPdfModal">print</button>
                                    </div>
                                    <div v-if="!item.cancelled_at">
                                        <button v-if="isAdminOrOwner(item.created_by, authUser)" class="btn btn-warning me-2"
                                            @click="onCancelTripTicket()">
                                            <i class="fas fa-times-circle"></i> Cancel Trip Ticket
                                        </button>
                                        <button v-if="!!item.can_update" class="btn btn-success me-2"
                                            @click="onClickUpdate(item.id)">
                                            <i class="fas fa-edit"></i> Edit Form
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageTripTicket')" class="btn btn-primary me-2"
                                            @click="onClickAdd">
                                            <i class="fas fa-plus"></i> Add New Trip Ticket
                                        </button>
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
        
            <WarehousePdfModal :is-loading-pdf="isLoadingPdf" :pdf-url="pdfUrl" />
            
        </div>
    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/trip-ticket/trip-ticket.api'
import type { TripTicket } from '~/composables/warehouse/trip-ticket/trip-ticket.types';
import { TRIP_TICKET_STATUS, tripTicketStatus } from '~/composables/warehouse/trip-ticket/trip-ticket.enums';
import { approvalStatus } from '~/utils/constants'
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';
import { canPrint } from '~/utils/permissions';
import { APPROVAL_STATUS, isBlankStatus } from '#imports';

definePageMeta({
    name: ROUTES.TRIP_TICKET_VIEW,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

// CONFIGS
const config = useRuntimeConfig()
const WAREHOUSE_API_URL = config.public.warehouseApiUrl

// CONSTANTS
const authUser = ref<AuthUser>({} as AuthUser)
const router = useRouter()
const route = useRoute()
const toast = useToast();

// FLAGS
const isLoadingPage = ref(true)
const isLoadingPdf = ref(false)

// DATA
const printBtn = ref<HTMLButtonElement>()
const item = ref<TripTicket | undefined>()
const pdfUrl = ref('')



onMounted(async () => {

    authUser.value = getAuthUser()

    const response = await api.findOne(route.params.id as string)

    item.value = response

    isLoadingPage.value = false

})


async function onCancelTripTicket() {

    Swal.fire({
        title: "Are you sure?",
        text: `This Trip Ticket will be cancelled!`,
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, cancel it!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (remove) => {

            if (remove) {
                await cancelTripTicket()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelTripTicket() {
    console.log('cancelTripTicket')

    if (!item.value) return

    const response = await api.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/warehouse/trip-ticket')

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }


}

async function onClickPrint() {
    console.log('onClickPrint()');

    printBtn.value?.click()
    
    try {

        const accessToken = authUser.value.access_token

        isLoadingPdf.value = true

        const response = await axios.get(WAREHOUSE_API_URL + '/trip-ticket/pdf/' + item.value?.id, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${accessToken}`, // Include Authorization header
            },
        });

        isLoadingPdf.value = false

        const blob = new Blob([response.data], { type: 'application/pdf' });
        pdfUrl.value = window.URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}


const onClickAdd = () => router.push('/warehouse/trip-ticket/create')
const onClickUpdate = (id: string) => router.push('/warehouse/trip-ticket/' + id)

</script>