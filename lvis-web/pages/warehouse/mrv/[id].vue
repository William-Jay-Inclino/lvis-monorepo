<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && mrvData && !mrvData.cancelled_at" class="mb-3">

                <h2 class="text-warning">Update MRV</h2>

                <hr>

                <div class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="form = FORM.UPDATE_INFO">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_INFO }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> MRV Info
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
                            <div :class="{ [`badge bg-${mrvStatus.color}`]: true }">
                                {{ mrvStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                MRV Number
                            </label>
                            <input type="text" class="form-control" :value="mrvData.mrv_number" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="mrvData.date_requested" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Request Type <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="request_types" label="name" v-model="mrvData.request_type_object" :clearable="false"></v-select>
                            </client-only>
                            <small v-if="showMwoNumber" class="text-muted fst-italic">
                                Note: The MWO number is automatically assigned when approved.
                            </small>
                        </div>

                        <div v-if="showOrNumber" class="mb-3">
                            <label class="form-label">
                                OR Number
                            </label>
                            <input v-model="mrvData.or_number" class="form-control"
                                rows="3" />
                        </div>

                        <div v-if="showCwoNumber" class="mb-3">
                            <label class="form-label">
                                CWO Number
                            </label>
                            <input v-model="mrvData.cwo_number" class="form-control"
                                rows="3" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                JO Number
                            </label>
                            <input v-model="mrvData.jo_number" class="form-control"
                                rows="3" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Item From <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="stations" label="name" v-model="mrvData.item_from" :clearable="false" disabled></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                                <label class="form-label">
                                    Project Name <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="projects" label="name" v-model="mrvData.project"></v-select>
                                </client-only>
                            </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Consumer Name <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="mrvData.consumer_name" class="form-control"
                                rows="3"> </textarea>
                            <small class="text-danger fst-italic" v-show="mrvDataErrors.consumer_name"> {{ errorMsg }}
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Location <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="mrvData.location" class="form-control"
                                rows="3"> </textarea>
                            <small class="text-danger fst-italic" v-show="mrvDataErrors.location"> {{ errorMsg }}
                            </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Purpose <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="mrvData.purpose" class="form-control" rows="3"> </textarea>
                            <small v-if="mrvDataErrors.purpose" class="text-danger fst-italic"> {{ errorMsg }} </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requested By <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="mrvData.requested_by" :clearable="false"></v-select>
                            </client-only>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">
                                Withdrawn By <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="mrvData.withdrawn_by" :clearable="false"></v-select>
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

                        <WarehouseUpdateApprovers
                          :is-updating="isChangingApprover"
                          :approvers="approvers"
                          :employees="employees"
                          :auditors="auditors"
                          @change-approver="handleChangeApprover" />
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
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/mrv/view/${mrvData.id}`">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM.UPDATE_INFO" @click="updateMrvInfo()" type="button" class="btn btn-success"
                                    :disabled="isUpdating">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> {{ isUpdating ? 'Updating...' : 'Update' }}
                                </button>
                                <button v-if="form === FORM.UPDATE_ITEMS" @click="updateMrvItems()" type="button" class="btn btn-success"
                                    :disabled="isUpdatingItems || isDisabledUpdateItemsBtn">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> {{ isUpdatingItems ? 'Updating Items...' : 'Update Items' }}
                                </button>
                            </div>
                        </div>
        
                    </div>
                </div>
                
                <WarehouseAddItemModal @add-item="handleAddItem" :items="itemsInModal" :added-item-ids="mrvItemIds"/>
        
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
import * as mrvApi from '~/composables/warehouse/mrv/mrv.api'
import * as mrvApproverApi from '~/composables/warehouse/mrv/mrv-approver.api'
import * as mrvItemApi from '~/composables/warehouse/mrv/mrv-item.api'
import { type MRV, type UpdateMrvInput } from '~/composables/warehouse/mrv/mrv.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Station } from '~/composables/warehouse/station/station';
import type { AddItem, Item } from '~/composables/warehouse/item/item.type';

definePageMeta({
    name: ROUTES.MRV_UPDATE,
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
const _mrvDataErrorsInitial = {
    purpose: false,
    consumer_name: false,
    location: false,
}

const form = ref<FORM>(FORM.UPDATE_INFO)

// DROPDOWNS
const employees = ref<Employee[]>([])
const auditors = ref<Employee[]>([])
const stations = ref<Station[]>([])
const items = ref<Item[]>([])
const projects = ref<Project[]>([])
const request_types = ref<WarehouseRequestType[]>([])

// FORM DATA
const mrvDataErrors = ref({ ..._mrvDataErrorsInitial })
const mrvData = ref<MRV>({} as MRV)



// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await mrvApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.mrv) {
        return redirectTo401Page()
    }

    if (!response.mrv.can_update) {
        return redirectTo401Page()
    }

    populateForm(response.mrv)

    stations.value = response.stations
    projects.value = response.projects
    employees.value = addPropertyFullName(response.employees)
    auditors.value = addPropertyFullName(response.auditors)
    items.value = response.items
    request_types.value = WAREHOUSE_REQUEST_TYPES.map(i => ({...i}))

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const mrvStatus = computed(() => {

    const approvers = mrvData.value.mrv_approvers

    if (mrvData.value.cancelled_at) {

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

    return mrvData.value.mrv_approvers.map(i => {
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

const mrvItemIds = computed( () => mrvData.value.mrv_items.map(i => i.item.id) )

const itemsInTable = computed( (): AddItem[] => {
    return mrvData.value.mrv_items.map(i => {
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

    const mrvItems = mrvData.value.mrv_items

    if(mrvItems.length === 0) {
        return true
    }

    for(let mrvItem of mrvItems) {

        const availableQty = mrvItem.item.total_quantity - mrvItem.item.quantity_on_queue

        if(mrvItem.quantity <= 0 || mrvItem.quantity > availableQty ) {
            return true
        }

    }

    return false
    
})

const showOrNumber = computed( () => {

    if(!mrvData.value.request_type_object) return false 

    return showORnumber(mrvData.value.request_type_object.id)

})

const showMwoNumber = computed( () => {

    if(!mrvData.value.request_type_object) return false 

    return showMWOnumber(mrvData.value.request_type_object.id)


})

const showCwoNumber = computed( () => {

    if(!mrvData.value.request_type_object) return false 

    return showCWOnumber(mrvData.value.request_type_object.id)

})

// ======================== FUNCTIONS ========================  

function populateForm(data: MRV) {

    data.date_requested = formatToValidHtmlDate(data.date_requested)

    data.request_type_object = {
        id: data.request_type,
        name: warehouseRequestTypeMapper[data.request_type],
    }

    const requestedBy = data.requested_by
    requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)
    
    if(data.withdrawn_by) {
        const withdrawnBy = data.withdrawn_by
        withdrawnBy!['fullname'] = getFullname(withdrawnBy!.firstname, withdrawnBy!.middlename, withdrawnBy!.lastname)
    }

    data.mrv_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    mrvData.value = data
    console.log('mrvData.value', mrvData.value);
}

async function updateMrvInfo() {

    console.log('update')

    if (!isValidMrvInfo()) {
        return
    }

    console.log('updating...')

    const data: UpdateMrvInput = {
        project: mrvData.value.project,
        purpose: mrvData.value.purpose,
        request_type: {
            id: mrvData.value.request_type_object.id,
            name: warehouseRequestTypeMapper[mrvData.value.request_type_object.id]
        },
        requested_by: mrvData.value.requested_by,
        withdrawn_by: mrvData.value.withdrawn_by,
        item_from: mrvData.value.item_from,
        or_number: mrvData.value.or_number,
        cwo_number: mrvData.value.cwo_number,
        jo_number: mrvData.value.jo_number,
        consumer_name: mrvData.value.consumer_name,
        location: mrvData.value.location,

    }

    isUpdating.value = true
    const response = await mrvApi.update(mrvData.value.id, data)
    isUpdating.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/mrv/view/${response.data.id}`);

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

async function updateMrvItems() {
    
    isUpdatingItems.value = true
    const response = await mrvItemApi.updateMrvItems(mrvData.value.id, mrvData.value.mrv_items)
    isUpdatingItems.value = false

    if (response.success) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        mrvData.value.mrv_items = response.mrv_items

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
    const response = await mrvItemApi.fetchItems()
    isFetchingItems.value = false

    items.value = response.items

}

// ======================== CHILD EVENTS: <WarehouseUpdateApprovers> ========================  

async function handleChangeApprover(payload: {currentApprover: Approver, newApprover: Employee}, closeBtnModal: HTMLButtonElement) {
    console.log('handleChangeApprover', payload);

    const { currentApprover, newApprover } = payload

    isChangingApprover.value = true
    const response = await mrvApproverApi.changeApprover(currentApprover.id, newApprover.id)
    isChangingApprover.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        const approverIndx = mrvData.value.mrv_approvers.findIndex(i => i.id === response.data?.id)

        if(approverIndx === -1) {
            console.error('Approver not found in mrv approvers with id of ' + response.data.id);
            return 
        }

        mrvData.value.mrv_approvers[approverIndx] = {...response.data}

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

    const mrvItem = mrvData.value.mrv_items.find(i => i.item.id === item.id) 

    if(!mrvItem) {
        console.error('Item not found', item.code);
        return 
    }

    mrvItem.quantity = qty

}

function handleRemoveItem(item: AddItem) {
    console.log('handleRemoveItem', item);

    const indx = mrvData.value.mrv_items.findIndex(i => i.item.id === item.id)

    if(indx === -1) {
        console.error('item not found in mrvData.items with id of ', item.id);
        return 
    }

    mrvData.value.mrv_items.splice(indx, 1)
}


// ======================== CHILD EVENTS: <WarehouseAddItemModal> ========================  

function handleAddItem(itemId: string) {
    console.log('handleAddItem', itemId);
    const item = items.value.find(i => i.id === itemId)

    if(!item) {
        console.error('item not found');
        return 
    }

    const isExist = mrvData.value.mrv_items.find(i => i.item.id === itemId) 

    if(isExist) {
        toast.error('Item exist!')
        return 
    }


    const mrvItem = {
        id: '',
        item,
        price: item.GWAPrice,
        quantity: 0,
    }

    // @ts-ignore
    mrvData.value.mrv_items.push(mrvItem)
    toast.success('Item added!')
}

// ======================== UTILS ========================  

function isValidMrvInfo(): boolean {

    mrvDataErrors.value = { ..._mrvDataErrorsInitial }

    if(mrvData.value.purpose.trim() === '') {
        mrvDataErrors.value.purpose = true
    }

    // if (!mrvData.value.requested_by) {
    //     mrvDataErrors.value.requested_by = true
    // }

    // if (!mrvData.value.item_from) {
    //     mrvDataErrors.value.item_from = true
    // }

    const hasError = Object.values(mrvDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}


</script>
