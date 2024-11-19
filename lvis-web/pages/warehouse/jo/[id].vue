<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && joData && joData.canvass && !joData.cancelled_at" class="mb-3">
                <h2 class="text-warning">Update JO</h2>
                <hr>
        
                <!-- <div v-if="isAdmin(authUser)" class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="isJODetailForm = true">
                                <a class="nav-link" :class="{ 'active': isJODetailForm }" href="#">
                                    <i class="fas fa-info-circle"></i> JO Info
                                </a>
                            </li>
                            <li class="nav-item" @click="isJODetailForm = false">
                                <a class="nav-link" :class="{ 'active': !isJODetailForm }" href="#">
                                    <i class="fas fa-users"></i> Approvers
                                </a>
                            </li>
                        </ul>
                    </div>
                </div> -->
        
                <div v-show="isJODetailForm" class="row justify-content-center">
                    <div class="col-lg-6">
                        
                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>
        
                        <div class="mb-3 d-flex align-items-center">
                            <label class="form-label me-2 mb-0">Status:</label>
                            <div :class="{ [`badge bg-${joStatus.color}`]: true }">
                                {{ joStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                JO Number
                            </label>
                            <input type="text" class="form-control" :value="joData.jo_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/jo/view/' + joData.id" target="_blank">View JO details</nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                RC Number
                            </label>
                            <input type="text" class="form-control" :value="joData.canvass.rc_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/canvass/view/' + joData.canvass.id" target="_blank">View canvass
                                details</nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="joData.date_requested" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner
                            </label>
                            <input :value="joData.canvass.requested_by?.fullname" type="text" class="form-control" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Purpose
                            </label>
                            <textarea :value="joData.canvass.purpose" class="form-control" rows="3" disabled> </textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner Notes
                            </label>
                            <textarea :value="joData.canvass.notes" class="form-control" rows="3" disabled> </textarea>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Imd. Sup. <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="joData.supervisor"
                                    :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="joDataErrors.supervisor"> This field is required
                            </small>
                        </div>
        
                        <div class="mb-3" v-if="isAdmin(authUser)">
                            <label class="form-label">
                                Classification
                            </label>
                            <client-only>
                                <v-select :options="classifications" label="name" v-model="joData.classification"></v-select>
                            </client-only>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Department <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="departments" label="name" v-model="joData.department"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="joDataErrors.department"> This field is required
                            </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Equipment
                            </label>
                            <input type="text" class="form-control" v-model="joData.equipment">
                            <small class="text-danger fst-italic" v-if="joDataErrors.equipment"> This field is required </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Notes
                            </label>
                            <textarea class="form-control" rows="3" v-model="joData.notes"></textarea>
                        </div>
        
        
                    </div>
                </div>
        
                <!-- <div v-show="!isJODetailForm" class="row justify-content-center pt-5">
        
                    <div class="col-12">
                        <WarehouseApprover :approvers="joData.jo_approvers" :employees="employees"
                            :isUpdatingApproverOrder="isUpdatingApproverOrder" :isAddingApprover="isAddingJoApprover"
                            :isEditingApprover="isEditingJoApprover" @changeApproverOrder="changeApproverOrder"
                            @addApprover="addApprover" @editApprover="editApprover" @removeApprover="removeApprover" @searched-employees="handleSearchedEmployees"/>
                    </div>
        
        
                </div> -->
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': isJODetailForm, 'col-12': !isJODetailForm }">
        
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/jo/view/${joData.id}`">
                                    <i class="fas fa-chevron-left"></i> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="isJODetailForm" @click="updateJoInfo()" type="button" class="btn btn-success"
                                    :disabled="isUpdating">
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
import * as joApi from '~/composables/warehouse/jo/jo.api'
import { type JO } from '~/composables/warehouse/jo/jo.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Department } from '~/composables/system/department/department';

definePageMeta({
    name: ROUTES.JO_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// DEPENDENCIES
const route = useRoute()
const toast = useToast();

// FLAGS
const isJODetailForm = ref(true)
const isUpdating = ref(false)
const isUpdatingApproverOrder = ref(false)
const isAddingJoApprover = ref(false)
const isEditingJoApprover = ref(false)

// INITIAL DATA
const _joDataErrorsInitial = {
    supervisor: false,
    department: false,
    equipment: false,
}

// DROPDOWNS
const employees = ref<Employee[]>([])
const classifications = ref<Classification[]>([])
const departments = ref<Department[]>([])


// FORM DATA
const joDataErrors = ref({ ..._joDataErrorsInitial })
const joData = ref<JO>({} as JO)



// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await joApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.jo) {
        return redirectTo401Page()
    }

    if (!response.jo.can_update) {
        return redirectTo401Page()
    }

    populateForm(response.jo)

    employees.value = addPropertyFullName(response.employees)

    classifications.value = response.classifications
    departments.value = response.departments

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const joStatus = computed(() => {

    const approvers = joData.value.jo_approvers

    if (joData.value.cancelled_at) {

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



// ======================== FUNCTIONS ========================  

function populateForm(data: JO) {

    if(!data.canvass) return

    data.date_requested = formatToValidHtmlDate(data.date_requested)

    const requestedBy = data.canvass.requested_by
    requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)

    const supervisor = data.supervisor
    supervisor['fullname'] = getFullname(supervisor.firstname, supervisor.middlename, supervisor.lastname)

    data.jo_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    joData.value = data

}

async function updateJoInfo() {

    console.log('update')

    if (!isValidJoInfo()) {
        return
    }

    console.log('updating...')

    isUpdating.value = true
    const response = await joApi.update(joData.value.id, joData.value)
    isUpdating.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        joData.value.jo_approvers = response.data.jo_approvers.map(i => {
            i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
            i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
            return i
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

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

// handle searched employees from child component (Approver) 
async function handleSearchedEmployees(searchedEmployees: Employee[]) {
    employees.value = addPropertyFullName(searchedEmployees)
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

// ======================== CHILD EVENTS: <WarehouseApprover> ========================  

// async function addApprover(
//     data: CreateApproverInput,
//     modalCloseBtn: HTMLButtonElement
// ) {

//     console.log('data', data)

//     isAddingJoApprover.value = true
//     const response = await joApproverApi.create(joData.value.id, data)
//     isAddingJoApprover.value = false

//     if (response.success && response.data) {
//         toast.success(response.msg)

//         const approver = response.data.approver

//         approver!.fullname = getFullname(approver!.firstname, approver!.middlename, approver!.lastname)

//         response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval, true) : null

//         joData.value.jo_approvers.push(response.data)
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
//     isEditingJoApprover.value = true
//     const response = await joApproverApi.update(data)
//     isEditingJoApprover.value = false

//     if (response.success && response.data) {
//         toast.success(response.msg)

//         const prevApproverItemIndx = joData.value.jo_approvers.findIndex(i => i.id === data.id)

//         response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval, true) : null

//         const a = response.data.approver

//         response.data.approver!['fullname'] = getFullname(a!.firstname, a!.middlename, a!.lastname)

//         joData.value.jo_approvers[prevApproverItemIndx] = { ...response.data }

//         joData.value.supervisor = a!
//         joData.value.supervisor_id = a!.id

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

//     const indx = joData.value.jo_approvers.findIndex(i => i.id === id)

//     const item = joData.value.jo_approvers[indx]

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
//                 const response = await joApproverApi.remove(item.id)

//                 if (response.success) {

//                     toast.success(`${item.approver?.fullname} removed!`)

//                     joData.value.jo_approvers.splice(indx, 1)

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
//     const response = await joApproverApi.updateApproverOrder(data)
//     isUpdatingApproverOrder.value = false

//     if (response.success && response.approvers) {
//         toast.success(response.msg)

//         joData.value.jo_approvers = response.approvers.map(i => {
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

// ======================== UTILS ========================  

function isValidJoInfo(): boolean {

    joDataErrors.value = { ..._joDataErrorsInitial }

    if (!joData.value.supervisor) {
        joDataErrors.value.supervisor = true
    }

    if (!joData.value.department) {
        joDataErrors.value.department = true
    }

    // if (joData.value.equipment.trim() === '') {
    //     joDataErrors.value.equipment = true
    // }

    const hasError = Object.values(joDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);


</script>
