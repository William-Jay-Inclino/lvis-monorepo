<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center">
        
                <div class="col-lg-10">
        
                    <div v-if="item">
        
                        <div class="row pt-3">
                            <div class="col">
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> MCRT Info
                                    </h5>
                                    <hr class="result">
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <tbody>
                                            <tr>
                                                <td class="text-muted">Status</td>
                                                <td data-testid="status">
                                                    <div :class="{ [`badge bg-${approvalStatus[item.status].color}`]: true }">
                                                        {{ approvalStatus[item.status].label }}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">MCRT Number</td>
                                                <td data-testid="mcrt-number"> {{ item.mcrt_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">MCT Number</td>
                                                <td>
                                                    <nuxt-link
                                                        data-testid="mct-number"
                                                        v-if="item.mct_number"
                                                        :to="'/warehouse/mct/view/' + item.mct_number">{{
                                                        item.mct_number
                                                        }}</nuxt-link>
                                                    <div v-else> N/A </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">SERIV Number</td>
                                                <td>
                                                    <nuxt-link
                                                        v-if="item.seriv_number"
                                                        :to="'/warehouse/seriv/view/' + item.seriv_number">{{
                                                        item.seriv_number
                                                        }}</nuxt-link>
                                                    <div v-else> N/A </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Date</td>
                                                <td> {{ formatDate(item.mcrt_date) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">CWO Number</td>
                                                <td> {{ cwo_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">MWO Number</td>
                                                <td> {{ mwo_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">JO Number</td>
                                                <td> {{ jo_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted align-middle">Notes</td>
                                                <td>
                                                    <textarea class="form-control form-control-sm" rows="5" readonly>{{ item.note }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Returned by</td>
                                                <td> {{ getFullname(item.returned_by.firstname, item.returned_by.middlename, item.returned_by.lastname) }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
                            </div>
        
                        </div>
        
        
        
        
                        <div class="row pt-3">
                            <div class="col">
        
        
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'users']"/>
                            </client-only> Signatories
                                    </h5>
                                    <hr class="result">
                                </div>
        
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white"> Label </th>
                                                <th class="bg-secondary text-white"> Approver </th>
                                                <th class="bg-secondary text-white"> Status </th>
                                                <th class="bg-secondary text-white"> Comment </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i, count in item.mcrt_approvers">
                                                <td class="align-middle"> {{ i.label }} </td>
                                                <td class="align-middle"> {{ getFullname(i.approver!.firstname,
                i.approver!.middlename, i.approver!.lastname) }} </td>
                                                <td v-if="!isBlankStatus(item.status, i.status)" class="text-muted text-center align-middle">
                                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                                        {{ approvalStatus[i.status].label }}
                                                    </div>
                                                    <div class="fst-italic" v-if="i.date_approval">
                                                        <small> {{ formatDate(i.date_approval, true) }} </small>
                                                    </div>
                                                </td>
                                                <td v-else class="text-muted text-center align-middle fst-italic">
                                                    N/A
                                                </td>
                                                <td>
                                                    <textarea rows="3" class="form-control form-control-sm" readonly
                                                        :value="i.notes || 'N/A'"></textarea>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
        
                            </div>
                        </div>
        
                        <hr>


                        <div class="row pt-3">
                            <div class="col">
        
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                            </client-only> Items
                                    </h5>
                                    <hr class="result">
                                </div>
    
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white"> No. </th>
                                                <th class="bg-secondary text-white"> Item Code </th>
                                                <th class="bg-secondary text-white"> Description </th>
                                                <th class="bg-secondary text-white"> Unit </th>
                                                <th class="bg-secondary text-white"> Quantity </th>
                                                <th class="bg-secondary text-white"> Unit Price </th>
                                                <th class="bg-secondary text-white"> Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i, count in item.mcrt_items">
                                                <td class="align-middle"> {{ count + 1 }} </td>
                                                <td class="align-middle">
                                                    <nuxt-link data-test="item-link" :to="'/warehouse/item/view/' + i.item.id">
                                                        {{ i.item.code }}
                                                    </nuxt-link> 
                                                </td>
                                                <td class="align-middle">
                                                    <textarea class="form-control form-control-sm" rows="5" readonly>{{ i.item.description }}</textarea>
                                                </td>
                                                <td class="align-middle"> {{ i.item.unit.name }} </td>
                                                <td class="align-middle"> {{ i.quantity }} </td>
                                                <td class="align-middle"> {{ formatToPhpCurrency(i.price) }} </td>
                                                <td class="align-middle"> {{ formatToPhpCurrency(i.quantity * i.price) }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
                            </div>
                        </div>
        
                        <hr>
        
                        <div class="row mb-3 pt-3">
                            <div class="col">
                                <div class="d-flex justify-content-end">
                                    <div class="me-2">
                                        <nuxt-link v-if="canSearch(authUser, 'canManageMCRT')" class="btn btn-secondary me-2"
                                            to="/warehouse/MCRT">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'search']" />
                                            </client-only> 
                                            Search MCRT
                                        </nuxt-link>
                                    </div>
                                    <div v-if="!item.cancelled_at">
                                        <button v-if="isAdminOrOwner(item.created_by, authUser) && item.status === APPROVAL_STATUS.PENDING" class="btn btn-warning me-2"
                                            @click="onCancelMCRT()">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'times-circle']" />
                                            </client-only> Cancel MCRT
                                        </button>
                                        <button v-if="!!item.can_update" class="btn btn-success me-2"
                                            @click="onClickUpdate(item.id)">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'edit']"/>
                                            </client-only> Edit Form
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageMCRT')" class="btn btn-primary me-2"
                                            @click="onClickAdd">
                                            <client-only>
                                                    <font-awesome-icon :icon="['fas', 'plus']"/>
                                            </client-only> Add New MCRT
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
        
            <WarehousePdfModal :is-loading-pdf="isLoadingPdf" :pdf-url="pdfUrl" />
            
        </div>
    </div>


</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/mcrt/mcrt.api'
import type { MCRT } from '~/composables/warehouse/mcrt/mcrt.types';
import { approvalStatus } from '~/utils/constants'
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';
import { APPROVAL_STATUS, isBlankStatus } from '#imports';

definePageMeta({
    name: ROUTES.MCRT_VIEW,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const isLoadingPdf = ref(false)

const config = useRuntimeConfig()
const WAREHOUSE_API_URL = config.public.warehouseApiUrl

const router = useRouter()
const route = useRoute()

const toast = useToast();

const printBtn = ref<HTMLButtonElement>()

const item = ref<MCRT | undefined>()

const pdfUrl = ref('')


onMounted(async () => {

    authUser.value = getAuthUser()

    item.value = await api.findOne(route.params.id as string)

    isLoadingPage.value = false

})


const jo_number = computed( () => {

    if(!item.value) return ''
        
    if(item.value.mct) {
        return item.value.mct.mrv.jo_number
    }

    if(item.value.seriv) {
        return item.value.seriv.jo_number
    }

    return ''

})

const mwo_number = computed( () => {

    if(!item.value) return ''
        
    if(item.value.mct) {
        return item.value.mct.mrv.mwo_number
    }

    if(item.value.seriv) {
        return item.value.seriv.mwo_number
    }

    return ''

})

const cwo_number = computed( () => {

    if(!item.value) return ''
        
    if(item.value.mct) {
        return item.value.mct.mrv.cwo_number
    }

    if(item.value.seriv) {
        return item.value.seriv.cwo_number
    }

    return ''

})


async function onCancelMCRT() {

    Swal.fire({
        title: "Are you sure?",
        text: `This MCRT will be cancelled!`,
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, cancel it!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (remove) => {

            if (remove) {
                await cancelMcrt()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelMcrt() {
    console.log('cancelMcrt')

    if (!item.value) return

    const response = await api.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/warehouse/mcrt')

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }


}

async function onClickPrint() {
    console.log('onClickPrint()');

    printBtn.value?.click()
    
    try {

        const accessToken = authUser.value.access_token

        isLoadingPdf.value = true

        const response = await axios.get(WAREHOUSE_API_URL + '/mcrt/pdf/' + item.value?.id, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${accessToken}`, // Include Authorization header
            },
        });

        isLoadingPdf.value = false

        const blob = new Blob([response.data], { type: 'application/pdf' });
        pdfUrl.value = window.URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}


const onClickAdd = () => router.push('/warehouse/mcrt/create')
const onClickUpdate = (id: string) => router.push('/warehouse/mcrt/' + id)

</script>