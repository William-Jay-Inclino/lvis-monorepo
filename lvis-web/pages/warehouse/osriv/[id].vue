<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && osrivData && !osrivData.cancelled_at" class="mb-3">

                <h2 class="text-warning">Update OSRIV</h2>

                <hr>

                <div class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="form = FORM.UPDATE_INFO">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_INFO }" href="#">
                                    <i class="fas fa-info-circle"></i> OSRIV Info
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
                            <div :class="{ [`badge bg-${osrivStatus.color}`]: true }">
                                {{ osrivStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                OSRIV Number
                            </label>
                            <input type="text" class="form-control" :value="osrivData.osriv_number" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="osrivData.date_requested" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Item From <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="stations" label="name" v-model="osrivData.item_from" :clearable="false"></v-select>
                            </client-only>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Purpose <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="osrivData.purpose" class="form-control" rows="3"> </textarea>
                            <small v-if="osrivDataErrors.purpose" class="text-danger fst-italic"> {{ errorMsg }} </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="osrivData.requested_by" :clearable="false"></v-select>
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

                        <WarehouseUpdateApprovers :disabled_orders="[2]" :is-updating="isChangingApprover" :approvers="approvers" :employees="employees" @change-approver="handleChangeApprover"/>
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
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/osriv/view/${osrivData.id}`">
                                    <i class="fas fa-chevron-left"></i> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM.UPDATE_INFO" @click="updateOsrivInfo()" type="button" class="btn btn-success"
                                    :disabled="isUpdating">
                                    <i class="fas fa-sync"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
                                </button>
                                <button v-if="form === FORM.UPDATE_ITEMS" @click="updateOsrivItems()" type="button" class="btn btn-success"
                                    :disabled="isUpdatingItems || isDisabledUpdateItemsBtn">
                                    <i class="fas fa-sync"></i> {{ isUpdatingItems ? 'Updating Items...' : 'Update Items' }}
                                </button>
                            </div>
                        </div>
        
                    </div>
                </div>
                
                <WarehouseAddItemModal @add-item="handleAddItem" :items="itemsInModal" :added-item-ids="osrivItemIds"/>
        
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
import * as osrivApi from '~/composables/warehouse/osriv/osriv.api'
import * as osrivApproverApi from '~/composables/warehouse/osriv/osriv-approver.api'
import * as osrivItemApi from '~/composables/warehouse/osriv/osriv-item.api'
import { type OSRIV } from '~/composables/warehouse/osriv/osriv.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Station } from '~/composables/warehouse/station/station';
import type { AddItem, Item } from '~/composables/warehouse/item/item.type';

definePageMeta({
    name: ROUTES.OSRIV_UPDATE,
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
const _osrivDataErrorsInitial = {
    // requested_by: false,
    purpose: false,
    // item_from: false,
}

const form = ref<FORM>(FORM.UPDATE_INFO)

// DROPDOWNS
const employees = ref<Employee[]>([])
const stations = ref<Station[]>([])
const items = ref<Item[]>([])


// FORM DATA
const osrivDataErrors = ref({ ..._osrivDataErrorsInitial })
const osrivData = ref<OSRIV>({} as OSRIV)



// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await osrivApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.osriv) {
        return redirectTo401Page()
    }

    if (!response.osriv.can_update) {
        return redirectTo401Page()
    }

    populateForm(response.osriv)

    stations.value = response.stations
    employees.value = addPropertyFullName(response.employees)
    items.value = response.items

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const osrivStatus = computed(() => {

    const approvers = osrivData.value.osriv_approvers

    if (osrivData.value.cancelled_at) {

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

    return osrivData.value.osriv_approvers.map(i => {
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

const osrivItemIds = computed( () => osrivData.value.osriv_items.map(i => i.item.id) )

const itemsInTable = computed( (): AddItem[] => {
    return osrivData.value.osriv_items.map(i => {
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

    const osrivItems = osrivData.value.osriv_items

    if(osrivItems.length === 0) {
        return true
    }

    for(let osrivItem of osrivItems) {

        const availableQty = osrivItem.item.total_quantity - osrivItem.item.quantity_on_queue

        if(osrivItem.quantity <= 0 || osrivItem.quantity > availableQty ) {
            return true
        }

    }

    return false
    
})

// ======================== FUNCTIONS ========================  

function populateForm(data: OSRIV) {

    data.date_requested = formatToValidHtmlDate(data.date_requested)

    const requestedBy = data.requested_by
    requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)

    data.osriv_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    osrivData.value = data
    console.log('osrivData.value', osrivData.value);
}

async function updateOsrivInfo() {

    console.log('update')

    if (!isValidOsrivInfo()) {
        return
    }

    console.log('updating...')

    isUpdating.value = true
    const response = await osrivApi.update(osrivData.value.id, osrivData.value)
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

async function updateOsrivItems() {
    
    isUpdatingItems.value = true
    const response = await osrivItemApi.updateOsrivItems(osrivData.value.id, osrivData.value.osriv_items)
    isUpdatingItems.value = false

    if (response.success) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        osrivData.value.osriv_items = response.osriv_items

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
    const response = await osrivItemApi.fetchItems()
    isFetchingItems.value = false

    items.value = response.items

}

// ======================== CHILD EVENTS: <WarehouseUpdateApprovers> ========================  

async function handleChangeApprover(payload: {currentApprover: Approver, newApprover: Employee}, closeBtnModal: HTMLButtonElement) {
    console.log('handleChangeApprover', payload);

    const { currentApprover, newApprover } = payload

    isChangingApprover.value = true
    const response = await osrivApproverApi.changeApprover(currentApprover.id, newApprover.id)
    isChangingApprover.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        const approverIndx = osrivData.value.osriv_approvers.findIndex(i => i.id === response.data?.id)

        if(approverIndx === -1) {
            console.error('Approver not found in osriv approvers with id of ' + response.data.id);
            return 
        }

        osrivData.value.osriv_approvers[approverIndx] = {...response.data}

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

    const osrivItem = osrivData.value.osriv_items.find(i => i.item.id === item.id) 

    if(!osrivItem) {
        console.error('Item not found', item.code);
        return 
    }

    osrivItem.quantity = qty

}

function handleRemoveItem(item: AddItem) {
    console.log('handleRemoveItem', item);

    const indx = osrivData.value.osriv_items.findIndex(i => i.item.id === item.id)

    if(indx === -1) {
        console.error('item not found in osrivData.items with id of ', item.id);
        return 
    }

    osrivData.value.osriv_items.splice(indx, 1)
}


// ======================== CHILD EVENTS: <WarehouseAddItemModal> ========================  

function handleAddItem(itemId: string) {
    console.log('handleAddItem', itemId);
    const item = items.value.find(i => i.id === itemId)

    if(!item) {
        console.error('item not found');
        return 
    }

    const isExist = osrivData.value.osriv_items.find(i => i.item.id === itemId) 

    if(isExist) {
        toast.error('Item exist!')
        return 
    }


    const osrivItem = {
        id: '',
        item,
        price: item.GWAPrice,
        quantity: 0,
    }

    // @ts-ignore
    osrivData.value.osriv_items.push(osrivItem)
    toast.success('Item added!')
}

// ======================== UTILS ========================  

function isValidOsrivInfo(): boolean {

    osrivDataErrors.value = { ..._osrivDataErrorsInitial }

    if(osrivData.value.purpose.trim() === '') {
        osrivDataErrors.value.purpose = true
    }

    // if (!osrivData.value.requested_by) {
    //     osrivDataErrors.value.requested_by = true
    // }

    // if (!osrivData.value.item_from) {
    //     osrivDataErrors.value.item_from = true
    // }

    const hasError = Object.values(osrivDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}


</script>
