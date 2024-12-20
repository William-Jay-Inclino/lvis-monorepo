<template>

    <div>

            <div v-if="!isLoadingPage && authUser" class="card">
                <div class="card-body">
    
                    <h2 class="text-warning mb-4">Create PMS Record</h2>
                    <hr>
            
                    <div class="row justify-content-center pt-5 pb-3">
                        <div class="col-lg-8">

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
                                <div class="row">
                                    <div class="col-6">
                                        <label class="form-label">
                                            Service Date <span class="text-danger">*</span>
                                        </label>
                                        <input type="date" class="form-control" v-model="vmData.service_date">
                                        <small class="text-danger fst-italic" v-if="vmDataErrors.service_date"> {{ errorMsg }}
                                        </small>
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label">
                                            Next Service Date <span class="text-danger">*</span>
                                        </label>
                                        <input type="date" class="form-control" v-model="vmData.next_service_date">
                                        <small class="text-danger fst-italic" v-if="vmDataErrors.next_service_date"> {{ errorMsg }}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <div class="row">
                                    <div class="col-6">
                                        <label class="form-label">
                                            Service Mileage <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="form-control" v-model="vmData.service_mileage">
                                        <small class="text-danger fst-italic" v-if="vmDataErrors.service_mileage"> {{ errorMsg }}
                                        </small>
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label">
                                            Next Service Mileage <span class="text-danger">*</span>
                                        </label>
                                        <input type="form" class="form-control" v-model="vmData.next_service_mileage">
                                        <small class="text-danger fst-italic" v-if="vmDataErrors.next_service_mileage"> {{ errorMsg }}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Cost <span class="text-danger">*</span>
                                </label>
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">₱</span>
                                    <input type="number" v-model="vmData.cost" class="form-control" rows="3">
                                </div>
                                <small class="text-danger fst-italic" v-if="vmDataErrors.cost"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Performed By <span class="text-danger">*</span>
                                </label>
                                <input type="text" v-model="vmData.performed_by" class="form-control" rows="3">
                                <small class="text-danger fst-italic" v-if="vmDataErrors.performed_by"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-4">
                                <label class="form-label">
                                    Remarks <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="vmData.remarks" class="form-control" rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-if="vmDataErrors.remarks"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'wrench']"/>
                                    </client-only> Services
                                </h5>
                                <hr class="result">
                            </div>

                            <div class="row mb-3">
                                <div class="col">
                                    <div class="alert alert-info" role="alert">
                                        <small class="fst-italic">
                                            <div>
                                                - Check the box if it is included in the PMS services.
                                            </div>
                                            <div>
                                                - If the service is not on the list, click the <b>Add Service button</b> to add a new service.
                                            </div>
                                            <div class="text-danger ms-3">
                                                Note: This service will be added to the database.
                                            </div>
                                            <div class="ms-3 mt-2">
                                                <button @click="onClickAddService()" class="btn btn-sm btn-success">Add Service</button>
                                            </div>
                                        </small>
                                    </div>
                                    <MotorpoolServices :services="vmData.services" />

                                    <div class="row mt-3">
                                        <div class="col">
                                            <label class="label mb-3">Services checked:</label>
                                            <ul class="list-group">
                                                <li v-for="item in checked_services" class="list-group-item fs-6 py-1">
                                                    {{ item.service.name }}
                                                    <span class="badge bg-success rounded-pill float-end">
                                                        <client-only>
                                                            <font-awesome-icon :icon="['fas', 'check']" />
                                                        </client-only>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="checked_services.length === 0" class="alert alert-danger" role="alert">
                                No services selected! Please check at least one.
                            </div>

                            <div class="row mt-4">
                                <div class="col">
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
import * as vehicleServiceApi from '~/composables/motorpool/vehicle-service/vehicle-service.api'

definePageMeta({
    name: ROUTES.VEHICLE_MAINTENANCE_CREATE,
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


// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await vmApi.fetchFormDataInCreate()

    vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
    service_centers.value = response.service_centers 
    vmData.value.services = response.services.map(i => {
        return {
            service: i,
            note: '',
            isChecked: false
        }
    })

    isLoadingPage.value = false
    

})



// ======================== COMPUTED ========================  

const checked_services = computed( () => {
    return vmData.value.services.filter(i => i.isChecked)
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

    const data: CreateVehicleMaintenance = {
        vehicle: vmData.value.vehicle,
        service_center: vmData.value.service_center,
        service_date: vmData.value.service_date,
        service_mileage: vmData.value.service_mileage,
        next_service_date: vmData.value.next_service_date,
        next_service_mileage: vmData.value.next_service_mileage,
        cost: vmData.value.cost,
        remarks: vmData.value.remarks,
        performed_by: vmData.value.performed_by,
        services: checked_services.value,
    }

    console.log('data', data);

    isSaving.value = true
    const response = await vmApi.create(data)
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

function onClickAddService() {

    Swal.fire({
        title: "Add Service",
        text: `Note: This service will be added to the database.`,
        input: 'text',
        inputValue: '',
        inputPlaceholder: 'Enter service name...',
        position: "top",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Add",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to enter a name!';
            }
        },
        preConfirm: async (confirm) => {

            const inputValue = Swal.getInput()?.value;
            const name = inputValue || '';

            const response = await vehicleServiceApi.create({ name })

            if (response.success) {

                Swal.fire({
                    text: response.msg,
                    icon: 'success',
                    position: 'top',
                });

                vmData.value.services.unshift({
                    service: response.data!,
                    note: '',
                    isChecked: true
                })

            } else {

                Swal.fire({
                    title: 'Error!',
                    text: response.msg,
                    icon: 'error',
                    position: 'top',
                })

            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

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

    if(vmData.value.service_mileage <= 0) {
        vmDataErrors.value.service_mileage = true
    }

    if(!vmData.value.next_service_date || vmData.value.next_service_date.trim() === '') {
        vmDataErrors.value.next_service_date = true
    }

    if(vmData.value.next_service_mileage <= 0) {
        vmDataErrors.value.next_service_mileage = true
    }

    if(vmData.value.cost < 0) {
        vmDataErrors.value.cost = true
    }

    if(vmData.value.remarks.trim() === '') {
        vmDataErrors.value.remarks = true
    }

    if(vmData.value.performed_by.trim() === '') {
        vmDataErrors.value.performed_by = true
    }
    
    const hasError = Object.values(vmDataErrors.value).includes(true);

    if (hasError || checked_services.value.length === 0) {
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
