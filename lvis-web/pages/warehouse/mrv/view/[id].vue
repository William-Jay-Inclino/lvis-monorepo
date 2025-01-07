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
                            </client-only> MRV Info
                                    </h5>
                                    <hr class="result">
                                </div>

                                <div class="alert alert-info">
                                    <small class="fst-italic">
                                        Note: The system will automatically cancel this MRV if it's not approved by <b>{{ formatDate(item.exp_date) }}</b>.
                                    </small>
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <tbody>
                                            <tr>
                                                <td class="text-muted">Status</td>
                                                <td>
                                                    <div
                                                        :class="{ [`badge bg-${approvalStatus[item.status].color}`]: true }">
                                                        {{ approvalStatus[item.status].label }}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">MRV Number</td>
                                                <td> {{ item.mrv_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">MCT Number</td>
                                                <td>
                                                    <nuxt-link v-if="item.mct"
                                                        :to="'/warehouse/mct/view/' + item.mct.id">{{
                item.mct.mct_number
            }}</nuxt-link>
                                                    <div v-else> N/A </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Date</td>
                                                <td> {{ formatDate(item.date_requested) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Request Type</td>
                                                <td> {{ warehouseRequestTypeMapper[item.request_type] }} </td>
                                            </tr>
                                            <tr v-if="showORnumber(item.request_type)">
                                                <td class="text-muted">OR Number</td>
                                                <td> {{ item.or_number ? item.or_number : 'N/A' }} </td>
                                            </tr>
                                            <tr v-if="showMWOnumber(item.request_type)">
                                                <td class="text-muted">MWO Number</td>
                                                <td>
                                                    <span v-if="item.mwo_number">
                                                        {{ item.mwo_number }}
                                                    </span>
                                                    <span class="fst-italic" v-else>
                                                        <small class="text-danger">MWO number is automatically assigned when approved</small>
                                                    </span> 
                                                </td>
                                            </tr>
                                            <tr v-if="showCWOnumber(item.request_type)">
                                                <td class="text-muted">CWO Number</td>
                                                <td> {{ item.cwo_number ? item.cwo_number : 'N/A' }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">JO Number</td>
                                                <td> {{ item.jo_number ? item.jo_number : 'N/A' }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Item from</td>
                                                <td> {{ item.item_from.name }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Project Name</td>
                                                <td> {{ item.project ? item.project.name : 'N/A' }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted align-middle">Consumer Name</td>
                                                <td> 
                                                    <textarea class="form-control form-control-sm" rows="3" readonly>{{ item.consumer_name }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted align-middle">Location</td>
                                                <td> 
                                                    <textarea class="form-control form-control-sm" rows="3" readonly>{{ item.location }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted align-middle">Purpose</td>
                                                <td> 
                                                    <textarea class="form-control form-control-sm" rows="3" readonly>{{ item.purpose }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Requested by</td>
                                                <td> {{ getFullname(item.requested_by.firstname,
                item.requested_by.middlename, item.requested_by.lastname) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Withdrawn by</td>
                                                <td v-if="item.withdrawn_by"> {{
                getFullname(item.withdrawn_by.firstname,
                    item.withdrawn_by.middlename, item.withdrawn_by.lastname) }} </td>
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
                                            <tr v-for="i, count in item.mrv_approvers">
                                                <td class="align-middle"> {{ i.label }} </td>
                                                <td class="align-middle"> {{ getFullname(i.approver!.firstname,
                i.approver!.middlename, i.approver!.lastname) }} </td>
                                                <td v-if="!isBlankStatus(item.status, i.status)"
                                                    class="text-muted text-center align-middle">
                                                    <div
                                                        :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
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
                                                <th class="bg-secondary text-white"> Description </th>
                                                <th class="bg-secondary text-white"> Unit </th>
                                                <th class="bg-secondary text-white"> Quantity </th>
                                                <!-- <th class="bg-secondary text-white"> Available Qty </th> -->
                                                <th class="bg-secondary text-white"> Unit Price </th>
                                                <th class="bg-secondary text-white"> Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i, count in item.mrv_items">
                                                <td class="align-middle"> {{ count + 1 }} </td>
                                                <td class="align-middle" style="white-space: pre-line;">
                                                    <nuxt-link :to="'/warehouse/item/view/' + i.item.id">
                                                        <small>
                                                            {{ i.item.code + ' - ' + i.item.description }} 
                                                        </small>
                                                    </nuxt-link> 
                                                </td>
                                                <td class="align-middle"> {{ i.item.unit.name }} </td>
                                                <td class="align-middle"> {{ i.quantity }} </td>
                                                <!-- <td> {{ i.item.total_quantity - i.item.quantity_on_queue }} </td> -->
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
                                        <nuxt-link v-if="canSearch(authUser, 'canManageMRV')"
                                            class="btn btn-secondary me-2" to="/warehouse/MRV">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search MRV
                                        </nuxt-link>
                                        <button disabled
                                            v-if="item.status === APPROVAL_STATUS.APPROVED && canPrint(authUser, 'canManageMRV')"
                                            @click="onClickPrint" class="btn btn-danger">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'print']"/>
                            </client-only> Print MRV
                                        </button>
                                        <button ref="printBtn" v-show="false" data-bs-toggle="modal"
                                            data-bs-target="#purchasingPdfModal">print</button>
                                    </div>
                                    <div v-if="!item.cancelled_at">
                                        <button v-if="isAdminOrOwner(item.created_by, authUser) && item.status === APPROVAL_STATUS.PENDING"
                                            class="btn btn-warning me-2" @click="onCancelMRV()">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'times-circle']" />
                            </client-only> Cancel MRV
                                        </button>
                                        <button v-if="!!item.can_update" class="btn btn-success me-2"
                                            @click="onClickUpdate(item.id)">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']"/>
                            </client-only> Edit Form
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageMRV')" class="btn btn-primary me-2"
                                            @click="onClickAdd">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add New MRV
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

import * as api from '~/composables/warehouse/mrv/mrv.api'
import type { MRV } from '~/composables/warehouse/mrv/mrv.types';
import { approvalStatus } from '~/utils/constants'
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2'
import axios from 'axios';
import { canPrint } from '~/utils/permissions';
import { APPROVAL_STATUS, isBlankStatus } from '#imports';
import { showCWOnumber, showMWOnumber, showORnumber } from '~/utils/helpers';

definePageMeta({
    name: ROUTES.MRV_VIEW,
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

const item = ref<MRV | undefined>()

const pdfUrl = ref('')


onMounted(async () => {

    authUser.value = getAuthUser()

    item.value = await api.findOne(route.params.id as string)

    isLoadingPage.value = false

})


async function onCancelMRV() {

    Swal.fire({
        title: "Are you sure?",
        text: `This MRV will be cancelled!`,
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
                await cancelMrv()
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function cancelMrv() {
    console.log('cancelMrv')

    if (!item.value) return

    const response = await api.cancel(item.value.id)

    if (response.success) {
        toast.success(response.msg)
        item.value.cancelled_at = response.cancelled_at!

        router.push('/warehouse/mrv')

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

        const response = await axios.get(WAREHOUSE_API_URL + '/mrv/pdf/' + item.value?.id, {
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


const onClickAdd = () => router.push('/warehouse/mrv/create')
const onClickUpdate = (id: string) => router.push('/warehouse/mrv/' + id)

</script>