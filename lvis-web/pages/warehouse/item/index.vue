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
                                <v-select @search="handleSearchItems" :options="itemOptions" label="code" v-model="searchItem"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <input type="text" class="form-control" v-model="searchDesc">
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">Item Type</label>
                            <client-only>
                                <v-select :options="itemTypes" label="name" v-model="searchItemType"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label"> Project </label>
                            <client-only>
                                <v-select @search="handleSearchProjects" :options="projects" label="name" v-model="searchProject"></v-select>
                            </client-only>
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
                    <button v-if="canCreate(authUser, 'canManageItem')" @click="onClickAdd" class="btn btn-primary float-end">
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
                                            <tr v-for="i in items">
                                                <td class="text-muted align-middle"> {{ i.code }} </td>
                                                <td class="text-muted align-middle"> 
                                                    {{ i.description }} {{ i.project_item ? `(${i.project_item.project.name})` : '' }} 
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

import * as api from '~/composables/warehouse/item/item.api'
import type { Item, ItemType } from '~/composables/warehouse/item/item.type';
import { PAGINATION_SIZE } from '~/utils/config'
import { useToast } from "vue-toastification";
import type { Project } from '~/composables/warehouse/project/project.types';
import { fetchProjectsByName } from '~/composables/warehouse/project/project.api';


definePageMeta({
    name: ROUTES.ITEM_INDEX,
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

// pagination
const _paginationInitial = {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: PAGINATION_SIZE,
}
const pagination = ref({ ..._paginationInitial })


// search filters
const itemOptions = ref<Item[]>([])
const itemTypes = ref<ItemType[]>([])
const projects = ref<Project[]>([])
const searchItem = ref<Item | null>(null)
const searchDesc = ref('')
const searchItemType = ref<ItemType | null>(null)
const searchProject = ref<Project | null>(null)
// ----------------


// container for search result
const items = ref<Item[]>([])

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await api.fetchDataInSearchFilters()

    console.log('response', response)

    itemOptions.value = response.items
    itemTypes.value = response.item_types
    projects.value = response.projects
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

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: pagination.value.pageSize,
        description: searchDesc.value,
        itemTypeCode: searchItemType.value ? searchItemType.value.code : null,
        project_id: searchProject.value ? searchProject.value.id : null,
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

    if (searchItem.value) {

        const response = await api.findByCode(searchItem.value.code)
        isSearching.value = false

        console.log('response', response)

        if (response) {
            items.value.push(response)
            return
        }

        return

    }

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page: 1,
        pageSize: pagination.value.pageSize,
        description: searchDesc.value,
        itemTypeCode: searchItemType.value ? searchItemType.value.code : null,
        project_id: searchProject.value ? searchProject.value.id : null,
    })

    isSearching.value = false

    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}

async function handleSearchItems(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        itemOptions.value = []
        return 
    } 

    debouncedSearchItems(input, loading)

}

async function handleSearchProjects(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        projects.value = []
        return 
    } 

    debouncedSearchProjects(input, loading)

}

async function searchItems(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await api.fetchItemsByCode(input);
        itemOptions.value = response
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
        projects.value = response
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