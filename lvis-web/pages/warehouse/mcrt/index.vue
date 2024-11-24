<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search MCRT</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">MCRT Number</label>
                            <client-only>
                                <v-select @search="handleSearchMcrtNumber" :options="mcrts" label="mcrt_number" v-model="mcrt"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Date</label>
                            <input v-model="date_requested" type="date" class="form-control">
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
                    <button v-if="canCreate(authUser, 'canManageMCRT')" @click="onClickAdd" class="btn btn-primary float-end">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'plus']"/>
                        </client-only> 
                        Create MCRT
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
                                                <th class="bg-secondary text-white">MCRT Number</th>
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
                                                <td class="text-muted align-middle"> {{ i.mcrt_number }} </td>
                                                <td class="text-muted align-middle"> {{ formatDate(i.mcrt_date) }}
                                                </td>
                                                <td class="text-center align-middle">
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="align-middle text-center">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm" :class="{ 'text-primary': canViewDetails(authUser, 'canManageMCRT') }"
                                                        :disabled="!canViewDetails(authUser, 'canManageMCRT')">
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

import { type MCRT } from '~/composables/warehouse/mcrt/mcrt.types';
import * as mcrtApi from '~/composables/warehouse/mcrt/mcrt.api'
import { formatDate } from '~/utils/helpers'
import { PAGINATION_SIZE } from '~/utils/config'
import { ROUTES, approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';

definePageMeta({
    name: ROUTES.MCRT_INDEX,
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
const mcrt = ref<MCRT | null>(null)
const date_requested = ref(null)
const mcrts = ref<MCRT[]>([])
const employees = ref<Employee[]>([])
// ----------------


// table data
const items = ref<MCRT[]>([])



// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()
    const response = await mcrtApi.fetchDataInSearchFilters()
    mcrts.value = response.mcrts
    isLoadingPage.value = false

})


// ======================== COMPUTED ======================== 



// ======================== FUNCTIONS ======================== 



async function changePage(page: number) {

    isPaginating.value = true

    const { data, currentPage, totalItems, totalPages } = await mcrtApi.findAll({
        page,
        pageSize: pagination.value.pageSize,
        date_requested: null,

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

    // find by RV NUMBER
    if (mcrt.value) {
        const response = await mcrtApi.findByMcrtNumber(mcrt.value.mcrt_number)
        isSearching.value = false
        if (response) {
            items.value.push(response)
            return
        }
        return
    }


    // find by DATE REQUESTED and/or REQUISITIONER
    const { data, currentPage, totalItems, totalPages } = await mcrtApi.findAll({
        page: 1,
        pageSize: pagination.value.pageSize,
        date_requested: date_requested.value,

    })
    isSearching.value = false
    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages

}

async function handleSearchMcrtNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        mcrts.value = []
        return
    } 

    debouncedSearchMcrtNumbers(input, loading)

}

async function searchMcrtNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchMcrtNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await mcrtApi.fetchMcrtNumbers(input);
        console.log('response', response);
        mcrts.value = response;
    } catch (error) {
        console.error('Error fetching MCRT numbers:', error);
    } finally {
        loading(false);
    }
}

// ======================== UTILS ======================== 

const onClickViewDetails = (id: string) => router.push('/warehouse/mcrt/view/' + id)
const onClickAdd = () => router.push('/warehouse/mcrt/create')

const debouncedSearchMcrtNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchMcrtNumbers(input, loading);
}, 500);

</script>
