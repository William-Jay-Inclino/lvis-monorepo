<template>

    <div>

            <div v-if="!isLoadingPage && authUser" class="card">
                <div class="card-body">
    
                    <h2 class="text-warning mb-4">Create Gas Slip</h2>
                    <hr>
            
                    <div class="row justify-content-center pt-5 pb-3">
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
                                <div>
                                    <small class="fst-italic"> 
                                        - Make sure the number of unposted gas slip of vehicle is less than 5 to continue <span class="fw-bold">(except private vehicle)</span>
                                    </small>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Vehicle <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select data-testid="vehicle" @search="handleSearchVehicles" :options="vehicles" label="label" v-model="gsData.vehicle" :clearable="false"></v-select>
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
                                    Date <span class="text-danger">*</span>
                                </label>
                                <input data-testid="date" type="date" class="form-control" v-model="gsData.used_on">
                                <small class="text-danger fst-italic" v-if="gsDataErrors.used_on"> {{ errorMsg }}
                                </small>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">
                                    Requisitioner <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select data-testid="requisitioner" :options="employees" label="fullname" v-model="gsData.requested_by"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="gsDataErrors.requested_by"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Authorized Driver <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select data-testid="driver" :options="employees" label="fullname" v-model="gsData.driver"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="gsDataErrors.vehicle"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Gas Station <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select data-testid="gas-station" :options="gas_stations" label="name" v-model="gsData.gas_station"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="gsDataErrors.gas_station"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Type of Fuel <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select data-testid="fuel-type" :options="fuel_types" label="name" v-model="gsData.fuel_type"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="gsDataErrors.fuel_type"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    No. of Liters: <span class="text-danger">*</span>
                                </label>
                                <input data-testid="no-of-liters" type="text" class="form-control" v-model="gsData.liter_in_text">
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
                                <textarea data-testid="purpose" v-model="gsData.purpose" class="form-control form-control-sm" rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-if="gsDataErrors.purpose"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'users']"/>
                            </client-only> Signatories
                                </h5>
                                <hr class="result">
                            </div>

                            <div v-for="approver, indx in gsData.approvers" class="mb-4">
                                <label class="form-label">
                                    {{ approver.label }} <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select
                                        :data-testid="`approver-${ indx }`"
                                        :options="getApproverOptions(approver.order)"
                                        label="fullname"
                                        v-model="approver.approver"
                                        :clearable="false"
                                    ></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="approver.showRequiredMsg"> {{ errorMsg }} </small>
                            </div>

                            <div class="d-flex justify-content-between">
                                <nuxt-link class="btn btn-secondary" to="/motorpool/gas-slip">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'search']" />
                                    </client-only> 
                                    Search Gas Slip
                                </nuxt-link>
                                <button data-testid="save" @click="save()" type="button" class="btn btn-primary" :disabled="isSaveDisabled || isSaving">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'save']"/>
                                    </client-only> {{ isSaving ? 'Saving...' : 'Save' }}
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



</template>


<script setup lang="ts">

import Swal from 'sweetalert2'
import { getFullname } from '~/utils/helpers'
import * as gsApi from '~/composables/motorpool/gas-slip/gas-slip.api'
import type { CreateGasSlip } from '~/composables/motorpool/gas-slip/gas-slip.types';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import { GAS_SLIP_DEFAULT_APPROVERS } from '~/composables/motorpool/gas-slip/gas-slips.constants';
import { VEHICLE_CLASSIFICATION, VehicleClassificationMapper } from '~/composables/motorpool/vehicle/vehicle.enums';
import { fetchVehicles } from '~/composables/motorpool/vehicle/vehicle.api';

definePageMeta({
    name: ROUTES.GAS_SLIP_CREATE,
    layout: "layout-motorpool",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// CONSTANTS
const router = useRouter();

// FLAGS
const isSaving = ref(false)
const errorMsg = 'This field is required'

// INITIAL DATA
const _gsDataErrorsInitial = {
    vehicle: false,
    driver: false,
    gas_station: false,
    fuel_type: false,
    requested_by: false,
    liter_in_text: false,
    purpose: false,
    used_on: false,
}

// FORM DATA
const gsData = ref<CreateGasSlip>({
    vehicle: null,
    driver: null,
    gas_station: null,
    fuel_type: null,
    requested_by: null,
    with_container: false,
    liter_in_text: '',
    purpose: '',
    used_on: '',
    approvers: [],
})
const gsDataErrors = ref({ ..._gsDataErrorsInitial })

// DROPDOWNS
const employees = ref<Employee[]>([])
const department_heads = ref<Employee[]>([])
const vehicles = ref<Vehicle[]>([])
const gas_stations = ref<GasStation[]>([])
const fuel_types = ref<FuelType[]>([])


// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await gsApi.fetchFormDataInCreate()

    employees.value = addPropertyFullName(response.employees)
    department_heads.value = addPropertyFullName(response.department_heads)
    vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
    fuel_types.value = response.fuel_types
    gas_stations.value = response.gas_stations

    isLoadingPage.value = false
    
    gsData.value.approvers = GAS_SLIP_DEFAULT_APPROVERS.map(i => ({...i}))

})



// ======================== COMPUTED ========================  

const isSaveDisabled = computed( () => {

    if(isSaving.value) return true 

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

async function save() {

    console.log('save')

    if (!isValid()) {
        Swal.fire({
            title: 'Error Saving!',
            text: 'Please check the form for errors.',
            icon: 'warning',
            position: 'top',
        })
        return
    }

    console.log('saving...', gsData.value)

    isSaving.value = true
    const response = await gsApi.create(gsData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/motorpool/gas-slip/view/${response.data.id}`);
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

function isValid(): boolean {

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
    
    if(!gsData.value.used_on || gsData.value.used_on.trim() === '') {
        gsDataErrors.value.used_on = true
    }

    for(let i of gsData.value.approvers) {
        if(!i.approver) {
            i.showRequiredMsg = true
        } else {
            i.showRequiredMsg = false 
        }
    }

    const hasErrorApprovers = gsData.value.approvers.some(i => i.showRequiredMsg === true)
    const hasError = Object.values(gsDataErrors.value).includes(true);

    if (hasError || hasErrorApprovers) {
        return false
    }

    return true

}

function getApproverOptions(order: number) {
    if(order === 1) {
        return supervisors.value
    }
    if(order === 2) {
        return department_heads.value
    }
    return employees.value
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
