<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && gsData && gasSlip && !gasSlip.cancelled_at" class="mb-3">

                <h2 class="text-warning">Update Gas Slip</h2>

                <hr>

                <div class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="form = FORM.UPDATE_INFO">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_INFO }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> Gas Slip Info
                                </a>
                            </li>
                            <li class="nav-item" @click="form = FORM.UPDATE_APPROVERS">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_APPROVERS }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'users']"/>
                            </client-only> Signatories
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
        
                <div v-show="form === FORM.UPDATE_INFO" class="row justify-content-center">
                    <div class="col-lg-6">
                        
                        <div class="alert alert-info" role="alert">
                            <div>
                                <small class="fst-italic">
                                    - Fields with * are required
                                </small>
                            </div>
                            <div>
                                <small class="fst-italic"> 
                                    - Make sure the number of unposted gas slip of vehicle is less than 5 to continue <span class="fw-bold">(except private vehicle)</span>
                                </small>
                            </div>
                        </div>
                    
                        <div class="mb-3 d-flex align-items-center">
                            <label class="form-label me-2 mb-0">Status:</label>
                            <div :class="{ [`badge bg-${gsStatus.color}`]: true }">
                                {{ gsStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Gas Slip Number
                            </label>
                            <input type="text" class="form-control" :value="gasSlip.gas_slip_number" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Vehicle <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select @search="handleSearchVehicles" :options="vehicles" label="label" v-model="gsData.vehicle" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="gsDataErrors.vehicle"> {{ errorMsg }}
                            </small>

                            <div v-if="gsData.vehicle">
                                <table class="table table-primary table-sm small">
                                    <tbody>
                                        <tr>
                                            <td>Vehicle Number</td>
                                            <td> {{ gsData.vehicle.vehicle_number }} </td>
                                        </tr>
                                        <tr>
                                            <td>Plate Number</td>
                                            <td> {{ gsData.vehicle.plate_number }} </td>
                                        </tr>
                                        <tr>
                                            <td>Classification</td>
                                            <td> {{ VehicleClassificationMapper[gsData.vehicle.classification_id] }} </td>
                                        </tr>
                                        <tr>
                                            <td>Date Acquired</td>
                                            <td> {{ formatDate(gsData.vehicle.date_acquired) }} </td>
                                        </tr>
                                        <tr>
                                            <td>Assignee</td>
                                            <td> {{ getFullname(gsData.vehicle.assignee.firstname, gsData.vehicle.assignee.middlename, gsData.vehicle.assignee.lastname) }} </td>
                                        </tr>
                                        <tr class="table-danger">
                                            <td class="text-danger fw-bold">Unposted Gas Slips</td>
                                            <td class="text-danger fw-bold"> {{ gsData.vehicle.total_unposted_gas_slips }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="gsData.requested_by" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="gsDataErrors.requested_by"> {{ errorMsg }}
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Authorized Driver <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="gsData.driver" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="gsDataErrors.vehicle"> {{ errorMsg }}
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Gas Station <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="gas_stations" label="name" v-model="gsData.gas_station" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="gsDataErrors.gas_station"> {{ errorMsg }}
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Type of Fuel <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="fuel_types" label="name" v-model="gsData.fuel_type" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="gsDataErrors.fuel_type"> {{ errorMsg }}
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                No. of Liters: <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="gsData.liter_in_text">
                            <small class="text-danger fst-italic" v-if="gsDataErrors.liter_in_text"> {{ errorMsg }}
                            </small>
                        </div>

                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="gsData.with_container">
                                <label class="form-check-label">
                                    With Container
                                </label>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Purpose <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="gsData.purpose" class="form-control" rows="3"> </textarea>
                            <small class="text-danger fst-italic" v-if="gsDataErrors.purpose"> {{ errorMsg }}
                            </small>
                        </div>

                    </div>
                </div>

                <div v-show="form === FORM.UPDATE_APPROVERS" class="row justify-content-center">
                    <div class="col-lg-6">
                        <div class="alert alert-info" role="alert">
                            <div>
                                <small class="fst-italic">
                                    - A signatory with a pending status can only be changed.
                                </small>
                            </div>
                            <div>
                                <small class="fst-italic">
                                    - Only employees with a rank higher than {{ SUPERVISOR_MIN_RANK - 1 }} are included as options in the <b>Imd. Sup.</b> field.
                                </small>
                            </div>
                        </div>

                        <WarehouseUpdateApprovers
                          :is-updating="isChangingApprover"
                          :approvers="approvers"
                          :supervisors="supervisors"
                          :employees="employees"
                          :department_heads="department_heads"
                          :supervisor_orders="[1]"
                          :department_head_orders="[2]"
                          @change-approver="handleChangeApprover" />
                    </div>
                </div>
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': form === FORM.UPDATE_INFO || form === FORM.UPDATE_APPROVERS }">
        
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/gas-slip/view/${gasSlip.id}`">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM.UPDATE_INFO" @click="updateGsInfo()" type="button" class="btn btn-success"
                                    :disabled="isUpdating || isSaveDisabled">
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
import { getFullname } from '~/utils/helpers'
import { useToast } from "vue-toastification";
import * as gsApi from '~/composables/warehouse/gas-slip/gas-slip.api'
import * as gsApproverApi from '~/composables/warehouse/gas-slip/gas-slip-approver.api'
import { type GasSlip, type UpdateGasSlip } from '~/composables/warehouse/gas-slip/gas-slip.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import { VEHICLE_CLASSIFICATION, VehicleClassificationMapper } from '~/composables/warehouse/vehicle/vehicle.enums';
import { fetchVehicles } from '~/composables/warehouse/vehicle/vehicle.api';

definePageMeta({
    name: ROUTES.GAS_SLIP_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const enum FORM {
    UPDATE_INFO,
    UPDATE_APPROVERS,
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
const isChangingApprover = ref(false)
const isLoadingPage = ref(true)

// INITIAL DATA
const _gsDataErrorsInitial = {
    vehicle: false,
    driver: false,
    gas_station: false,
    fuel_type: false,
    requested_by: false,
    liter_in_text: false,
    purpose: false,
}

const form = ref<FORM>(FORM.UPDATE_INFO)

// DROPDOWNS
const employees = ref<Employee[]>([])
const department_heads = ref<Employee[]>([])
const vehicles = ref<Vehicle[]>([])
const gas_stations = ref<GasStation[]>([])
const fuel_types = ref<FuelType[]>([])

// FORM DATA
const gsDataErrors = ref({ ..._gsDataErrorsInitial })
const gsData = ref<UpdateGasSlip>({} as UpdateGasSlip)
const gasSlip = ref<GasSlip>({} as GasSlip)


// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await gsApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.gas_slip) {
        return redirectTo401Page()
    }

    if(!response.gas_slip.can_update) {
        return redirectTo401Page()
    }

    gas_stations.value = response.gas_stations
    fuel_types.value = response.fuel_types
    vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
    department_heads.value = addPropertyFullName(response.department_heads)
    employees.value = addPropertyFullName(response.employees)
    gasSlip.value = {...response.gas_slip}

    response.gas_slip.driver['fullname'] = getFullname(response.gas_slip.driver.firstname, response.gas_slip.driver.middlename, response.gas_slip.driver.lastname)
    response.gas_slip.requested_by['fullname'] = getFullname(response.gas_slip.requested_by.firstname, response.gas_slip.requested_by.middlename, response.gas_slip.requested_by.lastname)
    response.gas_slip.vehicle['label'] = `${response.gas_slip.vehicle.vehicle_number} ${response.gas_slip.vehicle.name}`


    gsData.value = {
        vehicle: response.gas_slip.vehicle,
        driver: response.gas_slip.driver,
        gas_station: response.gas_slip.gas_station,
        fuel_type: response.gas_slip.fuel_type,
        requested_by: response.gas_slip.requested_by,
        with_container: response.gas_slip.with_container,
        liter_in_text: response.gas_slip.liter_in_text,
        purpose: response.gas_slip.purpose,
    }

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const gsStatus = computed(() => {

    const approvers = gasSlip.value.gas_slip_approvers

    if (gasSlip.value.cancelled_at) {

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

    return gasSlip.value.gas_slip_approvers.map(i => {
        return {
            id: i.id,
            approver: i.approver!,
            date_approval: i.date_approval,
            notes: i.notes,
            status: i.status,
            label: i.label,
            order: i.order,
        }
    })

})

const isSaveDisabled = computed( () => {

    if(isUpdating.value) return true 

    // should only validate total unposted gaslips greater than 5 if non private vehicle
    if(gsData.value.vehicle && gsData.value.vehicle.total_unposted_gas_slips >= 5 && gsData.value.vehicle.classification_id !== VEHICLE_CLASSIFICATION.PRIVATE) {
        return true 
    }

    return false

})


const supervisors = computed(() => {
    return employees.value.filter(i => i.rank_number >= SUPERVISOR_MIN_RANK)
})



// ======================== FUNCTIONS ========================  

async function updateGsInfo() {

    console.log('update')

    if (!isValidGsInfo()) {
        return
    }

    console.log('updating...')

    isUpdating.value = true
    const response = await gsApi.update(gasSlip.value.id, gsData.value)
    isUpdating.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })
        router.push(`/warehouse/gas-slip/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

// ======================== CHILD EVENTS: <WarehouseUpdateApprovers> ========================  

async function handleChangeApprover(payload: {currentApprover: Approver, newApprover: Employee}, closeBtnModal: HTMLButtonElement) {
    console.log('handleChangeApprover', payload);

    const { currentApprover, newApprover } = payload

    isChangingApprover.value = true
    const response = await gsApproverApi.changeApprover(currentApprover.id, newApprover.id)
    isChangingApprover.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        const approverIndx = gasSlip.value.gas_slip_approvers.findIndex(i => i.id === response.data?.id)

        if(approverIndx === -1) {
            console.error('Approver not found in trip ticket approvers with id of ' + response.data.id);
            return 
        }

        gasSlip.value.gas_slip_approvers[approverIndx] = {...response.data}

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
// ======================== UTILS ========================  

function isValidGsInfo(): boolean {

    gsDataErrors.value = { ..._gsDataErrorsInitial }

    if(!gsData.value.vehicle) {
        gsDataErrors.value.vehicle = true
    }

    if(!gsData.value.driver) {
        gsDataErrors.value.driver = true
    }

    if(!gsData.value.gas_station) {
        gsDataErrors.value.gas_station = true
    }

    if(!gsData.value.fuel_type) {
        gsDataErrors.value.fuel_type = true
    }

    if(!gsData.value.requested_by) {
        gsDataErrors.value.requested_by = true
    }

    if(gsData.value.liter_in_text.trim() === '') {
        gsDataErrors.value.liter_in_text = true
    }

    if(gsData.value.purpose.trim() === '') {
        gsDataErrors.value.purpose = true
    }

    const hasError = Object.values(gsDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}


async function handleSearchVehicles(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        vehicles.value = []
        return 
    } 

    debouncedSearchVehicles(input, loading)

}

async function searchVehicles(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchVehicles(input);
        vehicles.value = response.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
    } catch (error) {
        console.error('Error fetching Employees:', error);
    } finally {
        loading(false);
    }
}

const debouncedSearchVehicles = debounce((input: string, loading: (status: boolean) => void) => {
    searchVehicles(input, loading);
}, 500);

</script>
