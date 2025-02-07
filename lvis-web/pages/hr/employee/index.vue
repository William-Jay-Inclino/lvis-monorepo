<template>

    <div class="card">
        <div class="card-body">
            <div v-if="!isLoadingPage && authUser">
        
                <h2 class="text-warning">Employee</h2>
        
                <hr>
        
                <div class="row">
                    <div class="col">
                        <button v-if="canCreate(authUser, 'canManageEmployee', SERVICES.SYSTEM)" @click="onClickCreate"
                            class="btn btn-primary float-end">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                            </client-only> 
                            Create
                        </button>
                    </div>
                </div>
        
                <div class="row justify-content-center pt-5">
                    <div class="col-lg-11">
                        <div class="input-group mb-3">
                            <!-- Dropdown for selecting searchBy -->
                            <select class="form-select" v-model="store.search_filters.searchBy" aria-label="Search By" style="max-width: 250px;">
                                <option value="name">Name</option>
                                <option value="employee_number">Employee Number</option>
                            </select>
                            <!-- Input for search value -->
                            <input 
                                @keyup.enter="search()" 
                                type="text" 
                                class="form-control" 
                                :placeholder="`Enter ${store.search_filters.searchBy.replace('_', ' ')}...`"
                                v-model="store.search_filters.searchValue" 
                            />
                            <!-- Search button -->
                            <button class="btn btn-primary" @click="search()">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'search']" />
                                </client-only>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
        
                <div class="row justify-content-center pt-3">
        
                    <div class="text-center text-muted fst-italic" v-show="isSearching">
                        Loading please wait...
                    </div>
        
                    <div v-show="store.items.length > 0 && !isSearching" class="col-lg-11">
        
                        <div class="row">
                            <div class="col">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white">Employee Name</th>
                                                <th class="bg-secondary text-white">Employee No.</th>
                                                <th class="bg-secondary text-white">Position</th>
                                                <th class="bg-secondary text-white">Rank</th>
                                                <th class="bg-secondary text-white">Department</th>
                                                <th class="bg-secondary text-white">Division</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr @click="store.selected_row_indx = indx" :class="{'table-warning': indx === store.selected_row_indx}" v-for="i, indx in store.items">
                                                <td class="text-muted"> {{ getFullname(i.firstname, i.middlename, i.lastname) }} </td>
                                                <td class="text-muted"> {{ i.employee_number }} </td>
                                                <td class="text-muted"> {{ i.position }} </td>
                                                <td class="text-muted"> {{ i.rank_number }} </td>
                                                <td class="text-muted"> {{ i.department.code }} </td>
                                                <td class="text-muted"> {{ i.division ? i.division.code : 'N/A' }} </td>
                                                <td class="align-middle text-center">
                                                    <button @click="onClickViewDetails(i.id)" class="btn btn-light btn-sm text-primary">
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

import * as api from '~/composables/hr/employee/employee.api'
import { useEmployeeStore } from '~/composables/hr/employee/employee.store';

definePageMeta({
    name: ROUTES.EMPLOYEE_INDEX,
    layout: "layout-hr",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const isSearching = ref(false)
const authUser = ref<AuthUser>({} as AuthUser)
const store = useEmployeeStore()
const router = useRouter()


onMounted(async () => {
    authUser.value = getAuthUser()
    isLoadingPage.value = false
})


async function changePage(page: number) {
    store.remove_selected_row()
    isSearching.value = true

    store.set_searched_results({ items: [] })

    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: store.pagination.pageSize,
        searchValue: store.search_filters.searchValue,
        searchBy: store.search_filters.searchBy,
    })
    isSearching.value = false
    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}

async function search() {
    store.remove_selected_row()
    isSearching.value = true
    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page: store.pagination.currentPage,
        pageSize: store.pagination.pageSize,
        searchValue: store.search_filters.searchValue,
        searchBy: store.search_filters.searchBy
    })
    isSearching.value = false
    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}

const onClickCreate = () => router.push('/hr/employee/create')
const onClickViewDetails = (id: string) => router.push('/hr/employee/view/' + id)


</script>