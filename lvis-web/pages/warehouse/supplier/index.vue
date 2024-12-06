<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
                <h2 class="text-warning">Search Supplier</h2>
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Supplier Name</label>
                            <input @keyup.enter="search" type="text" class="form-control" v-model="searchName">
                        </div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <button @click="search" class="btn btn-primary" :disabled="isSearching">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button v-if="canCreate(authUser, 'canManageSupplier')" @click="onClickAdd" class="btn btn-primary float-end">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add Supplier
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
                                                <th class="bg-secondary text-white">Name</th>
                                                <th class="bg-secondary text-white">Contact</th>
                                                <th class="bg-secondary text-white">Address</th>
                                                <th width="10%" class="bg-secondary text-white">VAT Type</th>
                                                <th width="15%" class="text-center bg-secondary text-white">
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'cog']" />
                                                    </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in items">
                                                <td class="text-muted align-middle"> {{ i.name }} </td>
                                                <td class="text-muted align-middle"> {{ i.contact }} </td>
                                                <td class="text-muted align-middle"> {{ i.address }} </td>
                                                <td class="text-muted align-middle"> {{ VAT[i.vat_type].label }} </td>
                                                <td class="align-middle text-center">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm"
                                                        :class="{ 'text-primary': canViewDetails(authUser, 'canManageSupplier') }"
                                                        :disabled="!canViewDetails(authUser, 'canManageSupplier')">
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

import * as api from '~/composables/warehouse/supplier/supplier.api'
import { PAGINATION_SIZE } from '~/utils/config'
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";
import type { Supplier } from '~/composables/warehouse/supplier/supplier';


definePageMeta({
    name: ROUTES.SUPPLIER_INDEX,
    layout: "layout-warehouse",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const toast = useToast();
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
const searchName = ref('')
// ----------------


// container for search result
const items = ref<Supplier[]>([])

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {
    authUser.value = getAuthUser()

    isLoadingPage.value = false

})



// ======================== FUNCTIONS ======================== 

async function changePage(page: number) {

    isPaginating.value = true

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: pagination.value.pageSize,
        name: searchName.value,

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

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page: 1,
        pageSize: pagination.value.pageSize,
        name: searchName.value,
    })

    isSearching.value = false

    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}


// ======================== UTILS ======================== 

const onClickViewDetails = (id: string) => router.push('/warehouse/supplier/view/' + id)
const onClickAdd = () => router.push('/warehouse/supplier/create')

</script>