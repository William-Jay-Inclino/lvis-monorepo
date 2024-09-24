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
                                        <i class="fas fa-info-circle"></i> MRV Info
                                    </h5>
                                    <hr class="result">
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <tbody>
                                            <tr>
                                                <td class="text-muted">Status</td>
                                                <td>
                                                    <div :class="{ [`badge bg-${approvalStatus[item.status].color}`]: true }">
                                                        {{ approvalStatus[item.status].label }}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">MRV Number</td>
                                                <td> {{ item.mrv_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">MCT Number</td>
                                                <td>
                                                    <nuxt-link
                                                        v-if="item.mct"
                                                        :to="'/warehouse/mct/view/' + item.mct.id">{{
                                                        item.mct.mct_number
                                                        }}</nuxt-link>
                                                    <div v-else> N/A </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Date</td>
                                                <td> {{ formatDate(item.date_requested) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Request Type</td>
                                                <td> {{ warehouseRequestTypeMapper[item.request_type] }} </td>
                                            </tr>
                                            <tr v-if="showORnumber(item.request_type)">
                                                <td class="text-muted">OR Number</td>
                                                <td> {{ item.or_number }} </td>
                                            </tr>
                                            <tr v-if="showMWOnumber(item.request_type)">
                                                <td class="text-muted">MWO Number</td>
                                                <td> {{ item.mwo_number }} </td>
                                            </tr>
                                            <tr v-if="showCWOnumber(item.request_type)">
                                                <td class="text-muted">CWO Number</td>
                                                <td> {{ item.cwo_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">JO Number</td>
                                                <td> {{ item.jo_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Item from</td>
                                                <td> {{ item.item_from.name }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Project Name</td>
                                                <td> {{ item.project.name }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Consumer Name</td>
                                                <td> {{ item.consumer_name }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Location</td>
                                                <td> {{ item.location }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Purpose</td>
                                                <td> {{ item.purpose }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Requested by</td>
                                                <td> {{ getFullname(item.requested_by.firstname, item.requested_by.middlename, item.requested_by.lastname) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Withdrawn by</td>
                                                <td v-if="item.withdrawn_by"> {{ getFullname(item.withdrawn_by.firstname, item.withdrawn_by.middlename, item.withdrawn_by.lastname) }} </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
                            </div>
        
                        </div>
        
        
        
        
                        <div class="row pt-3">
                            <div class="col">
        
        
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <i class="fas fa-users"></i> Approvers
                                    </h5>
                                    <hr class="result">
                                </div>
        
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white"> Order </th>
                                                <th class="bg-secondary text-white"> Label </th>
                                                <th class="bg-secondary text-white"> Approver </th>
                                                <th class="bg-secondary text-white"> Status </th>
                                                <th class="bg-secondary text-white"> Notes </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i, count in item.mrv_approvers">
                                                <td class="align-middle"> {{ i.order }} </td>
                                                <td class="align-middle"> {{ i.label }} </td>
                                                <td class="align-middle"> {{ getFullname(i.approver!.firstname,
                i.approver!.middlename, i.approver!.lastname) }} </td>
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


                        <div class="row pt-3">
                            <div class="col">
        
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <i class="fas fa-shopping-cart"></i> Items
                                    </h5>
                                    <hr class="result">
                                </div>
    
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white"> No. </th>
                                                <th class="bg-secondary text-white"> Description </th>
                                                <th class="bg-secondary text-white"> Unit </th>
                                                <th class="bg-secondary text-white"> Available Qty </th>
                                                <th class="bg-secondary text-white"> Price </th>
                                                <th class="bg-secondary text-white"> Qty Request </th>
                                                <th class="bg-secondary text-white"> Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i, count in item.mrv_items">
                                                <td> {{ count + 1 }} </td>
                                                <td> {{ i.item.name + ' - ' + i.item.description }} </td>
                                                <td> {{ i.item.unit.name }} </td>
                                                <td> {{ i.item.total_quantity - i.item.quantity_on_queue }} </td>
                                                <td> {{ formatToPhpCurrency(i.price) }} </td>
                                                <td> {{ i.quantity }} </td>
                                                <td> {{ formatToPhpCurrency(i.quantity * i.price) }} </td>
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
                                        <nuxt-link v-if="canSearch(authUser, 'canManageMRV')" class="btn btn-secondary me-2"
                                            to="/warehouse/MRV">
                                            <i class="fas fa-search"></i> Search MRV
                                        </nuxt-link>
                                        <button v-if="item.status === APPROVAL_STATUS.APPROVED && canPrint(authUser, 'canManageMRV')" @click="onClickPrint" class="btn btn-danger">
                                            <i class="fas fa-print"></i> Print MRV
                                        </button>
                                        <button ref="printBtn" v-show="false" data-bs-toggle="modal"
                                            data-bs-target="#purchasingPdfModal">print</button>
                                    </div>
                                    <div v-if="!item.cancelled_at">
                                        <button v-if="isAdminOrOwner(item.created_by, authUser)" class="btn btn-warning me-2"
                                            @click="onCancelMRV()">
                                            <i class="fas fa-times-circle"></i> Cancel MRV
                                        </button>
                                        <button v-if="!!item.can_update" class="btn btn-success me-2"
                                            @click="onClickUpdate(item.id)">
                                            <i class="fas fa-sync"></i> Update MRV
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageMRV')" class="btn btn-primary me-2"
                                            @click="onClickAdd">
                                            <i class="fas fa-plus"></i> Add New MRV
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

import * as api from '~/composables/warehouse/mrv/mrv.api'
import type { MRV } from '~/composables/warehouse/mrv/mrv.types';
import { approvalStatus } from '~/utils/constants'
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';
import { canPrint } from '~/utils/permissions';
import { APPROVAL_STATUS, isBlankStatus } from '#imports';
import { showCWOnumber, showMWOnumber, showORnumber } from '~/utils/helpers';

definePageMeta({
    name: ROUTES.MRV_VIEW,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const isLoadingPdf = ref(false)

const config = useRuntimeConfig()
const WAREHOUSE_API_URL = config.public.warehouseApiUrl

const router = useRouter()
const route = useRoute()

const toast = useToast();

const printBtn = ref<HTMLButtonElement>()

const item = ref<MRV | undefined>()

const pdfUrl = ref('')


onMounted(async () => {

    authUser.value = getAuthUser()

    item.value = await api.findOne(route.params.id as string)

    isLoadingPage.value = false

})


async function onCancelMRV() {

    Swal.fire({
        title: "Are you sure?",
        text: `This MRV will be cancelled!`,
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
                await cancelMrv()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelMrv() {
    console.log('cancelMrv')

    if (!item.value) return

    const response = await api.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/warehouse/mrv')

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

        const response = await axios.get(WAREHOUSE_API_URL + '/mrv/pdf/' + item.value?.id, {
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


const onClickAdd = () => router.push('/warehouse/mrv/create')
const onClickUpdate = (id: string) => router.push('/warehouse/mrv/' + id)

</script>