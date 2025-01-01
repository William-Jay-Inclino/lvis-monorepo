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
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> Gas Slip Info
                                    </h5>
                                    <hr class="result">
                                </div>

                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="text-muted" width="50%">Status</td>
                                            <td>
                                                <div v-if="item.is_posted === null" :class="{ [`badge bg-${approvalStatus[item.status].color}`]: true }">
                                                    {{ approvalStatus[item.status].label }}
                                                </div>
                                                <div v-else-if="item.is_posted === true" class="badge bg-info">
                                                    Posted
                                                </div>
                                                <div v-else class="badge bg-secondary">
                                                    Unposted
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Gas Slip Number</td>
                                            <td> {{ item.gas_slip_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Date</td>
                                            <td> {{ formatDate(item.used_on) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Driver</td>
                                            <td> {{ getFullname(item.driver.firstname, item.driver.middlename, item.driver.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Gas Station</td>
                                            <td> {{ item.gas_station.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Type of Fuel</td>
                                            <td> {{ item.fuel_type.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Requisitioner</td>
                                            <td> {{ getFullname(item.requested_by.firstname, item.requested_by.middlename, item.requested_by.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">With Container</td>
                                            <td> {{ item.with_container ? 'Yes' : 'No' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">No. of Liters</td>
                                            <td> {{ item.liter_in_text }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Actual Liter</td>
                                            <td> {{ item.actual_liter || 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Price Per Liter</td>
                                            <td> {{ item.price_per_liter || 'N/A' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Purpose</td>
                                            <td> {{ item.purpose }} </td>
                                        </tr>
                                    </tbody>
                                </table>
        
                            </div>
        
                        </div>
        
                        
                        <div class="row pt-3">

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'car']" />
                            </client-only> Vehicle Info
                                </h5>
                                <hr class="result">
                            </div>

                            <table class="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td width="50%" class="text-muted align-middle">Unposted Gas Slip</td>
                                        <td class="fw-bold fs-4 table-danger text-center text-danger"> {{ item.vehicle.total_unposted_gas_slips }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Vehicle Number</td>
                                        <td>
                                            <nuxt-link :to="'/motorpool/vehicle/view/' + item.vehicle.id">{{ item.vehicle.vehicle_number }}</nuxt-link> 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Plate Number</td>
                                        <td> {{ item.vehicle.plate_number }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Name</td>
                                        <td> {{ item.vehicle.name }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Classification</td>
                                        <td> {{ VehicleClassificationMapper[item.vehicle.classification_id] }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Date Acquired</td>
                                        <td> {{ formatDate(item.vehicle.date_acquired) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Assignee</td>
                                        <td> {{ getFullname(item.vehicle.assignee.firstname, item.vehicle.assignee.middlename, item.vehicle.assignee.lastname) }} </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
        
        
                        <div class="row pt-3">
                            <div class="col">
        
        
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'users']"/>
                            </client-only> Signatories
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
                                            <tr v-for="i, count in item.gas_slip_approvers">
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
                                        <nuxt-link v-if="canSearch(authUser, 'canManageGasSlip')" class="btn btn-secondary me-2"
                                            to="/motorpool/gas-slip">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search Gas Slip
                                        </nuxt-link>
                                        <button v-if="!!item.can_print && !item.cancelled_at" @click="onClickPrint" class="btn btn-danger">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'print']"/>
                            </client-only> Print Gas Slip
                                        </button>
                                        <button ref="printBtn" v-show="false" data-bs-toggle="modal"
                                            data-bs-target="#purchasingPdfModal">print</button>
                                    </div>
                                    <div v-if="!item.cancelled_at">
                                        <button v-if="isAdminOrOwner(item.created_by, authUser) && item.status === APPROVAL_STATUS.PENDING" class="btn btn-warning me-2"
                                            @click="onCancelGasSlip()">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'times-circle']" />
                            </client-only> Cancel Gas Slip
                                        </button>
                                        <button v-if="!!item.can_update" class="btn btn-success me-2"
                                            @click="onClickUpdate(item.id)">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']"/>
                            </client-only> Edit Form
                                        </button>
                                        <button v-if="!!item.can_post" class="btn btn-info me-2"
                                            @click="onClickPostGasSlip(item.id)">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']"/>
                            </client-only> Post Gas Slip
                                        </button>
                                        <button ref="postGasSlipBtn" v-show="false" data-bs-toggle="modal"
                                            data-bs-target="#post_gas_slip_modal">post</button>

                                        <button v-if="canCreate(authUser, 'canManageGasSlip')" class="btn btn-primary me-2"
                                            @click="onClickAdd">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add New Gas Slip
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
            <WarehouseGasSlipPostGasSlip @post-gas-slip="handlePostGasSlip" :is-posting="isPostingGasSlip"/>

        </div>
    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/motorpool/gas-slip/gas-slip.api'
import type { GasSlip } from '~/composables/motorpool/gas-slip/gas-slip.types';
import { approvalStatus } from '~/utils/constants'
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';
import { VehicleClassificationMapper } from '~/composables/motorpool/vehicle/vehicle.enums';

definePageMeta({
    name: ROUTES.GAS_SLIP_VIEW,
    layout: "layout-motorpool",
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
const isPostingGasSlip = ref(false)
const isLoadingPdf = ref(false)

// DATA
const printBtn = ref<HTMLButtonElement>()
const postGasSlipBtn = ref<HTMLButtonElement>()
const item = ref<GasSlip | undefined>()
const pdfUrl = ref('')



onMounted(async () => {

    authUser.value = getAuthUser()

    const response = await api.findOne(route.params.id as string)

    item.value = response

    isLoadingPage.value = false

})


async function onCancelGasSlip() {

    Swal.fire({
        title: "Are you sure?",
        text: `This Gas Slip will be cancelled!`,
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
                await cancelGasSlip()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelGasSlip() {

    if (!item.value) return

    const response = await api.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/motorpool/gas-slip')

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }


}

function onClickPostGasSlip(id: string) {
    console.log('post gas slip', id);

    postGasSlipBtn.value?.click()

}

async function handlePostGasSlip(payload: {actual_liter: number, price_per_liter: number}, closeBtn: HTMLButtonElement) {
    console.log('handlePostGasSlip', payload);
    console.log('closeBtn', closeBtn);

    if(!item.value) return 

    isPostingGasSlip.value = true 
    const response = await api.postGasSlip(item.value.id, payload)
    isPostingGasSlip.value = false 
    
    if (response.success && response.data) {
        toast.success(response.msg)
        
        item.value.is_posted = response.data.is_posted
        item.value.actual_liter = response.data.actual_liter
        item.value.price_per_liter = response.data.price_per_liter
        item.value.can_post = response.data.can_post
        item.value.can_print = response.data.can_print
        item.value.vehicle.total_unposted_gas_slips--

        // close modal
        closeBtn.click()

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

        const response = await axios.get(WAREHOUSE_API_URL + '/gas-slip/pdf/' + item.value?.id, {
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


const onClickAdd = () => router.push('/motorpool/gas-slip/create')
const onClickUpdate = (id: string) => router.push('/motorpool/gas-slip/' + id)

</script>