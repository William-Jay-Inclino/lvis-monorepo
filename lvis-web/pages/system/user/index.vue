<template>
    <div class="card">

        <div class="card-body">
            <h2 class="text-warning">Users</h2>
    
            <hr>
    
            <div class="row">
                <div class="col">
                    <button @click="onClickCreate" class="btn btn-primary float-end">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'plus']"/>
                        </client-only> 
                        Create
                    </button>
                </div>
            </div>
    
            <div class="row justify-content-center pt-5">
                <div class="col-lg-10">
                    <div class="input-group mb-3">
                        <input @keyup.enter="search()" type="text" class="form-control" placeholder="Enter username..."
                            v-model="store.search_filters.searchValue">
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
    
                <div v-show="store.items.length > 0 && !isSearching" class="col-lg-10">
    
                    <div class="row">
                        <div class="col">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th class="bg-secondary text-white">Username</th>
                                            <th class="bg-secondary text-white">User's Fullname</th>
                                            <th class="bg-secondary text-white text-center">Status</th>
                                            <th class="bg-secondary text-white">Role</th>
                                            <th class="text-center bg-secondary text-white">
                                                <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only> 
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr @click="store.selected_row_indx = indx" :class="{'table-warning': indx === store.selected_row_indx}" v-for="i, indx in store.items">
                                            <td class="text-muted"> {{ i.username }} </td>
                                            <td class="text-muted" v-if="i.user_employee">
                                                {{ getFullname(i.user_employee.employee.firstname,
                        i.user_employee.employee.middlename, i.user_employee.employee.lastname) }}
                                            </td>
                                            <td class="text-muted" v-else>
                                                {{ getFullname(i.firstname, i.middlename, i.lastname) }}
                                            </td>
                                            <td class="text-center align-middle">
                                                <div :class="{ [`badge bg-${userStatus[i.status].color}`]: true }">
                                                    {{ userStatus[i.status].label }}
                                                </div>
                                            </td>
                                            <td class="text-muted"> {{ i.role }} </td>
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



    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/system/user/user.api'
import { userStatus } from '~/utils/constants'
import { useUserStore } from '~/composables/system/user/user.store';

definePageMeta({
    name: ROUTES.USER_INDEX,
    layout: "layout-system",
    middleware: ['auth'],
})

const router = useRouter()
const store = useUserStore()

const isSearching = ref(false)
const authUser = ref<AuthUser>({} as AuthUser)


onMounted(async () => {
    authUser.value = getAuthUser()
})

async function changePage(page: number) {
    store.remove_selected_row()
    isSearching.value = true
    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: store.pagination.pageSize,
        searchValue: null

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
        searchValue: store.search_filters.searchValue

    })
    isSearching.value = false
    store.set_searched_results({ items: data })
    store.set_pagination({ currentPage, totalPages, totalItems })
}


const onClickCreate = () => router.push('/system/user/create')
const onClickViewDetails = (id: string) => router.push('/system/user/view/' + id)

</script>