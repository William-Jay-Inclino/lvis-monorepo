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
                                    <i class="fas fa-info-circle"></i> MEQS Info
                                </a>
                            </li>
                            <li class="nav-item" @click="onClickTab(FORM_TYPE.SUPPLIER)">
                                <a class="nav-link" :class="{ 'active': form === FORM_TYPE.SUPPLIER }" href="#">
                                    <i class="fas fa-truck"></i> Manage Suppliers
                                </a>
                            </li>
                            <li class="nav-item" @click="onClickTab(FORM_TYPE.AWARD)">
                                <a class="nav-link" :class="{ 'active': form === FORM_TYPE.AWARD }" href="#">
                                    <i class="fas fa-medal"></i> Awarding
                                </a>
                            </li>
                            <!-- <li v-if="isAdmin(authUser)" class="nav-item" @click="onClickTab(FORM_TYPE.APPROVER)">
                                <a class="nav-link" :class="{ 'active': form === FORM_TYPE.APPROVER }" href="#">
                                    <i class="fas fa-users"></i> Approvers
                                </a>
                            </li> -->
                        </ul>
                    </div>
                </div>
        
        
                <div v-show="form === FORM_TYPE.MEQS_INFO" class="row justify-content-center pt-5">
        
                    <div class="col-lg-6">
        
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
                                :to="'/warehouse/purchasing/meqs/view/' + meqsData.id" target="_blank">View MEQS
                                details</nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">Reference</label>
                            <input type="text" class="form-control" :value="referenceNumber" disabled>
                            <nuxt-link v-if="meqsData.rv" class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/purchasing/rv/view/' + meqsData.rv.id" target="_blank">
                                View RV details
                            </nuxt-link>
                            <nuxt-link v-if="meqsData.spr" class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/purchasing/spr/view/' + meqsData.spr.id" target="_blank">
                                View SPR details
                            </nuxt-link>
                            <nuxt-link v-if="meqsData.jo" class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/purchasing/jo/view/' + meqsData.jo.id" target="_blank">
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
                            <input type="text" class="form-control" :value="reference.canvass!.purpose" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">Requisitioner Notes</label>
                            <input type="text" class="form-control" :value="reference.canvass!.notes" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">Notes</label>
                            <textarea v-model="meqsData.notes" class="form-control" rows="3"></textarea>
                            <small class="text-muted fst-italic">This note will be use during print out</small>
                        </div>
        
                    </div>
        
                </div>
        
        
                <!-- <div v-show="form === FORM_TYPE.APPROVER" class="row justify-content-center pt-5">
        
                    <div class="col-12">
                        <WarehouseApprover :approvers="meqsData.meqs_approvers" :employees="employees"
                            :isUpdatingApproverOrder="isUpdatingApproverOrder" :isAddingApprover="isAddingApprover"
                            :isEditingApprover="isEditingApprover" @changeApproverOrder="changeApproverOrder"
                            @addApprover="addApprover" @editApprover="editApprover" @removeApprover="removeApprover" @searched-employees="handleSearchedEmployees"/>
                    </div>
        
                </div> -->
        
                <div v-show="form === FORM_TYPE.SUPPLIER" class="row justify-content-center pt-5">
        
                    <div class="12">
        
                        <WarehouseMEQSSupplier :suppliers="suppliers" :meqs_suppliers="meqsData.meqs_suppliers"
                            :canvass_items="reference.canvass!.canvass_items" :is-adding-supplier="isAddingSupplier"
                            :is-editing-supplier="isEditingSupplier" :is-page-create="false" @add-supplier="addSupplier"
                            :is-adding-attachment="isAddingAttachment" @edit-supplier="editSupplier"
                            :is-rr-completed="meqsData.is_rr_completed" @remove-supplier="removeSupplier"
                            @add-attachment="addAttachment" @remove-attachment="removeAttachment" />
        
                    </div>
        
                </div>
        
                <div v-show="form === FORM_TYPE.AWARD" class="row justify-content-center pt-5">
        
                    <div class="12">
        
                        <WarehouseMEQSAward :meqs_suppliers="meqsData.meqs_suppliers"
                            :canvass_items="reference.canvass!.canvass_items" @award-supplier-item="awardSupplierItem"
                            :is-attaching-remark="isAttachingRemark" @attach-note="attachNote" />
        
                    </div>
        
                </div>
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': form === FORM_TYPE.MEQS_INFO, 'col-12': form !== FORM_TYPE.MEQS_INFO }">
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" to="/warehouse/purchasing/meqs">
                                    <i class="fas fa-chevron-left"></i> Back to Search
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM_TYPE.MEQS_INFO" @click="updateMeqsInfo()" type="button"
                                    class="btn btn-success" :disabled="isUpdating">
                                    <i class="fas fa-sync"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
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
import type { MEQS } from '~/composables/warehouse/meqs/meqs.types';
import * as meqsApi from '~/composables/warehouse/meqs/meqs.api'
import * as meqsApproverApi from '~/composables/warehouse/meqs/meqs-approver.api'
import * as meqsSupplierApi from '~/composables/warehouse/meqs/meqs-supplier.api'
import * as meqsSupplierAttachmentApi from '~/composables/warehouse/meqs/meqs-supplier-attachment.api'
import type { CreateMeqsSupplierAttachmentSubInput, CreateMeqsSupplierInput, CreateMeqsSupplierItemInput, MeqsSupplier, UpdateMeqsSupplierInput, UpdateMeqsSupplierItemInput } from '~/composables/warehouse/meqs/meqs-supplier';
import type { CreateMeqsSupplierAttachmentInput } from '~/composables/warehouse/meqs/meqs-supplier-attachment';
import type { Supplier } from '~/composables/warehouse/supplier/supplier';
import type { Employee } from '~/composables/system/employee/employee.types';
import { getLowestPriceItem, getSupplierItemsByCanvassId } from '~/composables/warehouse/meqs/meqs';
import { addPropertyFullName } from '~/composables/system/employee/employee';

definePageMeta({
    name: ROUTES.MEQS_UPDATE,
    layout: "layout-warehouse",
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
const toast = useToast();
const config = useRuntimeConfig()

const API_URL = config.public.apiUrl

// FLAGS
const isUpdating = ref(false)
const isUpdatingApproverOrder = ref(false)
const isAddingApprover = ref(false)
const isEditingApprover = ref(false)
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

    populateForm(response.meqs)

    employees.value = addPropertyFullName(response.employees)

    suppliers.value = response.suppliers

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

})

const referenceNumber = computed(() => {
    if (meqsData.value.rv) return 'RV#' + meqsData.value.rv.rv_number
    if (meqsData.value.spr) return 'SPR#' + meqsData.value.spr.spr_number
    if (meqsData.value.jo) return 'JO#' + meqsData.value.jo.jo_number
    return ''
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
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

// handle searched employees from child component (Approver) 
async function handleSearchedEmployees(searchedEmployees: Employee[]) {
    employees.value = addPropertyFullName(searchedEmployees)
}


// ======================== CHILD EVENTS: <WarehouseApprover> ========================  

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

async function addApprover(
    data: CreateApproverInput,
    modalCloseBtn: HTMLButtonElement
) {
    console.log('data', data)

    isAddingApprover.value = true
    const response = await meqsApproverApi.create(meqsData.value.id, data)
    isAddingApprover.value = false

    if (response.success && response.data) {
        toast.success(response.msg)

        const approver = response.data.approver

        approver!.fullname = getFullname(approver!.firstname, approver!.middlename, approver!.lastname)

        response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval, true) : null

        meqsData.value.meqs_approvers.push(response.data)
        modalCloseBtn.click()
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}

async function editApprover(
    data: UpdateApproverInput,
    modalCloseBtn: HTMLButtonElement
) {
    isEditingApprover.value = true
    const response = await meqsApproverApi.update(data)
    isEditingApprover.value = false

    if (response.success && response.data) {
        toast.success(response.msg)

        const prevApproverItemIndx = meqsData.value.meqs_approvers.findIndex(i => i.id === data.id)

        response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval, true) : null

        const a = response.data.approver

        response.data.approver!['fullname'] = getFullname(a!.firstname, a!.middlename, a!.lastname)

        meqsData.value.meqs_approvers[prevApproverItemIndx] = { ...response.data }

        modalCloseBtn.click()

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}

async function removeApprover(id: string) {
    const indx = meqsData.value.meqs_approvers.findIndex(i => i.id === id)

    const item = meqsData.value.meqs_approvers[indx]

    if (!item) {
        console.error('approver not found with id of: ' + id)
        return
    }

    Swal.fire({
        title: "Are you sure?",
        text: `${item.approver?.fullname} will be removed!`,
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (remove) => {

            if (remove) {
                const response = await meqsApproverApi.remove(item.id)

                if (response.success) {

                    toast.success(`${item.approver?.fullname} removed!`)

                    meqsData.value.meqs_approvers.splice(indx, 1)

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

async function changeApproverOrder(
    data: { id: string, order: number }[],
    modalCloseBtn: HTMLButtonElement
) {
    console.log('data', data)
    console.log('modalCloseBtn', modalCloseBtn)

    isUpdatingApproverOrder.value = true
    const response = await meqsApproverApi.updateApproverOrder(data)
    isUpdatingApproverOrder.value = false

    if (response.success && response.approvers) {
        toast.success(response.msg)

        meqsData.value.meqs_approvers = response.approvers.map(i => {
            i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
            i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
            return i
        })
        modalCloseBtn.click()

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
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


// ======================== UTILS ========================  

// async function onCancelMeqs() {
//     Swal.fire({
//         title: "Are you sure?",
//         text: `This MEQS will be cancelled!`,
//         position: "top",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#e74a3b",
//         cancelButtonColor: "#6c757d",
//         confirmButtonText: "Yes, cancel it!",
//         reverseButtons: true,
//         showLoaderOnConfirm: true,
//         preConfirm: async (remove) => {

//             if (remove) {
//                 await cancelMeqs()
//             }

//         },
//         allowOutsideClick: () => !Swal.isLoading()
//     })
// }

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