<template>

    <div class="card">
        <div class="card-body">
            <div v-if="!isLoadingPage && authUser" class="row justify-content-center pt-3">
        
                <div class="col-lg-6">
        
                    <div v-if="item">
        
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <i class="fas fa-info-circle"></i> Department Info
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div class="row pt-3">
                            <div class="col">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="text-muted">Code</td>
                                            <td> {{ item.code }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Name</td>
                                            <td> {{ item.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Status</td>
                                            <td>
                                                <div :class="{ [`badge bg-${departmentStatus[item.status].color}`]: true }">
                                                    {{ departmentStatus[item.status].label }}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
        
                        <div class="row pt-5">
                            <div class="col">
                                <div class="d-flex justify-content-end gap-2">
                                    <div class="d-flex justify-content-end gap-2">
                                        <button v-if="canRead(authUser, 'canManageDepartment')" class="btn btn-secondary"
                                            @click="onClickGoToList">
                                            <i class="fas fa-list"></i> Go to List
                                        </button>
                                        <button v-if="canEdit(authUser, 'canManageDepartment')" class="btn btn-success"
                                            @click="onClickUpdate">
                                            <i class="fas fa-sync"></i> Update
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageDepartment')" class="btn btn-primary"
                                            @click="onClickAddNew">
                                            <i class="fas fa-plus"></i> Add New
                                        </button>
                                    </div>
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
import type { Department } from '~/composables/system/department/department';
import { departmentStatus } from '~/utils/constants'

definePageMeta({
    name: ROUTES.DEPARTMENT_VIEW,
    layout: "layout-system",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter()
const route = useRoute()
const item = ref<Department | undefined>()

onMounted(async () => {
    authUser.value = getAuthUser()
    item.value = await api.findOne(route.params.id as string)
    isLoadingPage.value = false

})


const onClickGoToList = () => router.push(`/system/data-management/department`);
const onClickAddNew = () => router.push(`/system/data-management/department/create`);
const onClickUpdate = () => router.push(`/system/data-management/department/${item.value?.id}`);


</script>