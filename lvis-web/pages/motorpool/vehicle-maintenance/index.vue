<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
                <h2 class="text-warning">Search PMS Records</h2>
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Reference No.</label>
                            <client-only>
                                <v-select 
                                    @search="handleSearchRefNumbers" 
                                    :options="vehicle_maintenances" 
                                    label="ref_number" 
                                    v-model="vehicle_maintenance"
                                ></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Vehicle</label>
                            <client-only>
                                <v-select 
                                @search="handleSearchVehicles" 
                                :options="vehicles" 
                                label="label" 
                                v-model="selected_vehicle"
                            ></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Service Center</label>
                            <client-only>
                                <v-select 
                                    :options="service_centers" 
                                    label="name" 
                                    v-model="selected_service_center"
                                ></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Service Date</label>
                            <input v-model="service_date" type="date" class="form-control">
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
                                                <th class="bg-secondary text-white">Ref. Number</th>
                                                <th class="bg-secondary text-white">Vehicle</th>
                                                <th class="bg-secondary text-white">Service Center</th>
                                                <th class="bg-secondary text-white">Service Date</th>
                                                <th class="bg-secondary text-white">Next Service Date</th>
                                                <th width="15%" class="text-center bg-secondary text-white">
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'cog']" />
                                                    </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in items">
                                                <td class="text-muted align-middle"> {{ i.ref_number }} </td>
                                                <td class="text-muted align-middle"> {{ i.vehicle.vehicle_number + ' ' + i.vehicle.name }} </td>
                                                <td class="text-muted align-middle"> {{ i.service_center.name }} </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.service_date) }} </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.next_service_date) }} </td>
                                                <td class="align-middle text-center">
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

import * as api from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.api'
import { PAGINATION_SIZE } from '~/utils/config'
import { useToast } from "vue-toastification";
import type { VehicleMaintenance } from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.types';
import type { ServiceCenter } from '~/composables/motorpool/service-center/service-center.types';
import { fetchVehicles } from '~/composables/motorpool/vehicle/vehicle.api';


definePageMeta({
    name: ROUTES.VEHICLE_MAINTENANCE_INDEX,
    layout: "layout-motorpool",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const toast = useToast();
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
const vehicle_maintenance = ref<VehicleMaintenance | null>(null)
const vehicle_maintenances = ref<VehicleMaintenance[]>([])
const vehicles = ref<Vehicle[]>([])
const service_centers = ref<ServiceCenter[]>([])
const selected_vehicle = ref<Vehicle | null>(null)
const selected_service_center = ref<ServiceCenter | null>(null)
const service_date = ref<Date | null>(null)
// ----------------


// container for search result
const items = ref<VehicleMaintenance[]>([])

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await api.fetchDataInSearchFilters()
    vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
    service_centers.value = response.service_centers
    vehicle_maintenances.value = response.vehicle_maintenances

    isLoadingPage.value = false

})


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

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: pagination.value.pageSize,
        service_center_id: selected_service_center.value ? selected_service_center.value.id : null,
        vehicle_id: selected_vehicle.value ? selected_vehicle.value.id : null,
        service_date: service_date.value || null, 
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

    if (vehicle_maintenance.value) {

        const response = await api.findByRefNumber(vehicle_maintenance.value.ref_number)
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page: 1,
        pageSize: pagination.value.pageSize,
        service_center_id: selected_service_center.value ? selected_service_center.value.id : null,
        vehicle_id: selected_vehicle.value ? selected_vehicle.value.id : null,
        service_date: service_date.value || null, 
    })

    isSearching.value = false

    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}

async function handleSearchVehicles(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        vehicles.value = []
        return 
    } 

    debouncedSearchVehicles(input, loading)

}

async function handleSearchRefNumbers(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        vehicle_maintenances.value = []
        return 
    } 

    debouncedSearchRefNumbers(input, loading)

}

async function searchVehicles(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchVehicles(input);
        console.log('response', response);
        vehicles.value = response.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
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
        vehicle_maintenances.value = response
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
