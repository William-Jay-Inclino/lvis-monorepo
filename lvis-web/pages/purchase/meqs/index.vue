<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search MEQS</h2>
        
                <hr>
        
                <div class="row pt-3">

                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">MEQS Number</label>
                            <client-only>
                                <v-select data-testid="search-meqs-number" @search="handleSearchMeqsNumber" :options="store.meqsArray" label="meqs_number" v-model="store.search_filters.meqs"></v-select>
                            </client-only>
                        </div>
                    </div>

                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Transaction</label>
                            <div class="row g-0">
                                <div class="col-4">
                                    <client-only>
                                        <v-select @option:selected="onChangeTransactionType" :options="store.transactionTypes"
                                            v-model="store.search_filters.transactionType" :clearable="false"></v-select>
                                    </client-only>
                                </div>
                                <div class="col-8">
                                    <client-only>
                                        <v-select @search="handleSearchRvNumber" :options="store.rvs" label="rv_number" v-model="store.search_filters.rv"
                                            v-show="store.search_filters.transactionType === 'RV'"></v-select>
                                        <v-select @search="handleSearchJoNumber" :options="store.jos" label="jo_number" v-model="store.search_filters.jo"
                                            v-show="store.search_filters.transactionType === 'JO'"></v-select>
                                        <v-select @search="handleSearchSprNumber" :options="store.sprs" label="spr_number" v-model="store.search_filters.spr"
                                            v-show="store.search_filters.transactionType === 'SPR'"></v-select>
                                    </client-only>
                                </div>
                            </div>
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
                    <button data-testid="create-meqs" v-if="canCreate(authUser, 'canManageMEQS')" @click="onClickAdd" class="btn btn-primary float-end">
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
                                                <th class="bg-secondary text-white no-wrap">MEQS Number</th>
                                                <th class="bg-secondary text-white">Reference</th>
                                                <th class="bg-secondary text-white">Requisitioner</th>
                                                <th class="bg-secondary text-white">Date</th>
                                                <th class="bg-secondary text-white text-center">Status</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'info-circle']"/>
                                                    </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr @click="store.selected_row_indx = indx" :class="{'table-warning': indx === store.selected_row_indx}" v-for="i, indx in store.items">
                                                <td class="text-muted align-middle no-wrap"> {{ i.meqs_number }} </td>
                                                <td class="text-muted align-middle no-wrap" v-if="i.rv_number">
                                                    RV#{{ i.rv_number }}
                                                </td>
                                                <td class="text-muted align-middle no-wrap" v-else-if="i.jo_number">
                                                    JO#{{ i.jo_number }}
                                                </td>
                                                <td class="text-muted align-middle no-wrap" v-else-if="i.spr_number">
                                                    SPR#{{ i.spr_number }}
                                                </td>
                                                <td v-else>
                                                    N/A
                                                </td>
                                                <td class="text-muted align-middle no-wrap">
                                                    {{ i.requested_by ? getFullname(i.requested_by.firstname, i.requested_by.middlename, i.requested_by.lastname) : 'N/A' }}
                                                </td>
                                                <td class="text-muted align-middle no-wrap"> {{ formatDate(i.meqs_date) }} </td>
                                                <td class="text-center align-middle no-wrap">
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="text-center align-middle no-wrap">
                                                    <button :data-testid="`view-details-${ i.meqs_number }`" @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm"
                                                        :class="{ 'text-primary': canViewDetails(authUser, 'canManageMEQS') }"
                                                        :disabled="!canViewDetails(authUser, 'canManageMEQS')">
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
import * as meqsApi from '~/composables/purchase/meqs/meqs.api'
import { getFullname, formatDate } from '~/utils/helpers'
import { fetchRvNumbers } from '~/composables/purchase/rv/rv.api';
import { fetchEmployees } from '~/composables/hr/employee/employee.api';
import { fetchSprNumbers } from '~/composables/purchase/spr/spr.api';
import { fetchJoNumbers } from '~/composables/purchase/jo/jo.api';
import { fetchSuppliers } from '~/composables/warehouse/supplier/supplier.api';
import { useMeqsStore } from '~/composables/purchase/meqs/meqs.store';

definePageMeta({
    name: ROUTES.MEQS_INDEX,
    layout: "layout-purchasing",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const store = useMeqsStore()
const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)

onMounted(async () => {

    authUser.value = getAuthUser()
    const { meqs, rvs, sprs, jos, suppliers, employees } = await meqsApi.fetchDataInSearchFilters()
    store.set_search_filters({ meqsArray: meqs, rvs, sprs, jos, employees, suppliers })
    isLoadingPage.value = false

})

async function search() {
    store.remove_selected_row()

    console.log('search')

    isInitialLoad.value = false
    isSearching.value = true

    store.set_searched_results({ items: [] })

    // find by MEQS NUMBER
    if (store.search_filters.meqs) {
        const response = await meqsApi.findByMeqsNumber(store.search_filters.meqs.meqs_number)
        isSearching.value = false
        if (response) {
            store.set_searched_results({ items: [response] })
            return
        }
        return
    }

    // find by RV/SPR/JO NUMBER
    if (store.search_filters.rv || store.search_filters.spr || store.search_filters.jo) {

        let response

        if (store.search_filters.rv) {
            response = await meqsApi.findByReferenceNumber({ rv_number: store.search_filters.rv.rv_number })
        } else if (store.search_filters.spr) {
            response = await meqsApi.findByReferenceNumber({ spr_number: store.search_filters.spr.spr_number })
        } else if (store.search_filters.jo) {
            response = await meqsApi.findByReferenceNumber({ jo_number: store.search_filters.jo.jo_number })
        }

        isSearching.value = false
        if (response) {
            store.set_searched_results({ items: [response] })
            return
        }
        return
    }


    // find by DATE REQUESTED and/or REQUISITIONER
    const { data, currentPage, totalItems, totalPages } = await meqsApi.findAll({
        page: store.pagination.currentPage,
        pageSize: store.pagination.pageSize,
        date_requested: store.search_filters.date_requested,
        requested_by_id: store.search_filters.requested_by ? store.search_filters.requested_by.id : null,
        supplier_id: store.search_filters.supplier ? store.search_filters.supplier.id : null,
        approval_status: store.search_filters.approval_status ? store.search_filters.approval_status.id : null
    })
    isSearching.value = false
    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })

}

async function changePage(page: number) {
    store.remove_selected_row()

    isSearching.value = true

    const { data, currentPage, totalItems, totalPages } = await meqsApi.findAll({
        page,
        pageSize: store.pagination.pageSize,
        date_requested: store.search_filters.date_requested,
        requested_by_id: store.search_filters.requested_by ? store.search_filters.requested_by.id : null,
        supplier_id: store.search_filters.supplier ? store.search_filters.supplier.id : null,
        approval_status: store.search_filters.approval_status ? store.search_filters.approval_status.id : null
    })
    isSearching.value = false

    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}

function onChangeTransactionType() {
    console.log('onChangeTransactionType')
    store.search_filters.rv = null
    store.search_filters.spr = null
    store.search_filters.jo = null
}

async function handleSearchMeqsNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        store.search_filters.meqsArray = []
        return
    } 

    debouncedSearchMeqsNumbers(input, loading)

}

async function handleSearchJoNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        store.search_filters.jos = []
        return
    } 

    debouncedSearchJoNumbers(input, loading)

}

async function handleSearchSprNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        store.search_filters.sprs = []
        return
    } 

    debouncedSearchSprNumbers(input, loading)

}

async function handleSearchRvNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        store.search_filters.rvs = []
        return
    } 

    debouncedSearchRvNumbers(input, loading)

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

async function searchMeqsNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchMeqsNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await meqsApi.fetchMeqsNumbers(input);
        console.log('response', response);
        store.set_search_filters({ meqsArray: response })
    } catch (error) {
        console.error('Error fetching MEQS numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchJoNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchJoNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchJoNumbers(input);
        console.log('response', response);
        store.set_search_filters({ jos: response })
    } catch (error) {
        console.error('Error fetching JO numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchSprNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchSprNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchSprNumbers(input);
        console.log('response', response);
        store.set_search_filters({ sprs: response })
    } catch (error) {
        console.error('Error fetching SPR numbers:', error);
    } finally {
        loading(false);
    }
}

async function searchRvNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRvNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchRvNumbers(input);
        console.log('response', response);
        store.set_search_filters({ rvs: response })
    } catch (error) {
        console.error('Error fetching RV numbers:', error);
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

const onClickViewDetails = (id: string) => router.push('/purchase/meqs/view/' + id)
const onClickAdd = () => router.push('/purchase/meqs/create')

const debouncedSearchMeqsNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchMeqsNumbers(input, loading);
}, 500);

const debouncedSearchJoNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchJoNumbers(input, loading);
}, 500);

const debouncedSearchSprNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchSprNumbers(input, loading);
}, 500);

const debouncedSearchRvNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRvNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

const debouncedSearchSuppliers = debounce((input: string, loading: (status: boolean) => void) => {
    searchSuppliers(input, loading);
}, 500);

</script>
