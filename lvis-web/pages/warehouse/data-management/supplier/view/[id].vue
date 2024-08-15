<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center pt-3">
        
                <div class="col-lg-6">
        
                    <div v-if="item">
        
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <i class="fas fa-info-circle"></i> Supplier Info
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
                                        <tr>
                                            <td class="text-muted">Contact</td>
                                            <td> {{ item.contact }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Address</td>
                                            <td> {{ item.address }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">TIN</td>
                                            <td> {{ item.tin_no }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">VAT Status</td>
                                            <td> {{ item.is_vat_registered ? 'VAT Registered' : 'Non-VAT Registered' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">VAT Type</td>
                                            <td> {{ VAT[item.vat_type].label }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
        
                        <div class="row pt-5">
                            <div class="col">
                                <div class="d-flex justify-content-end gap-2">
                                    <div class="d-flex justify-content-end gap-2">
                                        <button v-if="canRead(authUser, 'canManageSupplier')" class="btn btn-secondary"
                                            @click="onClickGoToList">
                                            <i class="fas fa-list"></i> Go to List
                                        </button>
                                        <button v-if="canEdit(authUser, 'canManageSupplier')" class="btn btn-success"
                                            @click="onClickUpdate">
                                            <i class="fas fa-sync"></i> Update
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageSupplier')" class="btn btn-primary"
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

import * as api from '~/composables/warehouse/supplier/supplier.api'
import type { Supplier } from '~/composables/warehouse/supplier/supplier';

definePageMeta({
    name: ROUTES.SUPPLIER_VIEW,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter()
const route = useRoute()
const item = ref<Supplier | undefined>()

onMounted(async () => {
    authUser.value = getAuthUser()
    item.value = await api.findOne(route.params.id as string)
    isLoadingPage.value = false

})


const onClickGoToList = () => router.push(`/warehouse/data-management/supplier`);
const onClickAddNew = () => router.push(`/warehouse/data-management/supplier/create`);
const onClickUpdate = () => router.push(`/warehouse/data-management/supplier/${item.value?.id}`);


</script>