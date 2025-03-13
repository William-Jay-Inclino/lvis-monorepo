<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
        
                <h2 class="text-warning">Search PO</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">PO Number</label>
                            <client-only>
                                <v-select data-testid="search-po-number" @search="handleSearchPoNumber" :options="store.pos" label="po_number" v-model="store.search_filters.po"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">MEQS Number</label>
                            <client-only>
                                <v-select @search="handleSearchMeqsNumber" :options="store.meqs" label="meqs_number" v-model="store.search_filters.meq"></v-select>
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
                            <label class="form-label">Supplier</label>
                            <client-only>
                                <v-select @search="handleSearchSuppliers" :options="store.suppliers" label="name" v-model="store.search_filters.supplier"></v-select>
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
                                                <th class="bg-secondary text-white no-wrap">PO Number</th>
                                                <th class="bg-secondary text-white no-wrap">MEQS Number</th>
                                                <th width="25%" class="bg-secondary text-white">Supplier</th>
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
                                            <tr @click="store.selected_row_indx = indx" :class="{'table-warning': indx === store.selected_row_indx}" v-for="i, indx in store.items">
                                                <td class="text-muted align-middle no-wrap"> {{ i.po_number }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ i.meqs_number }} </td>
                                                <td class="text-muted align-middle"> 
                                                    {{ i.meqs_supplier ? i.meqs_supplier?.supplier?.name : 'N/A' }} 
                                                </td>
                                                <td class="text-muted align-middle no-wrap">

                                                    {{ i.requested_by ? getFullname(i.requested_by.firstname, i.requested_by.middlename, i.requested_by.lastname) : 'N/A' }}
                                                </td>
                                                <td class="text-muted align-middle no-wrap"> {{ formatDate(i.po_date) }} </td>
                                                <td class="align-middle no-wrap">
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="text-center align-middle no-wrap">
                                                    <button :data-testid="`view-details-${ i.po_number }`" @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm"
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

import * as poApi from '~/composables/purchase/po/po.api'
import { getFullname, formatDate } from '~/utils/helpers'
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { fetchMeqsNumbers } from '~/composables/purchase/meqs/meqs.api';
import { fetchSuppliers } from '~/composables/warehouse/supplier/supplier.api';
import { usePoStore } from '~/composables/purchase/po/po.store';

definePageMeta({
    name: ROUTES.PO_INDEX,
    layout: "layout-purchasing",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const store = usePoStore()
const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)


// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()
    const { pos, employees, meqs, suppliers } = await poApi.fetchDataInSearchFilters()
    store.set_search_filters({ pos, employees, meqs, suppliers })
    isLoadingPage.value = false

})


// ======================== FUNCTIONS ======================== 

async function changePage(page: number) {
    store.remove_selected_row()

    isSearching.value = true

    const { data, currentPage, totalItems, totalPages } = await poApi.findAll({
        page,
        pageSize: store.pagination.pageSize,
        date_requested: store.search_filters.date_requested,
        requested_by_id: store.search_filters.requested_by ? store.search_filters.requested_by.id : null,
        approval_status: store.search_filters.approval_status ? store.search_filters.approval_status.id : null,
        supplier_id: store.search_filters.supplier ? store.search_filters.supplier.id : null,
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


    if (store.search_filters.po) {

        const response = await poApi.findByRefNumber({ po_number: store.search_filters.po.po_number })
        isSearching.value = false

        console.log('response', response)

        if (response) {
            store.set_searched_results({ items: [response] })
            return
        }

        return

    }

    if (store.search_filters.meq) {

        const response = await poApi.findByRefNumber({ meqs_number: store.search_filters.meq.meqs_number })
        isSearching.value = false

        console.log('response', response)

        if (response) {
            store.set_searched_results({ items: [response] })
            return
        }

        return

    }

    const { data, currentPage, totalItems, totalPages } = await poApi.findAll({
        page: store.pagination.currentPage,
        pageSize: store.pagination.pageSize,
        date_requested: store.search_filters.date_requested,
        requested_by_id: store.search_filters.requested_by ? store.search_filters.requested_by.id : null,
        approval_status: store.search_filters.approval_status ? store.search_filters.approval_status.id : null,
        supplier_id: store.search_filters.supplier ? store.search_filters.supplier.id : null,
    })

    isSearching.value = false

    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })

}

async function handleSearchPoNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        store.search_filters.pos = []
        return
    } 

    debouncedSearchPoNumbers(input, loading)

}

async function handleSearchMeqsNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        store.search_filters.meqs = []
        return
    } 

    debouncedSearchMeqsNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        store.search_filters.employees = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function handleSearchSuppliers(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        store.search_filters.suppliers = []
        return 
    } 

    debouncedSearchSuppliers(input, loading)

}

async function searchPoNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchPoNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await poApi.fetchPoNumbers(input);
        console.log('response', response);
        store.set_search_filters({ pos: response })
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
        store.set_search_filters({ meqs: response })
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
        store.set_search_filters({ employees: response })
    } catch (error) {
        console.error('Error fetching Employees:', error);
    } finally {
        loading(false);
    }
}

async function searchSuppliers(input: string, loading: (status: boolean) => void) {
    console.log('searchSuppliers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchSuppliers(input);
        store.set_search_filters({ suppliers: response })
    } catch (error) {
        console.error('Error fetching Suppliers:', error);
    } finally {
        loading(false);
    }
}


// ======================== UTILS ======================== 

const onClickViewDetails = (id: string) => router.push('/purchase/po/view/' + id)
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

const debouncedSearchSuppliers = debounce((input: string, loading: (status: boolean) => void) => {
    searchSuppliers(input, loading);
}, 500);

</script>