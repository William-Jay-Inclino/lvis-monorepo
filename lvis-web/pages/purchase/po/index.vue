<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
        
                <h2 class="text-warning">Search PO</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">PO Number</label>
                            <client-only>
                                <v-select @search="handleSearchPoNumber" :options="pos" label="po_number" v-model="po"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">MEQS Number</label>
                            <client-only>
                                <v-select @search="handleSearchMeqsNumber" :options="meqs" label="meqs_number" v-model="meq"></v-select>
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
                    <button data-testid="create-po" v-if="canCreate(authUser, 'canManagePO')" @click="onClickAdd" class="btn btn-primary float-end">
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
                                                <th class="bg-secondary text-white">PO Number</th>
                                                <th class="bg-secondary text-white">MEQS Number</th>
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
                                                <td class="text-muted align-middle"> {{ i.po_number }} </td>
                                                <td class="text-muted align-middle"> {{ i.meqs_number }}
                                                </td>
                                                <td class="text-muted align-middle">
                                                    {{ getFullname(i.requested_by.firstname, i.requested_by.middlename, i.requested_by.lastname) }}
                                                </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.po_date) }} </td>
                                                <td>
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="text-center align-middle">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm"
                                                        :class="{ 'text-primary': canViewDetails(authUser, 'canManagePO') }"
                                                        :disabled="!canViewDetails(authUser, 'canManagePO')">
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

import * as poApi from '~/composables/purchase/po/po.api'
import type { PO } from '~/composables/purchase/po/po.types';
import { getFullname, formatDate } from '~/utils/helpers'
import { PAGINATION_SIZE } from '~/utils/config'
import type { MEQS } from '~/composables/purchase/meqs/meqs.types';
import type { Employee } from '~/composables/hr/employee/employee.types';
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import { fetchMeqsNumbers } from '~/composables/purchase/meqs/meqs.api';


definePageMeta({
    name: ROUTES.PO_INDEX,
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
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: PAGINATION_SIZE,
}
const pagination = ref({ ..._paginationInitial })

// search filters
const po = ref<PO | null>(null)
const meq = ref<MEQS | null>(null)
const date_requested = ref(null)
const requested_by = ref<Employee | null>(null)
const employees = ref<Employee[]>([])
const pos = ref<PO[]>([])
const meqs = ref<MEQS[]>([])
const approval_status = ref<IApprovalStatus | null>(null)


// container for search result
const items = ref<PO[]>([])


// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()
    const response = await poApi.fetchDataInSearchFilters()

    pos.value = response.pos
    meqs.value = response.meqs
    employees.value = addPropertyFullName(response.employees)

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

    const { data, currentPage, totalItems, totalPages } = await poApi.findAll({
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

    if (po.value) {

        const response = await poApi.findByRefNumber({ po_number: po.value.po_number })
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    if (meq.value) {

        const response = await poApi.findByRefNumber({ meqs_number: meq.value.meqs_number })
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    const { data, currentPage, totalItems, totalPages } = await poApi.findAll({
        page: 1,
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

async function handleSearchPoNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        pos.value = []
        return
    } 

    debouncedSearchPoNumbers(input, loading)

}

async function handleSearchMeqsNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        meqs.value = []
        return
    } 

    debouncedSearchMeqsNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function searchPoNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchPoNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await poApi.fetchPoNumbers(input);
        console.log('response', response);
        pos.value = response;
    } catch (error) {
        console.error('Error fetching PO numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchMeqsNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchMeqsNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchMeqsNumbers(input);
        console.log('response', response);
        meqs.value = response;
    } catch (error) {
        console.error('Error fetching MEQS numbers:', error);
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


const onClickViewDetails = (id: string) => router.push('/purchase/po/view/' + id)
const onClickEdit = (id: string) => router.push('/purchase/po/' + id)
const onClickAdd = () => router.push('/purchase/po/create')

const debouncedSearchPoNumbers = debounce((input: string, loading: (status: boolean) => void) => {
    searchPoNumbers(input, loading);
}, 500);

const debouncedSearchMeqsNumbers = debounce((input: string, loading: (status: boolean) => void) => {
    searchMeqsNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);


</script>