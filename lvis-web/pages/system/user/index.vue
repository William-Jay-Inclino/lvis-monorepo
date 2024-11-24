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
                            v-model="searchValue">
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
    
                <div v-show="items.length > 0" class="col-lg-10">
    
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
                                        <tr v-for="i in items">
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



    </div>

</template>


<script setup lang="ts">

definePageMeta({
    layout: "layout-system"
})

import * as api from '~/composables/system/user/user.api'
import type { User } from '~/composables/system/user/user.types';
import { PAGINATION_SIZE } from '~/utils/config'
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";
import { userStatus } from '~/utils/constants'


const toast = useToast();
const router = useRouter()

const items = ref<User[]>([])
const _paginationInitial = {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: PAGINATION_SIZE,
}


const isSearching = ref(false)


const searchValue = ref(null)
const pagination = ref({ ..._paginationInitial })

onMounted(async () => {

    isSearching.value = true
    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page: 1,
        pageSize: pagination.value.pageSize,
        searchValue: searchValue.value
    })
    isSearching.value = false

    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
})

async function changePage(page: number) {
    isSearching.value = true
    const { data, currentPage, totalItems, totalPages } = await api.findAll({
        page,
        pageSize: pagination.value.pageSize,
        searchValue: null

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
        page: 1,
        pageSize: pagination.value.pageSize,
        searchValue: searchValue.value

    })
    isSearching.value = false
    items.value = data
    pagination.value.totalItems = totalItems
    pagination.value.currentPage = currentPage
    pagination.value.totalPages = totalPages
}

async function onClickDelete(id: string) {
    console.log('onClickDelete', id)

    const indx = items.value.findIndex(i => i.id === id)
    const item = items.value[indx]


    if (!item) {
        console.error('Item not found with id: ' + id)
        return
    }

    Swal.fire({
        title: "Are you sure?",
        text: `${item.username} will be removed!`,
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, remove it!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (remove) => {

            if (remove) {
                const response = await api.remove(item.id)

                if (response.success) {

                    items.value.splice(indx, 1)
                    toast.success(response.msg)


                } else {

                    Swal.fire({
                        title: 'Error!',
                        text: response.msg,
                        icon: 'error',
                        position: 'top',
                    })

                }
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}


const onClickCreate = () => router.push('/system/user/create')
const onClickEdit = (id: string) => router.push('/system/user/' + id)
const onClickViewDetails = (id: string) => router.push('/system/user/view/' + id)

</script>