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
                            <input @keyup.enter="search" type="text" class="form-control" v-model="store.search_filters.searchName">
                        </div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <button @click="search" class="btn btn-primary" :disabled="isSearching">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                             {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button v-if="canCreate(authUser, 'canManageSupplier')" @click="onClickAdd" class="btn btn-primary float-end">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Create 
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
                                            <tr @click="store.selected_row_indx = indx" :class="{'table-warning': indx === store.selected_row_indx}" v-for="i, indx in store.items">
                                                <td class="text-muted align-middle"> {{ i.name }} </td>
                                                <td class="text-muted align-middle"> {{ i.contact }} </td>
                                                <td class="text-muted align-middle"> {{ i.address }} </td>
                                                <td class="text-muted align-middle"> {{ VAT[i.vat_type].label }} </td>
                                                <td class="align-middle text-center">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm"
                                                        :class="{ 'text-primary': canRead(authUser, 'canManageSupplier') }"
                                                        :disabled="!canRead(authUser, 'canManageSupplier')">
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

import * as api from '~/composables/warehouse/supplier/supplier.api'
import { useSupplierStore } from '~/composables/warehouse/supplier/supplier.store';

definePageMeta({
    name: ROUTES.SUPPLIER_INDEX,
    layout: "layout-warehouse",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const store = useSupplierStore()
const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)
// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {
    authUser.value = getAuthUser()
    isLoadingPage.value = false
})

// ======================== FUNCTIONS ======================== 

async function changePage(page: number) {
    store.remove_selected_row()

    isSearching.value = true
    const name = store.search_filters.searchName || ''

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: store.pagination.pageSize,
        name,

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
    const name = store.search_filters.searchName || ''

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page: store.pagination.currentPage,
        pageSize: store.pagination.pageSize,
        name,
    })

    isSearching.value = false

    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}


// ======================== UTILS ======================== 

const onClickViewDetails = (id: string) => router.push('/warehouse/supplier/view/' + id)
const onClickAdd = () => router.push('/warehouse/supplier/create')

</script>