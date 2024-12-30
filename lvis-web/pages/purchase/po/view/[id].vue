<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && item">
        
                <div class="row pt-3 justify-content-center">
                    <div class="col-lg-11">
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 data-testid="po-info" class="text-warning fst-italic">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'info-circle']"/>
                                </client-only> PO Info
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
                                        <td class="text-muted">MEQS Number</td>
                                        <td>
                                            <nuxt-link :to="'/purchase/meqs/view/' + item.meqs_number">{{
                                            item.meqs_number }}</nuxt-link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td data-testid="po-number" class="text-muted">PO Number</td>
                                        <td> {{ item.po_number }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted align-middle">RR Number/s</td>
                                        <td class="align-middle">
                                            <div v-if="item.rrs.length === 0"> N/A </div>
                                            <div v-else>
                                                <div v-for="rr in item.rrs">
                                                    <nuxt-link :to="'/warehouse/rr/view/' + rr.id">{{ rr.rr_number
                                                        }}</nuxt-link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Date</td>
                                        <td> {{ formatDate(item.po_date) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Supplier</td>
                                        <td> {{ item.meqs_supplier ? item.meqs_supplier.supplier!.name : 'N/A' }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">VAT Status</td>
                                        <td> {{ item.meqs_supplier ? item.meqs_supplier.supplier?.is_vat_registered ? 'VAT Registered' : 'Non-VAT Registered' : 'N/A' }} </td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Fund Source</td>
                                        <td> {{ item.fund_source ? item.fund_source.name : 'N/A' }} </td>
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
        
                <div class="row pt-3 justify-content-center">
                    <div class="col-lg-11">
        
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
                                    <tr v-for="i, count in item.po_approvers">
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
        
                <div class="row pt-3 justify-content-center">
                    <div class="col-lg-11">
        
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
                            <table class="table table-hover table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white">No</th>
                                        <th class="bg-secondary text-white">Description</th>
                                        <th class="bg-secondary text-white">Item Class</th>
                                        <th class="bg-secondary text-white">Unit</th>
                                        <th class="bg-secondary text-white">Qty</th>
                                        <th class="bg-secondary text-white">VAT Type</th>
                                        <th class="bg-secondary text-white">Unit Cost</th>
                                        <th class="bg-secondary text-white">Vatable Amount</th>
                                        <th class="bg-secondary text-white">VAT</th>
                                        <th class="bg-secondary text-white">Total Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item, i in supplierItems">
                                        <td class="text-muted"> {{ i + 1 }} </td>
                                        <td class="text-muted"> {{ item.canvass_item.description }} </td>
                                        <td class="text-muted"> {{ item.canvass_item.item ? 'Stock' : 'Non-Stock' }} </td>
                                        <td class="text-muted"> {{ item.canvass_item.unit ? item.canvass_item.unit.name : 'N/A'
                                            }} </td>
                                        <td class="text-muted"> {{ item.canvass_item.quantity }} </td>
                                        <td class="text-muted"> {{ VAT[item.vat_type].label }} </td>
                                        <td class="text-muted"> {{ formatToPhpCurrency(item.price) }} </td>
                                        <td class="text-muted">
                                            {{
                formatToPhpCurrency(
                    getTotalNetPrice({
                        vatType: item.vat_type,
                        pricePerUnit: item.price,
                        vatPerUnit: getVatAmount(item.price, item.vat_type), quantity:
                            item.canvass_item.quantity
                    })
                )
                                            }}
                                        </td>
                                        <td class="text-muted"> {{ formatToPhpCurrency(getVatAmount(item.price * item.canvass_item.quantity, item.vat_type))
                                            }} </td>
                                        <td class="text-muted"> {{ formatToPhpCurrency(item.price * item.canvass_item.quantity) }} </td>
                                    </tr>
                                    <tr>
                                        <td colspan="9" class="text-end fw-bold">
                                            Summary Total
                                        </td>
                                        <td class="fw-bold">
                                            {{ formatToPhpCurrency(totalPriceOfAllItems) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
        
        
                    </div>
                </div>
        
        
        
                <div class="row mb-3 pt-3 justify-content-center">
                    <div class="col-lg-11">
                        <hr>
                        <div class="d-flex justify-content-end">
                            <div class="me-2">
                                <nuxt-link v-if="canSearch(authUser, 'canManagePO')" class="btn btn-secondary me-2"
                                    to="/purchase/po">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search PO
                                </nuxt-link>
                                <button v-if="item.status === APPROVAL_STATUS.APPROVED && canPrint(authUser, 'canManagePO')" @click="onClickPrint" class="btn btn-danger">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'print']"/>
                            </client-only> Print PO
                                </button>
                                <button ref="printBtn" v-show="false" data-bs-toggle="modal"
                                    data-bs-target="#purchasingPdfModal">print</button>
                            </div>
                            <div v-if="!item.cancelled_at">
                                <button v-if="isAdminOrOwner(item.created_by, authUser) && item.status === APPROVAL_STATUS.PENDING" class="btn btn-warning me-2"
                                    @click="onCancelPo()" :disabled="item.rrs.length >= 1">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'times-circle']" />
                            </client-only> Cancel PO
                                </button>
                                <button v-if="!!item.can_update" class="btn btn-success me-2" @click="onClickUpdate(item.id)">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']"/>
                            </client-only> Edit Form
                                </button>
                                <button v-if="canCreate(authUser, 'canManagePO')" class="btn btn-primary me-2"
                                    @click="onClickAdd">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add New PO
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

import * as poApi from '~/composables/purchase/po/po.api'
import type { PO } from '~/composables/purchase/po/po.types';
import { approvalStatus } from '~/utils/constants'
import { getTotalNetPrice, getVatAmount } from '~/utils/helpers';
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';

definePageMeta({
    name: ROUTES.PO_VIEW,
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

const printBtn = ref<HTMLButtonElement>()

const item = ref<PO | undefined>()

const pdfUrl = ref('')

onMounted(async () => {

    authUser.value = getAuthUser()
    item.value = await poApi.findOne(route.params.id as string)

    isLoadingPage.value = false

})


const meqs = computed(() => {
    if(!item.value?.meqs_supplier) return 
    
    const meqs = item.value?.meqs_supplier.meqs
    return meqs

})

const supplierItems = computed(() => {

    if (!item.value || !item.value.meqs_supplier) return []

    const items = item.value.meqs_supplier.meqs_supplier_items

    if (items.length === 0) return []

    const awardedItems = items.filter(i => i.is_awarded)

    return awardedItems


})

const totalPriceOfAllItems = computed(() => {

    if (supplierItems.value.length === 0) return 0

    let totalPrice = 0

    for (let item of supplierItems.value) {

        // const totalPriceOfItem = getTotalNetPrice(item.price, item.canvass_item.quantity, getVatAmount(item.price, item.vat_type))
        // const totalPriceOfItem = getTotalNetPrice({
        //     vatType: item.vat_type,
        //     pricePerUnit: item.price,
        //     vatPerUnit: getVatAmount(item.price, item.vat_type),
        //     quantity: item.canvass_item.quantity
        // })

        // totalPrice += totalPriceOfItem

        totalPrice += item.price * item.canvass_item.quantity

    }

    return totalPrice

})

async function onCancelPo() {

    Swal.fire({
        title: "Are you sure?",
        text: `This PO will be cancelled!`,
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
                await cancelPo()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelPo() {

    if (!item.value) return

    const response = await poApi.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/purchase/po')

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

    if(!item.value?.fund_source) {

        Swal.fire({
            icon: "error",
            title: "Unable to print",
            text: "Fund Source is required!",
        });

        return

    }

    printBtn.value?.click()


    try {

        const accessToken = authUser.value.access_token

        isLoadingPdf.value = true

        const response = await axios.get(WAREHOUSE_API_URL + '/po/pdf/' + item.value?.id, {
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


const onClickAdd = () => router.push('/purchase/po/create')
const onClickUpdate = (id: string) => router.push('/purchase/po/' + id)

</script>