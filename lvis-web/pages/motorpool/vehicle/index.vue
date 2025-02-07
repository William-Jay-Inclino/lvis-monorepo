<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
                <h2 class="text-warning">Search Vehicle</h2>
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Vehicle Name</label>
                            <client-only>
                                <v-select data-testid="search-vehicle" @search="handleSearchVehicles" :options="store.vehicles" label="label" v-model="store.search_filters.vehicle"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Assignee</label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="store.employees" label="fullname" v-model="store.search_filters.assignee"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
                
                <div class="d-flex justify-content-end gap-2">
                    <button data-testid="search" @click="search" class="btn btn-primary" :disabled="isSearching">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'search']" />
                        </client-only> 
                        {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button data-testid="create-vehicle" v-if="canCreate(authUser, 'canManageVehicle')" @click="onClickAdd" class="btn btn-primary float-end">
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
                                                <th class="bg-secondary text-white">Vehicle Number</th>
                                                <th class="bg-secondary text-white">Name</th>
                                                <th class="bg-secondary text-white">Assignee</th>
                                                <th width="15%" class="text-center bg-secondary text-white">
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'cog']" />
                                                    </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr @click="store.selected_row_indx = indx" :class="{'table-warning': indx === store.selected_row_indx}" v-for="i, indx in store.items">
                                                <td class="text-muted align-middle"> {{ i.vehicle_number }} </td>
                                                <td class="text-muted align-middle"> {{ i.name }} </td>
                                                <td class="text-muted align-middle"> {{ getFullname(i.assignee.firstname, i.assignee.middlename, i.assignee.lastname) }} </td>
                                                <td class="align-middle text-center">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm"
                                                        :class="{ 'text-primary': canRead(authUser, 'canManageVehicle') }"
                                                        :disabled="!canRead(authUser, 'canManageVehicle')">
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

import * as api from '~/composables/motorpool/vehicle/vehicle.api'
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { useVehicleStore } from '~/composables/motorpool/vehicle/vehicle.store';

definePageMeta({
    name: ROUTES.VEHICLE_INDEX,
    layout: "layout-motorpool",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const store = useVehicleStore()
const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)
// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {
    authUser.value = getAuthUser()

    const { vehicles, employees } = await api.fetchDataInSearchFilters()
    store.set_search_filters({ vehicles, employees })
    isLoadingPage.value = false

})

// ======================== FUNCTIONS ======================== 

async function changePage(page: number) {
    store.remove_selected_row()

    isSearching.value = true

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: store.pagination.pageSize,
        assignee_id: store.search_filters.assignee ? store.search_filters.assignee.id : null,
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

    if (store.search_filters.vehicle) {

        const response = await api.findByVehicleNumber(store.search_filters.vehicle.vehicle_number)
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
        assignee_id: store.search_filters.assignee ? store.search_filters.assignee.id : null,
    })

    isSearching.value = false

    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
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

async function searchEmployees(input: string, loading: (status: boolean) => void) {

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
        const response = await api.fetchVehicles(input);
        store.set_search_filters({ vehicles: response })
    } catch (error) {
        console.error('Error fetching Vehicles:', error);
    } finally {
        loading(false);
    }
}


// ======================== UTILS ======================== 


const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

const debouncedSearchVehicles = debounce((input: string, loading: (status: boolean) => void) => {
    searchVehicles(input, loading);
}, 500);

const onClickViewDetails = (id: string) => router.push('/motorpool/vehicle/view/' + id)
const onClickAdd = () => router.push('/motorpool/vehicle/create')

</script>
