<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center pt-3">
        
                <div class="col-lg-6">
        
                    <div v-if="item">
        
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> Division Info
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div class="row pt-3">
                            <div class="col">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="text-muted">Code</td>
                                            <td> {{ item.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Name</td>
                                            <td> {{ item.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Department</td>
                                            <td> {{ item.department.name }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
        
                        <div class="row pt-5">
                            <div class="col">
                                <div class="d-flex justify-content-end gap-2">
                                    <div class="d-flex justify-content-end gap-2">
                                        <button v-if="canRead(authUser, 'canManageDivision', SERVICES.SYSTEM)" class="btn btn-secondary"
                                            @click="onClickGoToList">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'list']"/>
                            </client-only> Go to List
                                        </button>
                                        <button v-if="canEdit(authUser, 'canManageDivision', SERVICES.SYSTEM)" class="btn btn-success"
                                            @click="onClickUpdate">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> Update
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageDivision', SERVICES.SYSTEM)" class="btn btn-primary"
                                            @click="onClickAddNew">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add New
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

import * as api from '~/composables/hr/division/division.api'
import type { Division } from '~/composables/hr/division/division';


definePageMeta({
    name: ROUTES.DIVISION_VIEW,
    layout: "layout-hr",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter()
const route = useRoute()
const item = ref<Division | undefined>()

onMounted(async () => {
    authUser.value = getAuthUser()
    item.value = await api.findOne(route.params.id as string)
    console.log('item.value', item.value);
    isLoadingPage.value = false

})


const onClickGoToList = () => router.push(`/hr/division`);
const onClickAddNew = () => router.push(`/hr/division/create`);
const onClickUpdate = () => router.push(`/hr/division/${item.value?.id}`);


</script>