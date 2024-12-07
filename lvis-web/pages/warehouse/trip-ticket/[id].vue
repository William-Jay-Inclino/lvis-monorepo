<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && tripData && tripTicket && !tripTicket.cancelled_at" class="mb-3">

                <h2 class="text-warning">Update Trip Ticket</h2>

                <hr>

                <div class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="form = FORM.UPDATE_INFO">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_INFO }" href="#">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> Trip Ticket Info
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
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>
                        
                        <div class="mb-3 d-flex align-items-center">
                            <label class="form-label me-2 mb-0">Status:</label>
                            <div :class="{ [`badge bg-${tripStatus.color}`]: true }">
                                {{ tripStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Trip Number
                            </label>
                            <input type="text" class="form-control" :value="tripTicket.trip_number" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Vehicle <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select @search="handleSearchVehicles" :options="vehicles" label="label" v-model="tripData.vehicle" :clearable="false"></v-select>
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
                                <v-select :options="employees" label="fullname" v-model="tripData.driver" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="tripDataErrors.driver"> {{ errorMsg }}
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Passengers
                            </label>
                            <client-only>
                                <v-select :options="passengers" v-model="tripData.passengers" multiple taggable></v-select>
                            </client-only>
                            <!-- <small class="text-danger fst-italic" v-if="tripDataErrors.passengers"> {{ errorMsg }}
                            </small> -->
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
                            <small v-if="tripDataErrors.purpose" class="text-danger fst-italic"> {{ errorMsg }} </small>
                        </div>

                        <div class="mb-3">

                            <div class="alert" :class="{'alert-info': !tripDataErrors.tripType, 'alert-danger': tripDataErrors.tripType}" role="alert">
                                <small class="fst-italic"> Please check atleast 1 </small>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="tripData.is_operation">
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
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'calendar-alt']" />
                            </client-only> Trip Schedule
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
                          :disabled_orders="[1, 3, 4]"
                          :supervisor_orders="[2]"
                          @change-approver="handleChangeApprover" />
                    </div>
                </div>
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': form === FORM.UPDATE_INFO || form === FORM.UPDATE_APPROVERS }">
        
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/trip-ticket/view/${tripTicket.id}`">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM.UPDATE_INFO" @click="updateTripInfo()" type="button" class="btn btn-success"
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
import { useToast } from "vue-toastification";
import * as tripApi from '~/composables/warehouse/trip-ticket/trip-ticket.api'
import * as tripApproverApi from '~/composables/warehouse/trip-ticket/trip-ticket-approver.api'
import { type TripTicket, type UpdateTripTicket } from '~/composables/warehouse/trip-ticket/trip-ticket.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import { VehicleClassificationMapper } from '~/composables/warehouse/vehicle/vehicle.enums';
import { fetchVehicles } from '~/composables/warehouse/vehicle/vehicle.api';

definePageMeta({
    name: ROUTES.TRIP_TICKET_UPDATE,
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
const _tripDataErrorsInitial = {
    vehicle: false,
    driver: false,
    // passengers: false,
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

const form = ref<FORM>(FORM.UPDATE_INFO)

// DROPDOWNS
const employees = ref<Employee[]>([])
const vehicles = ref<Vehicle[]>([])


// FORM DATA
const tripDataErrors = ref({ ..._tripDataErrorsInitial })
const tripData = ref<UpdateTripTicket>({} as UpdateTripTicket)
const tripTicket = ref<TripTicket>({} as TripTicket)


// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await tripApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.trip_ticket) {
        return redirectTo401Page()
    }

    if(!response.trip_ticket.can_update) {
        return redirectTo401Page()
    }

    vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
    employees.value = addPropertyFullName(response.employees)
    tripTicket.value = {...response.trip_ticket}

    response.trip_ticket.driver['fullname'] = getFullname(response.trip_ticket.driver.firstname, response.trip_ticket.driver.middlename, response.trip_ticket.driver.lastname)
    response.trip_ticket.prepared_by['fullname'] = getFullname(response.trip_ticket.prepared_by.firstname, response.trip_ticket.prepared_by.middlename, response.trip_ticket.prepared_by.lastname)
    response.trip_ticket.vehicle['label'] = `${response.trip_ticket.vehicle.vehicle_number} ${response.trip_ticket.vehicle.name}`

    tripData.value = {
        vehicle: response.trip_ticket.vehicle,
        driver: response.trip_ticket.driver,
        passengers: response.trip_ticket.passengers
        ? response.trip_ticket.passengers.split(",").map(p => p.trim()).filter(p => p) // Split and sanitize
        : [], // Default to an empty array if null or undefined
        destination: response.trip_ticket.destination,
        purpose: response.trip_ticket.purpose,
        start_time: formatToValidHtmlDate(response.trip_ticket.start_time, true),
        end_time: formatToValidHtmlDate(response.trip_ticket.end_time, true),
        is_operation: response.trip_ticket.is_operation,
        is_stay_in: response.trip_ticket.is_stay_in,
        is_personal: response.trip_ticket.is_personal,
        is_out_of_coverage: response.trip_ticket.is_out_of_coverage,
        prepared_by: response.trip_ticket.prepared_by,
    }

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const tripStatus = computed(() => {

    const approvers = tripTicket.value.trip_ticket_approvers

    if (tripTicket.value.cancelled_at) {

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

    return tripTicket.value.trip_ticket_approvers.map(i => {
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

const passengers = computed( () => {
    return employees.value.map(i => i.firstname + " " + i.lastname)
})

const supervisors = computed(() => {
    return employees.value.filter(i => i.rank_number >= SUPERVISOR_MIN_RANK)
})

// ======================== FUNCTIONS ========================  

async function updateTripInfo() {

    console.log('update')

    if (!isValidTripInfo()) {
        return
    }

    console.log('updating...')

    isUpdating.value = true
    const response = await tripApi.update(tripTicket.value.id, tripData.value)
    isUpdating.value = false

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

// ======================== CHILD EVENTS: <WarehouseUpdateApprovers> ========================  

async function handleChangeApprover(payload: {currentApprover: Approver, newApprover: Employee}, closeBtnModal: HTMLButtonElement) {
    console.log('handleChangeApprover', payload);

    const { currentApprover, newApprover } = payload

    isChangingApprover.value = true
    const response = await tripApproverApi.changeApprover(currentApprover.id, newApprover.id)
    isChangingApprover.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        const approverIndx = tripTicket.value.trip_ticket_approvers.findIndex(i => i.id === response.data?.id)

        if(approverIndx === -1) {
            console.error('Approver not found in trip ticket approvers with id of ' + response.data.id);
            return 
        }

        tripTicket.value.trip_ticket_approvers[approverIndx] = {...response.data}

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

function isValidTripInfo(): boolean {

    tripDataErrors.value = { ..._tripDataErrorsInitial }

    if(!tripData.value.vehicle) {
        tripDataErrors.value.vehicle = true
    }

    if(!tripData.value.driver) {
        tripDataErrors.value.driver = true
    }

    // if(tripData.value.passengers.length === 0) {
    //     tripDataErrors.value.passengers = true
    // }

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


    const hasError = Object.values(tripDataErrors.value).includes(true);

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
