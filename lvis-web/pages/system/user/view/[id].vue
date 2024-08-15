<template>

    <div class="card">
        <div class="card-body">
            <div v-if="!isLoadingPage" class="row justify-content-center pt-3">
        
                <div class="col-lg-6">
        
                    <div v-if="item">
        
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <i class="fas fa-info-circle"></i> User Info
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div class="row pt-3">
                            <div class="col">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="text-muted">Username</td>
                                            <td> {{ item.username }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Is Employee?</td>
                                            <td> {{ !item.user_employee ? 'No' : 'Yes' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Firstname</td>
                                            <td> {{ !item.user_employee ? item.firstname : item.user_employee.employee.firstname
                                                }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Middlename</td>
                                            <td> {{ !item.user_employee ? (item.middlename || 'N/A') :
                (item.user_employee.employee.middlename || 'N/A') }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Lastname</td>
                                            <td> {{ !item.user_employee ? item.lastname : item.user_employee.employee.lastname
                                                }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Role</td>
                                            <td> {{ item.role }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Status</td>
                                            <td>
                                                <div :class="{ [`badge bg-${userStatus[item.status].color}`]: true }">
                                                    {{ userStatus[item.status].label }}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
        
                        <div class="h5wrapper mb-3 pt-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <i class="fas fa-info-circle"></i> User Permissions
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div v-if="item.role === ROLE.ADMIN">
                            <div class="text-muted text-center">--No restrictions--</div>
                        </div>
        
                        <div v-else>
                            <SystemUserPermissions :permissions="item.permissions" :is-view-only="true" />
                        </div>
        
        
        
                        <div class="row pt-5 pb-5">
                            <div class="col">
                                <div class="d-flex justify-content-end gap-2">
                                    <div class="d-flex justify-content-end gap-2">
                                        <button class="btn btn-secondary" @click="onClickGoToList">
                                            <i class="fas fa-list"></i> Go to List
                                        </button>
                                        <button class="btn btn-success" @click="onClickUpdate">
                                            <i class="fas fa-sync"></i> Update
                                        </button>
                                        <button class="btn btn-primary" @click="onClickAddNew">
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

definePageMeta({
    layout: "layout-system"
})

import * as api from '~/composables/system/user/user.api'
import type { User, UserPermissions } from '~/composables/system/user/user.types';

const router = useRouter()
const route = useRoute()
const item = ref<User | undefined>()
const isLoadingPage = ref(true)

onMounted(async () => {
    item.value = await api.findOne(route.params.id as string);

    console.log('item.value', item.value)

    isLoadingPage.value = false;
});


const onClickGoToList = () => router.push(`/system/user`);
const onClickAddNew = () => router.push(`/system/user/create`);
const onClickUpdate = () => router.push(`/system/user/${item.value?.id}`);


</script>