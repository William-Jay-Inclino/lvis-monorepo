<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage && authUser">
        
                <h2 class="text-warning">Create PO</h2>
                <hr>
        
                <div class="row pb-3">
                    <div class="col">
                        <div class="row justify-content-center pt-3">
        
                            <div class="col-lg-6">
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        MEQS Number <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select @search="handleSearchMeqsNumber" @option:selected="onMeqsSelected" :options="filteredMeqs" label="meqs_number"
                                            v-model="selectedMeqs" :clearable=false>
                                            <template v-slot:option="option">
                                                <div v-if="option.status !== APPROVAL_STATUS.APPROVED" class="row">
                                                    <div class="col">
                                                        <span class="text-danger">{{ option.meqs_number }}</span>
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
                                                <div v-else-if="!option.hasAvailableSupplier" class="row">
                                                    <div class="col">
                                                        <span class="text-danger">{{ option.meqs_number }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-muted fst-italic">
                                                            No Available Supplier
                                                        </small>
                                                    </div>
                                                </div>
                                                <div v-else class="row">
                                                    <div class="col">
                                                        <span>{{ option.meqs_number }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-success fst-italic"> Available </small>
                                                    </div>
                                                </div>
                                            </template>
                                        </v-select>
                                    </client-only>
                                    <nuxt-link v-if="selectedMeqs" class="btn btn-sm btn-light text-primary"
                                        :to="'/warehouse/purchasing/meqs/view/' + selectedMeqs.id" target="_blank">View MEQS
                                        details</nuxt-link>
                                </div>
        
                                <div v-if="selectedMeqs" class="mb-3">
                                    <label class="form-label">
                                        Supplier <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select @option:selected="onSupplierSelected" :options="suppliers" label="label"
                                            v-model="poData.meqs_supplier">
                                            <template v-slot:option="option">
                                                <div v-if="option.is_referenced" class="row">
                                                    <div class="col">
                                                        <span class="text-danger">{{ option.label }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-muted fst-italic">
                                                            Referenced
                                                        </small>
                                                    </div>
                                                </div>
                                                <div v-else class="row">
                                                    <div class="col">
                                                        <span>{{ option.label }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-success fst-italic"> Available </small>
                                                    </div>
                                                </div>
                                            </template>
                                        </v-select>
                                    </client-only>
                                </div>
        
                                <div v-if="poData.meqs_supplier" class="mb-3">
                                    <label class="form-label">
                                        VAT Status
                                    </label>
                                    <div class="fst-italic text-warning"> {{ poData.meqs_supplier.supplier?.is_vat_registered ? 'VAT Registered' : 'Non-VAT Registered' }} </div>
                                </div>
        
                                <div v-if="selectedMeqs && isAdmin(authUser)">
                                    <label class="form-label">
                                        Fund Source
                                    </label>
                                    <client-only>
                                        <v-select :options="accounts" label="name" v-model="poData.fund_source"></v-select>
                                    </client-only>
                                </div>
        
                                <div v-if="selectedMeqs" class="mb-3">
                                    <label class="form-label">
                                        Notes
                                    </label>
                                    <textarea class="form-control" rows="3"></textarea>
                                </div>
        
                                <div class="d-flex justify-content-between">
                                    <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/po">
                                        <i class="fas fa-chevron-left"></i> Back to Search
                                    </nuxt-link>
                                    <button @click="save()" type="button" class="btn btn-primary"
                                        :disabled="isSaving || !canSave">
                                        <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
                                    </button>
                                </div>
        
                            </div>
        
                        </div>
                    </div>
                </div>
        
                <div v-if="selectedMeqs && poData.meqs_supplier" class="h5wrapper mb-3 pt-5">
                    <hr class="result">
                    <h5 class="text-warning fst-italic">
                        <i class="fas fa-shopping-cart"></i> Items
                    </h5>
                    <hr class="result">
                </div>
        
                <div v-if="selectedMeqs && poData.meqs_supplier" class="row pb-3">
                    <div class="col">
                        <div class="table-responsive">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white">No</th>
                                        <th class="bg-secondary text-white">Description</th>
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
                                        <td class="text-muted"> {{ item.canvass_item.unit ? item.canvass_item.unit.name : 'N/A'
                                            }} </td>
                                        <td class="text-muted"> {{ item.canvass_item.quantity }} </td>
                                        <td class="text-muted"> {{ VAT[item.vat_type].label }} </td>
                                        <td class="text-muted"> {{ formatToPhpCurrency(item.price) }} </td>
                                        <td class="text-muted">
                                            {{
                formatToPhpCurrency(getTotalNetPrice({
                    vatType: item.vat_type,
                    pricePerUnit: item.price,
                    vatPerUnit: getVatAmount(item.price, item.vat_type),
                                            quantity: item.canvass_item.quantity
                                            }))
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
                                <tfoot v-show="supplierItems.length === 0">
                                    <tr>
                                        <td colspan="9" class="text-center">
                                            <span class="text-muted fst-italic"> No awarded items </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
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




<script setup lang="ts">
import type { MEQS } from '~/composables/warehouse/meqs/meqs.types';
import type { CreatePoInput } from '~/composables/warehouse/po/po.types';
import * as poApi from '~/composables/warehouse/po/po.api'
import { formatToPhpCurrency } from '~/utils/helpers'
import type { MeqsSupplier } from '~/composables/warehouse/meqs/meqs-supplier';
import Swal from 'sweetalert2'
import { getTotalNetPrice, getVatAmount } from '~/utils/helpers';
import type { Account } from '~/composables/system/account/account';
import { fetchMeqsByMeqsNumber } from '~/composables/warehouse/meqs/meqs.api';

definePageMeta({
    name: ROUTES.PO_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter();

// FLAGS
const isSaving = ref(false)

let currentMeqsSupplier: MeqsSupplier | null = null
let currentMeqs: MEQS | null = null

const selectedMeqs = ref<MEQS | null>(null)
const meqs = ref<MEQS[]>([])
const accounts = ref<Account[]>([])

const poData = ref<CreatePoInput>({
    meqs_supplier: null,
    fund_source: null,
    approvers: [],
    notes: ''
})


// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await poApi.fetchFormDataInCreate()

    meqs.value = response.meqs

    poData.value.approvers = response.approvers
    accounts.value = response.accounts

    isLoadingPage.value = false

})


// ======================== COMPUTED ========================  


// filter supplier that has awarded items only 

const suppliers = computed(() => {

    if (!selectedMeqs.value) return []

    const supplierThatHasAwardedItems = selectedMeqs.value.meqs_suppliers.filter(i => i.meqs_supplier_items.some(j => j.is_awarded))

    return supplierThatHasAwardedItems.map(i => ({ ...i, label: i.supplier?.name }))


})

const filteredMeqs = computed( () => {

    return meqs.value.map(i => {

        const supplierThatHasAwardedItems = i.meqs_suppliers.filter(i => i.meqs_supplier_items.some(j => j.is_awarded))
        const hasAvailabelSupplier = supplierThatHasAwardedItems.find(i => !i.is_referenced)

        if(hasAvailabelSupplier) {
            i.hasAvailableSupplier = true 
        } else {
            i.hasAvailableSupplier = false 
        }

        return i

    })

})

const canSave = computed(() => {

    if (!selectedMeqs.value || !poData.value.meqs_supplier) return false

    if (supplierItems.value.length === 0) return false

    return true

})

const supplierItems = computed(() => {

    if (!poData.value.meqs_supplier) return []

    return poData.value.meqs_supplier.meqs_supplier_items.filter(i => i.is_awarded)


})

const totalPriceOfAllItems = computed(() => {

    if (supplierItems.value.length === 0) return 0

    let totalPrice = 0

    for (let item of supplierItems.value) {

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



// ======================== FUNCTIONS ========================  


async function save() {
    console.log('save')

    console.log('saving...')

    isSaving.value = true
    const response = await poApi.create(poData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/purchasing/po/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}

function onMeqsSelected(payload: MEQS) {
    console.log('onMeqsSelected()', payload)

    resetSupplier()

    if (payload.status === APPROVAL_STATUS.APPROVED && payload.hasAvailableSupplier) {
        currentMeqs = payload
    } else {
        if (currentMeqs) {
            selectedMeqs.value = currentMeqs
        } else {
            selectedMeqs.value = null
        }
    }
}

function onSupplierSelected(payload: MeqsSupplier) {
    console.log('onSupplierSelected()', payload)
    if (payload.is_referenced) {
        if (currentMeqsSupplier) {
            poData.value.meqs_supplier = currentMeqsSupplier
        } else {
            poData.value.meqs_supplier = null
        }
    } else {
        currentMeqsSupplier = payload
    }
}

function resetSupplier() {
    poData.value.meqs_supplier = null
    currentMeqsSupplier = null
}

async function handleSearchMeqsNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        meqs.value = []
        return
    } 

    debouncedSearchRcNumbers(input, loading)

}

async function searchMeqsNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchMeqsNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchMeqsByMeqsNumber(input);
        console.log('response', response);
        meqs.value = response;
    } catch (error) {
        console.error('Error fetching MEQS numbers:', error);
    } finally {
        loading(false);
    }
}


// ======================== UTILS ========================  

const debouncedSearchRcNumbers = debounce((input: string, loading: (status: boolean) => void) => {
    searchMeqsNumbers(input, loading);
}, 500);



</script>