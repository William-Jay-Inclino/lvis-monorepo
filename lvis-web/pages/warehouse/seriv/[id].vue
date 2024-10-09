<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && serivData && !serivData.cancelled_at" class="mb-3">

                <h2 class="text-warning">Update SERIV</h2>

                <hr>

                <div class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="form = FORM.UPDATE_INFO">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_INFO }" href="#">
                                    <i class="fas fa-info-circle"></i> SERIV Info
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
                            <div :class="{ [`badge bg-${serivStatus.color}`]: true }">
                                {{ serivStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                SERIV Number
                            </label>
                            <input type="text" class="form-control" :value="serivData.seriv_number" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="serivData.date_requested" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Request Type <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="request_types" label="name" v-model="serivData.request_type" :clearable="false"></v-select>
                            </client-only>
                        </div>

                        <div v-if="showOrNumber" class="mb-3">
                            <label class="form-label">
                                OR Number
                            </label>
                            <input v-model="serivData.or_number" class="form-control"
                                rows="3" />
                        </div>

                        <div v-if="showMwoNumber" class="mb-3">
                            <label class="form-label">
                                MWO Number
                            </label>
                            <input v-model="serivData.mwo_number" class="form-control"
                                rows="3" />
                        </div>

                        <div v-if="showCwoNumber" class="mb-3">
                            <label class="form-label">
                                CWO Number
                            </label>
                            <input v-model="serivData.cwo_number" class="form-control"
                                rows="3" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                JO Number
                            </label>
                            <input v-model="serivData.jo_number" class="form-control"
                                rows="3" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Item From <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="stations" label="name" v-model="serivData.item_from" :clearable="false"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Consumer Name <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="serivData.consumer_name" class="form-control"
                                rows="3"> </textarea>
                            <small class="text-danger fst-italic" v-show="serivDataErrors.consumer_name"> {{ errorMsg }}
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Location <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="serivData.location" class="form-control"
                                rows="3"> </textarea>
                            <small class="text-danger fst-italic" v-show="serivDataErrors.location"> {{ errorMsg }}
                            </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Purpose <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="serivData.purpose" class="form-control" rows="3"> </textarea>
                            <small v-if="serivDataErrors.purpose" class="text-danger fst-italic"> {{ errorMsg }} </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requested By <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="serivData.requested_by" :clearable="false"></v-select>
                            </client-only>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">
                                Withdrawn By
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="serivData.withdrawn_by" :clearable="false"></v-select>
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
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/seriv/view/${serivData.id}`">
                                    <i class="fas fa-chevron-left"></i> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM.UPDATE_INFO" @click="updateSerivInfo()" type="button" class="btn btn-success"
                                    :disabled="isUpdating">
                                    <i class="fas fa-sync"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
                                </button>
                                <button v-if="form === FORM.UPDATE_ITEMS" @click="updateSerivItems()" type="button" class="btn btn-success"
                                    :disabled="isUpdatingItems || isDisabledUpdateItemsBtn">
                                    <i class="fas fa-sync"></i> {{ isUpdatingItems ? 'Updating Items...' : 'Update Items' }}
                                </button>
                            </div>
                        </div>
        
                    </div>
                </div>
                
                <WarehouseAddItemModal @add-item="handleAddItem" :items="itemsInModal" :added-item-ids="serivItemIds"/>
        
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
import * as serivApi from '~/composables/warehouse/seriv/seriv.api'
import * as serivApproverApi from '~/composables/warehouse/seriv/seriv-approver.api'
import * as serivItemApi from '~/composables/warehouse/seriv/seriv-item.api'
import { type SERIV, type UpdateSerivInput } from '~/composables/warehouse/seriv/seriv.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Station } from '~/composables/warehouse/station/station';
import type { AddItem, Item } from '~/composables/warehouse/item/item.type';

definePageMeta({
    name: ROUTES.SERIV_UPDATE,
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
const _serivDataErrorsInitial = {
    purpose: false,
    consumer_name: false,
    location: false,
}

const form = ref<FORM>(FORM.UPDATE_INFO)

// DROPDOWNS
const employees = ref<Employee[]>([])
const stations = ref<Station[]>([])
const items = ref<Item[]>([])
const request_types = ref<WarehouseRequestType[]>([])

// FORM DATA
const serivDataErrors = ref({ ..._serivDataErrorsInitial })
const serivData = ref<SERIV>({} as SERIV)



// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await serivApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.seriv) {
        return redirectTo401Page()
    }

    if (!response.seriv.can_update) {
        return redirectTo401Page()
    }

    populateForm(response.seriv)

    stations.value = response.stations
    employees.value = addPropertyFullName(response.employees)
    items.value = response.items
    request_types.value = WAREHOUSE_REQUEST_TYPES.map(i => ({...i}))

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const serivStatus = computed(() => {

    const approvers = serivData.value.seriv_approvers

    if (serivData.value.cancelled_at) {

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

    return serivData.value.seriv_approvers.map(i => {
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

const serivItemIds = computed( () => serivData.value.seriv_items.map(i => i.item.id) )

const itemsInTable = computed( (): AddItem[] => {
    return serivData.value.seriv_items.map(i => {
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

    const serivItems = serivData.value.seriv_items

    if(serivItems.length === 0) {
        return true
    }

    for(let serivItem of serivItems) {

        const availableQty = serivItem.item.total_quantity - serivItem.item.quantity_on_queue

        if(serivItem.quantity <= 0 || serivItem.quantity > availableQty ) {
            return true
        }

    }

    return false
    
})

const showOrNumber = computed( () => {

    if(!serivData.value.request_type) return false 

    return showORnumber(serivData.value.request_type)

})

const showMwoNumber = computed( () => {

    if(!serivData.value.request_type) return false 

    return showMWOnumber(serivData.value.request_type)


})

const showCwoNumber = computed( () => {

    if(!serivData.value.request_type) return false 

    return showCWOnumber(serivData.value.request_type)

})

// ======================== FUNCTIONS ========================  

function populateForm(data: SERIV) {

    data.date_requested = formatToValidHtmlDate(data.date_requested)

    const requestedBy = data.requested_by
    requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)
    
    if(data.withdrawn_by) {
        const withdrawnBy = data.withdrawn_by
        withdrawnBy!['fullname'] = getFullname(withdrawnBy!.firstname, withdrawnBy!.middlename, withdrawnBy!.lastname)
    }

    data.seriv_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    serivData.value = data
    console.log('serivData.value', serivData.value);
}

async function updateSerivInfo() {

    console.log('update')

    if (!isValidSerivInfo()) {
        return
    }

    console.log('updating...')

    const data: UpdateSerivInput = {
        purpose: serivData.value.purpose,
        request_type: {
            id: serivData.value.request_type,
            name: warehouseRequestTypeMapper[serivData.value.request_type]
        },
        requested_by: serivData.value.requested_by,
        withdrawn_by: serivData.value.withdrawn_by,
        item_from: serivData.value.item_from,
        or_number: serivData.value.or_number,
        mwo_number: serivData.value.mwo_number,
        cwo_number: serivData.value.cwo_number,
        jo_number: serivData.value.jo_number,
        consumer_name: serivData.value.consumer_name,
        location: serivData.value.location,

    }

    isUpdating.value = true
    const response = await serivApi.update(serivData.value.id, data)
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

async function updateSerivItems() {
    
    isUpdatingItems.value = true
    const response = await serivItemApi.updateSerivItems(serivData.value.id, serivData.value.seriv_items)
    isUpdatingItems.value = false

    if (response.success) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        serivData.value.seriv_items = response.seriv_items

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
    const response = await serivItemApi.fetchItems()
    isFetchingItems.value = false

    items.value = response.items

}

// ======================== CHILD EVENTS: <WarehouseUpdateApprovers> ========================  

async function handleChangeApprover(payload: {currentApprover: Approver, newApprover: Employee}, closeBtnModal: HTMLButtonElement) {
    console.log('handleChangeApprover', payload);

    const { currentApprover, newApprover } = payload

    isChangingApprover.value = true
    const response = await serivApproverApi.changeApprover(currentApprover.id, newApprover.id)
    isChangingApprover.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        const approverIndx = serivData.value.seriv_approvers.findIndex(i => i.id === response.data?.id)

        if(approverIndx === -1) {
            console.error('Approver not found in seriv approvers with id of ' + response.data.id);
            return 
        }

        serivData.value.seriv_approvers[approverIndx] = {...response.data}

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

    const serivItem = serivData.value.seriv_items.find(i => i.item.id === item.id) 

    if(!serivItem) {
        console.error('Item not found', item.code);
        return 
    }

    serivItem.quantity = qty

}

function handleRemoveItem(item: AddItem) {
    console.log('handleRemoveItem', item);

    const indx = serivData.value.seriv_items.findIndex(i => i.item.id === item.id)

    if(indx === -1) {
        console.error('item not found in serivData.items with id of ', item.id);
        return 
    }

    serivData.value.seriv_items.splice(indx, 1)
}


// ======================== CHILD EVENTS: <WarehouseAddItemModal> ========================  

function handleAddItem(itemId: string) {
    console.log('handleAddItem', itemId);
    const item = items.value.find(i => i.id === itemId)

    if(!item) {
        console.error('item not found');
        return 
    }

    const isExist = serivData.value.seriv_items.find(i => i.item.id === itemId) 

    if(isExist) {
        toast.error('Item exist!')
        return 
    }


    const serivItem = {
        id: '',
        item,
        price: item.GWAPrice,
        quantity: 0,
    }

    // @ts-ignore
    serivData.value.seriv_items.push(serivItem)
    toast.success('Item added!')
}

// ======================== UTILS ========================  

function isValidSerivInfo(): boolean {

    serivDataErrors.value = { ..._serivDataErrorsInitial }

    if(serivData.value.purpose.trim() === '') {
        serivDataErrors.value.purpose = true
    }

    // if (!serivData.value.requested_by) {
    //     serivDataErrors.value.requested_by = true
    // }

    // if (!serivData.value.item_from) {
    //     serivDataErrors.value.item_from = true
    // }

    const hasError = Object.values(serivDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}


</script>
