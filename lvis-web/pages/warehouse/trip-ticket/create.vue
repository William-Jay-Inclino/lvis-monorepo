<template>

    <div v-if="!isLoadingPage && authUser">

        <h2 class="text-warning mb-4">Create Trip Ticket</h2>

        <div class="row">

            <div class="col">
                <div class="card">
                    <div class="card-body">
        
                        <h5 class="text-warning">Trip Details</h5>
                        <hr>
                
                        <div class="row pb-3">
                            <div class="col">
                                <div class="row justify-content-center pt-3">
                
                                    <div class="col-lg-10">
        
                                        <div class="mb-3">
                                            <label class="form-label">
                                                Vehicle <span class="text-danger">*</span>
                                            </label>
                                            <client-only>
                                                <v-select @option:selected="handleVehicleSelected" :options="vehicles" label="name" v-model="tripData.vehicle" :clearable="false"></v-select>
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
                                                Passengers
                                            </label>
                                            <textarea v-model="tripData.passengers" class="form-control" rows="3"> </textarea>
                                        </div>
        
                                        <div class="mb-3">
                                            <label class="form-label">
                                                Destination
                                            </label>
                                            <textarea v-model="tripData.destination" class="form-control" rows="3"> </textarea>
                                        </div>
        
                                        <div class="mb-3">
                                            <label class="form-label">
                                                Purpose
                                            </label>
                                            <textarea v-model="tripData.purpose" class="form-control" rows="3"> </textarea>
                                        </div>
        
                                        <div class="mb-3">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="operation">
                                                <label class="form-check-label">
                                                    Operation
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="operation">
                                                <label class="form-check-label">
                                                    Stay In
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="operation">
                                                <label class="form-check-label">
                                                    Personal
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="operation">
                                                <label class="form-check-label">
                                                    Out of Coverage
                                                </label>
                                            </div>
                                        </div>
        
                                        <div class="mb-4">
                                            <label class="form-label">
                                                Prepared By
                                            </label>
                                            <input type="text" class="form-control" v-model="tripData.prepared_by">
                                        </div>
        
                                        <div class="h5wrapper mb-3">
                                            <hr class="result">
                                            <h5 class="text-warning fst-italic">
                                                <i class="fas fa-users"></i> Signatories
                                            </h5>
                                            <hr class="result">
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
        
                                        <div class="mb-3">
                                            <label class="form-label">
                                                Estimated Departure
                                            </label>
                                            <input type="datetime-local" class="form-control" v-model="tripData.start_time">
                                            <small class="text-danger fst-italic" v-show="tripDataErrors.start_time"> {{ errorMsg }} </small>
                                        </div>
        
                                        <div class="mb-5">
                                            <label class="form-label">
                                                Estimated Arrival
                                            </label>
                                            <input type="datetime-local" class="form-control" v-model="tripData.end_time">
                                            <small class="text-danger fst-italic" v-show="tripDataErrors.end_time"> {{ errorMsg }} </small>
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
                        
                    </div>
                </div>
            </div>

            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="text-warning">
                            Scheduled trips for this day  {{ formatDate(new Date()) }}
                        </h5>
                        <hr>

                        <div class="responsive">
                            <table class="table table-bordered table-hover table-sm small">
                                <thead>
                                    <tr>
                                        <th>Trip Number</th>
                                        <th>Driver</th>
                                        <th>Departure Time</th>
                                        <th>Arrival Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="trip in scheduledTripsToday">
                                        <td> {{ trip.trip_number }} </td>
                                        <td> {{ getFullname(trip.driver.firstname, trip.driver.middlename, trip.driver.lastname) }} </td>
                                        <td> {{ formatTimeTo12Hour(trip.start_time) }} </td>
                                        <td> {{ formatTimeTo12Hour(trip.end_time) }} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>



    </div>

    <div v-else>
        <LoaderSpinner />
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
    end_time: false,

    // "is" fields (operation, stay_in, personal, out_of_coverage) should have atleast 1 check
    tripType: false,
    prepared_by: false,
}

// FORM DATA
const tripData = ref<CreateTripTicket>({
    vehicle: null,
    driver: null,
    passengers: '',
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


// DROPDOWNS
const employees = ref<Employee[]>([])
const vehicles = ref<Vehicle[]>([])
const scheduledTripsToday = ref<TripTicket[]>([])


// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await tripApi.fetchFormDataInCreate()

    employees.value = addPropertyFullName(response.employees)
    vehicles.value = response.vehicles
    scheduledTripsToday.value = response.scheduledTripsToday

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
        const gm = tripData.value.approvers.find(i => i.order === 4)
        if(gm) {
            gm.approver = response.general_manager
            gm.approver['fullname'] = getFullname(gm.approver.firstname, gm.approver.middlename, gm.approver.lastname)
        }
    }

})



// ======================== COMPUTED ========================  




// ======================== FUNCTIONS ========================  

async function save() {

    console.log('save')

    if (!isValid()) {
        return
    }

    console.log('saving...')

    // isSaving.value = true
    // const response = await tripApi.create(rvData.value)
    // isSaving.value = false

    // if (response.success && response.data) {

    //     Swal.fire({
    //         title: 'Success!',
    //         text: response.msg,
    //         icon: 'success',
    //         position: 'top',
    //     })

    //     router.push(`/warehouse/rv/view/${response.data.id}`);
    // } else {
    //     Swal.fire({
    //         title: 'Error!',
    //         text: response.msg,
    //         icon: 'error',
    //         position: 'top',
    //     })
    // }

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

// ======================== UTILS ========================  

function isValid(): boolean {

    return false
    // rvDataErrors.value = { ..._rvDataErrorsInitial }

    // if (!rvData.value.canvass) {
    //     rvDataErrors.value.canvass = true
    // }

    // if (!rvData.value.supervisor) {
    //     rvDataErrors.value.supervisor = true
    // }

    // const hasError = Object.values(rvDataErrors.value).includes(true);

    // if (hasError) {
    //     return false
    // }

    // return true

}


</script>
