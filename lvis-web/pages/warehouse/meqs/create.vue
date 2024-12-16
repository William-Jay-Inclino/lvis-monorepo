<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Create MEQS</h2>
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <span class="text-secondary">
                            Step {{ currentStep }} of 3:
                            <span v-show="currentStep === 1"> Add MEQS info </span>
                            <span v-show="currentStep === 2"> Add Suppliers </span>
                            <span v-show="currentStep === 3"> Award Supplier </span>
                        </span>
                    </div>
                </div>
        
                <div class="row mb-3">
                    <div class="col">
                        <div class="row justify-content-center pt-5">
        
                            <div v-show="currentStep === 1" class="col-lg-6">

                                <div class="alert alert-info" role="alert">
                                    <small class="fst-italic">
                                        Fields with * are required
                                    </small>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Reference</label>
                                    <div class="row g-0">
                                        <div class="col-4">
                                            <client-only>
                                                <v-select @option:selected="onChangeTransactionType" :options="transactionTypes" v-model="transactionType"
                                                    :clearable="false"></v-select>
                                            </client-only>
                                        </div>
                                        <div class="col-8" v-if="transactionType === 'RV'">
                                            <client-only>
                                                <v-select @search="handleSearchRvNumber" @option:selected="onRvNumberSelected" :options="rvs" label="rv_number"
                                                    v-model="meqsData.rv">
                                                    <template v-slot:option="option">
                                                        <div v-if="option.status !== APPROVAL_STATUS.APPROVED" class="row">
                                                            <div class="col">
                                                                <span class="text-danger">{{ option.rv_number }}</span>
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
                                                        <div v-else-if="option.is_referenced" class="row">
                                                            <div class="col">
                                                                <span class="text-danger">{{ option.rv_number }}</span>
                                                            </div>
                                                            <div class="col text-end">
                                                                <small class="text-muted fst-italic">
                                                                    Referenced
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div v-else class="row">
                                                            <div class="col">
                                                                <span>{{ option.rv_number }}</span>
                                                            </div>
                                                            <div class="col text-end">
                                                                <small class="text-success fst-italic"> Available </small>
                                                            </div>
                                                        </div>
                                                    </template>
                                                </v-select>
                                            </client-only>
                                            <nuxt-link v-if="meqsData.rv" class="btn btn-sm btn-light text-primary"
                                                :to="'/warehouse/rv/view/' + meqsData.rv.id" target="_blank">View RV
                                                details</nuxt-link>
                                        </div>
                                        <div class="col-8" v-else-if="transactionType === 'JO'">
                                            <client-only>
                                                <v-select @search="handleSearchJoNumber" @option:selected="onJoNumberSelected" :options="jos" label="jo_number"
                                                    v-model="meqsData.jo">
                                                    <template v-slot:option="option">
                                                        <div v-if="option.status !== APPROVAL_STATUS.APPROVED" class="row">
                                                            <div class="col">
                                                                <span class="text-danger">{{ option.jo_number }}</span>
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
                                                        <div v-else-if="option.is_referenced" class="row">
                                                            <div class="col">
                                                                <span class="text-danger">{{ option.jo_number }}</span>
                                                            </div>
                                                            <div class="col text-end">
                                                                <small class="text-muted fst-italic">
                                                                    Referenced
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div v-else class="row">
                                                            <div class="col">
                                                                <span>{{ option.jo_number }}</span>
                                                            </div>
                                                            <div class="col text-end">
                                                                <small class="text-success fst-italic"> Available </small>
                                                            </div>
                                                        </div>
                                                    </template>
                                                </v-select>
                                            </client-only>
                                            <nuxt-link v-if="meqsData.jo" class="btn btn-sm btn-light text-primary"
                                                :to="'/warehouse/jo/view/' + meqsData.jo.id" target="_blank">View JO
                                                details</nuxt-link>
                                        </div>
                                        <div class="col-8" v-else-if="transactionType === 'SPR'">
                                            <client-only>
                                                <v-select @search="handleSearchSprNumber" @option:selected="onSprNumberSelected" :options="sprs"
                                                    label="spr_number" v-model="meqsData.spr">
                                                    <template v-slot:option="option">
                                                        <div v-if="option.status !== APPROVAL_STATUS.APPROVED" class="row">
                                                            <div class="col">
                                                                <span class="text-danger">{{ option.spr_number }}</span>
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
                                                        <div v-else-if="option.is_referenced" class="row">
                                                            <div class="col">
                                                                <span class="text-danger">{{ option.spr_number }}</span>
                                                            </div>
                                                            <div class="col text-end">
                                                                <small class="text-muted fst-italic">
                                                                    Referenced
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div v-else class="row">
                                                            <div class="col">
                                                                <span>{{ option.spr_number }}</span>
                                                            </div>
                                                            <div class="col text-end">
                                                                <small class="text-success fst-italic"> Available </small>
                                                            </div>
                                                        </div>
                                                    </template>
                                                </v-select>
                                            </client-only>
                                            <nuxt-link v-if="meqsData.spr" class="btn btn-sm btn-light text-primary"
                                                :to="'/warehouse/spr/view/' + meqsData.spr.id" target="_blank">View
                                                SPR details</nuxt-link>
                                        </div>
                                    </div>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Requisitioner
                                    </label>
        
                                    <input type="text" :value="requisitioner" class="form-control" disabled>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Requisitioner Purpose
                                    </label>
                                    <textarea :value="purpose" class="form-control" rows="3" disabled></textarea>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Requisitioner Notes
                                    </label>
                                    <textarea :value="requisitionerNotes" class="form-control" rows="3" disabled></textarea>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Notes
                                    </label>
                                    <textarea v-model="meqsData.notes" class="form-control" rows="3"></textarea>
                                    <small class="text-muted fst-italic">This note will be use during print out</small>
                                </div>
        
                                <div class="d-flex justify-content-between">
                                    <nuxt-link class="btn btn-secondary" to="/warehouse/meqs">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search MEQS
                                    </nuxt-link>
                                    <button @click="goToStep2()" type="button" class="btn btn-primary"
                                        :disabled="!canProceedStep2">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-right']"/>
                            </client-only> Next
                                    </button>
                                </div>
                            </div>
        
                            <div v-show="currentStep === 2" class="col-lg-10 col-md-11 col-sm-12">
        
                                <div class="row">
                                    <div class="col">
                                        <WarehouseMEQSSupplier 
                                            :suppliers="suppliers" 
                                            :meqs_suppliers="meqsData.meqs_suppliers"
                                            :canvass_items="canvassItems" 
                                            :min_no_of_supplier="min_no_of_supplier"
                                            :max_no_of_supplier="max_no_of_supplier"
                                            @search-suppliers="handleSearchedSuppliers" 
                                            @add-supplier="addSupplier"
                                            @edit-supplier="editSupplier" 
                                            @remove-supplier="removeSupplier"
                                            @add-attachment="addAttachment" 
                                            @remove-attachment="removeAttachment" 
                                        />
                                    </div>
                                </div>
        
                                <div class="d-flex justify-content-between">
                                    <button @click="goToStep1()" type="button" class="btn btn-secondary"
                                        :disabled="!hasReference">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Back
                                    </button>
                                    <button @click="goToStep3()" type="button" class="btn btn-primary"
                                        :disabled="!canProceedStep3">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-right']"/>
                            </client-only> Next
                                    </button>
                                </div>
        
                            </div>
        
                            <div v-show="currentStep === 3" class="col-12">
        
                                <div class="row">
                                    <div class="col">
                                        <WarehouseMEQSAward :is-initial="isInitialStep3"
                                            :meqs_suppliers="meqsData.meqs_suppliers" :canvass_items="canvassItems"
                                            @award-supplier-item="awardSupplierItem" @attach-note="attachNote" />
                                    </div>
                                </div>
        
                                <div class="d-flex justify-content-between mt-3">
                                    <button @click="goToStep2()" type="button" class="btn btn-secondary"
                                        :disabled="!hasReference">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Back
                                    </button>
                                    <button @click="onSaveMeqs()" type="button" class="btn btn-primary"
                                        :disabled="isSavingMeqs">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'save']"/>
                            </client-only> {{ isSavingMeqs ? 'Saving MEQS...' : 'Save MEQS' }}
                                    </button>
                                </div>
        
                            </div>
        
                        </div>
                    </div>
                </div>
        
                <button v-show="false" ref="requiredNotesBtn" data-bs-toggle="modal"
                    data-bs-target="#requiredNotesModal"></button>
        
                <WarehouseMEQSRequiredNotes :items-needing-justification="itemsNeedingJustification"
                    :is-saving-meqs="isSavingMeqs" @update-notes="updateNotes" @save="saveMeqs" />
        
            </div>
        
            <div v-else>
                <LoaderSpinner />
            </div>
            
        </div>
    </div>

</template>


<script setup lang="ts">

import type { CanvassItemWithSuppliers, CreateMeqsInput, CreateMeqsSupplierSubInput } from '~/composables/warehouse/meqs/meqs.types';
import type { RV } from '~/composables/warehouse/rv/rv.types';
import * as meqsApi from '~/composables/warehouse/meqs/meqs.api'
import type { CanvassItem } from '~/composables/warehouse/canvass/canvass-item.types';
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import type { MeqsSupplier } from '~/composables/warehouse/meqs/meqs-supplier';
import type { JO } from '~/composables/warehouse/jo/jo.types';
import type { SPR } from '~/composables/warehouse/spr/spr.types';
import type { Supplier } from '~/composables/warehouse/supplier/supplier';
import { getLowestPriceItem, getSupplierItemsByCanvassId } from '~/composables/warehouse/meqs/meqs';
import { fetchJOsByJoNumber } from '~/composables/warehouse/jo/jo.api';
import { fetchSPRsBySprNumber } from '~/composables/warehouse/spr/spr.api';
import { fetchRVsByRvNumber } from '~/composables/warehouse/rv/rv.api';

definePageMeta({
    name: ROUTES.MEQS_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

// DEPENDENCIES
const toast = useToast();
const config = useRuntimeConfig()
const router = useRouter();

// CONSTANTS
const transactionTypes = ref(['RV', 'SPR', 'JO'])
const requiredNotesBtn = ref<HTMLButtonElement>()
const API_URL = config.public.apiUrl
const min_no_of_supplier = ref(3)
const max_no_of_supplier = ref(5)

// FLAGS 
const isInitialStep3 = ref(true)
const isSavingMeqs = ref(false)

// ARRAYS
const rvs = ref<RV[]>([])
const jos = ref<JO[]>([])
const sprs = ref<SPR[]>([])
const suppliers = ref<Supplier[]>([])

const currentStep = ref(1)
const transactionType = ref<'RV' | 'SPR' | 'JO'>('RV')

const itemsNeedingJustification = ref<CanvassItemWithSuppliers[]>([])

let currentRv: RV | null = null
let currentJo: JO | null = null
let currentSpr: SPR | null = null

// FORM DATA
const meqsData = ref<CreateMeqsInput>({
    jo: null,
    rv: null,
    spr: null,
    notes: 'Based on the canvass of Cost and Quality of the Items listed above, I respectfully recommend purchase of the needed items',
    approvers: [],
    meqs_suppliers: []
})


onMounted(async () => {

    const response = await meqsApi.fetchFormDataInCreate()

    rvs.value = response.rvs
    jos.value = response.jos
    sprs.value = response.sprs
    suppliers.value = response.suppliers
    meqsData.value.approvers = response.approvers
    min_no_of_supplier.value = response.minimum_no_of_supplier
    max_no_of_supplier.value = response.maximum_no_of_supplier

    isLoadingPage.value = false

})




// ======================== COMPUTED ======================== 

const referenceIsRv = computed((): boolean => !!meqsData.value.rv)
const referenceIsJo = computed((): boolean => !!meqsData.value.jo)
const referenceIsSpr = computed((): boolean => !!meqsData.value.spr)
const hasReference = computed((): boolean => !!referenceIsRv.value || !!referenceIsJo.value || !!referenceIsSpr.value)
const canProceedStep2 = computed((): boolean => !!hasReference.value)
const canProceedStep3 = computed((): boolean => meqsData.value.meqs_suppliers.length >= min_no_of_supplier.value && meqsData.value.meqs_suppliers.length <= max_no_of_supplier.value)
// const canProceedStep3 = computed((): boolean => true)

const purpose = computed(() => {

    if (!hasReference.value) {
        return ''
    }

    if (referenceIsRv.value) return meqsData.value.rv!.canvass!.purpose
    if (referenceIsJo.value) return meqsData.value.jo!.canvass!.purpose
    if (referenceIsSpr.value) return meqsData.value.spr!.canvass!.purpose

    // todo: get purpose for jo and spr
    return ''

})
const requisitionerNotes = computed(() => {

    if (!hasReference.value) {
        return ''
    }

    if (referenceIsRv.value) return meqsData.value.rv!.canvass!.notes
    if (referenceIsJo.value) return meqsData.value.jo!.canvass!.notes
    if (referenceIsSpr.value) return meqsData.value.spr!.canvass!.notes

    // todo: get purpose for jo and spr
    return ''

})
const requisitioner = computed(() => {
    if (!hasReference.value) {
        return ''
    }

    let employee

    if (referenceIsRv.value) {
        employee = meqsData.value.rv?.canvass!.requested_by
    } else if (referenceIsJo.value) {
        employee = meqsData.value.jo?.canvass!.requested_by
    } else if (referenceIsSpr.value) {
        employee = meqsData.value.spr?.canvass!.requested_by
    }

    // todo: get employee data for jo and spr

    return getFullname(employee!.firstname, employee!.middlename, employee!.lastname)
})

const canvassItems = computed((): CanvassItem[] => {

    if (referenceIsRv.value) {
        return meqsData.value.rv!.canvass!.canvass_items
    }

    if (referenceIsJo.value) {
        return meqsData.value.jo!.canvass!.canvass_items
    }

    if (referenceIsSpr.value) {
        return meqsData.value.spr!.canvass!.canvass_items
    }



    return []

})

const rvId = computed(() => {
    if (meqsData.value.rv) {
        return meqsData.value.rv.id
    }
    return null
})

const joId = computed(() => {
    if (meqsData.value.jo) {
        return meqsData.value.jo.id
    }
    return null
})

const sprId = computed(() => {
    if (meqsData.value.spr) {
        return meqsData.value.spr.id
    }
    return null
})



// ======================== WATCHERS ========================  

// set currentCanvass to null if rc number field is deselected
watch(rvId, (val) => {

    if (!val) {
        console.log('rv number deselected')
        currentRv = null
    }

})

watch(joId, (val) => {

    if (!val) {
        console.log('jo number deselected')
        currentJo = null
    }

})

watch(sprId, (val) => {

    if (!val) {
        console.log('spr number deselected')
        currentSpr = null
    }

})



// ======================== FUNCTIONS ======================== 

function onChangeTransactionType() {
    console.log('onChangeTransactionType');

    if(transactionType.value === 'RV') {
        console.log('Transaction type is RV. Clearing data of SPR & JO');
        
        meqsData.value.spr = null
        meqsData.value.jo = null

        return 
    }

    if(transactionType.value === 'SPR') {
        console.log('Transaction type is SPR. Clearing data of JO & RV');
        
        meqsData.value.rv = null
        meqsData.value.jo = null

        return 

    }

    if(transactionType.value === 'JO') {
        console.log('Transaction type is JO. Clearing data of RV & SPR');
        
        meqsData.value.rv = null
        meqsData.value.spr = null

        return 

    }

}

// check if rv is approved. If true then rollback to previous rv else set new current rv
function onRvNumberSelected(payload: RV) {
    console.log('onRvNumberSelected()', payload)

    if (payload.status === APPROVAL_STATUS.APPROVED && !payload.is_referenced) {
        currentRv = payload
    } else {
        if (currentRv) {
            meqsData.value.rv = currentRv
        } else {
            meqsData.value.rv = null
        }
    }
}

// check if rv is approved. If true then rollback to previous rv else set new current rv
function onJoNumberSelected(payload: JO) {
    console.log('onJoNumberSelected()', payload)

    if (payload.status === APPROVAL_STATUS.APPROVED && !payload.is_referenced) {
        currentJo = payload
    } else {
        if (currentJo) {
            meqsData.value.jo = currentJo
        } else {
            meqsData.value.jo = null
        }
    }
}

// check if rv is approved. If true then rollback to previous rv else set new current rv
function onSprNumberSelected(payload: SPR) {
    console.log('onSprNumberSelected()', payload)

    if (payload.status === APPROVAL_STATUS.APPROVED && !payload.is_referenced) {
        currentSpr = payload
    } else {
        if (currentSpr) {
            meqsData.value.spr = currentSpr
        } else {
            meqsData.value.spr = null
        }
    }
}

function onSaveMeqs() {

    isInitialStep3.value = false

    const isValid = isValidStep3(meqsData.value.meqs_suppliers, canvassItems.value)

    if (!isValid) {

        Swal.fire({
            title: 'The form contains errors',
            text: 'Each item must have an associated awarded supplier, and a price is mandatory. If a supplier does not offer a specific item, please set the price to -1',
            icon: 'error',
            position: 'top',
        })

        return

    }

    const items = getItemsNeedingJustification(canvassItems.value, meqsData.value.meqs_suppliers)

    if (items.length > 0) {
        itemsNeedingJustification.value = items
        requiredNotesBtn.value?.click()
        return
    }

    saveMeqs()

}

async function saveMeqs(closeRequiredNotesBtn?: HTMLButtonElement) {
    console.log('saving MEQS...')

    // if saving meqs is from Notes component, needs to close the modal
    if (closeRequiredNotesBtn) {
        closeRequiredNotesBtn.click()
    }

    console.log('meqsData.value', meqsData.value)

    // upload attachments and update supplier.attachments of the uploaded response which is an array of sources (kung asa naka store ang images sa backend)
    for (let supplier of meqsData.value.meqs_suppliers) {

        if (!supplier.files) continue

        if (supplier.files.length === 0) {
            continue
        }

        console.log(`uploading files of ${supplier.supplier?.name}...`)
        const fileSources = await meqsApi.uploadAttachments(supplier.files, API_URL)
        console.log('files uploaded', fileSources)

        if (fileSources) {

            for (let fileSrc of fileSources) {

                // Find the first underscore
                const firstUnderscoreIndex = fileSrc.indexOf('_');

                // Extract the part after the first underscore
                const filename = fileSrc.substring(firstUnderscoreIndex + 1);

                // const [x, filename] = fileSrc.split('_', 2)

                console.log('filename', filename);

                const attachment = supplier.attachments.find(i => i.filename === filename)

                if (attachment) {
                    attachment.src = fileSrc
                }

            }

        }

    }

    console.log('meqsData.value', meqsData.value)

    isSavingMeqs.value = true
    const response = await meqsApi.create(meqsData.value)
    isSavingMeqs.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/meqs/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

function getItemsNeedingJustification(canvassItems: CanvassItem[], meqsSuppliers: MeqsSupplier[]): CanvassItemWithSuppliers[] {
    const items: CanvassItemWithSuppliers[] = []

    for (let canvassItem of canvassItems) {

        const itemsByCanvassId = getSupplierItemsByCanvassId(canvassItem.id, meqsSuppliers)

        const lowestPriceItem = getLowestPriceItem(itemsByCanvassId)
        const awardedItem = itemsByCanvassId.find(i => i.is_awarded)

        if (!awardedItem) {
            console.error('No awardedItem')
            continue
        }

        // const isAwardedNotLowest = (lowestPriceItem.meqs_supplier!.supplier?.id !== awardedItem.meqs_supplier?.supplier?.id)
        const isAwardedNotLowest = (lowestPriceItem.meqs_supplier!.supplier?.id !== awardedItem.meqs_supplier?.supplier?.id) && (lowestPriceItem.price !== awardedItem.price)
        const hasEmptyNotes = awardedItem.notes.trim() === ''

        if (isAwardedNotLowest && hasEmptyNotes) {

            items.push({
                canvassItem,
                lowestPriceItem,
                awardedItem
            })

        }

    }

    return items
}



// ======================== SEARCH FUNCTIONS ======================== 


async function handleSearchJoNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        jos.value = []
        return
    } 

    debouncedSearchJoNumbers(input, loading)

}

async function handleSearchSprNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        sprs.value = []
        return
    } 

    debouncedSearchSprNumbers(input, loading)

}

async function handleSearchRvNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        rvs.value = []
        return
    } 

    debouncedSearchRvNumbers(input, loading)

}


async function searchJoNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchJoNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchJOsByJoNumber(input);
        console.log('response', response);
        jos.value = response;
    } catch (error) {
        console.error('Error fetching JO numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchSprNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchSprNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchSPRsBySprNumber(input);
        console.log('response', response);
        sprs.value = response;
    } catch (error) {
        console.error('Error fetching SPR numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchRvNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRvNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchRVsByRvNumber(input);
        console.log('response', response);
        rvs.value = response;
    } catch (error) {
        console.error('Error fetching RV numbers:', error);
    } finally {
        loading(false);
    }
}


// ======================== CHILD FUNCTIONS: SUPPLIER ======================== 

function addSupplier(data: MeqsSupplier) {
    console.log('addSupplier()', data)

    meqsData.value.meqs_suppliers.push({ ...data })

    toast.success('Supplier Added!')
}

function editSupplier(data: MeqsSupplier, indx: number) {
    console.log('editSupplier()', data)

    meqsData.value.meqs_suppliers[indx] = { ...data }

    toast.success('Supplier Edited!')
}

function removeSupplier(indx: number) {
    const item = meqsData.value.meqs_suppliers[indx]

    Swal.fire({
        title: "Are you sure?",
        text: `Supplier "${item.supplier?.name}" will be removed together with it's items!`,
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, remove it!",
        reverseButtons: true
    }).then(confirm => {

        if (confirm) {
            meqsData.value.meqs_suppliers.splice(indx, 1)
            toast.success('Supplier removed!')
        }

    })
}

async function addAttachment(payload: { supplierIndx: number, file: any }, closeModalBtn: HTMLButtonElement) {
    console.log('addAttachment', payload, closeModalBtn)

    const meqsSupplier = { ...meqsData.value.meqs_suppliers[payload.supplierIndx] }

    console.log('meqsSupplier', meqsSupplier)

    const attachment = {
        id: '',
        meqs_supplier_id: meqsSupplier.id,
        src: '',
        filename: payload.file.filename
    }

    const updatedSupplier = {
        ...meqsSupplier,
        attachments: meqsSupplier.attachments ? [...meqsSupplier.attachments, attachment] : [attachment],
        files: meqsSupplier.files ? [...meqsSupplier.files, payload.file] : [payload.file]
    }

    // Replace the old meqsSupplier object with the updated one
    const updatedSuppliers = [...meqsData.value.meqs_suppliers]
    updatedSuppliers.splice(payload.supplierIndx, 1, updatedSupplier)
    meqsData.value.meqs_suppliers = updatedSuppliers

    toast.success('Attachment added!')

    console.log('meqsData.value.meqs_suppliers', meqsData.value.meqs_suppliers)

    closeModalBtn.click()
}

async function removeAttachment(supplierIndx: number, attachmentIndx: number) {
    console.log('removeAttachment', supplierIndx, attachmentIndx)

    const meqsSupplier = meqsData.value.meqs_suppliers[supplierIndx]
    const attachment = meqsSupplier.attachments[attachmentIndx]

    Swal.fire({
        title: "Are you sure?",
        text: `Attachment with filename "${attachment.filename}" will be removed!`,
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, remove it!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (remove) => {

            if (remove) {
                meqsSupplier.attachments.splice(attachmentIndx, 1)
                toast.success('Attachment removed!')
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function handleSearchedSuppliers(searched_suppliers: Supplier[]) {
    console.log('handleSearchedSuppliers');
    suppliers.value = searched_suppliers.map(i => ({...i}))
}

// ======================== CHILD FUNCTIONS: AWARD ======================== 


function awardSupplierItem(meqsSupplier: CreateMeqsSupplierSubInput, canvass_item_id: string) {

    console.log('awardSupplierItem')

    const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

    if (!item) return

    if (isInvalidPrice(item.price)) {
        toast.error('Supplier cannot be awarded if their price is invalid')
        return
    } else if (item.price === -1) {
        toast.error('Supplier cannot be awarded if item is unavailable')
        return
    } else {
        // in order to toggle. Should only award 1 supplier in each canvass item
        removeAwardForAllSuppliersWith(canvass_item_id)

        console.log('executed')
        // set the award
        item.is_awarded = true
    }


}

function removeAwardForAllSuppliersWith(canvass_item_id: string) {

    for (let meqsSupplier of meqsData.value.meqs_suppliers) {

        const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

        if (item) {
            item.is_awarded = false
        }

    }

}

function attachNote(canvass_item_id: string, note: string) {

    for (let supplier of meqsData.value.meqs_suppliers) {

        const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

        if (item) {
            item.notes = note
        }

    }

    toast.success('Note attached!')

}



// ======================== CHILD FUNCTIONS: NOTES ======================== 


function updateNotes(canvass_item_id: string, note: string) {

    console.log('updateNotes', canvass_item_id, note)

    for (let supplier of meqsData.value.meqs_suppliers) {

        const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

        if (item) {
            item.notes = note
        }
    }

}


// ======================== UTILS ======================== 

const goToStep1 = () => currentStep.value = 1
const goToStep2 = () => currentStep.value = 2
const goToStep3 = () => currentStep.value = 3

const isInvalidPrice = (price: number): boolean => {
    if (price < -1 || price === 0) {
        return true
    } else {
        return false
    }
}

function isValidStep3(meqsSuppliers: MeqsSupplier[], canvassItems: CanvassItem[]): boolean {

    let hasInvalidPrice = false

    for (let supplier of meqsSuppliers) {

        for (let item of supplier.meqs_supplier_items) {

            if (isInvalidPrice(item.price)) {
                item['invalidPrice'] = true
                hasInvalidPrice = true
            } else {
                item['invalidPrice'] = false
            }

        }

    }

    // validate if item has no awarded supplier 

    let hasErrorCanvassItem = false

    for (let item of canvassItems) {

        const hasAwardedSupplier = meqsSuppliers.find(i => i.meqs_supplier_items.find(j => j.canvass_item.id === item.id && j.is_awarded))
        if (hasAwardedSupplier) {
            item['hasAwardedSupplier'] = true
        } else {
            item['hasAwardedSupplier'] = false
            hasErrorCanvassItem = true
        }


    }

    if (hasErrorCanvassItem || hasInvalidPrice) {
        return false
    }

    return true

}

const debouncedSearchJoNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchJoNumbers(input, loading);
}, 500);

const debouncedSearchSprNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchSprNumbers(input, loading);
}, 500);

const debouncedSearchRvNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRvNumbers(input, loading);
}, 500);

</script>