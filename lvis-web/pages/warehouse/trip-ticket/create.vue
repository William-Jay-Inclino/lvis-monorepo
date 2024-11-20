<template>

    <div>

            <div v-if="!isLoadingPage && authUser" class="card">
                <div class="card-body">
    
                    <h2 class="text-warning mb-4">Create Trip Ticket</h2>
                    <hr>
            
                    <div class="row justify-content-center pt-5 pb-3">
                        <div class="col-lg-6">

                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic">
                                    Fields with * are required
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Vehicle <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select @option:selected="handleVehicleSelected" :options="vehicles" label="label" v-model="tripData.vehicle" :clearable="false"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="tripDataErrors.vehicle"> {{ errorMsg }}
                                </small>

                                <div v-if="tripData.vehicle">
                                    <table class="table table-primary table-sm small">
                                        <tbody>
                                            <tr>
                                                <td>Vehicle Number</td>
                                                <td> {{ tripData.vehicle.vehicle_number }} </td>
                                            </tr>
                                            <tr>
                                                <td>Plate Number</td>
                                                <td> {{ tripData.vehicle.plate_number }} </td>
                                            </tr>
                                            <tr>
                                                <td>Classification</td>
                                                <td> {{ VehicleClassificationMapper[tripData.vehicle.classification_id] }} </td>
                                            </tr>
                                            <tr>
                                                <td>Date Acquired</td>
                                                <td> {{ formatDate(tripData.vehicle.date_acquired) }} </td>
                                            </tr>
                                            <tr>
                                                <td>Assignee</td>
                                                <td> {{ getFullname(tripData.vehicle.assignee.firstname, tripData.vehicle.assignee.middlename, tripData.vehicle.assignee.lastname) }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Driver <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="employees" label="fullname" v-model="tripData.driver"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="tripDataErrors.vehicle"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Passengers <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="passengers" v-model="tripData.passengers" multiple taggable></v-select>
                                </client-only>
                                <!-- <textarea v-model="tripData.passengers" class="form-control" rows="3"> </textarea> -->
                                <small class="text-danger fst-italic" v-if="tripDataErrors.passengers"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Destination <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="tripData.destination" class="form-control" rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-if="tripDataErrors.destination"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Purpose <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="tripData.purpose" class="form-control" rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-if="tripDataErrors.purpose"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="mb-3">

                                <div class="alert" :class="{'alert-info': !tripDataErrors.tripType, 'alert-danger': tripDataErrors.tripType}" role="alert">
                                    <small class="fst-italic"> Please check atleast 1 </small>
                                </div>

                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="tripData.is_operation" @change="handleOperationToggle">
                                    <label class="form-check-label">
                                        Operation
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="tripData.is_stay_in">
                                    <label class="form-check-label">
                                        Stay In
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox"  v-model="tripData.is_personal">
                                    <label class="form-check-label">
                                        Personal
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox"  v-model="tripData.is_out_of_coverage">
                                    <label class="form-check-label">
                                        Out of Coverage
                                    </label>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label">
                                    Prepared By <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="employees" label="fullname" v-model="tripData.prepared_by"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="tripDataErrors.prepared_by"> {{ errorMsg }}
                                </small>
                            </div>

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-users"></i> Signatories
                                </h5>
                                <hr class="result">
                            </div>

                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic"> If Operation is checked, no GM/OIC approval is needed </small>
                            </div>

                            <div v-for="approver in tripData.approvers" class="mb-4">

                                <label class="form-label">
                                    {{ approver.label }} <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select
                                        :options="employees"
                                        label="fullname"
                                        v-model="approver.approver"
                                        :clearable="false"
                                        :disabled="approver.order === 1 || approver.order === 4 || approver.order == 3"
                                    ></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="approver.showRequiredMsg"> {{ errorMsg }} </small>
                            </div>

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-calendar-alt"></i> Trip Schedule
                                </h5>
                                <hr class="result">
                            </div>

                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic">
                                    <div>
                                        - Departure should be greater than the current date.
                                    </div>
                                    <div>
                                        - Arrival should be greater than the Estimated Departure.
                                    </div>
                                    <div>
                                        - Trip schedule depends on vehicle and driver availability.
                                    </div>
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Departure <span class="text-danger">*</span>
                                </label>
                                <input type="datetime-local" class="form-control" v-model="tripData.start_time">
                                <small class="text-danger fst-italic" v-if="tripDataErrors.start_time"> {{ errorMsg }} </small>
                                <small class="text-danger fst-italic" v-else-if="tripDataErrors.start_time2">
                                    Departure must be later than the current time
                                </small>
                            </div>

                            <div class="mb-5">
                                <label class="form-label">
                                    Arrival <span class="text-danger">*</span>
                                </label>
                                <input type="datetime-local" class="form-control" v-model="tripData.end_time">
                                <small class="text-danger fst-italic" v-if="tripDataErrors.end_time"> {{ errorMsg }} </small>
                                <small class="text-danger fst-italic" v-else-if="tripDataErrors.end_time2">
                                    Arrival must be later than departure
                                </small>
                            </div>
    
                            <div class="d-flex justify-content-between">
                                <nuxt-link class="btn btn-secondary" to="/warehouse/trip-ticket">
                                    <i class="fas fa-search"></i> Search Trip Ticket
                                </nuxt-link>
                                <button @click="save()" type="button" class="btn btn-primary" :disabled="isSaving">
                                    <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
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
import * as tripApi from '~/composables/warehouse/trip-ticket/trip-ticket.api'
import type { TripTicket, CreateTripTicket } from '~/composables/warehouse/trip-ticket/trip-ticket.types';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import { TRIP_TICKET_DEFAULT_APPROVERS } from '~/composables/warehouse/trip-ticket/trip-ticket.constants';
import { VEHICLE_STATUS, VehicleClassificationMapper } from '~/composables/warehouse/vehicle/vehicle.enums';

definePageMeta({
    name: ROUTES.TRIP_TICKET_CREATE,
    layout: "layout-warehouse",
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
const _tripDataErrorsInitial = {
    vehicle: false,
    driver: false,
    passengers: false,
    destination: false,
    purpose: false,
    start_time: false,
    start_time2: false,
    end_time: false,
    end_time2: false,

    // "is" fields (operation, stay_in, personal, out_of_coverage) should have atleast 1 check
    tripType: false,
    prepared_by: false,
}

// FORM DATA
const tripData = ref<CreateTripTicket>({
    vehicle: null,
    driver: null,
    passengers: [],
    destination: '',
    purpose: '',
    start_time: '',
    end_time: '',
    is_operation: false,
    is_stay_in: false,
    is_personal: false,
    is_out_of_coverage: false,
    prepared_by: null,
    approvers: [],
})
const tripDataErrors = ref({ ..._tripDataErrorsInitial })

const generalManager = ref<Employee>()

// DROPDOWNS
const employees = ref<Employee[]>([])
const vehicles = ref<Vehicle[]>([])


// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await tripApi.fetchFormDataInCreate()

    employees.value = addPropertyFullName(response.employees)
    vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))

    isLoadingPage.value = false

    tripData.value.approvers = TRIP_TICKET_DEFAULT_APPROVERS.map(i => ({...i}))

    // set default fmsd_chief
    if(response.fmsd_chief) {
        const dispatchedBy = tripData.value.approvers.find(i => i.order === 3)
        if(dispatchedBy) {
            dispatchedBy.approver = response.fmsd_chief
            dispatchedBy.approver['fullname'] = getFullname(dispatchedBy.approver.firstname, dispatchedBy.approver.middlename, dispatchedBy.approver.lastname)
        }
    }

    // set default general_manager
    if(response.general_manager) {

        generalManager.value = response.general_manager

        const gm = tripData.value.approvers.find(i => i.order === 4)
        if(gm) {
            gm.approver = response.general_manager
            gm.approver['fullname'] = getFullname(gm.approver.firstname, gm.approver.middlename, gm.approver.lastname)
        }
    }

})



// ======================== COMPUTED ========================  


const passengers = computed( () => {
    return employees.value.map(i => i.firstname + " " + i.lastname)
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

    console.log('saving...', tripData.value)

    isSaving.value = true
    const response = await tripApi.create(tripData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/trip-ticket/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

function handleVehicleSelected(vehicle: Vehicle) {
    console.log('handleVehicleSelected', vehicle);

    const approverIndx = tripData.value.approvers.findIndex(i => i.order === 1)

    if(approverIndx === -1) {
        console.error('approver with order: 1 not found');
        return 
    }

    const assignee = {...vehicle.assignee}

    tripData.value.approvers[approverIndx].approver = assignee
    tripData.value.approvers[approverIndx].approver['fullname'] = getFullname(assignee.firstname, assignee.middlename, assignee.lastname)
}

function handleOperationToggle() {

    // remove GM / OIC in the approvers
    if(tripData.value.is_operation === true) {
        const indx = tripData.value.approvers.findIndex(i => i.order === 4)

        if(indx === -1) {
            console.error('order with value 4 not found in approvers');
            return 
        }

        tripData.value.approvers.splice(indx, 1)

    } 
    
    // add GM / OIC in approvers
    else {

        const gmApprover = TRIP_TICKET_DEFAULT_APPROVERS.find(i => i.order === 4)

        if(!gmApprover) {
            console.error('Order with value of 4 not found in TRIP_TICKET_DEFAULT_APPROVERS');
            return 
        }

        gmApprover.approver = {...generalManager.value!}

        tripData.value.approvers.push(gmApprover)

    }



}

// ======================== UTILS ========================  

function isValid(): boolean {

    tripDataErrors.value = { ..._tripDataErrorsInitial }

    if(!tripData.value.vehicle) {
        tripDataErrors.value.vehicle = true
    }

    if(!tripData.value.driver) {
        tripDataErrors.value.driver = true
    }

    if(tripData.value.passengers.length === 0) {
        tripDataErrors.value.passengers = true
    }

    if(tripData.value.destination.trim() === '') {
        tripDataErrors.value.destination = true
    }

    if(tripData.value.purpose.trim() === '') {
        tripDataErrors.value.purpose = true
    }

    if(!tripData.value.start_time || tripData.value.start_time.trim() === '') {
        tripDataErrors.value.start_time = true
    }

    if(!tripData.value.end_time || tripData.value.end_time.trim() === '') {
        tripDataErrors.value.end_time = true
    }

    if(!tripData.value.prepared_by) {
        tripDataErrors.value.prepared_by = true
    }

    const hasNoTripType = !tripData.value.is_operation && !tripData.value.is_stay_in && !tripData.value.is_personal && !tripData.value.is_out_of_coverage

    if(hasNoTripType) {
        tripDataErrors.value.tripType = true 
    }

    const isValidStartTime = new Date(tripData.value.start_time) > new Date()
    const isValidEndTime = new Date(tripData.value.end_time) > new Date(tripData.value.start_time)

    if(!isValidStartTime) {
        tripDataErrors.value.start_time2 = true
    }

    if(!isValidEndTime) {
        tripDataErrors.value.end_time2 = true
    }

    for(let i of tripData.value.approvers) {
        if(!i.approver) {
            i.showRequiredMsg = true
        } else {
            i.showRequiredMsg = false 
        }
    }

    const hasErrorApprovers = tripData.value.approvers.some(i => i.showRequiredMsg === true)
    const hasError = Object.values(tripDataErrors.value).includes(true);

    if (hasError || hasErrorApprovers) {
        return false
    }

    return true

}


</script>
