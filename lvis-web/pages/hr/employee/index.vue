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
                            <select class="form-select" v-model="searchBy" aria-label="Search By" style="max-width: 250px;">
                                <option value="name">Name</option>
                                <option value="employee_number">Employee Number</option>
                            </select>
                            <!-- Input for search value -->
                            <input 
                                @keyup.enter="search()" 
                                type="text" 
                                class="form-control" 
                                :placeholder="`Enter ${searchBy.replace('_', ' ')}...`"
                                v-model="searchValue" 
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
        
                    <div v-show="items.length > 0 && !isSearching" class="col-lg-11">
        
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
                                            <tr v-for="i in items">
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

import * as api from '~/composables/hr/employee/employee.api'
import type { Employee } from '~/composables/hr/employee/employee.types';
import { PAGINATION_SIZE } from '~/utils/config'

definePageMeta({
    name: ROUTES.EMPLOYEE_INDEX,
    layout: "layout-hr",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter()

const items = ref<Employee[]>([])
const _paginationInitial = {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: PAGINATION_SIZE,
}


const isSearching = ref(false)


const searchValue = ref(null)
const searchBy = ref<'name' | 'employee_number'>('name')
const pagination = ref({ ..._paginationInitial })

onMounted(async () => {
    authUser.value = getAuthUser()

    isSearching.value = true
    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page: 1,
        pageSize: pagination.value.pageSize,
        searchValue: searchValue.value,
        searchBy: searchBy.value
    })
    isSearching.value = false

    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages


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


async function changePage(page: number) {
    isSearching.value = true
    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: pagination.value.pageSize,
        searchValue: searchValue.value,
        searchBy: searchBy.value,
    })
    isSearching.value = false
    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}

async function search() {
    isSearching.value = true
    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
        searchValue: searchValue.value,
        searchBy: searchBy.value
    })
    isSearching.value = false
    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}

const onClickCreate = () => router.push('/hr/employee/create')
const onClickViewDetails = (id: string) => router.push('/hr/employee/view/' + id)


</script>