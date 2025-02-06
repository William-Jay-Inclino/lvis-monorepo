<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search Trip Ticket</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Trip Number</label>
                            <client-only>
                                <v-select @search="handleSearchTripNumber" :options="store.search_filters.trip_tickets" label="trip_number" v-model="store.search_filters.trip_ticket"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Vehicle</label>
                            <client-only>
                                <v-select @search="handleSearchVehicles" :options="store.search_filters.vehicles" label="label" v-model="store.search_filters.vehicle"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Driver</label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="store.search_filters.employees" label="fullname" v-model="store.search_filters.driver"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <client-only>
                                <v-select :options="tripStatusArray" label="label" v-model="store.search_filters.trip_status"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Date Prepared</label>
                            <input v-model="store.search_filters.date_prepared" type="date" class="form-control">
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Est. Departure</label>
                            <input v-model="store.search_filters.date_departure" type="date" class="form-control">
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
                        v-show="store.items.length === 0 && (!isInitialLoad && !isSearching)">
                        No results found
                    </div>
        
        
                    <div v-show="store.items.length > 0 && !isSearching" class="col-lg">
        
                        <div class="row">
                            <div class="col">
        
        
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white no-wrap">Trip Number</th>
                                                <th class="bg-secondary text-white">Vehicle</th>
                                                <th class="bg-secondary text-white">Driver</th>
                                                <th class="bg-secondary text-white no-wrap">Date Prepared</th>
                                                <th class="bg-secondary text-white no-wrap">Est. Date Departure</th>
                                                <th class="bg-secondary text-white">Status</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in store.items">
                                                <td class="text-muted align-middle"> {{ i.trip_number }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ i.vehicle.vehicle_number + ' ' + i.vehicle.name }} </td>
                                                <td class="text-muted align-middle no-wrap">
                                                    {{ getFullname(i.driver.firstname, i.driver.middlename, i.driver.lastname) }}
                                                </td>
                                                <td class="text-muted align-middle no-wrap"> {{ formatDate(i.created_at) }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ formatDate(i.start_time, true) }}
                                                </td>
                                                <td class="text-center align-middle">
                                                    <div :class="{ [`badge bg-${tripTicketStatus[i.status].color}`]: true }">
                                                        {{ tripTicketStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="align-middle text-center no-wrap">
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
        
                        <div class="row pt-4">
                            <div class="col">
                                <nav>
                                    <ul class="pagination justify-content-center">
                                        <!-- Previous Button -->
                                        <li class="page-item" :class="{ disabled: store.pagination.currentPage === 1 }">
                                            <a class="page-link" @click="changePage(store.pagination.currentPage - 1)" href="#">Previous</a>
                                        </li>

                                        <!-- First Page -->
                                        <li v-if="store.visiblePages[0] > 1" class="page-item">
                                            <a class="page-link" @click="changePage(1)" href="#">1</a>
                                        </li>
                                        <li v-if="store.visiblePages[0] > 2" class="page-item disabled">
                                            <span class="page-link">...</span>
                                        </li>

                                        <!-- Visible Pages -->
                                        <li
                                            v-for="page in store.visiblePages"
                                            :key="page"
                                            class="page-item"
                                            :class="{ active: store.pagination.currentPage === page }"
                                            >
                                            <a class="page-link" @click="changePage(page)" href="#">{{ page }}</a>
                                        </li>

                                        <!-- Last Page -->
                                        <li v-if="store.visiblePages[store.visiblePages.length - 1] < store.pagination.totalPages - 1" class="page-item disabled">
                                            <span class="page-link">...</span>
                                        </li>
                                        <li v-if="store.visiblePages[store.visiblePages.length - 1] < store.pagination.totalPages" class="page-item">
                                            <a class="page-link" @click="changePage(store.pagination.totalPages)" href="#">{{ store.pagination.totalPages }}</a>
                                        </li>

                                        <!-- Next Button -->
                                        <li class="page-item" :class="{ disabled: store.pagination.currentPage === store.pagination.totalPages }">
                                            <a class="page-link" @click="changePage(store.pagination.currentPage + 1)" href="#">Next</a>
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

import * as tripTicketApi from '~/composables/motorpool/trip-ticket/trip-ticket.api'
import { getFullname, formatDate } from '~/utils/helpers'
import { ROUTES } from '~/utils/constants';
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { tripTicketStatus } from '~/composables/motorpool/trip-ticket/trip-ticket.enums';
import { tripStatusArray } from '~/composables/motorpool/trip-ticket/trip-ticket.enums';
import { fetchVehicles } from '~/composables/motorpool/vehicle/vehicle.api';
import { useTripTicketStore } from '~/composables/motorpool/trip-ticket/trip-ticket.store';

definePageMeta({
    name: ROUTES.TRIP_TICKET_INDEX,
    layout: "layout-motorpool",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const store = useTripTicketStore()

const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()

    const { vehicles, trip_tickets, employees } = await tripTicketApi.fetchDataInSearchFilters()

    store.set_search_filters({ vehicles, trip_tickets, employees })

    isLoadingPage.value = false

})


// ======================== FUNCTIONS ======================== 

async function changePage(page: number) {

    isSearching.value = true

    const { data, currentPage, totalItems, totalPages } = await tripTicketApi.findAll({
        page,
        pageSize: store.pagination.pageSize,
        vehicle_id: store.search_filters.vehicle ? store.search_filters.vehicle.id : undefined,
        driver_id: store.search_filters.driver ? store.search_filters.driver.id : undefined,
        date_prepared: store.search_filters.date_prepared || undefined,
        estimated_departure: store.search_filters.date_departure || undefined,
        trip_status: store.search_filters.trip_status ? store.search_filters.trip_status.id : null
    })
    isSearching.value = false

    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}

async function search() {

    isInitialLoad.value = false
    isSearching.value = true

    store.set_searched_results({ items: [] })

    // find by TRIP NUMBER
    if (store.search_filters.trip_ticket) {
        const response = await tripTicketApi.findByTripNumber(store.search_filters.trip_ticket.trip_number)
        isSearching.value = false
        if (response) {
            store.set_searched_results({ items: [response] })
            return
        }
        return
    }


    // find by DATE REQUESTED and/or REQUISITIONER
    const { data, currentPage, totalItems, totalPages } = await tripTicketApi.findAll({
        page: store.pagination.currentPage,
        pageSize: store.pagination.pageSize,
        vehicle_id: store.search_filters.vehicle ? store.search_filters.vehicle.id : undefined,
        driver_id: store.search_filters.driver ? store.search_filters.driver.id : undefined,
        date_prepared: store.search_filters.date_prepared || undefined,
        estimated_departure: store.search_filters.date_departure || undefined,
        trip_status: store.search_filters.trip_status ? store.search_filters.trip_status.id : null
    })
    isSearching.value = false
    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })

}

async function handleSearchTripNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        store.search_filters.trip_tickets = []
        return
    } 

    debouncedSearchTripNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        store.search_filters.employees = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function handleSearchVehicles(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        store.search_filters.vehicles = []
        return 
    } 

    debouncedSearchVehicles(input, loading)

}

async function searchTripNumbers(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await tripTicketApi.fetchTripNumbers(input);
        console.log('response', response);
        store.set_search_filters({ trip_tickets: response })
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
        store.set_search_filters({ employees: response })
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
        store.set_search_filters({ vehicles: response })
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
