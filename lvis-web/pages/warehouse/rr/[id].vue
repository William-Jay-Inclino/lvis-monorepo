<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && rrData && rrData.po && !rrData.cancelled_at">
                <h2 class="text-warning">Update RR</h2>
                <hr>
        
                <div v-if="isAdmin(authUser)" class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="form = FORM_TYPE.RR_INFO">
                                <a class="nav-link" :class="{ 'active': form === FORM_TYPE.RR_INFO }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> RR Info
                                </a>
                            </li>
                            <li class="nav-item" @click="form = FORM_TYPE.ITEM">
                                <a class="nav-link" :class="{ 'active': form === FORM_TYPE.ITEM }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                            </client-only> Items
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
        
        
                <div v-show="form === FORM_TYPE.RR_INFO" class="row justify-content-center">
        
                    <div class="col-lg-6">

                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>
        
                        <div class="mb-3 d-flex align-items-center">
                            <label class="form-label me-2 mb-0">Status:</label>
                            <div :class="{ [`badge bg-${rrStatus.color}`]: true }">
                                {{ rrStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">RR Number</label>
                            <input type="text" class="form-control" :value="rrData.rr_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/rr/view/' + rrData.id" target="_blank">View RR details</nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">PO Number</label>
                            <input type="text" class="form-control" :value="rrData.po.po_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/po/view/' + rrData.po.id" target="_blank">View PO
                                details</nuxt-link>
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
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="rrData.received_by"
                                    :clearable="false"></v-select>
                            </client-only>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">Notes</label>
                            <textarea v-model="rrData.notes" class="form-control" rows="3"></textarea>
                        </div>
        
                    </div>
        
                </div>
        
                <div v-show="form === FORM_TYPE.ITEM" class="row justify-content-center pt-5">
        
                    <div class="col-12">
        
                        <WarehouseRRItems :rr-items="rrData.rr_items" />
        
                    </div>
        
                </div>

                <hr v-show="form === FORM_TYPE.ITEM">
        
                <div v-show="form === FORM_TYPE.ITEM" class="row justify-content-end">
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
                    <div :class="{ 'col-lg-6': form === FORM_TYPE.RR_INFO, 'col-12': form !== FORM_TYPE.RR_INFO }">
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/rr/view/${rrData.id}`">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM_TYPE.RR_INFO" @click="updateRrInfo()" type="button"
                                    class="btn btn-success" :disabled="isUpdating">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> {{ isUpdating ? 'Updating...' : 'Update' }}
                                </button>
                                <button v-else-if="form === FORM_TYPE.ITEM" type="button" @click="updateRrItems()"
                                    class="btn btn-success" :disabled="isUpdatingRrItems">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> {{ isUpdatingRrItems ? 'Updating...' : 'Update' }}
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
import { useToast } from "vue-toastification";
import type { RR } from '~/composables/warehouse/rr/rr.types';
import * as rrApi from '~/composables/warehouse/rr/rr.api'
import * as rrApproverApi from '~/composables/warehouse/rr/rr-approver.api'
import * as rrItemApi from '~/composables/warehouse/rr/rr-item.api'
import type { Employee } from '~/composables/hr/employee/employee.types';
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { addPropertyFullName } from '~/composables/hr/employee/employee';

definePageMeta({
    name: ROUTES.RR_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const enum FORM_TYPE {
    RR_INFO,
    ITEM,
    APPROVER,
}

// DEPENDENCIES
const route = useRoute()
const router = useRouter();
const toast = useToast();

// FLAGS
const isUpdating = ref(false)
const isUpdatingRrItems = ref(false)
const isUpdatingApproverOrder = ref(false)
const isAddingApprover = ref(false)
const isEditingApprover = ref(false)

const _rrDataErrorsInitial = {
    invoice_number: false,
    delivery_charge: false,
}

const rrData = ref<RR>({} as RR)
const rrDataErrors = ref({ ..._rrDataErrorsInitial })

const employees = ref<Employee[]>([])
const form = ref<FORM_TYPE>(FORM_TYPE.RR_INFO)

// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await rrApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.rr) {
        return redirectTo401Page()
    }

    if (!response.rr.can_update) {
        redirectTo401Page()
    }

    populateForm(response.rr)

    employees.value = addPropertyFullName(response.employees)


    isLoadingPage.value = false

})


// ======================== COMPUTED ========================  

const rrStatus = computed(() => {

    const approvers = rrData.value.rr_approvers

    if (rrData.value.cancelled_at) {

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

const grossTotalSummary = computed(() => {

    let ctr = 0

    for (let item of rrData.value.rr_items) {
        ctr += item.meqs_supplier_item.price * item.quantity_accepted
    }

    return ctr

})


const totalPriceSummary = computed(() => grossTotalSummary.value + rrData.value.delivery_charge)


// ======================== FUNCTIONS ========================  
function populateForm(data: RR) {
    console.log('populateForm', data)

    const emp = data.received_by

    data.received_by.fullname = getFullname(emp.firstname, emp.middlename, emp.lastname)

    rrData.value = data

    data.rr_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })
}

async function updateRrInfo() {
    console.log('updatePoInfo')

    isUpdating.value = true
    const response = await rrApi.update(rrData.value.id, rrData.value)
    isUpdating.value = false

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

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

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



// ======================== CHILD EVENTS: <WarehouseRRItems> ========================  

async function updateRrItems() {
    console.log('updateRrItems')

    console.log('rrData.value.rr_items', rrData.value.rr_items)

    let hasError = false

    for (let item of rrData.value.rr_items) {

        item.isInvalidQtyAccepted = false

        if (!item.quantity_accepted || item.quantity_accepted < 0 || (item.quantity_accepted > item.meqs_supplier_item.canvass_item.quantity)) {
            item.isInvalidQtyAccepted = true
            hasError = true

        }

    }

    if (hasError) return

    console.log('updating rr items...')

    isUpdatingRrItems.value = true
    const response = await rrItemApi.updateRrItems(rrData.value.rr_items)
    isUpdatingRrItems.value = false

    if (response.success) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/rr/view/${rrData.value.id}`);

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

// async function addApprover(
//     data: CreateApproverInput,
//     modalCloseBtn: HTMLButtonElement
// ) {
//     console.log('data', data)

//     isAddingApprover.value = true
//     const response = await rrApproverApi.create(rrData.value.id, data)
//     isAddingApprover.value = false

//     if (response.success && response.data) {
//         toast.success(response.msg)

//         const approver = response.data.approver

//         approver!.fullname = getFullname(approver!.firstname, approver!.middlename, approver!.lastname)

//         response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval, true) : null

//         rrData.value.rr_approvers.push(response.data)
//         modalCloseBtn.click()
//     } else {
//         Swal.fire({
//             title: 'Error!',
//             text: response.msg,
//             icon: 'error',
//             position: 'top',
//         })
//     }
// }

// async function editApprover(
//     data: UpdateApproverInput,
//     modalCloseBtn: HTMLButtonElement
// ) {
//     isEditingApprover.value = true
//     const response = await rrApproverApi.update(data)
//     isEditingApprover.value = false

//     if (response.success && response.data) {
//         toast.success(response.msg)

//         const prevApproverItemIndx = rrData.value.rr_approvers.findIndex(i => i.id === data.id)

//         response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval, true) : null

//         const a = response.data.approver

//         response.data.approver!['fullname'] = getFullname(a!.firstname, a!.middlename, a!.lastname)

//         rrData.value.rr_approvers[prevApproverItemIndx] = { ...response.data }

//         modalCloseBtn.click()

//     } else {
//         Swal.fire({
//             title: 'Error!',
//             text: response.msg,
//             icon: 'error',
//             position: 'top',
//         })
//     }
// }

// async function removeApprover(id: string) {
//     const indx = rrData.value.rr_approvers.findIndex(i => i.id === id)

//     const item = rrData.value.rr_approvers[indx]

//     if (!item) {
//         console.error('approver not found with id of: ' + id)
//         return
//     }

//     Swal.fire({
//         title: "Are you sure?",
//         text: `${item.approver?.fullname} will be removed!`,
//         position: "top",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#e74a3b",
//         cancelButtonColor: "#6c757d",
//         confirmButtonText: "Yes, delete it!",
//         reverseButtons: true,
//         showLoaderOnConfirm: true,
//         preConfirm: async (remove) => {

//             if (remove) {
//                 const response = await rrApproverApi.remove(item.id)

//                 if (response.success) {

//                     toast.success(`${item.approver?.fullname} removed!`)

//                     rrData.value.rr_approvers.splice(indx, 1)

//                 } else {

//                     Swal.fire({
//                         title: 'Error!',
//                         text: response.msg,
//                         icon: 'error',
//                         position: 'top',
//                     })

//                 }
//             }

//         },
//         allowOutsideClick: () => !Swal.isLoading()
//     })
// }

// async function changeApproverOrder(
//     data: { id: string, order: number }[],
//     modalCloseBtn: HTMLButtonElement
// ) {
//     console.log('data', data)
//     console.log('modalCloseBtn', modalCloseBtn)

//     isUpdatingApproverOrder.value = true
//     const response = await rrApproverApi.updateApproverOrder(data)
//     isUpdatingApproverOrder.value = false

//     if (response.success && response.approvers) {
//         toast.success(response.msg)

//         rrData.value.rr_approvers = response.approvers.map(i => {
//             i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
//             i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
//             return i
//         })
//         modalCloseBtn.click()

//     } else {
//         Swal.fire({
//             title: 'Error!',
//             text: response.msg,
//             icon: 'error',
//             position: 'top',
//         })
//     }
// }

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>