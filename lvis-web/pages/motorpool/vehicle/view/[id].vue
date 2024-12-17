<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center pt-3">
        
                <div class="col-lg-9">
        
                    <div v-if="item">
        
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> Vehicle Info
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div class="row pt-3">
                            <div class="col">

                                <div v-if="!item.rf_id" class="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                                    <small class="fst-italic">
                                        Vehicle has no assigned RFID
                                    </small>
                                    <button @click="onClickAssignRFID(item)" class="btn btn-danger btn-sm">
                                        Assign RFID
                                    </button>
                                </div>


                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="text-muted">Vehicle Number</td>
                                            <td> {{ item.vehicle_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Name</td>
                                            <td> {{ item.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Plate Number</td>
                                            <td> {{ item.plate_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Classification</td>
                                            <td> {{ VehicleClassificationMapper[item.classification_id] }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Assignee</td>
                                            <td> {{ getFullname(item.assignee.firstname, item.assignee.middlename, item.assignee.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Date Acquired</td>
                                            <td> {{ formatDate(item.date_acquired) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Status</td>
                                            <td>
                                                <div :class="{ [`badge bg-${VehicleStatusMapper[item.status].color}`]: true }">
                                                    {{ VehicleStatusMapper[item.status].label }}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Total Unposted Gaslips</td>
                                            <td class="text-danger fw-bold"> {{ item.total_unposted_gas_slips }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">RFID</td>
                                            <td>
                                                <div v-if="!item.rf_id"> N/A </div>
                                                <div v-else>
                                                    <button @click="onClickAssignRFID(item, true)" class="btn btn-sm btn-danger"> Update RFID </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="row pt-3 mb-3">
                            <div class="col">
                                <ul class="nav nav-tabs nav-fill">
                                    <li class="nav-item">
                                        <a @click="onClickTab('gas-slip')" class="nav-link" :class="{'active': tab_selected === 'gas-slip'}" href="javascript:void(0)">Gas Slips</a>
                                    </li>
                                    <li class="nav-item">
                                        <a @click="onClickTab('trip-ticket')" class="nav-link" :class="{'active': tab_selected === 'trip-ticket'}" href="javascript:void(0)">Trips</a>
                                    </li>
                                    <li class="nav-item">
                                        <a @click="onClickTab('service-history')" class="nav-link" :class="{'active': tab_selected === 'service-history'}" href="javascript:void(0)">Service History</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div v-show="tab_selected === 'gas-slip'">

                            <div class="h5wrapper mb-3 pt-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <client-only>
                                    <font-awesome-icon :icon="['fas', 'gas-pump']"/>
                                </client-only> Gas Slips
                                </h5>
                                <hr class="result">
                            </div>
    
                            <div class="row pt-3">

                                <div v-if="item.gas_slips.length === 0" class="col text-center">
                                    <span class="text-muted fst-italic"> ----------------- No Record ----------------- </span>
                                </div>

                                <div v-else class="col">
                                    <div style="max-height: 300px; overflow-y: auto;">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th class="text-muted">GS No.</th>
                                                    <th class="text-muted">Driver</th>
                                                    <th class="text-muted">Requested By</th>
                                                    <th class="text-muted">Gas Station</th>
                                                    <th class="text-muted text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="gs in item.gas_slips">
                                                    <td>
                                                        <nuxt-link :to="'/motorpool/gas-slip/view/' + gs.id">{{ gs.gas_slip_number }}</nuxt-link>
                                                    </td>
                                                    <td> {{ getFullname(gs.driver.firstname, gs.driver.middlename, gs.driver.lastname) }} </td>
                                                    <td> {{ getFullname(gs.requested_by.firstname, gs.requested_by.middlename, gs.requested_by.lastname) }} </td>
                                                    <td> {{ gs.gas_station.name }} </td>
                                                    <td class="text-center align-middle">
        
                                                        <div v-if="gs.cancelled_at" :class="{ [`badge bg-${approvalStatus[gs.status].color}`]: true }">
                                                                {{ approvalStatus[gs.status].label }}
                                                        </div>
                                                        <div v-else-if="gs.is_posted === null" :class="{ [`badge bg-${approvalStatus[gs.status].color}`]: true }">
                                                                {{ approvalStatus[gs.status].label }}
                                                        </div>
                                                        <div v-else-if="gs.is_posted === true" class="badge bg-info">
                                                            Posted
                                                        </div>
                                                        <div v-else class="badge bg-secondary">
                                                            Unposted
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div v-show="tab_selected === 'trip-ticket'">
                            <div class="h5wrapper mb-3 pt-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <client-only>
                                    <font-awesome-icon :icon="['fas', 'car']"/>
                                </client-only> Trips
                                </h5>
                                <hr class="result">
                            </div>
    
                            <div class="row pt-3">

                                <div v-if="item.trip_tickets.length === 0" class="col text-center">
                                    <span class="text-muted fst-italic"> ----------------- No Record ----------------- </span>
                                </div>

                                <div v-else class="col">
                                    <div style="max-height: 300px; overflow-y: auto;">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th class="text-muted">Trip No.</th>
                                                    <th class="text-muted">Driver</th>
                                                    <th class="text-muted">Destination</th>
                                                    <th class="text-muted">Purpose</th>
                                                    <th class="text-muted">Date</th>
                                                    <th class="text-muted text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="trip in item.trip_tickets">
                                                    <td>
                                                        <nuxt-link :to="'/motorpool/trip-ticket/view/' + trip.id">{{ trip.trip_number }}</nuxt-link>
                                                    </td>
                                                    <td> {{ getFullname(trip.driver.firstname, trip.driver.middlename, trip.driver.lastname) }} </td>
                                                    <td> {{ trip.destination }} </td>
                                                    <td> {{ trip.purpose }} </td>
                                                    <td> {{ formatDate(trip.start_time) }} </td>
                                                    <td class="text-center align-middle">
                                                        <div :class="{ [`badge bg-${tripTicketStatus[trip.status].color}`]: true }">
                                                            {{ tripTicketStatus[trip.status].label }}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div v-show="tab_selected === 'service-history'">
                            <div class="h5wrapper mb-3 pt-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <client-only>
                                    <font-awesome-icon :icon="['fas', 'history']"/>
                                </client-only> Service History
                                </h5>
                                <hr class="result">
                            </div>
    
                            <div class="row pt-3">
                                <div class="col text-center">
                                    <span class="text-muted fst-italic"> ----------------- No Record ----------------- </span>
                                </div>
                            </div>
                        </div>

        
                        <div class="row pt-5">
                            <div class="col">
                                <div class="d-flex justify-content-end gap-2">
                                    <div class="d-flex justify-content-end gap-2">
                                        <button v-if="canRead(authUser, 'canManageVehicle')" class="btn btn-secondary"
                                            @click="onClickGoToList">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'list']"/>
                            </client-only> Go to List
                                        </button>
                                        <button v-if="canEdit(authUser, 'canManageVehicle')" class="btn btn-success"
                                            @click="onClickUpdate">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> Update
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageVehicle')" class="btn btn-primary"
                                            @click="onClickAddNew">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add New
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
    </div>


</template>


<script setup lang="ts">
import * as api from '~/composables/motorpool/vehicle/vehicle.api'
import type { Vehicle } from '~/composables/motorpool/vehicle/vehicle.types';
import { VehicleStatusMapper, VehicleClassificationMapper } from '~/composables/motorpool/vehicle/vehicle.enums';
import Swal from 'sweetalert2'
import { tripTicketStatus } from '~/composables/motorpool/trip-ticket/trip-ticket.enums';

definePageMeta({
    name: ROUTES.VEHICLE_VIEW,
    layout: "layout-motorpool",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const router = useRouter()
const route = useRoute()
const item = ref<Vehicle | undefined>()
const tab_selected = ref<'gas-slip' | 'trip-ticket' | 'service-history'>('gas-slip')

onMounted(async () => {
    authUser.value = getAuthUser()
    item.value = await api.findOne(route.params.id as string)
    isLoadingPage.value = false
})


function onClickAssignRFID(vehicle: Vehicle, isUpdate: boolean = false) {
    console.log('assignRFID', vehicle);

    const action = isUpdate ? "Update" : "Assign"

    Swal.fire({
        title: `${action} RFID`,
        text: `Please input RFID to vehicle ${vehicle.vehicle_number} ${vehicle.name}`,
        input: 'text',
        inputPlaceholder: 'Enter RFID here',
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#6c757d",
        confirmButtonText: action,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to enter RFID!';
            }
        },
        preConfirm: async (confirm) => {

            const inputValue = Swal.getInput()?.value;

            const response = await api.assignRFID(vehicle.id, inputValue!)

            if (response.success && response.data) {

                Swal.fire({
                    title: 'Success!',
                    text: "RFID assigned successfully",
                    icon: 'success',
                    position: 'top',
                });


                item.value!.rf_id = response.data.rf_id

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

const onClickTab = (tab: 'gas-slip' | 'trip-ticket' | 'service-history') => tab_selected.value = tab

const onClickGoToList = () => router.push(`/motorpool/vehicle`);
const onClickAddNew = () => router.push(`/motorpool/vehicle/create`);
const onClickUpdate = () => router.push(`/motorpool/vehicle/${item.value?.id}`);


</script>