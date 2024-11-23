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
                            </client-only> OSRIV Info
                                    </h5>
                                    <hr class="result">
                                </div>

                                <table class="table table-bordered">
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
                                            <td class="text-muted">OSRIV Number</td>
                                            <td> {{ item.osriv_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Date</td>
                                            <td> {{ formatDate(item.date_requested) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted align-middle">Requested by</td>
                                            <td> {{ getFullname(item.requested_by.firstname, item.requested_by.middlename, item.requested_by.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Department</td>
                                            <td> {{ item.requested_by.department.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted align-middle">Item from</td>
                                            <td> {{ item.item_from.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted align-middle">Purpose</td>
                                            <td> {{ item.purpose }} </td>
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
                                            <tr v-for="i, count in item.osriv_approvers">
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


                        <div class="row pt-3">
                            <div class="col">
        
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                            </client-only> Items
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
                                                <th class="bg-secondary text-white"> Quantity </th>
                                                <th class="bg-secondary text-white"> Unit Price </th>
                                                <th class="bg-secondary text-white"> Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i, count in item.osriv_items">
                                                <td> {{ count + 1 }} </td>
                                                <td> {{ i.item.code + ' - ' + i.item.description }} </td>
                                                <td> {{ i.item.unit.name }} </td>
                                                <td> {{ i.quantity }} </td>
                                                <!-- <td> {{ i.item.total_quantity - i.item.quantity_on_queue }} </td> -->
                                                <td> {{ formatToPhpCurrency(i.price) }} </td>
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
                                        <nuxt-link v-if="canSearch(authUser, 'canManageOSRIV')" class="btn btn-secondary me-2"
                                            to="/warehouse/OSRIV">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search Search OSRIV
                                        </nuxt-link>
                                        <!-- <button disabled v-if="item.status === APPROVAL_STATUS.APPROVED && canPrint(authUser, 'canManageOSRIV')" @click="onClickPrint" class="btn btn-danger">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'print']"/>
                            </client-only> Print OSRIV
                                        </button>
                                        <button ref="printBtn" v-show="false" data-bs-toggle="modal"
                                            data-bs-target="#purchasingPdfModal">print</button> -->
                                    </div>
                                    <div v-if="!item.cancelled_at">
                                        <button v-if="isAdminOrOwner(item.created_by, authUser) && item.status === APPROVAL_STATUS.PENDING" class="btn btn-warning me-2"
                                            @click="onCancelOsriv()">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'times-circle']" />
                            </client-only> Cancel OSRIV
                                        </button>
                                        <button v-if="!!item.can_update" class="btn btn-success me-2"
                                            @click="onClickUpdate(item.id)">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']"/>
                            </client-only> Edit Form
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageOSRIV')" class="btn btn-primary me-2"
                                            @click="onClickAdd">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add New OSRIV
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

import * as api from '~/composables/warehouse/osriv/osriv.api'
import type { OSRIV } from '~/composables/warehouse/osriv/osriv.types';
import { approvalStatus } from '~/utils/constants'
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';
import { canPrint } from '~/utils/permissions';
import { APPROVAL_STATUS, isBlankStatus } from '#imports';

definePageMeta({
    name: ROUTES.OSRIV_VIEW,
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
const item = ref<OSRIV | undefined>()
const pdfUrl = ref('')



onMounted(async () => {

    authUser.value = getAuthUser()

    const response = await api.findOne(route.params.id as string)

    item.value = response

    isLoadingPage.value = false

})


async function onCancelOsriv() {

    Swal.fire({
        title: "Are you sure?",
        text: `This OSRIV will be cancelled!`,
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
                await cancelOsriv()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelOsriv() {
    console.log('cancelOsriv')

    if (!item.value) return

    const response = await api.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/warehouse/osriv')

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

        const response = await axios.get(WAREHOUSE_API_URL + '/osriv/pdf/' + item.value?.id, {
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


const onClickAdd = () => router.push('/warehouse/osriv/create')
const onClickUpdate = (id: string) => router.push('/warehouse/osriv/' + id)

</script>