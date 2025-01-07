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
                            </client-only> MST Info
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
                                                <td class="text-muted">MST Number</td>
                                                <td> {{ item.mst_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Date</td>
                                                <td> {{ formatDate(item.mst_date) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">CWO Number</td>
                                                <td> {{ item.cwo_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">MWO Number</td>
                                                <td> {{ item.mwo_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">JO Number</td>
                                                <td> {{ item.jo_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Remarks</td>
                                                <td>
                                                    <textarea class="form-control form-control-sm" rows="5" readonly>{{ item.remarks }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Returned by</td>
                                                <td> {{ getFullname(item.returned_by.firstname, item.returned_by.middlename, item.returned_by.lastname) }} </td>
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
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'users']"/>
                            </client-only> Signatories
                                    </h5>
                                    <hr class="result">
                                </div>
        
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white"> Label </th>
                                                <th class="bg-secondary text-white"> Approver </th>
                                                <th class="bg-secondary text-white"> Status </th>
                                                <th class="bg-secondary text-white"> Comment </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i, count in item.mst_approvers">
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
                                                    <textarea rows="3" class="form-control form-control-sm" readonly
                                                        :value="i.notes || 'N/A'"></textarea>
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
                                                <th class="bg-secondary text-white"> Status </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i, count in item.mst_items">
                                                <td class="align-middle"> {{ count + 1 }} </td>
                                                <td class="align-middle" style="white-space: pre-line;">
                                                    <nuxt-link :to="'/warehouse/item/view/' + i.item.id">
                                                        <small>
                                                            {{ i.item.code + ' - ' + i.item.description }} 
                                                        </small>
                                                    </nuxt-link> 
                                                </td>
                                                <td class="align-middle"> {{ i.item.unit.name }} </td>
                                                <td class="align-middle"> {{ i.quantity }} </td>
                                                <td class="align-middle"> {{ formatToPhpCurrency(i.price) }} </td>
                                                <td class="align-middle"> {{ formatToPhpCurrency(i.quantity * i.price) }} </td>
                                                <td class="align-middle">
                                                    <span
                                                    :class="{'text-success': i.status === ITEM_STATUS.USABLE, 'text-danger': i.status === ITEM_STATUS.NOT_USABLE}">
                                                        {{ itemStatusMapper[i.status] }}
                                                    </span>
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
                                        <nuxt-link v-if="canSearch(authUser, 'canManageMST')" class="btn btn-secondary me-2"
                                            to="/warehouse/MST">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search MST
                                        </nuxt-link>
                                        <button disabled v-if="item.status === APPROVAL_STATUS.APPROVED && canPrint(authUser, 'canManageMST')" @click="onClickPrint" class="btn btn-danger">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'print']"/>
                            </client-only> Print MST
                                        </button>
                                        <button ref="printBtn" v-show="false" data-bs-toggle="modal"
                                            data-bs-target="#purchasingPdfModal">print</button>
                                    </div>
                                    <div v-if="!item.cancelled_at">
                                        <button v-if="isAdminOrOwner(item.created_by, authUser) && item.status === APPROVAL_STATUS.PENDING" class="btn btn-warning me-2"
                                            @click="onCancelMST()">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'times-circle']" />
                            </client-only> Cancel MST
                                        </button>
                                        <button v-if="!!item.can_update" class="btn btn-success me-2"
                                            @click="onClickUpdate(item.id)">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']"/>
                            </client-only> Edit Form
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageMST')" class="btn btn-primary me-2"
                                            @click="onClickAdd">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add New MST
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

import * as api from '~/composables/warehouse/mst/mst.api'
import type { MST } from '~/composables/warehouse/mst/mst.types';
import { approvalStatus } from '~/utils/constants'
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';
import { canPrint } from '~/utils/permissions';
import { APPROVAL_STATUS, isBlankStatus } from '#imports';

definePageMeta({
    name: ROUTES.MST_VIEW,
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

const item = ref<MST | undefined>()

const pdfUrl = ref('')


onMounted(async () => {

    authUser.value = getAuthUser()

    item.value = await api.findOne(route.params.id as string)

    isLoadingPage.value = false

})


async function onCancelMST() {

    Swal.fire({
        title: "Are you sure?",
        text: `This MST will be cancelled!`,
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
                await cancelMst()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelMst() {
    console.log('cancelMst')

    if (!item.value) return

    const response = await api.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/warehouse/mst')

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

        const response = await axios.get(WAREHOUSE_API_URL + '/mst/pdf/' + item.value?.id, {
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


const onClickAdd = () => router.push('/warehouse/mst/create')
const onClickUpdate = (id: string) => router.push('/warehouse/mst/' + id)

</script>