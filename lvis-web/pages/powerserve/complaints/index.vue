<template>

    <div class="card">
        <div class="card-body">
            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Search Complaints</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Ref Number</label>
                            <client-only>
                                <v-select :options="store.complaints" label="ref_number" v-model="store.search_filters.selected_complaint"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <client-only>
                                <v-select :options="store.complaint_statuses" label="name" v-model="store.search_filters.selected_complaint_status"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Complainant Name</label>
                            <input v-model="store.search_filters.complainant_name" type="text" class="form-control">
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Complainant Contact Number</label>
                            <input v-model="store.search_filters.complainant_contact_no" type="text" class="form-control">
                        </div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-primary" :disabled="isSearching">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                    <button @click="onClickAdd"
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
                                                <th class="bg-secondary text-white no-wrap">Complainant Name</th>
                                                <th class="bg-secondary text-white no-wrap">Complainant Contact #</th>
                                                <th class="bg-secondary text-white">Status</th>
                                                <th class="bg-secondary text-white">Location</th>
                                                <th class="bg-secondary text-white">Remarks</th>
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
                                                <td class="text-muted align-middle no-wrap"> {{ i.complaint_status_id }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ '<Location>' }} </td>
                                                <td class="text-muted align-middle no-wrap"> {{ '<Remarks>' }} </td>
                                                <td class="align-middle text-center no-wrap">
                                                    <button @click="onClickViewDetails(i._id)" class="btn btn-light btn-sm text-primary">
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
                                            <a class="page-link" href="#">Previous</a>
                                        </li>

                                        <!-- First Page -->
                                        <li v-if="store.visiblePages[0] > 1" class="page-item">
                                            <a class="page-link" href="#">1</a>
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
                                            <a class="page-link" href="#">{{ page }}</a>
                                        </li>

                                        <!-- Last Page -->
                                        <li v-if="store.visiblePages[store.visiblePages.length - 1] < store.pagination.totalPages - 1" class="page-item disabled">
                                            <span class="page-link">...</span>
                                        </li>
                                        <li v-if="store.visiblePages[store.visiblePages.length - 1] < store.pagination.totalPages" class="page-item">
                                            <a class="page-link" href="#">{{ store.pagination.totalPages }}</a>
                                        </li>

                                        <!-- Next Button -->
                                        <li class="page-item" :class="{ disabled: store.pagination.currentPage === store.pagination.totalPages }">
                                            <a class="page-link" href="#">Next</a>
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

import { ROUTES } from '~/utils/constants';
import { useComplaintStore } from '~/composables/powerserve/complaints/complaints.store';
import { complaintStatuses, complaintReportTypes, natureOfComplaints, complaints  } from '~/composables/powerserve/complaints/complaints.mock-data'

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

    store.set_search_filters({ 
        complaint_statuses: complaintStatuses.map(i => ({...i})),
    })

    store.search_filters.complaints = complaints.map(i => ({...i}))
    store.items = complaints.map(i => ({...i}))

    isLoadingPage.value = false

})

// ======================== FUNCTIONS ======================== 


// ======================== UTILS ======================== 

const onClickViewDetails = (id: number) => router.push('/powerserve/complaints/view/' + id)
const onClickAdd = () => router.push('/powerserve/complaints/create')


</script>