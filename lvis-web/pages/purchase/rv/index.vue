<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search RV</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">RV Number</label>
                            <client-only>
                                <v-select data-testid="search-rv-number" @search="handleSearchRvNumber" :options="store.rvs" label="rv_number" v-model="store.search_filters.rv"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">RC Number</label>
                            <client-only>
                                <v-select @search="handleSearchRcNumber" :options="store.canvasses" label="rc_number" v-model="store.search_filters.canvass"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Date</label>
                            <input v-model="store.search_filters.date_requested" type="date" class="form-control">
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Requisitioner</label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="store.employees" label="fullname" v-model="store.search_filters.requested_by"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <client-only>
                                <v-select :options="approvalStatusArray" label="label" v-model="store.search_filters.approval_status"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <button data-testid="search" @click="search()" class="btn btn-primary" :disabled="isSearching">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'search']" />
                        </client-only> 
                            {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button data-testid="create-rv" v-if="canCreate(authUser, 'canManageRV')" @click="onClickAdd" class="btn btn-primary float-end">
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
                                                <th class="bg-secondary text-white no-wrap">RV Number</th>
                                                <th class="bg-secondary text-white no-wrap">RC Number</th>
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
                                            <tr @click="store.selected_row_indx = indx" :class="{'table-warning': indx === store.selected_row_indx}" v-for="i, indx in store.items">
                                                <td class="text-muted align-middle no-wrap"> {{ i.rv_number }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ i.canvass ? i.canvass.rc_number : 'N/A'  }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ i.canvass ?
                getFullname(i.canvass.requested_by!.firstname,
                    i.canvass.requested_by!.middlename, i.canvass.requested_by!.lastname) : 'N/A' }}
                                                </td>
                                                <td class="text-muted align-middle no-wrap"> {{ formatDate(i.date_requested) }}
                                                </td>
                                                <td class="text-center align-middle no-wrap">
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="align-middle text-center no-wrap">
                                                    <button :data-testid="`view-details-${ i.rv_number }`" @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm" :class="{ 'text-primary': canViewDetails(authUser, 'canManageRV') }"
                                                        :disabled="!canViewDetails(authUser, 'canManageRV')">
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

import * as rvApi from '~/composables/purchase/rv/rv.api'
import { getFullname, formatDate } from '~/utils/helpers'
import { ROUTES, approvalStatus } from '~/utils/constants';
import { fetchRcNumbers } from '~/composables/purchase/canvass/canvass.api';
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { approvalStatusArray } from '~/utils/constants';
import { useRvStore } from '~/composables/purchase/rv/rv.store';

definePageMeta({
    name: ROUTES.RV_INDEX,
    layout: "layout-purchasing",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const store = useRvStore()
const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()

    const { canvasses, rvs, employees } = await rvApi.fetchDataInSearchFilters()
    store.set_search_filters({ canvasses, rvs, employees })
    isLoadingPage.value = false

})

// ======================== FUNCTIONS ======================== 



async function changePage(page: number) {
    store.remove_selected_row()

    isSearching.value = true

    const { data, currentPage, totalItems, totalPages } = await rvApi.findAll({
        page,
        pageSize: store.pagination.pageSize,
        date_requested: store.search_filters.date_requested,
        requested_by_id: store.search_filters.requested_by ? store.search_filters.requested_by.id : null,
        approval_status: store.search_filters.approval_status ? store.search_filters.approval_status.id : null
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

    // find by RV NUMBER
    if (store.search_filters.rv) {
        const response = await rvApi.findByRvNumber(store.search_filters.rv.rv_number)
        isSearching.value = false
        if (response) {
            store.set_searched_results({ items: [response] })
            return
        }
        return
    }

    // find by RC NUMBER
    if (store.search_filters.canvass) {
        const response = await rvApi.findByRcNumber(store.search_filters.canvass.rc_number)
        isSearching.value = false
        if (response) {
            store.set_searched_results({ items: [response] })
            return
        }
        return
    }


    // find by DATE REQUESTED and/or REQUISITIONER
    const { data, currentPage, totalItems, totalPages } = await rvApi.findAll({
        page: store.pagination.currentPage,
        pageSize: store.pagination.pageSize,
        date_requested: store.search_filters.date_requested,
        requested_by_id: store.search_filters.requested_by ? store.search_filters.requested_by.id : null,
        approval_status: store.search_filters.approval_status ? store.search_filters.approval_status.id : null
    })
    isSearching.value = false
    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })

}

async function handleSearchRvNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        store.search_filters.rvs = []
        return
    } 

    debouncedSearchRvNumbers(input, loading)

}

async function handleSearchRcNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        store.search_filters.canvasses = []
        return
    } 

    debouncedSearchRcNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        store.search_filters.employees = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function searchRvNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRvNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await rvApi.fetchRvNumbers(input);
        console.log('response', response);
        store.set_search_filters({ rvs: response })
    } catch (error) {
        console.error('Error fetching RV numbers:', error);
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
        store.set_search_filters({ canvasses: response })
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
        store.set_search_filters({ employees: response })
    } catch (error) {
        console.error('Error fetching Employees:', error);
    } finally {
        loading(false);
    }
}

// ======================== UTILS ======================== 

const onClickViewDetails = (id: string) => router.push('/purchase/rv/view/' + id)
const onClickAdd = () => router.push('/purchase/rv/create')

const debouncedSearchRvNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRvNumbers(input, loading);
}, 500);

const debouncedSearchRcNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRcNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>
