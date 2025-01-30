<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search SPR</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">SPR Number</label>
                            <client-only>
                                <v-select @search="handleSearchSprNumber" :options="sprs" label="spr_number" v-model="spr"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">RC Number</label>
                            <client-only>
                                <v-select @search="handleSearchRcNumber" :options="canvasses" label="rc_number" v-model="canvass"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Date</label>
                            <input v-model="date_requested" type="date" class="form-control">
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Requisitioner</label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="requested_by"></v-select>
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
                    <button v-if="canCreate(authUser, 'canManageSPR')" @click="onClickAdd" class="btn btn-primary float-end">
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
                                                <th class="bg-secondary text-white">SPR Number</th>
                                                <th class="bg-secondary text-white">RC Number</th>
                                                <th class="bg-secondary text-white">Requisitioner</th>
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
                                                <td class="text-muted align-middle"> {{ i.spr_number }} </td>
                                                <td class="text-muted align-middle"> {{ i.canvass ? i.canvass.rc_number : 'N/A'  }} </td>
                                                <td class="text-muted align-middle"> {{ i.canvass ?
                getFullname(i.canvass.requested_by!.firstname,
                    i.canvass.requested_by!.middlename, i.canvass.requested_by!.lastname) : 'N/A' }}
                                                </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.date_requested) }}
                                                </td>
                                                <td class="text-center align-middle">
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="align-middle text-center">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm"
                                                        :class="{ 'text-primary': canViewDetails(authUser, 'canManageSPR') }"
                                                        :disabled="!canViewDetails(authUser, 'canManageSPR')">
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

import type { Canvass } from '~/composables/purchase/canvass/canvass.types';
import { type SPR } from '~/composables/purchase/spr/spr.types';
import * as sprApi from '~/composables/purchase/spr/spr.api'
import { getFullname, formatDate } from '~/utils/helpers'
import { PAGINATION_SIZE } from '~/utils/config'
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { fetchRcNumbers } from '~/composables/purchase/canvass/canvass.api';
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { addPropertyFullName } from '~/composables/hr/employee/employee';

definePageMeta({
    name: ROUTES.SPR_INDEX,
    layout: "layout-purchasing",
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
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: PAGINATION_SIZE,
}
const pagination = ref({ ..._paginationInitial })


// search filters
const canvass = ref<Canvass | null>(null)
const spr = ref<SPR | null>(null)
const date_requested = ref(null)
const approval_status = ref<IApprovalStatus | null>(null)
const requested_by = ref<Employee | null>(null)
const canvasses = ref<Canvass[]>([])
const sprs = ref<SPR[]>([])
const employees = ref<Employee[]>([])
// ----------------


// table data
const items = ref<SPR[]>([])



// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()

    const response = await sprApi.fetchDataInSearchFilters()

    canvasses.value = response.canvasses
    sprs.value = response.sprs
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

    const { data, currentPage, totalItems, totalPages } = await sprApi.findAll({
        page,
        pageSize: pagination.value.pageSize,
        date_requested: date_requested.value,
        requested_by_id: requested_by.value ? requested_by.value.id : null,
        approval_status: approval_status.value ? approval_status.value.id : null
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

    // find by SPR NUMBER
    if (spr.value) {
        const response = await sprApi.findBySprNumber(spr.value.spr_number)
        isSearching.value = false
        if (response) {
            items.value.push(response)
            return
        }
        return
    }

    // find by RC NUMBER
    if (canvass.value) {
        const response = await sprApi.findByRcNumber(canvass.value.rc_number)
        isSearching.value = false
        if (response) {
            items.value.push(response)
            return
        }
        return
    }


    // find by DATE REQUESTED and/or REQUISITIONER
    const { data, currentPage, totalItems, totalPages } = await sprApi.findAll({
        page: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
        date_requested: date_requested.value,
        requested_by_id: requested_by.value ? requested_by.value.id : null,
        approval_status: approval_status.value ? approval_status.value.id : null
    })
    isSearching.value = false
    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages

}

async function handleSearchSprNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        sprs.value = []
        return
    } 

    debouncedSearchSprNumbers(input, loading)

}

async function handleSearchRcNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        canvasses.value = []
        return
    } 

    debouncedSearchRcNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function searchSprNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchSprNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await sprApi.fetchSprNumbers(input);
        console.log('response', response);
        sprs.value = response;
    } catch (error) {
        console.error('Error fetching SPR numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchRcNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRcNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchRcNumbers(input);
        console.log('response', response);
        canvasses.value = response;
    } catch (error) {
        console.error('Error fetching RC numbers:', error);
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
const onClickViewDetails = (id: string) => router.push('/purchase/spr/view/' + id)
const onClickAdd = () => router.push('/purchase/spr/create')

const debouncedSearchSprNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchSprNumbers(input, loading);
}, 500);

const debouncedSearchRcNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRcNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>
