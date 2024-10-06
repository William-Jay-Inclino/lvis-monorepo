<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && mstData && !mstData.cancelled_at" class="mb-3">

                <h2 class="text-warning">Update MST</h2>

                <hr>

                <div class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="form = FORM.UPDATE_INFO">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_INFO }" href="#">
                                    <i class="fas fa-info-circle"></i> MST Info
                                </a>
                            </li>
                            <li class="nav-item" @click="form = FORM.UPDATE_APPROVERS">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_APPROVERS }" href="#">
                                    <i class="fas fa-users"></i> Signatories
                                </a>
                            </li>
                            <li class="nav-item" @click="form = FORM.UPDATE_ITEMS">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_ITEMS }" href="#">
                                    <i class="fas fa-shopping-cart"></i> Items
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
                            <div :class="{ [`badge bg-${mstStatus.color}`]: true }">
                                {{ mstStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                MST Number
                            </label>
                            <input type="text" class="form-control" :value="mstData.mst_number" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="mstData.mst_date" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                CWO Number
                            </label>
                            <input v-model="mstData.cwo_number" class="form-control"/>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                MWO Number
                            </label>
                            <input v-model="mstData.mwo_number" class="form-control" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                JO Number
                            </label>
                            <input v-model="mstData.jo_number" class="form-control"/>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Remarks <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="mstData.remarks" class="form-control" rows="3"> </textarea>
                            <small v-if="mstDataErrors.remarks" class="text-danger fst-italic"> {{ errorMsg }} </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Returned By <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="mstData.returned_by" :clearable="false"></v-select>
                            </client-only>
                        </div>
        
                    </div>
                </div>

                <div v-show="form === FORM.UPDATE_APPROVERS" class="row justify-content-center">
                    <div class="col-lg-6">
                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Only pending status can be change
                            </small>
                        </div>

                        <WarehouseUpdateApprovers :is-updating="isChangingApprover" :approvers="approvers" :employees="employees" @change-approver="handleChangeApprover"/>
                    </div>
                </div>

                <div v-show="form === FORM.UPDATE_ITEMS" class="row justify-content-center">
                    <div class="col-lg-10">

                        <div class="text-center fst-italic text-muted" v-if="isFetchingItems">
                            loading items...
                        </div>

                        <div v-else>
                            <div class="text-end mb-3">
                                <button
                                    class="btn btn-success btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addItemModal">
                                    <i
                                    class="fas fa-plus"></i>
                                    Add Item
                                </button>
                            </div>
    
                            <WarehouseItems :items="itemsInTable" @remove-item="handleRemoveItem" @update-qty="handleUpdateItemQty"/>
                        </div>

                    </div>
                </div>
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': form === FORM.UPDATE_INFO || form === FORM.UPDATE_APPROVERS, 'col-10': form === FORM.UPDATE_ITEMS }">
        
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/mst/view/${mstData.id}`">
                                    <i class="fas fa-chevron-left"></i> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM.UPDATE_INFO" @click="updateMstInfo()" type="button" class="btn btn-success"
                                    :disabled="isUpdating">
                                    <i class="fas fa-sync"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
                                </button>
                                <button v-if="form === FORM.UPDATE_ITEMS" @click="updateMstItems()" type="button" class="btn btn-success"
                                    :disabled="isUpdatingItems || isDisabledUpdateItemsBtn">
                                    <i class="fas fa-sync"></i> {{ isUpdatingItems ? 'Updating Items...' : 'Update Items' }}
                                </button>
                            </div>
                        </div>
        
                    </div>
                </div>
                
                <WarehouseAddItemModal @add-item="handleAddItem" :items="itemsInModal" :added-item-ids="mstItemIds"/>
        
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
import { useToast } from "vue-toastification";
import * as mstApi from '~/composables/warehouse/mst/mst.api'
import * as mstApproverApi from '~/composables/warehouse/mst/mst-approver.api'
import * as mstItemApi from '~/composables/warehouse/mst/mst-item.api'
import { type MST, type UpdateMstInput } from '~/composables/warehouse/mst/mst.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Station } from '~/composables/warehouse/station/station';
import type { AddItem, Item } from '~/composables/warehouse/item/item.type';

definePageMeta({
    name: ROUTES.MST_UPDATE,
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
const _mstDataErrorsInitial = {
    remarks: false,
}

const form = ref<FORM>(FORM.UPDATE_INFO)

// DROPDOWNS
const employees = ref<Employee[]>([])
const items = ref<Item[]>([])

// FORM DATA
const mstDataErrors = ref({ ..._mstDataErrorsInitial })
const mstData = ref<MST>({} as MST)



// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await mstApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.mst) {
        return redirectTo401Page()
    }

    if (!response.mst.can_update) {
        return redirectTo401Page()
    }

    populateForm(response.mst)

    employees.value = addPropertyFullName(response.employees)
    items.value = response.items

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const mstStatus = computed(() => {

    const approvers = mstData.value.mst_approvers

    if (mstData.value.cancelled_at) {

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

    return mstData.value.mst_approvers.map(i => {
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

const mstItemIds = computed( () => mstData.value.mst_items.map(i => i.item.id) )

const itemsInTable = computed( (): AddItem[] => {
    return mstData.value.mst_items.map(i => {
            const x: AddItem = {
                id: i.item.id,
                code: i.item.code,
                description: i.item.description,
                label: i.item.code + ' - ' + i.item.description,
                available_quantity: i.item.total_quantity - i.item.quantity_on_queue,
                unit: i.item.unit,
                qty_request: i.quantity,
                GWAPrice: i.item.GWAPrice,
                item_type: i.item.item_type,
            }

            return x
        })
})

const itemsInModal = computed( (): AddItem[] => {
    return items.value.map(i => {
            const x: AddItem = {
                id: i.id,
                code: i.code,
                description: i.description,
                label: i.code + ' - ' + i.description,
                available_quantity: i.total_quantity - i.quantity_on_queue,
                unit: i.unit,
                qty_request: 0,
                GWAPrice: i.GWAPrice,
                item_type: i.item_type,
            }

            return x
        })
})

const isDisabledUpdateItemsBtn = computed( () => {

    const mstItems = mstData.value.mst_items

    if(mstItems.length === 0) {
        return true
    }

    for(let mstItem of mstItems) {

        const availableQty = mstItem.item.total_quantity - mstItem.item.quantity_on_queue

        if(mstItem.quantity <= 0 || mstItem.quantity > availableQty ) {
            return true
        }

    }

    return false
    
})

// ======================== FUNCTIONS ========================  

function populateForm(data: MST) {

    data.mst_date = formatToValidHtmlDate(data.mst_date)

    const returnedBy = data.returned_by
    returnedBy!['fullname'] = getFullname(returnedBy!.firstname, returnedBy!.middlename, returnedBy!.lastname)

    data.mst_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    mstData.value = data
    console.log('mstData.value', mstData.value);
}

async function updateMstInfo() {

    console.log('update')

    if (!isValidMstInfo()) {
        return
    }

    console.log('updating...')

    const data: UpdateMstInput = {
        remarks: mstData.value.remarks,
        returned_by: mstData.value.returned_by,
        cwo_number: mstData.value.cwo_number,
        mwo_number: mstData.value.mwo_number,
        jo_number: mstData.value.jo_number,

    }

    isUpdating.value = true
    const response = await mstApi.update(mstData.value.id, data)
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

async function updateMstItems() {
    
    isUpdatingItems.value = true
    const response = await mstItemApi.updateMstItems(mstData.value.id, mstData.value.mst_items)
    isUpdatingItems.value = false

    if (response.success) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        mstData.value.mst_items = response.mst_items

        await fetchItems()

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

async function fetchItems() {

    isFetchingItems.value = true
    const response = await mstItemApi.fetchItems()
    isFetchingItems.value = false

    items.value = response.items

}

// ======================== CHILD EVENTS: <WarehouseUpdateApprovers> ========================  

async function handleChangeApprover(payload: {currentApprover: Approver, newApprover: Employee}, closeBtnModal: HTMLButtonElement) {
    console.log('handleChangeApprover', payload);

    const { currentApprover, newApprover } = payload

    isChangingApprover.value = true
    const response = await mstApproverApi.changeApprover(currentApprover.id, newApprover.id)
    isChangingApprover.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        const approverIndx = mstData.value.mst_approvers.findIndex(i => i.id === response.data?.id)

        if(approverIndx === -1) {
            console.error('Approver not found in mst approvers with id of ' + response.data.id);
            return 
        }

        mstData.value.mst_approvers[approverIndx] = {...response.data}

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


// ======================== CHILD EVENTS: <WarehouseItems> ========================  

function handleUpdateItemQty(item: AddItem, qty: number) {
    console.log('handleUpdateItemQty', item, qty);

    const mstItem = mstData.value.mst_items.find(i => i.item.id === item.id) 

    if(!mstItem) {
        console.error('Item not found', item.code);
        return 
    }

    mstItem.quantity = qty

}

function handleRemoveItem(item: AddItem) {
    console.log('handleRemoveItem', item);

    const indx = mstData.value.mst_items.findIndex(i => i.item.id === item.id)

    if(indx === -1) {
        console.error('item not found in mstData.items with id of ', item.id);
        return 
    }

    mstData.value.mst_items.splice(indx, 1)
}


// ======================== CHILD EVENTS: <WarehouseAddItemModal> ========================  

function handleAddItem(itemId: string) {
    console.log('handleAddItem', itemId);
    const item = items.value.find(i => i.id === itemId)

    if(!item) {
        console.error('item not found');
        return 
    }

    const isExist = mstData.value.mst_items.find(i => i.item.id === itemId) 

    if(isExist) {
        toast.error('Item exist!')
        return 
    }


    const mstItem = {
        id: '',
        item,
        price: item.GWAPrice,
        quantity: 0,
    }

    // @ts-ignore
    mstData.value.mst_items.push(mstItem)
    toast.success('Item added!')
}

// ======================== UTILS ========================  

function isValidMstInfo(): boolean {

    mstDataErrors.value = { ..._mstDataErrorsInitial }

    if(mstData.value.remarks.trim() === '') {
        mstDataErrors.value.remarks = true
    }

    const hasError = Object.values(mstDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}


</script>
