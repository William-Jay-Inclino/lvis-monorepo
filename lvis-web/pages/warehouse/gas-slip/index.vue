<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search Gas Slip</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Gas Slip Number</label>
                            <client-only>
                                <v-select @search="handleSearchGasSlipNumber" :options="gas_slips" label="gas_slip_number" v-model="gas_slip"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Vehicle</label>
                            <client-only>
                                <v-select :options="vehicles" label="label" v-model="vehicle"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <client-only>
                                <v-select :options="approvalStatusArray" label="label" v-model="approval_status"></v-select>
                            </client-only>
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
                    <button v-if="canCreate(authUser, 'canManageGasSlip')" @click="onClickAdd" class="btn btn-primary float-end">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'plus']"/>
                        </client-only> 
                        Create
                    </button>
                </div>
        
                <div class="h5wrapper mb-3 mt-3" v-show="!isInitialLoad && !isSearching && !isPaginating">
                    <hr class="result">
                    <h6 class="text-warning"><i>Search results...</i></h6>
                    <hr class="result">
                </div>
        
                <div class="row justify-content-center pt-3">
        
                    <div class="text-center text-muted fst-italic" v-show="isSearching || isPaginating">
                        Please wait...
                    </div>
        
                    <div class="text-center text-muted fst-italic"
                        v-show="items.length === 0 && (!isInitialLoad && !isSearching)">
                        No results found
                    </div>
        
        
                    <div v-show="items.length > 0" class="col-lg">
        
                        <div class="row">
                            <div class="col">
        
        
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white">Gas Slip No.</th>
                                                <th class="bg-secondary text-white">Vehicle No.</th>
                                                <th class="bg-secondary text-white">Date</th>
                                                <th class="bg-secondary text-white text-center">Status</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in items">
                                                <td class="text-muted align-middle"> {{ i.gas_slip_number }} </td>
                                                <td class="text-muted align-middle"> {{ i.vehicle.vehicle_number }} </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.created_at) }} </td>
                                                <td class="text-center align-middle">

                                                    <div v-if="i.cancelled_at" :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                            {{ approvalStatus[i.status].label }}
                                                    </div>
                                                    <div v-else-if="i.is_posted === null" :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                            {{ approvalStatus[i.status].label }}
                                                    </div>
                                                    <div v-else-if="i.is_posted === true" class="badge bg-info">
                                                        Posted
                                                    </div>
                                                    <div v-else class="badge bg-secondary">
                                                        Unposted
                                                    </div>


                                                </td>
                                                <td class="align-middle text-center">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm" :class="{ 'text-primary': canViewDetails(authUser, 'canManageGasSlip') }"
                                                        :disabled="!canViewDetails(authUser, 'canManageGasSlip')">
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
                                        <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                                            <a class="page-link" @click="changePage(pagination.currentPage - 1)"
                                                href="#">Previous</a>
                                        </li>
                                        <li v-for="page in pagination.totalPages" :key="page" class="page-item"
                                            :class="{ active: pagination.currentPage === page }">
                                            <a class="page-link" @click="changePage(page)" href="#">{{ page }}</a>
                                        </li>
                                        <li class="page-item"
                                            :class="{ disabled: pagination.currentPage === pagination.totalPages }">
                                            <a class="page-link" @click="changePage(pagination.currentPage + 1)"
                                                href="#">Next</a>
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

import { type GasSlip } from '~/composables/warehouse/gas-slip/gas-slip.types';
import * as gasSlipApi from '~/composables/warehouse/gas-slip/gas-slip.api'
import { getFullname, formatDate } from '~/utils/helpers'
import { PAGINATION_SIZE } from '~/utils/config'
import { ROUTES, approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import { tripTicketStatus } from '~/composables/warehouse/trip-ticket/trip-ticket.enums';

definePageMeta({
    name: ROUTES.GAS_SLIP_INDEX,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)
const isPaginating = ref(false)

// pagination
const _paginationInitial = {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: PAGINATION_SIZE,
}
const pagination = ref({ ..._paginationInitial })


// search filters
const gas_slip = ref<GasSlip | null>(null)
const vehicle = ref<Vehicle | null>(null)
const gas_slips = ref<GasSlip[]>([])
const employees = ref<Employee[]>([])
const vehicles = ref<Vehicle[]>([])
const approval_status = ref<IApprovalStatus | null>(null)
    // ----------------


// table data
const items = ref<GasSlip[]>([])



// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()

    const response = await gasSlipApi.fetchDataInSearchFilters()

    vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
    gas_slips.value = response.gas_slips
    employees.value = addPropertyFullName(response.employees)

    isLoadingPage.value = false

})


// ======================== COMPUTED ======================== 



// ======================== FUNCTIONS ======================== 



async function changePage(page: number) {

    isPaginating.value = true

    const { data, currentPage, totalItems, totalPages } = await gasSlipApi.findAll({
        page,
        pageSize: pagination.value.pageSize,
        vehicle_id: vehicle.value ? vehicle.value.id : undefined,
        approval_status: approval_status.value ? approval_status.value.id : null,
    })
    isPaginating.value = false

    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}

async function search() {

    isInitialLoad.value = false
    isSearching.value = true

    items.value = []

    // find by GAS SLIP NUMBER
    if (gas_slip.value) {
        const response = await gasSlipApi.findByGasSlipNumber(gas_slip.value.gas_slip_number)
        isSearching.value = false
        if (response) {
            items.value.push(response)
            return
        }
        return
    }


    // find by VEHICLE
    const { data, currentPage, totalItems, totalPages } = await gasSlipApi.findAll({
        page: 1,
        pageSize: pagination.value.pageSize,
        vehicle_id: vehicle.value ? vehicle.value.id : undefined,
        approval_status: approval_status.value ? approval_status.value.id : null,
    })
    isSearching.value = false
    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages

}

async function handleSearchGasSlipNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        gas_slips.value = []
        return
    } 

    debouncedSearchGasSlipNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function searchGasSlipNumbers(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await gasSlipApi.fetchGasSlipNumbers(input);
        console.log('response', response);
        gas_slips.value = response;
    } catch (error) {
        console.error('Error fetching Gas Slip numbers:', error);
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

// ======================== UTILS ======================== 

const onClickViewDetails = (id: string) => router.push('/warehouse/gas-slip/view/' + id)
const onClickAdd = () => router.push('/warehouse/gas-slip/create')

const debouncedSearchGasSlipNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchGasSlipNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>
