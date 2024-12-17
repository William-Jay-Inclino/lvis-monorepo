<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && sprData && sprData.canvass && !sprData.cancelled_at" class="mb-3">
                <h2 class="text-warning">Update SPR</h2>
                <hr>
        
                <div v-show="isSPRDetailForm" class="row justify-content-center">
                    <div class="col-lg-6">
                        
                        <div class="alert alert-info" role="alert">
                            <div>
                                <small class="fst-italic">
                                    - Fields with * are required
                                </small>
                            </div>
                            <div>
                                <small class="fst-italic">
                                    - Only employees with a rank higher than {{ SUPERVISOR_MIN_RANK - 1 }} are included as options in the <b>Imd. Sup.</b> field.
                                </small>
                            </div>
                        </div>
        
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
                                <v-select @search="handleSearchEmployees" :options="supervisors" label="fullname" v-model="sprData.supervisor"
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
                                <v-select @search="handleSearchVehicles" :options="vehicles" label="label" v-model="sprData.vehicle"
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
                                <v-select @search="handleSearchClassifications" :options="classifications" label="name" v-model="sprData.classification"></v-select>
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
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': isSPRDetailForm, 'col-12': !isSPRDetailForm }">
        
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/spr/view/${sprData.id}`">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="isSPRDetailForm" @click="updateSprInfo()" type="button" class="btn btn-success"
                                    :disabled="isUpdating">
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
import { getFullname, formatToValidHtmlDate } from '~/utils/helpers'
import * as sprApi from '~/composables/warehouse/spr/spr.api'
import { type SPR } from '~/composables/warehouse/spr/spr.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import { fetchClassificationsByName } from '~/composables/accounting/classification/classification.api';
import { fetchVehicles } from '~/composables/warehouse/vehicle/vehicle.api';

definePageMeta({
    name: ROUTES.SPR_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})


const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)


// DEPENDENCIES
const route = useRoute()
const router = useRouter();

// FLAGS
const isSPRDetailForm = ref(true)
const isUpdating = ref(false)

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
    vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))

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


const supervisors = computed(() => {
    return employees.value.filter(i => i.rank_number >= SUPERVISOR_MIN_RANK)
})


// ======================== FUNCTIONS ========================  

function populateForm(data: SPR) {

    if(!data.canvass) return 

    data.date_requested = formatToValidHtmlDate(data.date_requested)

    data.vehicle['label'] = data.vehicle.vehicle_number + ' ' + data.vehicle.name

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
        Swal.fire({
            title: 'Form has errors!',
            text: 'Please review the form and correct the errors.',
            icon: 'error',
            position: 'top',
        })
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

        router.push(`/warehouse/spr/view/${response.data.id}`);

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

async function handleSearchClassifications(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        classifications.value = []
        return 
    } 

    debouncedSearchClassifications(input, loading)

}

async function handleSearchVehicles(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        vehicles.value = []
        return 
    } 

    debouncedSearchVehicles(input, loading)

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

async function searchClassifications(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchClassificationsByName(input);
        classifications.value = response
    } catch (error) {
        console.error('Error fetching Classifications:', error);
    } finally {
        loading(false);
    }
}

async function searchVehicles(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchVehicles(input);
        vehicles.value = response.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
    } catch (error) {
        console.error('Error fetching Vehicles:', error);
    } finally {
        loading(false);
    }
}

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

const debouncedSearchClassifications = debounce((input: string, loading: (status: boolean) => void) => {
    searchClassifications(input, loading);
}, 500);

const debouncedSearchVehicles = debounce((input: string, loading: (status: boolean) => void) => {
    searchVehicles(input, loading);
}, 500);

</script>
