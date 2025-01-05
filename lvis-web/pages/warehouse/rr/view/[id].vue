<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && item">
        
                <div class="row pt-3 justify-content-center">
                    <div class="col-lg-12">
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 data-testid="rr-info" class="text-warning fst-italic">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'info-circle']"/>
                                </client-only> RR Info
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div v-if="item.status === APPROVAL_STATUS.APPROVED && !item.is_completed"class="alert alert-danger" role="alert">
                            Failed to complete RR item transactions. Please contact system administrator ASAP!
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
                                    <tr v-if="canvass">
                                        <td class="text-muted"> Requisitioner </td>
                                        <td> {{ getFullname(canvass.requested_by!.firstname, canvass.requested_by!.middlename, canvass.requested_by!.lastname) }} </td>
                                    </tr>
                                    <tr v-if="canvass">
                                        <td class="text-muted"> Purpose </td>
                                        <td> {{ canvass.purpose }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted"> RC Number </td>
                                        <td v-if="meqs">
                                            <nuxt-link v-if="meqs.rv && meqs.rv.canvass"
                                                :to="'/purchase/canvass/view/' + meqs.rv.canvass.id">{{
                meqs.rv.canvass.rc_number }}</nuxt-link>
                                            <nuxt-link v-else-if="meqs.jo && meqs.jo.canvass"
                                                :to="'/purchase/canvass/view/' + meqs.jo.canvass.id">{{
                meqs.jo.canvass.rc_number }}</nuxt-link>
                                            <nuxt-link v-else-if="meqs.spr && meqs.spr.canvass"
                                                :to="'/purchase/canvass/view/' + meqs.spr.canvass.id">{{
                meqs.spr.canvass.rc_number }}</nuxt-link>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                        <td v-else>
                                            N/A
                                        </td>
                                    </tr>
                                    <tr v-if="meqs && meqs.rv">
                                        <td class="text-muted"> RV Number </td>
                                        <td>
                                            <nuxt-link :to="'/purchase/rv/view/' + meqs.rv.id">{{ meqs.rv.rv_number
                                                }}</nuxt-link>
                                        </td>
                                    </tr>
                                    <tr v-else-if="meqs && meqs.jo">
                                        <td class="text-muted"> JO Number </td>
                                        <td>
                                            <nuxt-link :to="'/purchase/jo/view/' + meqs.jo.id">{{ meqs.jo.jo_number
                                                }}</nuxt-link>
                                        </td>
                                    </tr>
                                    <tr v-else-if="meqs && meqs.spr">
                                        <td class="text-muted"> SPR Number </td>
                                        <td>
                                            <nuxt-link :to="'/purchase/spr/view/' + meqs.spr.id">{{
                meqs.spr.spr_number }}</nuxt-link>
                                        </td>
                                    </tr>
                                    <tr v-else>
                                        <td class="text-muted"> RV/SPR/JO Number </td>
                                        <td> N/A </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">MEQS Number</td>
                                        <td>
                                            <nuxt-link v-if="item.po?.meqs_supplier"
                                                :to="'/purchase/meqs/view/' + item.po.meqs_supplier.meqs!.id">{{
                item.po.meqs_supplier.meqs!.meqs_number }}</nuxt-link>
                                            <div v-else>
                                                N/A
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">PO Number</td>
                                        <td>
                                            <nuxt-link :to="'/purchase/po/view/' + item.po_number">{{ item.po_number
                                                }}</nuxt-link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">RR Number</td>
                                        <td data-testid="rr-number"> {{ item.rr_number }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Date</td>
                                        <td> {{ formatDate(item.rr_date) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Invoice Number</td>
                                        <td> {{ item.invoice_number }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Delivery Number</td>
                                        <td> {{ item.delivery_number }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Delivery Charge</td>
                                        <td> {{ formatToPhpCurrency(item.delivery_charge) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Received By</td>
                                        <td> {{ getFullname(item.received_by.firstname, item.received_by.middlename,
                item.received_by.lastname) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Notes</td>
                                        <td> {{ item.notes }} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
        
                    </div>
                </div>
        
                <div class="row pt-4 justify-content-center">
                    <div class="col-lg-12">
        
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
                                    <tr v-for="i, count in item.rr_approvers">
                                        <td class="align-middle"> {{ i.order }} </td>
                                        <td class="align-middle"> {{ i.label }} </td>
                                        <td class="align-middle"> {{ getFullname(i.approver!.firstname, i.approver!.middlename,
                i.approver!.lastname) }} </td>
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
        
                <div class="row pt-4 justify-content-center">
                    <div class="col-lg-12">
        
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                            </client-only> RR Items
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div class="row">
                            <div class="col-lg-4 col-md-6">
                                <div class="accordion" id="accordionFlushExample">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="flush-headingOne">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseOne" aria-expanded="false"
                                                aria-controls="flush-collapseOne">
                                                Table Filters
                                            </button>
                                        </h2>
                                        <div id="flush-collapseOne" class="accordion-collapse collapse"
                                            aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body">
                                                <div class="row">
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showDescription" class="form-check-input"
                                                                type="checkbox">
                                                            <label class="form-check-label">Description</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showItemCode" class="form-check-input"
                                                                type="checkbox">
                                                            <label class="form-check-label">Item Code</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showClass" class="form-check-input" type="checkbox">
                                                            <label class="form-check-label">Class</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showUnit" class="form-check-input" type="checkbox">
                                                            <label class="form-check-label">Unit</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showDelivered" class="form-check-input"
                                                                type="checkbox">
                                                            <label class="form-check-label">Qty Request</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showAccepted" class="form-check-input"
                                                                type="checkbox">
                                                            <label class="form-check-label">Qty Accepted</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showVat" class="form-check-input" type="checkbox">
                                                            <label class="form-check-label">VAT Type</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showGrossPrice" class="form-check-input"
                                                                type="checkbox">
                                                            <label class="form-check-label">Unit Cost</label>
                                                        </div>
                                                    </div>
                                                    <!-- <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showNetPrice" class="form-check-input"
                                                                type="checkbox">
                                                            <label class="form-check-label">Net Price</label>
                                                        </div>
                                                    </div> -->
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showGrossTotal" class="form-check-input"
                                                                type="checkbox">
                                                            <label class="form-check-label">Total Cost</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showVatTotal" class="form-check-input"
                                                                type="checkbox">
                                                            <label class="form-check-label">VAT</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="form-check form-switch">
                                                            <input v-model="showNetTotal" class="form-check-input"
                                                                type="checkbox">
                                                            <label class="form-check-label">Vatable Amount</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
                        </div>
        
                        <div class="row mt-3">
                            <div class="col">
                                <div class="table-responsive">
                                    <table class="table table-hover table-bordered">
                                        <thead>
                                            <tr>
                                                <th v-show="showDescription" class="bg-secondary text-white">Description</th>
                                                <th v-show="showClass" class="bg-secondary text-white">Class</th>
                                                <th v-show="showUnit" class="bg-secondary text-white">Unit</th>
                                                <th v-show="showDelivered" class="bg-secondary text-white">Qty Request</th>
                                                <th v-show="showAccepted" class="bg-secondary text-white">Qty Accepted</th>
                                                <th v-show="showVat" class="bg-secondary text-white">VAT Type</th>
                                                <th v-show="showGrossPrice" class="bg-secondary text-white">Unit Cost</th>
                                                <th v-show="showNetTotal" class="bg-secondary text-white">Vatable Amount</th>
                                                <th v-show="showVatTotal" class="bg-secondary text-white">VAT</th>
                                                <th v-show="showGrossTotal" class="bg-secondary text-white">Total Cost</th>
                                                <!-- <th v-show="showNetPrice" class="bg-secondary text-white">Net Amount</th> -->
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="rrItem, i in item.rr_items" :key="i">
                                                <td v-show="showDescription" class="text-muted">
                                                    <div class="input-group input-group-sm">
                                                        {{ i + 1 }}.
                                                        <textarea class="form-control ms-2" rows="3"
                                                            :value="rrItem.meqs_supplier_item.canvass_item.item ? rrItem.meqs_supplier_item.canvass_item.item.code + ' - ' + rrItem.meqs_supplier_item.canvass_item.item.description : rrItem.meqs_supplier_item.canvass_item.description"
                                                            disabled></textarea>
                                                    </div>
                                                </td>
                                                <td v-show="showClass" class="text-muted align-middle text-center">
                                                    <div v-if="rrItem.meqs_supplier_item.canvass_item.item">
                                                        <div> Stock </div>
                                                        <div v-if="rrItem.item_transaction">
                                                            <nuxt-link class="btn btn-outline-light btn-sm"
                                                                :to="'/warehouse/item/view/' + rrItem.item_transaction.item_id" target="_blank">
                                                                <small class="text-info fst-italic"> View Item </small>
                                                            </nuxt-link>
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        Non-Stock
                                                    </div>
                                                </td>
                                                <td v-show="showUnit" class="text-muted align-middle">
                                                    {{ rrItem.meqs_supplier_item.canvass_item.unit ?
                rrItem.meqs_supplier_item.canvass_item.unit.name : 'N/A' }}
                                                </td>
                                                <td v-show="showDelivered" class="text-muted text-center align-middle">
                                                    {{ rrItem.meqs_supplier_item.canvass_item.quantity }}
                                                </td>
                                                <td v-show="showAccepted" class="text-muted text-center align-middle">
                                                    {{ rrItem.quantity_accepted }}
                                                </td>
                                                <td v-show="showVat" class="text-muted text-center align-middle">
                                                    {{ VAT[rrItem.meqs_supplier_item.vat_type].label }}
                                                </td>
                                                <td v-show="showGrossPrice" class="text-muted text-center align-middle">
                                                    {{ formatToPhpCurrency(rrItem.meqs_supplier_item.price) }}
                                                </td>
                                                <td v-show="showNetTotal" class="text-muted text-center align-middle">
                                                    {{
                                                    formatToPhpCurrency(
                                                    getTotalNetPrice({
                                                    vatType: rrItem.meqs_supplier_item.vat_type, 
                                                    pricePerUnit: rrItem.meqs_supplier_item.price,
                                                    vatPerUnit: getVatAmount(rrItem.meqs_supplier_item.price,
                                                    rrItem.meqs_supplier_item.vat_type),
                                                    quantity: rrItem.quantity_accepted
                                                    })
                                                    )
                                                    }}
                                                </td>
                                                <td v-show="showVatTotal" class="text-muted text-center align-middle">
                                                    {{
                                                        formatToPhpCurrency(
                                                            getVatTotal({
                                                                price: rrItem.meqs_supplier_item.price,
                                                                quantity: rrItem.quantity_accepted,
                                                                vatType: rrItem.meqs_supplier_item.vat_type
                                                            })
                                                        )
                                                    }}
                                                </td>
                                                <td v-show="showGrossTotal" class="text-muted text-center align-middle">
                                                    {{
                                                        formatToPhpCurrency(
                                                        getGrossTotal({
                                                        price: rrItem.meqs_supplier_item.price,
                                                        quantity: rrItem.quantity_accepted
                                                        })
                                                        )
                                                    }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
        
                    </div>
                </div>
        
                <div class="row justify-content-end">
                    <div class="col-4">
                        <div class="table-responsive">
                            <table class="table table-hover table-bordered table-striped">
                                <tbody>
                                    <tr>
                                        <td class="fst-italic"> Summary (Gross Total) </td>
                                        <td class="fw-bold"> {{ formatToPhpCurrency(grossTotalSummary) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="fst-italic"> Delivery Charge </td>
                                        <td class="fw-bold"> {{ formatToPhpCurrency(item.delivery_charge) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="fst-italic"> Total </td>
                                        <td class="fw-bold"> {{ formatToPhpCurrency(totalPriceSummary) }} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        
                <div class="row mb-3 pt-3 justify-content-center">
                    <div class="col-lg-12">
                        <hr>
                        <div class="d-flex justify-content-end">
                            <div class="me-2">
                                <nuxt-link v-if="canSearch(authUser, 'canManageRR')" class="btn btn-secondary me-2"
                                    to="/warehouse/rr">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'search']" />
                                    </client-only> 
                                    Search RR
                                </nuxt-link>
                                <button v-if="item.status === APPROVAL_STATUS.APPROVED && canPrint(authUser, 'canManageRR')" @click="onClickPrint" class="btn btn-danger" data-bs-toggle="modal"
                                    data-bs-target="#purchasingPdfModal">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'print']"/>
                                    </client-only> Print RR
                                </button>
                            </div>
                            <div v-if="!item.cancelled_at">
                                <button v-if="isAdminOrOwner(item.created_by, authUser) && item.status === APPROVAL_STATUS.PENDING" class="btn btn-warning me-2"
                                    @click="onCancelRr()">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'times-circle']" />
                                    </client-only> Cancel RR
                                </button>
                                <button v-if="!!item.can_update" class="btn btn-success me-2" @click="onClickUpdate(item.id)">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'edit']"/>
                                    </client-only> Edit Form
                                </button>
                                <button data-testid="add-new-rr" v-if="canCreate(authUser, 'canManageRR')" class="btn btn-primary me-2"
                                    @click="onClickAdd">
                                    <client-only>
                                            <font-awesome-icon :icon="['fas', 'plus']"/>
                                    </client-only> Add New RR
                                </button>
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

import * as rrApi from '~/composables/warehouse/rr/rr.api'
import type { RR } from '~/composables/warehouse/rr/rr.types';
import { approvalStatus } from '~/utils/constants'
import { getTotalNetPrice, getVatAmount, getGrossTotal, getVatTotal } from '~/utils/helpers';
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';

definePageMeta({
    name: ROUTES.RR_VIEW,
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

const item = ref<RR | undefined>()

const showDescription = ref(true)
const showItemCode = ref(true)
const showClass = ref(true)
const showUnit = ref(false)
const showDelivered = ref(true)
const showAccepted = ref(true)
const showVat = ref(true)
const showGrossPrice = ref(true)
const showNetPrice = ref(true)
const showGrossTotal = ref(true)
const showVatTotal = ref(true)
const showNetTotal = ref(true)

const pdfUrl = ref('')

onMounted(async () => {
    authUser.value = getAuthUser()
    const rr = await rrApi.findOne(route.params.id as string)
    item.value = rr
    isLoadingPage.value = false
})


const grossTotalSummary = computed(() => {

    let ctr = 0

    for (let rrItem of item.value!.rr_items) {
        ctr += rrItem.meqs_supplier_item.price * rrItem.quantity_accepted
    }

    return ctr

})

const totalPriceSummary = computed(() => grossTotalSummary.value + item.value!.delivery_charge)


const meqs = computed(() => {

    if(!item.value?.po) return null
    if(!item.value!.po.meqs_supplier) return null 

    const meqs = item.value!.po.meqs_supplier.meqs
    return meqs

})

const canvass = computed(() => {
    if(!meqs.value) return 
    
    if(meqs.value.rv && meqs.value.rv.canvass) return meqs.value.rv.canvass 
    
    if(meqs.value.spr && meqs.value.spr.canvass) return meqs.value.spr.canvass

    if(meqs.value.jo && meqs.value.jo.canvass) meqs.value.jo.canvass

})


async function onCancelRr() {

    Swal.fire({
        title: "Are you sure?",
        text: `This RR will be cancelled!`,
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
                await cancelRr()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelRr() {

    if (!item.value) return

    const response = await rrApi.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/warehouse/rr')

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

        const response = await axios.get(WAREHOUSE_API_URL + '/rr/pdf/' + item.value?.id, {
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


const onClickAdd = () => router.push('/warehouse/rr/create')
const onClickUpdate = (id: string) => router.push('/warehouse/rr/' + id)

</script>