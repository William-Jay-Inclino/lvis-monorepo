<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
                <h2 class="text-warning">Search Item</h2>
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Item Code</label>
                            <client-only>
                                <v-select @search="handleSearchItems" :options="store.itemOptions" label="code" v-model="store.search_filters.searchItem"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <input data-testid="search-item-desc" type="text" class="form-control" v-model="store.search_filters.searchDesc">
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Item Type</label>
                            <client-only>
                                <v-select :options="store.itemTypes" label="name" v-model="store.search_filters.searchItemType"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label"> Project </label>
                            <client-only>
                                <v-select @search="handleSearchProjects" :options="store.projects" label="name" v-model="store.search_filters.searchProject"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <button data-testid="search" @click="search" class="btn btn-primary" :disabled="isSearching">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'search']" />
                        </client-only> 
                            {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button data-testid="create-item" v-if="canCreate(authUser, 'canManageItem')" @click="onClickAdd" class="btn btn-primary float-end">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add
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
                                                <th class="bg-secondary text-white">Item Code</th>
                                                <th class="bg-secondary text-white">Description</th>
                                                <th class="bg-secondary text-white">Type</th>
                                                <th class="bg-secondary text-white">GWA Price</th>
                                                <th class="bg-secondary text-white">Quantity</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr @click="store.selected_row_indx = indx" :class="{'table-warning': indx === store.selected_row_indx}" v-for="i, indx in store.items">
                                                <td :data-test="`test-${i.description}`" class="text-muted align-middle"> {{ i.code }} </td>
                                                <td class="text-muted align-middle"> 
                                                    <textarea class="form-control form-control-sm" rows="3" readonly>{{ i.description }} {{ i.project_item ? `(${i.project_item.project.name})` : '' }}</textarea>                                                     
                                                </td>
                                                <td class="text-muted align-middle"> {{ i.item_type.name }} </td>
                                                <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.GWAPrice) }}
                                                </td>
                                                <td class="text-muted align-middle"> {{ i.total_quantity }} </td>
                                                <td class="align-middle text-center">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm"
                                                        :class="{ 'text-primary': canViewDetails(authUser, 'canManageItem') }"
                                                        :disabled="!canViewDetails(authUser, 'canManageItem')">
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

import * as api from '~/composables/warehouse/item/item.api'
import { fetchProjectsByName } from '~/composables/warehouse/project/project.api';
import { useItemStore } from '~/composables/warehouse/item/item.store';

definePageMeta({
    name: ROUTES.ITEM_INDEX,
    layout: "layout-warehouse",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const store = useItemStore()
const router = useRouter()

// flags
const isInitialLoad = ref(true)
const isSearching = ref(false)

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {
    authUser.value = getAuthUser()

    const { items, item_types, projects } = await api.fetchDataInSearchFilters()
    store.set_search_filters({ itemOptions: items, itemTypes: item_types, projects })

    isLoadingPage.value = false

})


// ======================== FUNCTIONS ======================== 

async function changePage(page: number) {
    store.remove_selected_row()

    isSearching.value = true

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: store.pagination.pageSize,
        description: store.search_filters.searchDesc,
        itemTypeCode: store.search_filters.searchItemType ? store.search_filters.searchItemType.code : null,
        project_id: store.search_filters.searchProject ? store.search_filters.searchProject.id : null,
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

    if (store.search_filters.searchItem) {

        const response = await api.findByCode(store.search_filters.searchItem.code)
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
        description: store.search_filters.searchDesc,
        itemTypeCode: store.search_filters.searchItemType ? store.search_filters.searchItemType.code : null,
        project_id: store.search_filters.searchProject ? store.search_filters.searchProject.id : null,
    })

    isSearching.value = false

    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}

async function handleSearchItems(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        store.search_filters.itemOptions = []
        return 
    } 

    debouncedSearchItems(input, loading)

}

async function handleSearchProjects(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        store.search_filters.projects = []
        return 
    } 

    debouncedSearchProjects(input, loading)

}

async function searchItems(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await api.fetchItemsByCode(input);
        store.set_search_filters({ itemOptions: response })
    } catch (error) {
        console.error('Error fetching Items:', error);
    } finally {
        loading(false);
    }
}

async function searchProjects(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchProjectsByName(input);
        store.set_search_filters({ projects: response })
    } catch (error) {
        console.error('Error fetching Projects:', error);
    } finally {
        loading(false);
    }
}


// ======================== UTILS ======================== 

const debouncedSearchItems = debounce((input: string, loading: (status: boolean) => void) => {
    searchItems(input, loading);
}, 500);

const debouncedSearchProjects = debounce((input: string, loading: (status: boolean) => void) => {
    searchProjects(input, loading);
}, 500);

const onClickViewDetails = (id: string) => router.push('/warehouse/item/view/' + id)
const onClickAdd = () => router.push('/warehouse/item/create')

</script>