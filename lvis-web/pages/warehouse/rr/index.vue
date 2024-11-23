<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage && authUser">
        
                <h2 class="text-warning">Search RR</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">RR Number</label>
                            <client-only>
                                <v-select @search="handleSearchRrNumber" :options="rrs" label="rr_number" v-model="rr"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">PO Number</label>
                            <client-only>
                                <v-select @search="handleSearchPoNumber" :options="pos" label="po_number" v-model="po"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Date</label>
                            <input v-model="date_requested" type="date" class="form-control">
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Requisitioner</label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="requested_by"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <button @click="search()" class="btn btn-primary" :disabled="isSearching">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button v-if="canCreate(authUser, 'canManageRR')" @click="onClickAdd" class="btn btn-primary float-end">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'plus']"/>
                        </client-only> 
                        Create RR
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
                                                <th class="bg-secondary text-white">RR Number</th>
                                                <th class="bg-secondary text-white">PO Number</th>
                                                <th class="bg-secondary text-white">Requisitioner</th>
                                                <th class="bg-secondary text-white">Date</th>
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
                                                <td class="text-muted align-middle"> {{ i.rr_number }} </td>
                                                <td class="text-muted align-middle"> {{ i.po_number }} </td>
                                                <td class="text-muted align-middle">
                                                    {{ getFullname(i.requested_by.firstname, i.requested_by.middlename, i.requested_by.lastname) }}
                                                </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.rr_date) }} </td>
                                                <td>
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="text-center align-middle">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm"
                                                    :class="{ 'text-primary': (canViewDetails(authUser, 'canManageRR') && !isTransactionFailed(i) ), 'text-danger': isTransactionFailed(i) }"
                                                        :disabled="!canViewDetails(authUser, 'canManageRR')">
                                                        <i class="fas fa-info-circle"
                                                            ></i>
                                                        View details
                                                    </button>
                                                    <!-- <button :disabled="!i.can_update || i.status === APPROVAL_STATUS.CANCELLED" @click="onClickEdit(i.id)"
                                                        class="btn btn-light w-50">
                                                        <i class="fas fa-edit" :class="{ 'text-primary': !!i.can_update && i.status !== APPROVAL_STATUS.CANCELLED}"></i>
                                                    </button> -->
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

import * as rrApi from '~/composables/warehouse/rr/rr.api'
import type { RR } from '~/composables/warehouse/rr/rr.types';
import { getFullname, formatDate } from '~/utils/helpers'
import { PAGINATION_SIZE } from '~/utils/config'
import type { PO } from '~/composables/warehouse/po/po.types';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import { fetchPoNumbers } from '~/composables/warehouse/po/po.api';

definePageMeta({
    name: ROUTES.RR_INDEX,
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
const po = ref<PO | null>(null)
const rr = ref<RR | null>(null)
const date_requested = ref(null)
const requested_by = ref<Employee | null>(null)
const employees = ref<Employee[]>([])
const pos = ref<PO[]>([])
const rrs = ref<RR[]>([])


// container for search result
const items = ref<RR[]>([])


// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()
    const response = await rrApi.fetchDataInSearchFilters()

    pos.value = response.pos
    rrs.value = response.rrs
    employees.value = addPropertyFullName(response.employees)

    isLoadingPage.value = false

})



// ======================== FUNCTIONS ======================== 

async function changePage(page: number) {

    isPaginating.value = true

    const { data, currentPage, totalItems, totalPages } = await rrApi.findAll({
        page,
        pageSize: pagination.value.pageSize,
        date_requested: date_requested.value,
        requested_by_id: requested_by.value ? requested_by.value.id : null

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

    if (rr.value) {

        const response = await rrApi.findByRefNumber({ rr_number: rr.value.rr_number })
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    if (po.value) {

        const response = await rrApi.findByRefNumber({ po_number: po.value.po_number })
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    const { data, currentPage, totalItems, totalPages } = await rrApi.findAll({
        page: 1,
        pageSize: pagination.value.pageSize,
        date_requested: date_requested.value,
        requested_by_id: requested_by.value ? requested_by.value.id : null

    })

    isSearching.value = false

    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}

async function handleSearchRrNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        rrs.value = []
        return
    } 

    debouncedSearchRrNumbers(input, loading)

}

async function handleSearchPoNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        pos.value = []
        return
    } 

    debouncedSearchPoNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function searchRrNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRrNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await rrApi.fetchRrNumbers(input);
        console.log('response', response);
        rrs.value = response;
    } catch (error) {
        console.error('Error fetching RR numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchPoNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchPoNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchPoNumbers(input);
        console.log('response', response);
        pos.value = response;
    } catch (error) {
        console.error('Error fetching PO numbers:', error);
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

function getRequisitionerFullname(employee?: Employee | null) {
    console.log('employee', employee)
    if (!employee) return ''
    return getFullname(employee.firstname, employee.middlename, employee.lastname)
}

function isTransactionFailed(item: RR) {

    if(item.status === APPROVAL_STATUS.APPROVED && !item.is_completed) {
        return true 
    }

    return false 

}

const onClickViewDetails = (id: string) => router.push('/warehouse/rr/view/' + id)
const onClickEdit = (id: string) => router.push('/warehouse/rr/' + id)
const onClickAdd = () => router.push('/warehouse/rr/create')

const debouncedSearchRrNumbers = debounce((input: string, loading: (status: boolean) => void) => {
    searchRrNumbers(input, loading);
}, 500);

const debouncedSearchPoNumbers = debounce((input: string, loading: (status: boolean) => void) => {
    searchPoNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>


<style scoped>

.border-error {
    border: 1px solid #ff7b7b;;
}


</style>