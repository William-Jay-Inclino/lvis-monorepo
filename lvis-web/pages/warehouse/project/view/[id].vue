<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center pt-3">
        
                <div class="col-lg-9">
        
                    <div v-if="item">
        
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> Project Info
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div class="row pt-3">
                            <div class="col">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="text-muted">Name</td>
                                            <td> {{ item.name }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="h5wrapper mb-3 pt-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                            </client-only> Project Items
                            </h5>
                            <hr class="result">
                        </div>

                        <div v-if="item.project_items.length > 0" class="table-responsive">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white"> No. </th>
                                        <th class="bg-secondary text-white"> Description </th>
                                        <th class="bg-secondary text-white"> Unit </th>
                                        <th class="bg-secondary text-white"> Quantity </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="i, count in item.project_items">
                                        <td> {{ count + 1 }} </td>
                                        <td> {{ i.item.code + ' - ' + i.item.description }} </td>
                                        <td> {{ i.item.unit.name }} </td>
                                        <td> {{ i.item.total_quantity }} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="fst-italic text-muted text-center">
                            ------------ No Items ------------
                        </div>
        
                        <div class="row pt-5">
                            <div class="col">
                                <div class="d-flex justify-content-end gap-2">
                                    <div class="d-flex justify-content-end gap-2">
                                        <button v-if="canRead(authUser, 'canManageProject', SERVICES.SYSTEM)" class="btn btn-secondary"
                                            @click="onClickGoToList">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'list']"/>
                            </client-only> Go to List
                                        </button>
                                        <button v-if="canEdit(authUser, 'canManageProject', SERVICES.SYSTEM)" class="btn btn-success"
                                            @click="onClickUpdate">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> Update
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageProject', SERVICES.SYSTEM)" class="btn btn-primary"
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

import * as api from '~/composables/warehouse/project/project.api'
import type { Project } from '~/composables/warehouse/project/project.types';

definePageMeta({
    name: ROUTES.PROJECT_VIEW,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter()
const route = useRoute()
const item = ref<Project | undefined>()

onMounted(async () => {
    authUser.value = getAuthUser()
    item.value = await api.findOne(route.params.id as string)
    isLoadingPage.value = false

})


const onClickGoToList = () => router.push(`/warehouse/project`);
const onClickAddNew = () => router.push(`/warehouse/project/create`);
const onClickUpdate = () => router.push(`/warehouse/project/${item.value?.id}`);


</script>