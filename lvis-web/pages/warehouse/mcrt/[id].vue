<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && mcrtData && !mcrtData.cancelled_at" class="mb-3">

                <h2 class="text-warning">Update MCRT</h2>

                <hr>

                <div class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="form = FORM.UPDATE_INFO">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_INFO }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> MCRT Info
                                </a>
                            </li>
                            <li class="nav-item" @click="form = FORM.UPDATE_APPROVERS">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_APPROVERS }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'users']"/>
                            </client-only> Signatories
                                </a>
                            </li>
                            <li class="nav-item" @click="form = FORM.UPDATE_ITEMS">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_ITEMS }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                            </client-only> Items
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
        
                <div v-show="form === FORM.UPDATE_INFO" class="row justify-content-center">
                    <div class="col-lg-6">
                        
                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>
                        
                        <div class="mb-3 d-flex align-items-center">
                            <label class="form-label me-2 mb-0">Status:</label>
                            <div :class="{ [`badge bg-${mcrtStatus.color}`]: true }">
                                {{ mcrtStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                MCRT Number
                            </label>
                            <input type="text" class="form-control" :value="mcrtData.mcrt_number" disabled>
                        </div>

                        <div v-if="mcrtData.mct_number" class="mb-3">
                            <label class="form-label">
                                MCT Number
                            </label>
                            <input type="text" class="form-control" :value="mcrtData.mct_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/mct/view/' + mcrtData.mct_number" target="_blank">View MCT
                                details</nuxt-link>
                        </div>

                        <div v-if="mcrtData.seriv_number" class="mb-3">
                            <label class="form-label">
                                SERIV Number
                            </label>
                            <input type="text" class="form-control" :value="mcrtData.seriv_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/seriv/view/' + mcrtData.seriv_number" target="_blank">View SERIV
                                details</nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="mcrtData.mcrt_date" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                WO Number
                            </label>
                            <input v-model="mcrtData.wo_number" class="form-control"/>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                MO Number
                            </label>
                            <input v-model="mcrtData.mo_number" class="form-control" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                JO Number
                            </label>
                            <input v-model="mcrtData.jo_number" class="form-control"/>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Note <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="mcrtData.note" class="form-control" rows="3"> </textarea>
                            <small v-if="mcrtDataErrors.note" class="text-danger fst-italic"> {{ errorMsg }} </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Returned By <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="mcrtData.returned_by" :clearable="false"></v-select>
                            </client-only>
                        </div>
        
                    </div>
                </div>

                <div v-show="form === FORM.UPDATE_APPROVERS" class="row justify-content-center">
                    <div class="col-lg-6">
                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                A signatory with a pending status can only be changed.
                            </small>
                        </div>

                        <WarehouseUpdateApprovers :is-updating="isChangingApprover" :approvers="approvers" :employees="employees" @change-approver="handleChangeApprover"/>
                    </div>
                </div>

                <div v-show="form === FORM.UPDATE_ITEMS" class="row justify-content-center">
                    <div class="col-lg-11">
                        <div class="text-muted fst-italic text-center" v-show="isFetchingItems">
                            loading items...
                        </div>
                        <div v-show="!isFetchingItems">
                            <WarehouseMCRTItems
                                  :items="mcrtData.mcrt_items"
                                  @remove-item="handleRemoveItem"
                                  @update-item="handleUpdateItem" />
                        </div>
                    </div>
                </div>
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': form === FORM.UPDATE_INFO || form === FORM.UPDATE_APPROVERS, 'col-10': form === FORM.UPDATE_ITEMS }">
        
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/mcrt/view/${mcrtData.id}`">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM.UPDATE_INFO" @click="updateMcrtInfo()" type="button" class="btn btn-success"
                                    :disabled="isUpdating">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> {{ isUpdating ? 'Updating...' : 'Update' }}
                                </button>
                                <button v-if="form === FORM.UPDATE_ITEMS" @click="updateMcrtItems()" type="button" class="btn btn-success"
                                    :disabled="isUpdatingItems || isDisabledUpdateItemsBtn">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> {{ isUpdatingItems ? 'Updating Items...' : 'Update Items' }}
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
import { getFullname, formatToValidHtmlDate } from '~/utils/helpers'
import * as mcrtApi from '~/composables/warehouse/mcrt/mcrt.api'
import * as mcrtApproverApi from '~/composables/warehouse/mcrt/mcrt-approver.api'
import * as mcrtItemApi from '~/composables/warehouse/mcrt/mcrt-item.api'
import { type MCRT, type UpdateMcrtInput } from '~/composables/warehouse/mcrt/mcrt.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Station } from '~/composables/warehouse/station/station';
import type { Item } from '~/composables/warehouse/item/item.type';
import type { MCRTItem } from '~/composables/warehouse/mcrt/mcrt-item.types';
import { useToast, POSITION as TOAST_POSITION } from 'vue-toastification';

definePageMeta({
    name: ROUTES.MCRT_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const enum FORM {
    UPDATE_INFO,
    UPDATE_APPROVERS,
    UPDATE_ITEMS,
}

const authUser = ref<AuthUser>({} as AuthUser)

// CONSTANTS
const errorMsg = 'This field is required'
const router = useRouter()

// DEPENDENCIES
const route = useRoute()
const toast = useToast();

// FLAGS
const isUpdating = ref(false)
const isUpdatingItems = ref(false)
const isChangingApprover = ref(false)
const isLoadingPage = ref(true)
const isFetchingItems = ref(false)

// INITIAL DATA
const _mcrtDataErrorsInitial = {
    note: false,
}

const form = ref<FORM>(FORM.UPDATE_INFO)

// DROPDOWNS
const employees = ref<Employee[]>([])
const stations = ref<Station[]>([])
const items = ref<Item[]>([])
const request_types = ref<WarehouseRequestType[]>([])

// FORM DATA
const mcrtDataErrors = ref({ ..._mcrtDataErrorsInitial })
const mcrtData = ref<MCRT>({} as MCRT)



// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await mcrtApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.mcrt) {
        return redirectTo401Page()
    }

    if (!response.mcrt.can_update) {
        return redirectTo401Page()
    }

    populateForm(response.mcrt)

    stations.value = response.stations
    employees.value = addPropertyFullName(response.employees)
    items.value = response.items
    request_types.value = WAREHOUSE_REQUEST_TYPES.map(i => ({...i}))

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const mcrtStatus = computed(() => {

    const approvers = mcrtData.value.mcrt_approvers

    if (mcrtData.value.cancelled_at) {

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

const approvers = computed( (): Approver[] => {

    return mcrtData.value.mcrt_approvers.map(i => {
        return {
            id: i.id,
            approver: i.approver,
            date_approval: i.date_approval,
            notes: i.notes,
            status: i.status,
            label: i.label,
            order: i.order,
        }
    })

})

const isDisabledUpdateItemsBtn = computed( () => {

    const mcrtItems = mcrtData.value.mcrt_items

    if(mcrtItems.length === 0) {
        return true
    }

    return false
    
})

// ======================== FUNCTIONS ========================  

function populateForm(data: MCRT) {

    data.mcrt_date = formatToValidHtmlDate(data.mcrt_date)

    const returnedBy = data.returned_by
    returnedBy!['fullname'] = getFullname(returnedBy!.firstname, returnedBy!.middlename, returnedBy!.lastname)

    data.mcrt_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    mcrtData.value = data
    console.log('mcrtData.value', mcrtData.value);
}

async function updateMcrtInfo() {

    console.log('update')

    if (!isValidMcrtInfo()) {
        return
    }

    console.log('updating...')

    const data: UpdateMcrtInput = {
        note: mcrtData.value.note,
        returned_by: mcrtData.value.returned_by,
        wo_number: mcrtData.value.wo_number,
        mo_number: mcrtData.value.mo_number,
        jo_number: mcrtData.value.jo_number,

    }

    isUpdating.value = true
    const response = await mcrtApi.update(mcrtData.value.id, data)
    isUpdating.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/mcrt/view/${response.data.id}`);

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

async function updateMcrtItems() {
    
    isUpdatingItems.value = true
    const response = await mcrtItemApi.updateMcrtItems(mcrtData.value.id, mcrtData.value.mcrt_items)
    isUpdatingItems.value = false

    if (response.success) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        mcrtData.value.mcrt_items = response.mcrt_items

        await fetchItems(mcrtData.value.id)

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

async function fetchItems(id: string) {

    isFetchingItems.value = true
    const response = await mcrtItemApi.fetchMcrtItems(id)
    isFetchingItems.value = false

    mcrtData.value.mcrt_items = response.items.map(i => ({...i}))

}



// ======================== CHILD EVENTS: <WarehouseUpdateApprovers> ========================  

async function handleChangeApprover(payload: {currentApprover: Approver, newApprover: Employee}, closeBtnModal: HTMLButtonElement) {
    console.log('handleChangeApprover', payload);

    const { currentApprover, newApprover } = payload

    isChangingApprover.value = true
    const response = await mcrtApproverApi.changeApprover(currentApprover.id, newApprover.id)
    isChangingApprover.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        const approverIndx = mcrtData.value.mcrt_approvers.findIndex(i => i.id === response.data?.id)

        if(approverIndx === -1) {
            console.error('Approver not found in mcrt approvers with id of ' + response.data.id);
            return 
        }

        mcrtData.value.mcrt_approvers[approverIndx] = {...response.data}

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

    closeBtnModal.click()
}


// ======================== CHILD EVENTS: <WarehouseMCRTItems> ========================  

function handleRemoveItem(item: MCRTItem) {

    const indx = mcrtData.value.mcrt_items.findIndex(i => i.item.id === item.item.id)

    if(indx === -1) {
        console.error('item not found in mcrtData.mcrt_items with id of ', item.item.id);
        return 
    }

    mcrtData.value.mcrt_items.splice(indx, 1)

    toast.success('Item removed!', {position: TOAST_POSITION.BOTTOM_RIGHT})
}

function handleUpdateItem(mcrtItem: MCRTItem, data: {qty: number}) {
    const item = mcrtData.value.mcrt_items.find(i => i.item.id === mcrtItem.item.id)

    if(!item) {
        console.error('item not found');
        return 
    }

    if(data.qty <= 0 || data.qty > (mcrtItem.reference_qty - mcrtItem.qty_returned)) {
        item.showQtyError = true 
    } else {
        item.showQtyError = false
    }

    item.quantity = data.qty

}



// ======================== UTILS ========================  

function isValidMcrtInfo(): boolean {

    mcrtDataErrors.value = { ..._mcrtDataErrorsInitial }

    if(mcrtData.value.note.trim() === '') {
        mcrtDataErrors.value.note = true
    }

    const hasError = Object.values(mcrtDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}


</script>
