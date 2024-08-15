<template>

    <div class="card">
        <div class="card-body">
        
            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Position</h2>
        
                <hr>
        
                <div class="row">
                    <div class="col">
                        <button v-if="canCreate(authUser, 'canManagePosition')" @click="onClickCreate"
                            class="btn btn-primary float-end">
                            <i class="fas fa-plus"></i> Create
                        </button>
                    </div>
                </div>
        
                <div class="row justify-content-center pt-5">
                    <div class="col-lg-6">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="search for name..." v-model="searchValue">
                        </div>
                    </div>
                </div>
        
                <div class="row justify-content-center pt-3">
        
                    <div v-show="items.length > 0" class="col-lg-6">
        
                        <div class="row">
                            <div class="col">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white">Name</th>
                                                <th class="text-center bg-secondary text-white">
                                                    <i class="fas fa-cog"></i>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in filteredItems">
                                                <td class="text-muted"> {{ i.name }} </td>
                                                <td class="text-center">
                                                    <button :disabled="!canDelete(authUser, 'canManagePosition')"
                                                        @click="onClickDelete(i.id)" class="btn btn-sm btn-light me-3">
                                                        <i class="fas fa-trash"
                                                            :class="{ 'text-danger': canDelete(authUser, 'canManagePosition') }"></i>
                                                    </button>
                                                    <button :disabled="!canEdit(authUser, 'canManagePosition')"
                                                        @click="onClickEdit(i.id)" class="btn btn-sm btn-light">
                                                        <i class="fas fa-edit"
                                                            :class="{ 'text-primary': canEdit(authUser, 'canManagePosition') }"></i>
                                                    </button>
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

import * as api from '~/composables/system/position/position.api'
import type { Position } from '~/composables/system/position/position'
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";

definePageMeta({
    name: ROUTES.POSITION_INDEX,
    layout: "layout-system",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const toast = useToast();
const router = useRouter()

const items = ref<Position[]>([])
const searchValue = ref('')


onMounted(async () => {
    authUser.value = getAuthUser()
    items.value = await api.findAll()
    isLoadingPage.value = false

})

const filteredItems = computed(() => {

    if (searchValue.value.trim() === '') return items.value

    return items.value.filter(i => i.name.toLowerCase().includes(searchValue.value.toLowerCase()))

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

const onClickCreate = () => router.push('/system/data-management/position/create')
const onClickEdit = (id: string) => router.push('/system/data-management/position/' + id)

</script>