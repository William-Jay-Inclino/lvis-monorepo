<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && item" class="row justify-content-center mb-3">
        
                <div class="col-lg-10">
        
                    <div class="row">
                        <div class="col">
                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> MEQS Info
                                </h5>
                                <hr class="result">
                            </div>
        
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <tbody>
                                        <tr>
                                            <td width="50%" class="text-muted">Status</td>
                                            <td>
                                                <div :class="{ [`badge bg-${approvalStatus[item.status].color}`]: true }">
                                                    {{ approvalStatus[item.status].label }}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">RC Number</td>
                                            <td>
                                                <nuxt-link v-if="referenceData?.canvass"
                                                    :to="'/purchase/canvass/view/' + referenceData?.canvass.id">{{
                referenceData?.canvass.rc_number }}</nuxt-link>
                                                <div v-else>
                                                    N/A
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted"> {{ referenceLabel }} Number</td>
                                            <td>
                                                <nuxt-link v-if="item.rv_number" :to="'/purchase/rv/view/' + item.rv_number">
                                                    {{ item.rv_number }} </nuxt-link>
                                                <nuxt-link v-else-if="item.spr_number"
                                                    :to="'/purchase/spr/view/' + item.spr_number"> {{ item.spr_number }} </nuxt-link>
                                                <nuxt-link v-else-if="item.jo_number" :to="'/purchase/jo/view/' + item.jo_number">
                                                    {{ item.jo_number }} </nuxt-link>
                                                    <div v-else>
                                                        N/A
                                                    </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">MEQS Number</td>
                                            <td> {{ item?.meqs_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted align-middle">PO Number/s</td>
                                            <td>
                                                <div v-if="hasPO">
                                                    <div v-for="meqsSupplier in item.meqs_suppliers">
                                                        <nuxt-link v-if="meqsSupplier.po"
                                                            :to="'/purchase/po/view/' + meqsSupplier.po.id">{{
                meqsSupplier.po.po_number }}</nuxt-link>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    N/A
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">RR Number/s</td>
                                            <td>
                                                <div v-if="hasPO">
                                                    <div v-for="meqsSupplier in item.meqs_suppliers">
        
                                                        <div v-if="meqsSupplier.po && meqsSupplier.po.rrs.length > 0">
                                                            <div v-for="rr in meqsSupplier.po.rrs">
                                                                <nuxt-link :to="'/warehouse/rr/view/' + rr.id">{{
                rr.rr_number }}</nuxt-link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    N/A
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Date</td>
                                            <td> {{ formatDate(item?.meqs_date) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Notes</td>
                                            <td> {{ item?.notes }} </td>
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
                                <table class="table table-hover table-bordered">
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
                                        <tr v-for="i, count in item.meqs_approvers">
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
                                                <textarea rows="3" class="form-control" disabled :value="i.notes"></textarea>
                                            </td>
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
                                <font-awesome-icon :icon="['fas', 'truck']" />
                            </client-only> Suppliers
                                </h5>
                                <hr class="result">
                            </div>
        
                            <div class="alert alert-info" role="alert">
                                <small class="text-muted fst-italic">Click the attachment to view it in a larger size.</small>
                            </div>
        
                            <div class="table-responsive">
                                <table class="table table-hover table-bordered ">
                                    <thead>
                                        <tr>
                                            <th class="bg-secondary text-white"> Supplier </th>
                                            <th class="bg-secondary text-white"> Payment Terms </th>
                                            <th class="bg-secondary text-white"> Attachments </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="i, count in item.meqs_suppliers">
                                            <td class="text-muted align-middle"> {{ i.supplier!.name }} </td>
                                            <td class="text-muted align-middle"> {{ i.payment_terms }} </td>
                                            <td>
                                                <div class="d-flex flex-wrap">
                                                    <div v-for="attachment in i.attachments" class="p-1 image-container">
                                                        <a href="javascript:void(0)" @click="onClickAttachment(attachment.src)"
                                                            data-bs-toggle="modal" data-bs-target="#myModal">
                                                            <img :src="getUploadsPath(attachment.src)"
                                                                class="img-thumbnail small-image" alt="Image not found">
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
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
                                <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                            </client-only> Items
                                </h5>
                                <hr class="result">
                            </div>
                            <div class="alert alert-info" role="alert">
                                <div>
                                    <small class="text-muted fst-italic">1. The awarded supplier is indicated by a yellow
                                        star.</small>
                                </div>
                                <div>
                                    <small class="text-muted fst-italic">2. The highlighted row needs some review.</small>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover table-sm table-bordered ">
                                    <thead>
                                        <tr>
                                            <th class="bg-secondary text-white"> No </th>
                                            <th class="bg-secondary text-white"> Item </th>
                                            <th class="bg-secondary text-white"> Unit Price </th>
                                            <th class="bg-secondary text-white"> Qty </th>
                                            <th class="bg-secondary text-white text-center"
                                                v-for="meqsSupplier in item.meqs_suppliers">
                                                {{ `${meqsSupplier.supplier?.name}` }}
                                            </th>
                                            <th class="bg-secondary text-white text-center">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="referenceData?.canvass">
                                        <tr :class="{'table-danger': hasRemarks(canvassItem.id, item.meqs_suppliers)}" v-for="canvassItem, i in referenceData.canvass.canvass_items">
                                            <td class="text-muted"> {{ i + 1 }} </td>
                                            <td class="text-muted"> {{ canvassItem.description }} </td>
                                            <td class="text-muted"> {{ canvassItem.unit ? canvassItem.unit.name : 'N/A' }} </td>
                                            <td class="text-muted"> {{ canvassItem.quantity }} </td>
                                            <td class="text-muted text-center" v-for="meqsSupplier in item.meqs_suppliers">
                                                <template v-for="supplierItem in meqsSupplier.meqs_supplier_items">
                                                    <span v-if="supplierItem.canvass_item.id === canvassItem.id">
                                                        {{ supplierItem.price === -1 ? 'N/A' :
                formatToPhpCurrency(supplierItem.price) }}
                                                       
                                                            <client-only>
                                                                <font-awesome-icon 
                                                                :icon="['fas', 'star']" 
                                                                class="fs-5" 
                                                                :class="{ 'text-warning': supplierItem.is_awarded }" 
                                                                />

                                                            </client-only>
                                                    </span>
                                                </template>
                                            </td>
                                            <td class="text-center">
                                                <button @click="onClickNote(canvassItem.id)" class="btn btn-secondary btn-sm"
                                                    data-bs-toggle="modal" data-bs-target="#myModal">
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'book']" />
                                                    </client-only>
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <tr>
                                            <td :colspan="5 + item.meqs_suppliers.length" class="text-center">N/A</td>
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
                                    <nuxt-link v-if="canSearch(authUser, 'canManageMEQS')" class="btn btn-secondary me-2"
                                        to="/purchase/meqs">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search MEQS
                                    </nuxt-link>
                                    <button v-if="item.status === APPROVAL_STATUS.APPROVED && canPrint(authUser, 'canManageMEQS')" @click="onClickPrint" class="btn btn-danger" data-bs-toggle="modal"
                                        data-bs-target="#purchasingPdfModal">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'print']"/>
                            </client-only> Print MEQS
                                    </button>
                                </div>
                                <div v-if="!item.cancelled_at">
                                    <button v-if="isAdminOrOwner(item.created_by, authUser) && item.status === APPROVAL_STATUS.PENDING" class="btn btn-warning me-2"
                                        @click="onCancelMeqs()">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'times-circle']" />
                            </client-only> Cancel MEQS
                                    </button>
                                    <button v-if="!!item.can_update" class="btn btn-success me-2"
                                        @click="onClickUpdate(item.id)">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']"/>
                            </client-only> Edit Form
                                    </button>
                                    <button v-if="canCreate(authUser, 'canManageMEQS')" class="btn btn-primary me-2"
                                        @click="onClickAdd">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add New MEQS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
        
        
                </div>
        
                <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" :class="{'modal-xl': modalToShow === 'attachment'}">
                        <div class="modal-content">
        
                            <div class="modal-header">
                                <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
        
                            <div class="modal-body d-flex justify-content-center">
                                <div v-if="modalToShow === 'attachment'">
                                    <img :src="selectedAttachment" class="img-fluid" :alt="selectedAttachment">
                                </div>
                                <div v-else>
                                    <textarea rows="5" cols="50" class="form-control" :value="selectedNote" readonly></textarea>
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

import { UPLOADS_PATH } from '~/utils/config';
import { formatToPhpCurrency } from '~/utils/helpers';
import * as meqsApi from '~/composables/purchase/meqs/meqs.api'
import type { MEQS } from '~/composables/purchase/meqs/meqs.types';
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';
import { hasRemarks } from '~/composables/purchase/meqs/meqs';

definePageMeta({
    name: ROUTES.MEQS_VIEW,
    layout: "layout-purchasing",
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

const item = ref<MEQS | undefined>()
const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload'

const selectedAttachment = ref('')
const selectedNote = ref('')
const modalToShow = ref<'attachment' | 'note'>('attachment')

const pdfUrl = ref('')

onMounted(async () => {

    authUser.value = getAuthUser()

    item.value = await meqsApi.findOne(route.params.id as string)

    isLoadingPage.value = false

})

const referenceData = computed(() => {

    if (item.value?.rv) return item.value?.rv
    if (item.value?.jo) return item.value?.jo
    if (item.value?.spr) return item.value?.spr

    // todos
})

const referenceLabel = computed(() => {

    if (item.value?.rv) return 'RV'
    if (item.value?.jo) return 'JO'
    if (item.value?.spr) return 'SPR'

    // todos

    return 'RV/SPR/JO'

})

function getUploadsPath(src: string) {

    const path = src.replace(UPLOADS_PATH, '')
    console.log('PATH', path)

    const uploadsPath = API_FILE_ENDPOINT + path
    return uploadsPath

}

function onClickAttachment(src: string) {
    modalToShow.value = 'attachment'
    selectedAttachment.value = getUploadsPath(src)
}

function onClickNote(canvass_item_id: string) {

    modalToShow.value = 'note'

    for (let supplier of item.value!.meqs_suppliers) {

        const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

        if (item) {
            const emptyNote = (!item.notes || item.notes.trim() === '')
            selectedNote.value = emptyNote ? 'No remarks' : item.notes!
            break
        }

    }

}

const hasPO = computed(() => {

    if (!item.value) return false

    if (item.value.meqs_suppliers) {

        const po = item.value.meqs_suppliers.find(i => !!i.po)

        if (po) {
            return true
        }

        return false

    } else {
        return false
    }

})

async function onCancelMeqs() {

    Swal.fire({
        title: "Are you sure?",
        text: `This MEQS will be cancelled!`,
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
                await cancelMeqs()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelMeqs() {

    if (!item.value) return

    const response = await meqsApi.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/purchase/meqs')

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
    try {

        const accessToken = authUser.value.access_token

        isLoadingPdf.value = true

        const response = await axios.get(WAREHOUSE_API_URL + '/meqs/pdf/' + item.value?.id, {
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

const onClickAdd = () => router.push('/purchase/meqs/create')
const onClickUpdate = (id: string) => router.push('/purchase/meqs/' + id)


</script>


<style scoped>
.small-image {
    max-width: 100px;
    max-height: 100px;
}

.image-container {
    overflow: hidden;
}

.image-container img {
    transition: transform 0.3s ease;
}

.image-container:hover img {
    transform: scale(1.2);
}
</style>