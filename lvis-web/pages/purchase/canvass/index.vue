<template>

    <div class="card">
        <div class="card-body">
            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search Canvass</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">RC Number</label>
                            <client-only>
                                <v-select @search="handleSearchRcNumber" :options="store.search_filters.canvasses" label="rc_number" v-model="store.search_filters.canvass"></v-select>
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
                                <v-select @search="handleSearchEmployees" :options="store.search_filters.employees" label="fullname" v-model="store.search_filters.requested_by"></v-select>
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
                    <button data-testid="create-canvass" v-if="canCreate(authUser, 'canManageCanvass')" @click="onClickAdd"
                        class="btn btn-primary float-end">
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
        
        
                                <!-- <div v-if="!isMobile"> -->
        
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white no-wrap">RC Number</th>
                                                <th class="bg-secondary text-white">Requisitioner</th>
                                                <th class="bg-secondary text-white">Date</th>
                                                <th class="bg-secondary text-center text-white">
                                                    <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in store.items">
                                                <td class="text-muted align-middle no-wrap"> {{ i.rc_number }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{
                getFullname(i.requested_by!.firstname, i.requested_by!.middlename,
                    i.requested_by!.lastname) }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ formatDate(i.date_requested) }} </td>
                                                <td class="align-middle text-center no-wrap">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm" :class="{ 'text-primary': canViewDetails(authUser, 'canManageCanvass') }"
                                                        :disabled="!canViewDetails(authUser, 'canManageCanvass')">
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
        
                                <!-- </div> -->
        
        
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

import * as api from '~/composables/purchase/canvass/canvass.api'
import { getFullname, formatDate } from '~/utils/helpers'
import { ROUTES } from '~/utils/constants';
import { debounce } from '~/utils/helpers';
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { useCanvassStore } from '~/composables/purchase/canvass/canvass.store';

definePageMeta({
    name: ROUTES.CANVASS_INDEX,
    layout: "layout-purchasing",
    middleware: ['auth']
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const router = useRouter()
const store = useCanvassStore()
// flags

const isInitialLoad = ref(true)
const isSearching = ref(false)

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()

    const { canvasses, employees } = await api.fetchDataInSearchFilters()
    store.set_search_filters({ canvasses, employees })
    isLoadingPage.value = false

})

// ======================== FUNCTIONS ======================== 



async function changePage(page: number) {

    isSearching.value = true

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: store.pagination.pageSize,
        date_requested: store.search_filters.date_requested,
        requested_by_id: store.search_filters.requested_by ? store.search_filters.requested_by.id : null

    })

    isSearching.value = false
    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}

async function search() {

    isInitialLoad.value = false
    isSearching.value = true

    store.set_searched_results({ items: [] })

    if (store.search_filters.canvass) {

        const response = await api.findByRcNumber(store.search_filters.canvass.rc_number)
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
        date_requested: store.search_filters.date_requested,
        requested_by_id: store.search_filters.requested_by ? store.search_filters.requested_by.id : null

    })

    isSearching.value = false

    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
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

async function searchRcNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRcNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await api.fetchRcNumbers(input);
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

const onClickViewDetails = (id: string) => router.push('/purchase/canvass/view/' + id)
const onClickAdd = () => router.push('/purchase/canvass/create')

const debouncedSearchRcNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRcNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

</script>