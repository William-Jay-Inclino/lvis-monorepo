<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Department</h2>
        
                <hr>
        
                <div class="row">
                    <div class="col">
                        <button v-if="canCreate(authUser, 'canManageDepartment', SERVICES.SYSTEM)" @click="onClickCreate"
                            class="btn btn-primary float-end">
                            <client-only>
                            <font-awesome-icon :icon="['fas', 'plus']"/>
                        </client-only> 
                        Create
                        </button>
                    </div>
                </div>
        
                <div class="row justify-content-center pt-5">
                    <div class="col-lg-8">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="search for code..." v-model="searchValue">
                        </div>
                    </div>
                </div>
        
                <div class="row justify-content-center pt-3">
        
                    <div v-show="items.length > 0" class="col-lg-8">
        
                        <div class="row">
                            <div class="col">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white">Code</th>
                                                <th class="bg-secondary text-white">Name</th>
                                                <th class="bg-secondary text-white">Status</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <client-only>
                                                    <font-awesome-icon :icon="['fas', 'cog']" />
                                                </client-only>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in filteredItems">
                                                <td class="text-muted"> {{ i.code }} </td>
                                                <td class="text-muted"> {{ i.name }} </td>
                                                <td class="text-muted">
                                                    <div :class="{ [`badge bg-${departmentStatus[i.status].color}`]: true }">
                                                        {{ departmentStatus[i.status].label }}
                                                    </div>
                                                </td>
                                                <td class="text-center">
                                                    <div class="d-inline-flex">
                                                        <button :disabled="!canDelete(authUser, 'canManageDepartment', SERVICES.SYSTEM)"
                                                            @click="onClickDelete(i.id)" class="btn btn-sm btn-light me-3">
                                                            <client-only>
                                                                <font-awesome-icon :icon="['fas', 'trash']" :class="{ 'text-danger': canDelete(authUser, 'canManageDepartment', SERVICES.SYSTEM) }"/>
                                                            </client-only>
                                                        </button>
                                                        <button :disabled="!canEdit(authUser, 'canManageDepartment', SERVICES.SYSTEM)"
                                                            @click="onClickEdit(i.id)" class="btn btn-sm btn-light">
                                                            <client-only>
                                                                <font-awesome-icon :icon="['fas', 'edit']" :class="{ 'text-primary': canEdit(authUser, 'canManageDepartment', SERVICES.SYSTEM) }" />
                                                            </client-only>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
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

import * as api from '~/composables/system/department/department.api'
import type { Department } from '~/composables/system/department/department'
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";
import { departmentStatus } from '~/utils/constants'

definePageMeta({
    name: ROUTES.DEPARTMENT_INDEX,
    layout: "layout-system",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const toast = useToast();
const router = useRouter()

const items = ref<Department[]>([])
const searchValue = ref('')


onMounted(async () => {
    authUser.value = getAuthUser()
    items.value = await api.findAll()
    isLoadingPage.value = false

})

const filteredItems = computed(() => {

    if (searchValue.value.trim() === '') return items.value

    return items.value.filter(i => i.code.toLowerCase().includes(searchValue.value.toLowerCase()))

})

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
        text: `${item.name} will be removed!`,
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

const onClickCreate = () => router.push('/system/department/create')
const onClickEdit = (id: string) => router.push('/system/department/' + id)

</script>