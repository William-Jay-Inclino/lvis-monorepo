<template>

    <div class="container">
        <div class="card">
            <div class="card-body">
                <div v-if="!isLoadingPage && authUser">
                    <h2 class="text-warning">Search Complaint</h2>
            
                    <hr>
            
                    <div class="row pt-3">
                        <div class="col-lg-4 col-md-6 col-sm-12">
                            <div class="mb-3">
                                <label class="form-label">Ref Number</label>
                                <client-only>
                                    <v-select @search="handleSearchRefNumber" :options="store.complaints" label="rc_number" v-model="store.search_filters.complaint"></v-select>
                                </client-only>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-12">
                            <div class="mb-3">
                                <label class="form-label">Date</label>
                                <input v-model="store.search_filters.created_at" type="date" class="form-control">
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-12">
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <client-only>
                                    <v-select label="name"></v-select>
                                </client-only>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-12">
                            <div class="mb-3">
                                <label class="form-label">Complainant Name</label>
                                <input type="text" class="form-control">
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-12">
                            <div class="mb-3">
                                <label class="form-label">Complainant Contact #</label>
                                <input type="text" class="form-control">
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-12">
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <input type="text" class="form-control">
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
                        <button data-testid="create-complaint" v-if="canCreate(authUser, 'canManageComplaint')" @click="onClickAdd"
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
                                                    <th class="bg-secondary text-white no-wrap">Ref Number</th>
                                                    <th class="bg-secondary text-white">Complainant</th>
                                                    <th class="bg-secondary text-white">Complainant Contact #</th>
                                                    <th class="bg-secondary text-white">Description</th>
                                                    <th class="bg-secondary text-white">Date</th>
                                                    <th class="bg-secondary text-white">Status</th>
                                                    <th class="bg-secondary text-center text-white">
                                                        <client-only>
                                                        <font-awesome-icon :icon="['fas', 'cog']" />
                                                    </client-only>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr @click="store.selected_row_indx = indx" :class="{'table-warning': indx === store.selected_row_indx}" v-for="i, indx in store.items">
                                                    <td class="text-muted align-middle no-wrap"> {{ i.ref_number }} </td>
                                                    <td class="text-muted align-middle no-wrap"> {{ i.complainant_name }} </td>
                                                    <td class="text-muted align-middle no-wrap"> {{ i.complainant_contact_no }} </td>
                                                    <td class="text-muted align-middle no-wrap">
                                                        <textarea rows="3" class="form-control form-control-sm small text-muted">{{ i.description }}</textarea>
                                                    </td>
                                                    <td class="text-muted align-middle no-wrap"> {{ formatDate(i.created_at) }} </td>
                                                    <td class="text-muted align-middle no-wrap">
                                                        <div :class="`badge soft-badge soft-badge-${ i.status?.color_class }`">
                                                            {{ i.status?.name }}
                                                        </div>
                                                    </td>
                                                    <td class="align-middle text-center no-wrap">
                                                        <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm" :class="{ 'text-primary': canViewDetails(authUser, 'canManageComplaint') }"
                                                            :disabled="!canViewDetails(authUser, 'canManageComplaint')">
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
    </div>


</template>


<script setup lang="ts">

import * as api from '~/composables/powerserve/complaint/complaint.api'
import { ROUTES } from '~/utils/constants';
import { debounce } from '~/utils/helpers';
import { useComplaintStore } from '~/composables/powerserve/complaint/complaint.store';

definePageMeta({
    name: ROUTES.COMPLAINT_INDEX,
    layout: "layout-powerserve",
    middleware: ['auth']
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const router = useRouter()
const store = useComplaintStore()
// flags

const isInitialLoad = ref(true)
const isSearching = ref(false)

// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    authUser.value = getAuthUser()

    // const { complaintes, employees } = await api.fetchDataInSearchFilters()
    // store.set_search_filters({ complaintes, employees })
    isLoadingPage.value = false

})

// ======================== FUNCTIONS ======================== 



async function changePage(page: number) {
    store.remove_selected_row()

    isSearching.value = true

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: store.pagination.pageSize,
        created_at: store.search_filters.created_at,

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

    if (store.search_filters.complaint) {

        const response = await api.findByRefNumber(store.search_filters.complaint.ref_number)
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
        created_at: store.search_filters.created_at,

    })

    isSearching.value = false

    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}

async function handleSearchRefNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        store.search_filters.complaints = []
        return
    } 

    debouncedSearchRefNumbers(input, loading)

}

async function searchRefNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRefNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await api.fetchRefNumbers(input);
        console.log('response', response);
        store.set_search_filters({ complaints: response })
    } catch (error) {
        console.error('Error fetching ref numbers:', error);
    } finally {
        loading(false);
    }
}

// ======================== UTILS ======================== 

const onClickViewDetails = (id: number) => router.push('/powerserve/complaint/view/' + id)
const onClickAdd = () => router.push('/powerserve/complaint/create')

const debouncedSearchRefNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRefNumbers(input, loading);
}, 500);

</script>


<style scoped>

    /* .container {
        max-width: 1600px; 
        margin: 0 auto; 
    } */

</style>