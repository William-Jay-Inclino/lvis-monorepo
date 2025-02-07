<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
                <h2 class="text-warning">Search PMS Records</h2>
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Reference No.</label>
                            <client-only>
                                <v-select 
                                    @search="handleSearchRefNumbers" 
                                    :options="store.vehicle_maintenances" 
                                    label="ref_number" 
                                    v-model="store.search_filters.vehicle_maintenance"
                                ></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Vehicle</label>
                            <client-only>
                                <v-select 
                                @search="handleSearchVehicles" 
                                :options="store.vehicles" 
                                label="label" 
                                v-model="store.search_filters.selected_vehicle"
                            ></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <client-only>
                                <v-select 
                                :options="['Completed', 'Pending']" 
                                v-model="store.search_filters.vehicle_status"
                            ></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Service Center</label>
                            <client-only>
                                <v-select 
                                    :options="store.service_centers" 
                                    label="name" 
                                    v-model="store.search_filters.selected_service_center"
                                ></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Service Date</label>
                            <input v-model="store.search_filters.service_date" type="date" class="form-control">
                        </div>
                    </div>
                </div>
                
                <div class="d-flex justify-content-end gap-2">
                    <button @click="search" class="btn btn-primary" :disabled="isSearching">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                             {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button v-if="canCreate(authUser, 'canManageVehicleMaintenance')" @click="onClickAdd" class="btn btn-primary float-end">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Create 
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
                                                <th class="bg-secondary text-white no-wrap">Ref. Number</th>
                                                <th class="bg-secondary text-white">Vehicle</th>
                                                <th class="bg-secondary text-white no-wrap">Service Center</th>
                                                <th class="bg-secondary text-white no-wrap">Service Date</th>
                                                <th class="bg-secondary text-white text-center">Status</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'cog']" />
                                                    </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr @click="store.selected_row_indx = indx" :class="{'table-warning': indx === store.selected_row_indx}" v-for="i, indx in store.items">
                                                <td class="text-muted align-middle no-wrap"> {{ i.ref_number }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ i.vehicle.vehicle_number + ' ' + i.vehicle.name }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ i.service_center.name }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ formatDate(i.service_date) }} </td>
                                                <td class="text-center no-wrap">
                                                    <div class="badge" :class="{'bg-primary': i.is_completed, 'bg-orange': !i.is_completed}">
                                                        {{ i.is_completed ? 'Completed' : 'Pending' }}
                                                    </div>
                                                </td>
                                                <td class="align-middle text-center no-wrap">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm"
                                                        :class="{ 'text-primary': canRead(authUser, 'canManageVehicleMaintenance') }"
                                                        :disabled="!canRead(authUser, 'canManageVehicleMaintenance')">
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

import * as api from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.api'
import { fetchVehicles } from '~/composables/motorpool/vehicle/vehicle.api';
import { useVehicleMaintenanceStore } from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.store';

definePageMeta({
    name: ROUTES.VEHICLE_MAINTENANCE_INDEX,
    layout: "layout-motorpool",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const store = useVehicleMaintenanceStore()
const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)
// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {
    authUser.value = getAuthUser()

    const { vehicle_maintenances, vehicles, service_centers } = await api.fetchDataInSearchFilters()
    store.set_search_filters({ vehicle_maintenances, vehicles, service_centers })
    isLoadingPage.value = false

})

// ======================== FUNCTIONS ======================== 

async function changePage(page: number) {
    store.remove_selected_row()

    isSearching.value = true

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: store.pagination.pageSize,
        service_center_id: store.search_filters.selected_service_center ? store.search_filters.selected_service_center.id : null,
        vehicle_id: store.search_filters.selected_vehicle ? store.search_filters.selected_vehicle.id : null,
        service_date: store.search_filters.service_date || null, 
        is_completed: store.search_filters.vehicle_status ? (store.search_filters.vehicle_status === 'Completed' ? true : false) : null, 
    })

    isSearching.value = false
    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}

async function search() {
    store.remove_selected_row()

    isInitialLoad.value = false
    isSearching.value = true

    store.set_searched_results({ items: [] })

    if (store.search_filters.vehicle_maintenance) {

        const response = await api.findByRefNumber(store.search_filters.vehicle_maintenance.ref_number)
        isSearching.value = false

        console.log('response', response)

        if (response) {
            store.set_searched_results({ items: [response] })
            return
        }

        return

    }

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page: store.pagination.currentPage,
        pageSize: store.pagination.pageSize,
        service_center_id: store.search_filters.selected_service_center ? store.search_filters.selected_service_center.id : null,
        vehicle_id: store.search_filters.selected_vehicle ? store.search_filters.selected_vehicle.id : null,
        service_date: store.search_filters.service_date || null, 
        is_completed: store.search_filters.vehicle_status ? (store.search_filters.vehicle_status === 'Completed' ? true : false) : null, 
    })

    isSearching.value = false

    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}

async function handleSearchVehicles(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        store.search_filters.vehicles = []
        return 
    } 

    debouncedSearchVehicles(input, loading)

}

async function handleSearchRefNumbers(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        store.search_filters.vehicle_maintenances = []
        return 
    } 

    debouncedSearchRefNumbers(input, loading)

}

async function searchVehicles(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchVehicles(input);
        console.log('response', response);
        store.set_search_filters({ vehicles: response })
    } catch (error) {
        console.error('Error fetching Vehicles:', error);
    } finally {
        loading(false);
    }
}

async function searchRefNumbers(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await api.fetchRefNumbers(input);
        console.log('response', response);
        store.set_search_filters({ vehicle_maintenances: response })
    } catch (error) {
        console.error('Error fetching Ref Numbers of Vehicle Maintenance:', error);
    } finally {
        loading(false);
    }
}


// ======================== UTILS ======================== 


const debouncedSearchVehicles = debounce((input: string, loading: (status: boolean) => void) => {
    searchVehicles(input, loading);
}, 500);

const debouncedSearchRefNumbers = debounce((input: string, loading: (status: boolean) => void) => {
    searchRefNumbers(input, loading);
}, 500);

const onClickViewDetails = (id: string) => router.push('/motorpool/vehicle-maintenance/view/' + id)
const onClickAdd = () => router.push('/motorpool/vehicle-maintenance/create')

</script>
