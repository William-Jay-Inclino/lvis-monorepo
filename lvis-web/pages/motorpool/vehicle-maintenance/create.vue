<template>

    <div>

            <div v-if="!isLoadingPage && authUser" class="card">
                <div class="card-body">
    
                    <h2 class="text-warning mb-4">Create Vehicle Maintenance</h2>
                    <hr>
            
                    <div class="row justify-content-center pt-5 pb-3">
                        <div class="col-lg-6">

                            <div class="alert alert-info" role="alert">
                                <div>
                                    <small class="fst-italic">
                                        Fields with * are required
                                    </small>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Vehicle <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select @search="handleSearchVehicles" :options="vehicles" label="label" v-model="vmData.vehicle" :clearable="false"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="vmDataErrors.vehicle"> {{ errorMsg }}
                                </small>

                                <div v-if="vmData.vehicle">
                                    <table class="table table-primary table-sm small">
                                        <tbody>
                                            <tr>
                                                <td>Vehicle Number</td>
                                                <td> {{ vmData.vehicle.vehicle_number }} </td>
                                            </tr>
                                            <tr>
                                                <td>Plate Number</td>
                                                <td> {{ vmData.vehicle.plate_number }} </td>
                                            </tr>
                                            <tr>
                                                <td>Classification</td>
                                                <td> {{ VehicleClassificationMapper[vmData.vehicle.classification_id] }} </td>
                                            </tr>
                                            <tr>
                                                <td>Date Acquired</td>
                                                <td> {{ formatDate(vmData.vehicle.date_acquired) }} </td>
                                            </tr>
                                            <tr>
                                                <td>Assignee</td>
                                                <td> {{ getFullname(vmData.vehicle.assignee.firstname, vmData.vehicle.assignee.middlename, vmData.vehicle.assignee.lastname) }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Service Center <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="service_centers" label="name" v-model="vmData.service_center"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="vmDataErrors.service_center"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Remarks <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="vmData.remarks" class="form-control" rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-if="vmDataErrors.remarks"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="d-flex justify-content-between">
                                <nuxt-link class="btn btn-secondary" to="/motorpool/vehicle-maintenance">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                                </client-only> 
                                    Search PMS
                                </nuxt-link>
                                <button @click="save()" type="button" class="btn btn-primary" :disabled="isSaving">
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
import * as vmApi from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.api'
import type { CreateVehicleMaintenance } from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.types';
import { fetchVehicles } from '~/composables/motorpool/vehicle/vehicle.api';
import type { ServiceCenter } from '~/composables/motorpool/service-center/service-center.types';
import { VehicleClassificationMapper } from '~/composables/motorpool/vehicle/vehicle.enums';
import type { VehicleService } from '~/composables/motorpool/vehicle-service/vehicle-service.types';

definePageMeta({
    name: ROUTES.VEHICLE_SERVICE_INDEX,
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
const _vmDataErrorsInitial = {
    vehicle: false,
    service_center: false,
    service_date: false,
    service_mileage: false,
    next_service_date: false,
    next_service_mileage: false,
    cost: false,
    remarks: false,
    performed_by: false,
    services: false,
}

// FORM DATA
const vmData = ref<CreateVehicleMaintenance>({
    vehicle: null,
    service_center: null,
    service_date: '',
    service_mileage: 0,
    next_service_date: '',
    next_service_mileage: 0,
    cost: 0,
    remarks: '',
    performed_by: '',
    services: [],
})
const vmDataErrors = ref({ ..._vmDataErrorsInitial })

// DROPDOWNS
const vehicles = ref<Vehicle[]>([])
const service_centers = ref<ServiceCenter[]>([])
const services = ref<VehicleService[]>([])


// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await vmApi.fetchFormDataInCreate()

    vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
    service_centers.value = response.service_centers 
    services.value = response.services

    isLoadingPage.value = false
    

})



// ======================== COMPUTED ========================  

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

    console.log('saving...', vmData.value)

    isSaving.value = true
    const response = await vmApi.create(vmData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/motorpool/vehicle-maintenance/view/${response.data.id}`);
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

    vmDataErrors.value = { ..._vmDataErrorsInitial }

    if(!vmData.value.vehicle) {
        vmDataErrors.value.vehicle = true
    }

    if(!vmData.value.service_center) {
        vmDataErrors.value.service_center = true
    }

    if(!vmData.value.service_date || vmData.value.service_date.trim() === '') {
        vmDataErrors.value.service_date = true
    }

    if(!vmData.value.service_mileage || vmData.value.service_mileage <= 0) {
        vmDataErrors.value.service_mileage = true
    }

    if(!vmData.value.next_service_date || vmData.value.next_service_date.trim() === '') {
        vmDataErrors.value.next_service_date = true
    }

    if(!vmData.value.next_service_mileage || vmData.value.next_service_mileage <= 0) {
        vmDataErrors.value.next_service_mileage = true
    }

    if(!vmData.value.cost || vmData.value.cost <= 0) {
        vmDataErrors.value.cost = true
    }

    if(vmData.value.remarks.trim() === '') {
        vmDataErrors.value.remarks = true
    }

    if(vmData.value.performed_by.trim() === '') {
        vmDataErrors.value.performed_by = true
    }

    if(vmData.value.services.length === 0) {
        vmDataErrors.value.services = true
    }
    

    const hasError = Object.values(vmDataErrors.value).includes(true);

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
