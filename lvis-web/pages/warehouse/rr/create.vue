<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Create RR</h2>
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <span class="text-secondary">
                            Step {{ currentStep }} of 2:
                            <span v-if="currentStep === 1"> Fill up RR info </span>
                            <span v-if="currentStep === 2"> Add Items </span>
                        </span>
                    </div>
                </div>
        
                <div v-show="currentStep === 1" class="row justify-content-center pt-5">
                    <div class="col-lg-6">

                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                PO Number <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select @search="handleSearchPoNumber" @option:selected="onPoSelected" :options="pos" label="po_number" v-model="rrData.po"
                                    :clearable="false">
                                    <template v-slot:option="option">
                                        <div v-if="option.status !== APPROVAL_STATUS.APPROVED" class="row">
                                            <div class="col">
                                                <span class="text-danger">{{ option.po_number }}</span>
                                            </div>
                                            <div class="col text-end">
                                                <small class="text-muted fst-italic">
                                                    {{
                // @ts-ignore
                approvalStatus[option.status].label
            }}
                                                </small>
                                            </div>
                                        </div>
                                        <div v-else class="row">
                                            <div class="col">
                                                <span>{{ option.po_number }}</span>
                                            </div>
                                            <div class="col text-end">
                                                <small class="text-success fst-italic"> Available </small>
                                            </div>
                                        </div>
                                    </template>
                                </v-select>
                            </client-only>
                            <div>
                                <nuxt-link v-if="rrData.po" class="btn btn-sm btn-light text-primary"
                                    :to="'/warehouse/po/view/' + rrData.po.id" target="_blank">View PO
                                    details</nuxt-link>
                            </div>
                            <div v-if="rrData.po && rrData.po.rrs.length > 0">
                                <small class="text-muted fst-italic"> Other assigned RR: </small>
                                <ul>
                                    <li v-for="rr in rrData.po.rrs">
                                        <nuxt-link :to="'/warehouse/rr/view/' + rr.id" target="_blank">
                                            {{ rr.rr_number }}
                                        </nuxt-link>
                                    </li>
                                </ul>
                            </div>
                            <small class="text-danger fst-italic" v-if="rrDataErrors.po"> This field is required </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Delivery Number
                            </label>
                            <input type="text" class="form-control" v-model="rrData.delivery_number">
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Delivery Charge
                            </label>
                            <input type="number" class="form-control" v-model="rrData.delivery_charge">
                            <small class="text-danger fst-italic" v-if="rrDataErrors.delivery_charge"> This field is invalid
                            </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Invoice <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="rrData.invoice_number">
                            <small class="text-danger fst-italic" v-if="rrDataErrors.invoice_number"> This field is required
                            </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Received By <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="rrData.received_by"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="rrDataErrors.received_by"> This field is required
                            </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Notes
                            </label>
                            <textarea class="form-control" rows="3" v-model="rrData.notes"></textarea>
                        </div>
        
                    </div>
                </div>
        
                <div v-show="currentStep === 2" class="row justify-content-center pt-5">
                    <div class="col-12">
        
                        <WarehouseRRItems :rr-items="rrData.rr_items" />
        
                    </div>
                </div>
        
                <hr v-show="currentStep === 2">
        
                <div v-show="currentStep === 2" class="row justify-content-end">
                    <div class="col-4">
                        <div class="table-responsive">
                            <table class="table table-hover table-bordered table-striped">
                                <tbody>
                                    <tr>
                                        <td class="fst-italic"> Summary (Total Price) </td>
                                        <td class="fw-bold">
                                            {{ formatToPhpCurrency(grossTotalSummary) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fst-italic"> Delivery Charge </td>
                                        <td class="fw-bold"> {{ formatToPhpCurrency(rrData.delivery_charge) }} </td>
                                    </tr>
                                    <tr>
                                        <td class="fst-italic"> Total </td>
                                        <td class="fw-bold">
                                            {{ formatToPhpCurrency(totalPriceSummary) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-6': currentStep === 1, 'col-12': currentStep === 2 }">
                        <div class="d-flex justify-content-between">
        
                            <div>
                                <nuxt-link v-show="currentStep === 1" class="btn btn-secondary" to="/warehouse/rr">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search Search RR
                                </nuxt-link>
        
                                <button v-show="currentStep === 2" @click="goToStep1" class="btn btn-secondary">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Back
                                </button>
        
                            </div>
        
                            <button v-show="currentStep === 1" @click="goToStep2" class="btn btn-primary">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-right']"/>
                            </client-only> Next
                            </button>
                            <button @click="save()" v-show="currentStep === 2" class="btn btn-primary" :disabled="isSaving">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'save']"/>
                            </client-only> {{ isSaving ? 'Saving...' : 'Save' }}
                            </button>
                        </div>
                    </div>
                </div>
        
            </div>
        
            <div v-else>
                <LoaderSpinner />
            </div>
            
        </div>
    </div>


</template>



<script script setup lang="ts">

import type { PO } from '~/composables/warehouse/po/po.types';
import type { CreateRrInput } from '~/composables/warehouse/rr/rr.types';
import * as rrApi from '~/composables/warehouse/rr/rr.api';
import type { MeqsSupplierItem } from '~/composables/warehouse/meqs/meqs-supplier-item';
import type { RrItem } from '~/composables/warehouse/rr/rr-item.types';
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";
import type { Item } from '~/composables/warehouse/item/item.type';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import { fetchPosByPoNumber } from '~/composables/warehouse/po/po.api';

definePageMeta({
    name: ROUTES.RR_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

// CONSTANTS
const router = useRouter();
const toast = useToast();

// FLAGS
const isSaving = ref(false)

const currentStep = ref(1)

let currentPOselected: PO | null = null

const pos = ref<PO[]>([])

const _rrDataErrorsInitial = {
    po: false,
    received_by: false,
    invoice_number: false,
    delivery_charge: false,
}

const rrData = ref<CreateRrInput>({
    po: null,
    received_by: null,
    invoice_number: '',
    delivery_number: '',
    notes: '',
    delivery_charge: 0,
    approvers: [],
    rr_items: []
})

const rrDataErrors = ref({ ..._rrDataErrorsInitial })

// DROPDOWNS
const employees = ref<Employee[]>([])
const units = ref<Unit[]>([])
const items = ref<Item[]>([])

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    const response = await rrApi.fetchFormDataInCreate()

    employees.value = addPropertyFullName(response.employees)
    units.value = response.units
    rrData.value.approvers = response.approvers
    pos.value = response.pos
    items.value = response.items.map(i => ({ ...i, label: `${i.code} - ${i.description}` }))

    isLoadingPage.value = false

})

const poId = computed(() => {

    if (rrData.value.po) {
        return rrData.value.po.id
    }

    return null

})

const grossTotalSummary = computed(() => {

    let ctr = 0

    for (let item of rrData.value.rr_items) {
        ctr += item.meqs_supplier_item.price * item.quantity_accepted
    }

    return ctr

})

const totalPriceSummary = computed(() => grossTotalSummary.value + rrData.value.delivery_charge)

watch(poId, () => {

    if (poId && rrData.value.po!.meqs_supplier) {
        populateRrItems(rrData.value.po!.meqs_supplier.meqs_supplier_items)
    }

})

function onPoSelected(payload: PO) {
    console.log('onPoSelected()', payload)
    if (payload.status === APPROVAL_STATUS.APPROVED && !payload.is_referenced) {
        currentPOselected = payload
    } else {
        if (currentPOselected) {
            rrData.value.po = currentPOselected
        } else {
            rrData.value.po = null
        }
    }

}

function populateRrItems(items: MeqsSupplierItem[]) {

    console.log('populateRrItems()', items)

    const rrItems: RrItem[] = []

    for (let item of items) {

        if (!item.is_awarded) continue

        const vatAmount = getVatAmount(item.price, item.vat_type)
        // const netPrice = getNetPrice({
        //     vatType: item.vat_type,
        //     grossPrice: item.price,
        //     vatAmount
        // })

        const rrItem: RrItem = {
            id: '',
            rr_id: '',
            meqs_supplier_item_id: item.id,
            meqs_supplier_item: item,
            quantity_accepted: -1,
            isInvalidQtyAccepted: true
        }

        rrItems.push(rrItem)

    }

    console.log('rrItems', rrItems)
    rrData.value.rr_items = rrItems

}

async function save() {
    console.log('save', rrData.value)

    if (!isValidStep2()) {
        toast.error("Unable to save. Form has an invalid quantity")
        return
    }

    console.log('saving...')

    isSaving.value = true
    const response = await rrApi.create(rrData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/rr/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}

function isValidStep1(): boolean {

    rrDataErrors.value = { ..._rrDataErrorsInitial }

    if (!rrData.value.po) {
        rrDataErrors.value.po = true
    }

    if (rrData.value.delivery_charge < 0) {
        rrDataErrors.value.delivery_charge = true
    }

    if (rrData.value.invoice_number.trim() === '') {
        rrDataErrors.value.invoice_number = true
    }

    if (!rrData.value.received_by) {
        rrDataErrors.value.received_by = true
    }

    const hasError = Object.values(rrDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true
}

function isValidStep2(): boolean {

    let isValid = true

    for (let item of rrData.value.rr_items) {

        item.isInvalidQtyAccepted = false

        console.log('item.quantity_accepted', item.quantity_accepted);
        console.log('item.meqs_supplier_item.canvass_item.quantity', item.meqs_supplier_item.canvass_item.quantity);

        if (!item.quantity_accepted || item.quantity_accepted < 0 || (item.quantity_accepted > item.meqs_supplier_item.canvass_item.quantity)) {
            item.isInvalidQtyAccepted = true
            isValid = false
        }

    }

    return isValid

}

async function handleSearchPoNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        pos.value = []
        return
    } 

    debouncedSearchPoNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function searchPoNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchPoNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchPosByPoNumber(input);
        console.log('response', response);
        pos.value = response;
    } catch (error) {
        console.error('Error fetching PO numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchEmployees(input: string, loading: (status: boolean) => void) {
    console.log('searchEmployees');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchEmployees(input);
        console.log('response', response);
        employees.value = addPropertyFullName(response)
    } catch (error) {
        console.error('Error fetching Employees:', error);
    } finally {
        loading(false);
    }
}

// ======================== CHILD FUNCTIONS <Items.vue> ======================== 

// ======================== UTILS ======================== 

const goToStep1 = () => currentStep.value = 1
const goToStep2 = () => {

    if (!(isValidStep1())) return

    currentStep.value = 2

}

const debouncedSearchPoNumbers = debounce((input: string, loading: (status: boolean) => void) => {
    searchPoNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>
