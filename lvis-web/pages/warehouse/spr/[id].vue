<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && sprData && sprData.canvass && !sprData.cancelled_at" class="mb-3">
                <h2 class="text-warning">Update SPR</h2>
                <hr>
        
                <!-- <div v-if="isAdmin(authUser)" class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="isSPRDetailForm = true">
                                <a class="nav-link" :class="{ 'active': isSPRDetailForm }" href="#">
                                    <i class="fas fa-info-circle"></i> SPR Info
                                </a>
                            </li>
                            <li class="nav-item" @click="isSPRDetailForm = false">
                                <a class="nav-link" :class="{ 'active': !isSPRDetailForm }" href="#">
                                    <i class="fas fa-users"></i> Approvers
                                </a>
                            </li>
                        </ul>
                    </div>
                </div> -->
        
                <div v-show="isSPRDetailForm" class="row justify-content-center">
                    <div class="col-lg-6">
        
        
                        <div class="mb-3 d-flex align-items-center">
                            <label class="form-label me-2 mb-0">Status:</label>
                            <div :class="{ [`badge bg-${sprStatus.color}`]: true }">
                                {{ sprStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                SPR Number
                            </label>
                            <input type="text" class="form-control" :value="sprData.spr_number" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                RC Number
                            </label>
                            <input type="text" class="form-control" :value="sprData.canvass.rc_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/canvass/view/' + sprData.canvass.id" target="_blank">View canvass
                                details</nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="sprData.date_requested" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner
                            </label>
                            <input :value="sprData.canvass.requested_by?.fullname" type="text" class="form-control" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Purpose
                            </label>
                            <textarea :value="sprData.canvass.purpose" class="form-control" rows="3" disabled> </textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner Notes
                            </label>
                            <textarea :value="sprData.canvass.notes" class="form-control" rows="3" disabled> </textarea>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Imd. Sup. <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="sprData.supervisor"
                                    :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="sprDataErrors.supervisor"> This field is required
                            </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Vehicle <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="vehicles" label="name" v-model="sprData.vehicle"
                                    :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="sprDataErrors.vehicle"> This field is required
                            </small>
                        </div>
        
                        <div class="mb-3" v-if="isAdmin(authUser)">
                            <label class="form-label">
                                Classification
                            </label>
                            <client-only>
                                <v-select :options="classifications" label="name" v-model="sprData.classification"></v-select>
                            </client-only>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Notes
                            </label>
                            <textarea class="form-control" rows="3" v-model="sprData.notes"></textarea>
                        </div>
        
        
                    </div>
                </div>
        
                <!-- <div v-show="!isSPRDetailForm" class="row justify-content-center pt-5">
        
                    <div class="col-12">
                        <WarehouseApprover :approvers="sprData.spr_approvers" :employees="employees"
                            :isUpdatingApproverOrder="isUpdatingApproverOrder" :isAddingApprover="isAddingSprApprover"
                            :isEditingApprover="isEditingSprApprover" @changeApproverOrder="changeApproverOrder"
                            @addApprover="addApprover" @editApprover="editApprover" @removeApprover="removeApprover" @searched-employees="handleSearchedEmployees"/>
                    </div>
        
        
                </div> -->
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': isSPRDetailForm, 'col-12': !isSPRDetailForm }">
        
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/spr/view/${sprData.id}`">
                                    <i class="fas fa-chevron-left"></i> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="isSPRDetailForm" @click="updateSprInfo()" type="button" class="btn btn-success"
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
import { getFullname, formatToValidHtmlDate } from '~/utils/helpers'
import { useToast } from "vue-toastification";
import * as sprApi from '~/composables/warehouse/spr/spr.api'
import * as sprApproverApi from '~/composables/warehouse/spr/spr-approver.api'
import { type SPR } from '~/composables/warehouse/spr/spr.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';

definePageMeta({
    name: ROUTES.SPR_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})


const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)


// DEPENDENCIES
const route = useRoute()
const toast = useToast();

// FLAGS
const isSPRDetailForm = ref(true)
const isUpdating = ref(false)
const isUpdatingApproverOrder = ref(false)
const isAddingSprApprover = ref(false)
const isEditingSprApprover = ref(false)

// INITIAL DATA
const _sprDataErrorsInitial = {
    supervisor: false,
    vehicle: false,
}

// DROPDOWNS
const employees = ref<Employee[]>([])
const classifications = ref<Classification[]>([])
const vehicles = ref<Vehicle[]>([])


// FORM DATA
const sprDataErrors = ref({ ..._sprDataErrorsInitial })
const sprData = ref<SPR>({} as SPR)



// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await sprApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.spr) {
        return redirectTo401Page()
    }

    if (!response.spr.can_update) {
        redirectTo401Page()
    }

    populateForm(response.spr)

    employees.value = addPropertyFullName(response.employees)

    classifications.value = response.classifications
    vehicles.value = response.vehicles

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const sprStatus = computed(() => {

    const approvers = sprData.value.spr_approvers

    if (sprData.value.cancelled_at) {

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

function populateForm(data: SPR) {

    if(!data.canvass) return 

    data.date_requested = formatToValidHtmlDate(data.date_requested)

    const requestedBy = data.canvass.requested_by
    requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)

    const supervisor = data.supervisor
    supervisor['fullname'] = getFullname(supervisor.firstname, supervisor.middlename, supervisor.lastname)

    data.spr_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    sprData.value = data

}

async function updateSprInfo() {

    console.log('update')

    if (!isValidSprInfo()) {
        return
    }

    console.log('updating...')

    isUpdating.value = true
    const response = await sprApi.update(sprData.value.id, sprData.value)
    isUpdating.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        sprData.value.spr_approvers = response.data.spr_approvers.map(i => {
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

async function addApprover(
    data: CreateApproverInput,
    modalCloseBtn: HTMLButtonElement
) {

    console.log('data', data)

    isAddingSprApprover.value = true
    const response = await sprApproverApi.create(sprData.value.id, data)
    isAddingSprApprover.value = false

    if (response.success && response.data) {
        toast.success(response.msg)

        const approver = response.data.approver

        approver!.fullname = getFullname(approver!.firstname, approver!.middlename, approver!.lastname)

        response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval, true) : null

        sprData.value.spr_approvers.push(response.data)
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
    isEditingSprApprover.value = true
    const response = await sprApproverApi.update(data)
    isEditingSprApprover.value = false

    if (response.success && response.data) {
        toast.success(response.msg)

        const prevApproverItemIndx = sprData.value.spr_approvers.findIndex(i => i.id === data.id)

        response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval, true) : null

        const a = response.data.approver

        response.data.approver!['fullname'] = getFullname(a!.firstname, a!.middlename, a!.lastname)

        sprData.value.spr_approvers[prevApproverItemIndx] = { ...response.data }

        sprData.value.supervisor = a!
        sprData.value.supervisor_id = a!.id

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

    const indx = sprData.value.spr_approvers.findIndex(i => i.id === id)

    const item = sprData.value.spr_approvers[indx]

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
                const response = await sprApproverApi.remove(item.id)

                if (response.success) {

                    toast.success(`${item.approver?.fullname} removed!`)

                    sprData.value.spr_approvers.splice(indx, 1)

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
    const response = await sprApproverApi.updateApproverOrder(data)
    isUpdatingApproverOrder.value = false

    if (response.success && response.approvers) {
        toast.success(response.msg)

        sprData.value.spr_approvers = response.approvers.map(i => {
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

// ======================== UTILS ========================  

// async function onCancelSpr() {

//     Swal.fire({
//         title: "Are you sure?",
//         text: `This SPR will be cancelled!`,
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
//                 await cancelSpr()
//             }

//         },
//         allowOutsideClick: () => !Swal.isLoading()
//     })

// }

function isValidSprInfo(): boolean {

    sprDataErrors.value = { ..._sprDataErrorsInitial }

    if (!sprData.value.supervisor) {
        sprDataErrors.value.supervisor = true
    }

    const hasError = Object.values(sprDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>
