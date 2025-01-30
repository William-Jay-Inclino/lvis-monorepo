<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search Trip Ticket</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Trip Number</label>
                            <client-only>
                                <v-select @search="handleSearchTripNumber" :options="trip_tickets" label="trip_number" v-model="trip_ticket"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Vehicle</label>
                            <client-only>
                                <v-select @search="handleSearchVehicles" :options="vehicles" label="label" v-model="vehicle"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Driver</label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="driver"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <client-only>
                                <v-select :options="tripStatusArray" label="label" v-model="trip_status"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
                
                <div class="row pt-1">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Date Prepared</label>
                            <input v-model="date_prepared" type="date" class="form-control">
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Est. Departure</label>
                            <input v-model="date_departure" type="date" class="form-control">
                        </div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <button @click="search()" class="btn btn-primary" :disabled="isSearching">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                             {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button v-if="canCreate(authUser, 'canManageTripTicket')" @click="onClickAdd" class="btn btn-primary float-end">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'plus']"/>
                        </client-only> 
                        Create
                    </button>
                </div>
        
                <div class="h5wrapper mb-3 mt-3" v-show="!isInitialLoad && !isSearching">
                    <hr class="result">
                    <h6 class="text-warning"><i>Search results...</i></h6>
                    <hr class="result">
                </div>
        
                <div class="row justify-content-center pt-3">
        
                    <div class="text-center text-muted fst-italic" v-show="isSearching">
                        Please wait...
                    </div>
        
                    <div class="text-center text-muted fst-italic"
                        v-show="items.length === 0 && (!isInitialLoad && !isSearching)">
                        No results found
                    </div>
        
        
                    <div v-show="items.length > 0 && !isSearching" class="col-lg">
        
                        <div class="row">
                            <div class="col">
        
        
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white">Trip Number</th>
                                                <th class="bg-secondary text-white">Vehicle</th>
                                                <th class="bg-secondary text-white">Driver</th>
                                                <th class="bg-secondary text-white">Date Prepared</th>
                                                <th class="bg-secondary text-white">Est. Date Departure</th>
                                                <th class="bg-secondary text-white">Status</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in items">
                                                <td class="text-muted align-middle"> {{ i.trip_number }} </td>
                                                <td class="text-muted align-middle"> {{ i.vehicle.vehicle_number + ' ' + i.vehicle.name }} </td>
                                                <td class="text-muted align-middle">
                                                    {{ getFullname(i.driver.firstname, i.driver.middlename, i.driver.lastname) }}
                                                </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.created_at) }} </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.start_time, true) }}
                                                </td>
                                                <td class="text-center align-middle">
                                                    <div :class="{ [`badge bg-${tripTicketStatus[i.status].color}`]: true }">
                                                        {{ tripTicketStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="align-middle text-center">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm" :class="{ 'text-primary': canViewDetails(authUser, 'canManageTripTicket') }"
                                                        :disabled="!canViewDetails(authUser, 'canManageTripTicket')">
                                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']" />
                            </client-only>
                                                        View details
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
        
        
                            </div>
                        </div>
        
                        <div class="row">
                            <div class="col">
                                <nav>
                                    <ul class="pagination justify-content-center">
                                        <!-- Previous Button -->
                                        <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                                            <a class="page-link" @click="changePage(pagination.currentPage - 1)" href="#">Previous</a>
                                        </li>

                                        <!-- First Page -->
                                        <li v-if="visiblePages[0] > 1" class="page-item">
                                            <a class="page-link" @click="changePage(1)" href="#">1</a>
                                        </li>
                                        <li v-if="visiblePages[0] > 2" class="page-item disabled">
                                            <span class="page-link">...</span>
                                        </li>

                                        <!-- Visible Pages -->
                                        <li
                                            v-for="page in visiblePages"
                                            :key="page"
                                            class="page-item"
                                            :class="{ active: pagination.currentPage === page }"
                                            >
                                            <a class="page-link" @click="changePage(page)" href="#">{{ page }}</a>
                                        </li>

                                        <!-- Last Page -->
                                        <li v-if="visiblePages[visiblePages.length - 1] < pagination.totalPages - 1" class="page-item disabled">
                                            <span class="page-link">...</span>
                                        </li>
                                        <li v-if="visiblePages[visiblePages.length - 1] < pagination.totalPages" class="page-item">
                                            <a class="page-link" @click="changePage(pagination.totalPages)" href="#">{{ pagination.totalPages }}</a>
                                        </li>

                                        <!-- Next Button -->
                                        <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.totalPages }">
                                            <a class="page-link" @click="changePage(pagination.currentPage + 1)" href="#">Next</a>
                                        </li>
                                    </ul>
                                </nav>
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

import { type TripTicket } from '~/composables/motorpool/trip-ticket/trip-ticket.types';
import * as tripTicketApi from '~/composables/motorpool/trip-ticket/trip-ticket.api'
import { getFullname, formatDate } from '~/utils/helpers'
import { PAGINATION_SIZE } from '~/utils/config'
import { ROUTES } from '~/utils/constants';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import { tripTicketStatus, type ITripStatus } from '~/composables/motorpool/trip-ticket/trip-ticket.enums';
import { tripStatusArray } from '~/composables/motorpool/trip-ticket/trip-ticket.enums';
import { fetchVehicles } from '~/composables/motorpool/vehicle/vehicle.api';

definePageMeta({
    name: ROUTES.TRIP_TICKET_INDEX,
    layout: "layout-motorpool",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)

// pagination
const _paginationInitial = {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: PAGINATION_SIZE,
}
const pagination = ref({ ..._paginationInitial })


// search filters
const trip_ticket = ref<TripTicket | null>(null)
const vehicle = ref<Vehicle | null>(null)
const driver = ref<Employee | null>(null)
const date_prepared = ref(null)
const date_departure = ref(null)
const trip_tickets = ref<TripTicket[]>([])
const employees = ref<Employee[]>([])
const vehicles = ref<Vehicle[]>([])
const trip_status = ref<ITripStatus | null>(null)
    // ----------------


// table data
const items = ref<TripTicket[]>([])



// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()

    const response = await tripTicketApi.fetchDataInSearchFilters()

    vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
    trip_tickets.value = response.trip_tickets
    employees.value = addPropertyFullName(response.employees)

    isLoadingPage.value = false

})


// ======================== COMPUTED ======================== 

const visiblePages = computed(() => {
    const maxVisible = 5; // Max pages to show
    const currentPage = pagination.value.currentPage;
    const totalPages = pagination.value.totalPages;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

// ======================== FUNCTIONS ======================== 



async function changePage(page: number) {

    isSearching.value = true

    const { data, currentPage, totalItems, totalPages } = await tripTicketApi.findAll({
        page,
        pageSize: pagination.value.pageSize,
        vehicle_id: vehicle.value ? vehicle.value.id : undefined,
        driver_id: driver.value ? driver.value.id : undefined,
        date_prepared: date_prepared.value || undefined,
        estimated_departure: date_departure.value || undefined,
        trip_status: trip_status.value ? trip_status.value.id : null
    })
    isSearching.value = false

    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}

async function search() {

    isInitialLoad.value = false
    isSearching.value = true

    items.value = []

    // find by TRIP NUMBER
    if (trip_ticket.value) {
        const response = await tripTicketApi.findByTripNumber(trip_ticket.value.trip_number)
        isSearching.value = false
        if (response) {
            items.value.push(response)
            return
        }
        return
    }


    // find by DATE REQUESTED and/or REQUISITIONER
    const { data, currentPage, totalItems, totalPages } = await tripTicketApi.findAll({
        page: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
        vehicle_id: vehicle.value ? vehicle.value.id : undefined,
        driver_id: driver.value ? driver.value.id : undefined,
        date_prepared: date_prepared.value || undefined,
        estimated_departure: date_departure.value || undefined,
        trip_status: trip_status.value ? trip_status.value.id : null
    })
    isSearching.value = false
    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages

}

async function handleSearchTripNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        trip_tickets.value = []
        return
    } 

    debouncedSearchTripNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function handleSearchVehicles(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        vehicles.value = []
        return 
    } 

    debouncedSearchVehicles(input, loading)

}

async function searchTripNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchTripNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await tripTicketApi.fetchTripNumbers(input);
        console.log('response', response);
        trip_tickets.value = response;
    } catch (error) {
        console.error('Error fetching Trip Ticket numbers:', error);
    } finally {
        loading(false);
    }
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

// ======================== UTILS ======================== 

const onClickViewDetails = (id: string) => router.push('/motorpool/trip-ticket/view/' + id)
const onClickAdd = () => router.push('/motorpool/trip-ticket/create')

const debouncedSearchTripNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchTripNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

const debouncedSearchVehicles = debounce((input: string, loading: (status: boolean) => void) => {
    searchVehicles(input, loading);
}, 500);

</script>
