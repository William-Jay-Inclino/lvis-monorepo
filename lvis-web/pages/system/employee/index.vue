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
                    <div class="col-lg-10">
                        <div class="input-group mb-3">
                            <input @keyup.enter="search()" type="text" class="form-control" placeholder="Enter name..."
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
                                                <th class="bg-secondary text-white">Firstname</th>
                                                <th class="bg-secondary text-white">Middlename</th>
                                                <th class="bg-secondary text-white">Lastname</th>
                                                <th class="bg-secondary text-white">Status</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in items">
                                                <td class="text-muted"> {{ i.firstname }} </td>
                                                <td class="text-muted"> {{ i.middlename }} </td>
                                                <td class="text-muted"> {{ i.lastname }} </td>
                                                <td class="text-center align-middle">
                                                    <div :class="{ [`badge bg-${employeeStatus[i.status].color}`]: true }">
                                                        {{ employeeStatus[i.status].label }}
                                                    </div>
                                                </td>
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
        
            <div v-else>
                <LoaderSpinner />
            </div>
        </div>
    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/system/employee/employee.api'
import type { Employee } from '~/composables/system/employee/employee.types';
import { PAGINATION_SIZE } from '~/utils/config'
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";
import { employeeStatus } from '~/utils/constants';

definePageMeta({
    name: ROUTES.EMPLOYEE_INDEX,
    layout: "layout-system",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const toast = useToast();
const router = useRouter()
const config = useRuntimeConfig()

const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload'


const items = ref<Employee[]>([])
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
    authUser.value = getAuthUser()

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


    isLoadingPage.value = false
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

    const fullname = getFullname(item.firstname, item.middlename, item.lastname)

    Swal.fire({
        title: "Are you sure?",
        text: `${fullname} will be removed!`,
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

function getUploadsPath(src: string) {

    const path = src.replace(UPLOADS_PATH, '')
    console.log('PATH', path)

    const uploadsPath = API_FILE_ENDPOINT + path
    return uploadsPath

}

const onClickCreate = () => router.push('/system/employee/create')
const onClickEdit = (id: string) => router.push('/system/employee/' + id)
const onClickViewDetails = (id: string) => router.push('/system/employee/view/' + id)


</script>