<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && meqsData && reference && !meqsData.cancelled_at">
                <h2 class="text-warning">Update MEQS</h2>
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="onClickTab(FORM_TYPE.MEQS_INFO)">
                                <a class="nav-link" :class="{ 'active': form === FORM_TYPE.MEQS_INFO }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> MEQS Info
                                </a>
                            </li>
                            <li class="nav-item" @click="onClickTab(FORM_TYPE.SUPPLIER)">
                                <a class="nav-link" :class="{ 'active': form === FORM_TYPE.SUPPLIER }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'truck']" />
                            </client-only> Manage Suppliers
                                </a>
                            </li>
                            <li class="nav-item" @click="onClickTab(FORM_TYPE.AWARD)">
                                <a class="nav-link" :class="{ 'active': form === FORM_TYPE.AWARD }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'medal']" />
                            </client-only> Awarding
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
        
        
                <div v-show="form === FORM_TYPE.MEQS_INFO" class="row justify-content-center pt-5">
        
                    <div class="col-lg-6">

                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>
        
                        <div class="mb-3 d-flex align-items-center">
                            <label class="form-label me-2 mb-0">Status:</label>
                            <div :class="{ [`badge bg-${meqsStatus.color}`]: true }">
                                {{ meqsStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">Meqs Number</label>
                            <input type="text" class="form-control" :value="meqsData.meqs_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/purchase/meqs/view/' + meqsData.id" target="_blank">View MEQS
                                details</nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">Reference</label>
                            <input type="text" class="form-control" :value="referenceNumber" disabled>
                            <nuxt-link v-if="meqsData.rv" class="btn btn-sm btn-light text-primary"
                                :to="'/purchase/rv/view/' + meqsData.rv.id" target="_blank">
                                View RV details
                            </nuxt-link>
                            <nuxt-link v-if="meqsData.spr" class="btn btn-sm btn-light text-primary"
                                :to="'/purchase/spr/view/' + meqsData.spr.id" target="_blank">
                                View SPR details
                            </nuxt-link>
                            <nuxt-link v-if="meqsData.jo" class="btn btn-sm btn-light text-primary"
                                :to="'/purchase/jo/view/' + meqsData.jo.id" target="_blank">
                                View JO details
                            </nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">Requisitioner</label>
                            <input type="text" class="form-control"
                                :value="getFullname(reference!.canvass!.requested_by!.firstname, reference!.canvass!.requested_by!.middlename, reference!.canvass!.requested_by!.lastname)"
                                disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">Requisitioner Purpose</label>
                            <textarea class="form-control form-control-sm" rows="5" readonly>{{ reference.canvass!.purpose }}</textarea>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">Requisitioner Notes</label>
                            <textarea class="form-control form-control-sm" rows="5" readonly>{{ reference.canvass!.notes }}</textarea>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">Recommendation Statement</label>
                            <textarea v-model="meqsData.notes" class="form-control form-control-sm" rows="5"></textarea>
                            <small class="text-muted fst-italic">This note will be use during print out</small>
                        </div>
        
                    </div>
        
                </div>
        
                <div v-show="form === FORM_TYPE.SUPPLIER" class="row justify-content-center pt-5">
        
                    <div class="12">
        
                        <WarehouseMEQSSupplier 
                            :suppliers="suppliers" 
                            :meqs_suppliers="meqsData.meqs_suppliers"
                            :canvass_items="reference.canvass!.canvass_items" 
                            :is-adding-supplier="isAddingSupplier"
                            :is-editing-supplier="isEditingSupplier" 
                            :is-page-create="false" @add-supplier="addSupplier"
                            :is-adding-attachment="isAddingAttachment" 
                            :min_no_of_supplier="min_no_of_supplier"
                            :max_no_of_supplier="max_no_of_supplier"
                            @edit-supplier="editSupplier"
                            @remove-supplier="removeSupplier"
                            @add-attachment="addAttachment" 
                            @remove-attachment="removeAttachment" />
        
                    </div>
        
                </div>
        
                <div v-show="form === FORM_TYPE.AWARD" class="row justify-content-center pt-5">
        
                    <div class="12">
        
                        <WarehouseMEQSAward :meqs_suppliers="meqsData.meqs_suppliers"
                            :canvass_items_with_suppliers="canvassItemsWithSuppliers" @award-supplier-item="awardSupplierItem"
                            :is-attaching-remark="isAttachingRemark" @attach-note="attachNote" />
        
                    </div>
        
                </div>
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': form === FORM_TYPE.MEQS_INFO, 'col-12': form !== FORM_TYPE.MEQS_INFO }">
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/purchase/meqs/view/${meqsData.id}`">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM_TYPE.MEQS_INFO" @click="updateMeqsInfo()" type="button"
                                    class="btn btn-success" :disabled="isUpdating">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> {{ isUpdating ? 'Updating...' : 'Update' }}
                                </button>
                            </div>
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

import Swal from 'sweetalert2'
import { getFullname, formatToValidHtmlDate, redirectTo401Page } from '~/utils/helpers'
import { useToast } from "vue-toastification";
import type { MEQS } from '~/composables/purchase/meqs/meqs.types';
import * as meqsApi from '~/composables/purchase/meqs/meqs.api'
import * as meqsSupplierApi from '~/composables/purchase/meqs/meqs-supplier.api'
import * as meqsSupplierAttachmentApi from '~/composables/purchase/meqs/meqs-supplier-attachment.api'
import type { CreateMeqsSupplierAttachmentSubInput, CreateMeqsSupplierInput, CreateMeqsSupplierItemInput, MeqsSupplier, UpdateMeqsSupplierInput, UpdateMeqsSupplierItemInput } from '~/composables/purchase/meqs/meqs-supplier';
import type { CreateMeqsSupplierAttachmentInput } from '~/composables/purchase/meqs/meqs-supplier-attachment';
import type { Supplier } from '~/composables/warehouse/supplier/supplier';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { getLowestPriceItem, getSupplierItemsByCanvassId } from '~/composables/purchase/meqs/meqs';
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import type { CanvassItem } from '~/composables/purchase/canvass/canvass-item.types';

definePageMeta({
    name: ROUTES.MEQS_UPDATE,
    layout: "layout-purchasing",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const enum FORM_TYPE {
    MEQS_INFO,
    APPROVER,
    SUPPLIER,
    AWARD
}

// DEPENDENCIES
const route = useRoute()
const router = useRouter();
const toast = useToast();
const config = useRuntimeConfig()

const API_URL = config.public.apiUrl
const min_no_of_supplier = ref(3)
const max_no_of_supplier = ref(5)

// FLAGS
const isUpdating = ref(false)
const isAddingSupplier = ref(false)
const isEditingSupplier = ref(false)
const isAddingAttachment = ref(false)
const isAttachingRemark = ref(false)

const form = ref<FORM_TYPE>(FORM_TYPE.MEQS_INFO)

const meqsData = ref<MEQS>({} as MEQS)

const employees = ref<Employee[]>([])
const suppliers = ref<Supplier[]>([])

// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await meqsApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.meqs) {
        return redirectTo401Page()
    }

    if (!response.meqs.can_update) {
        return redirectTo401Page()
    }

    populateForm(response.meqs!)

    employees.value = addPropertyFullName(response.employees)
    suppliers.value = response.suppliers
    min_no_of_supplier.value = response.minimum_no_of_supplier
    max_no_of_supplier.value = response.maximum_no_of_supplier

    isLoadingPage.value = false

})


// ======================== COMPUTED ========================  

const meqsStatus = computed(() => {

    const approvers = meqsData.value.meqs_approvers

    if (meqsData.value.cancelled_at) {

        return approvalStatus[APPROVAL_STATUS.CANCELLED]

    }

    const hasDisapproved = approvers.find(i => i.status === APPROVAL_STATUS.DISAPPROVED)

    if (hasDisapproved) {
        return approvalStatus[APPROVAL_STATUS.DISAPPROVED]
    }

    const hasPending = approvers.find(i => i.status === APPROVAL_STATUS.PENDING)

    if (hasPending) {
        return approvalStatus[APPROVAL_STATUS.PENDING]
    }

    return approvalStatus[APPROVAL_STATUS.APPROVED]

})


const reference = computed(() => {

    if (meqsData.value.rv) return meqsData.value.rv
    if (meqsData.value.spr) return meqsData.value.spr
    if (meqsData.value.jo) return meqsData.value.jo

    return null

})

const referenceNumber = computed(() => {
    if (meqsData.value.rv) return 'RV#' + meqsData.value.rv.rv_number
    if (meqsData.value.spr) return 'SPR#' + meqsData.value.spr.spr_number
    if (meqsData.value.jo) return 'JO#' + meqsData.value.jo.jo_number
    return ''
})

const canvassItemsWithSuppliers = computed((): CanvassItem[] => {

    if(!reference.value || !reference.value.canvass) return []

    const canvass_items_with_supplier = []

    for(let canvass_item of reference.value.canvass.canvass_items) {

        // check if canvass_item has a supplier
        for(let meqsSupplier of meqsData.value.meqs_suppliers) {
            
            const item = meqsSupplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item.id)

            // has supplier
            if(item && item.price > 0) {
                canvass_items_with_supplier.push(canvass_item)
                break
            } 

        }

    }

    return canvass_items_with_supplier

})


// ======================== FUNCTIONS ========================  
function populateForm(data: MEQS) {
    console.log('populateForm', data)

    data.meqs_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    for (let supplier of data.meqs_suppliers) {

        supplier.meqs_supplier_items.map(i => {
            i['vat'] = {
                value: i.vat_type,
                label: VAT[i.vat_type].label
            }
            return i
        })

    }

    meqsData.value = data

}

async function updateMeqsInfo() {
    console.log('updateMeqsInfo')

    console.log('updating...')

    isUpdating.value = true
    const response = await meqsApi.update(meqsData.value.id, meqsData.value)
    isUpdating.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })
        
        router.push(`/purchase/meqs/view/${response.data.id}`);

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

async function addSupplier(payload: MeqsSupplier) {
    console.log('addSupplier()', payload)

    isAddingSupplier.value = true

    const meqs_supplier_items: CreateMeqsSupplierItemInput[] = payload.meqs_supplier_items.map(i => {

        return {
            canvass_item_id: i.canvass_item.id,
            price: i.price,
            notes: i.notes,
            is_awarded: i.is_awarded,
            vat_type: i.vat!.value
        }

    })

    const attachments: CreateMeqsSupplierAttachmentSubInput[] = payload.attachments.map(i => {

        return {
            src: i.src,
            filename: i.filename
        }

    })

    const data: CreateMeqsSupplierInput = {
        meqs_id: meqsData.value.id,
        supplier_id: payload.supplier!.id,
        payment_terms: payload.payment_terms,
        meqs_supplier_items,
        // attachments

    }


    // upload files first if there are any

    if (payload.files && payload.files.length > 0) {
        const fileSources = await meqsApi.uploadAttachments(payload.files, API_URL)
        console.log('files uploaded', fileSources)

        if (fileSources) {

            for (let fileSrc of fileSources) {

                const [x, filename] = fileSrc.split('_')

                attachments.push({
                    src: fileSrc,
                    filename
                })

            }

        }
    }

    console.log('data', data)

    const response = await meqsSupplierApi.create(data)
    isAddingSupplier.value = false

    if (response.success && response.data) {

        response.data.meqs_supplier_items.map(i => {
            i['vat'] = {
                value: i.vat_type,
                label: VAT[i.vat_type].label
            }
            return i
        })

        meqsData.value.meqs_suppliers.push(response.data)
        toast.success(response.msg)
    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

async function editSupplier(payload: MeqsSupplier, indx: number) {
    console.log('editSupplier()', payload)


    const meqs_supplier_items: UpdateMeqsSupplierItemInput[] = payload.meqs_supplier_items.map(i => {

        return {
            id: i.id,
            price: i.price,
            notes: i.notes,
            is_awarded: i.is_awarded,
            vat_type: i.vat!.value
        }

    })


    const data: UpdateMeqsSupplierInput = {
        payment_terms: payload.payment_terms,
        meqs_supplier_items
    }


    console.log('data', data)

    isEditingSupplier.value = true
    const response = await meqsSupplierApi.update(payload.id, data)
    isEditingSupplier.value = false

    if (response.success && response.data) {

        response.data.meqs_supplier_items.map(i => {
            i['vat'] = {
                value: i.vat_type,
                label: VAT[i.vat_type].label
            }
            return i
        })

        meqsData.value.meqs_suppliers[indx] = { ...response.data }

        toast.success(response.msg)
    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }


}

async function removeSupplier(indx: number) {

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
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (remove) => {

            if (remove) {
                const response = await meqsSupplierApi.remove(item.id)

                if (response.success) {

                    meqsData.value.meqs_suppliers.splice(indx, 1)
                    toast.success('Supplier removed!')


                } else {

                    Swal.fire({
                        title: 'Error!',
                        text: response.msg,
                        icon: 'error',
                        position: 'top',
                    })

                }
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function addAttachment(payload: { supplierIndx: number, file: any }, closeModalBtn: HTMLButtonElement) {
    console.log('addAttachment', payload, closeModalBtn)

    const meqsSupplier = meqsData.value.meqs_suppliers[payload.supplierIndx]

    console.log('meqsSupplier', meqsSupplier)

    isAddingAttachment.value = true

    const attachmentPath = await meqsApi.uploadSingleAttachment(payload.file, API_URL)

    if (attachmentPath) {
        console.log('attachmentPath', attachmentPath)

        const [x, filename] = attachmentPath.split('_')

        const attachmentData: CreateMeqsSupplierAttachmentInput = {
            meqs_supplier_id: meqsSupplier.id,
            src: attachmentPath,
            filename
        }

        const response = await meqsSupplierAttachmentApi.create(attachmentData)

        isAddingAttachment.value = false

        if (response.success && response.data) {

            meqsSupplier.attachments.push(response.data)
            toast.success(response.msg)

        } else {

            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })

        }

    }

    closeModalBtn.click()
}

async function removeAttachment(supplierIndx: number, attachmentIndx: number) {
    console.log('removeAttachment', supplierIndx, attachmentIndx)


    const meqsSupplier = meqsData.value.meqs_suppliers[supplierIndx]

    if(meqsSupplier.attachments.length === 1) {
        toast.error('Unable to remove attachment. There must be at least one attachment per supplier')
        return
    }

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
                const response = await meqsSupplierAttachmentApi.remove(attachment.id)

                if (response.success) {

                    meqsSupplier.attachments.splice(attachmentIndx, 1)
                    toast.success('Attachment removed!')

                } else {

                    Swal.fire({
                        title: 'Error!',
                        text: response.msg,
                        icon: 'error',
                        position: 'top',
                    })

                }
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}



// ======================== CHILD EVENTS: <WarehouseApprover> ========================  


async function awardSupplierItem(meqsSupplier: MeqsSupplier, canvass_item_id: string, meqs_supplier_item_id: string, attachRemarkBtn: HTMLButtonElement) {

    console.log('awardSupplierItem', meqsSupplier, canvass_item_id)
    console.log('attachRemarkBtn', attachRemarkBtn);

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


    // remarks/note is required if selected item is not the lowest price 

    if(!isLowestPriceItem(meqs_supplier_item_id, canvass_item_id, meqsData.value.meqs_suppliers)) {
        console.log('item is not lowest price');
        attachRemarkBtn.click()
    }


    const response = await meqsSupplierApi.awardSupplierItem(meqs_supplier_item_id, meqsSupplier.id, canvass_item_id)

    console.log('response', response)

    if (response.success) {

        toast.success('Supplier awarded!')

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}

async function attachNote(canvass_item_id: string, note: string) {

    for (let supplier of meqsData.value.meqs_suppliers) {

        const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

        if (item) {
            item.notes = note
        }

    }

    isAttachingRemark.value = true
    const response = await meqsSupplierApi.attachNoteSupplierItem(meqsData.value.id, canvass_item_id, note)
    isAttachingRemark.value = false

    console.log('response', response)

    if (response.success) {

        toast.success(response.msg)

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
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

function isLowestPriceItem(meqs_supplier_item_id: string, canvass_item_id: string, meqs_suppliers: MeqsSupplier[]): boolean {

    console.log('isLowestPriceItem');
    
    const supplierItems = getSupplierItemsByCanvassId(canvass_item_id, meqs_suppliers)
    const lowestPriceItem = getLowestPriceItem(supplierItems)

    if(meqs_supplier_item_id === lowestPriceItem.id) {
        return true 
    }

    return false 
}

function onClickTab(formType: FORM_TYPE) {
    form.value = formType
}

function isInvalidPrice(price: number): boolean {
    if (price < -1 || price === 0) {
        return true
    } else {
        return false
    }
}


</script>