<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center">
        
                <div class="col-lg-9">
        
                    <div v-if="item">
        
                        <div class="row pt-3">
                            <div class="col">
                                <div class="h5wrapper mb-3">
                                    <hr class="result">
                                    <h5 class="text-warning fst-italic">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> Canvass Info
                                    </h5>
                                    <hr class="result">
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <tbody>
                                            <tr>
                                                <td class="text-muted">RC Number</td>
                                                <td> {{ item.rc_number }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">RV Number</td>
                                                <td>
                                                    <div v-if="item.rv">
                                                        <nuxt-link :to="'/warehouse/rv/view/' + item.rv.id">{{
                item.rv.rv_number }}</nuxt-link>
                                                    </div>
                                                    <div v-else>
                                                        N/A
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">JO Number</td>
                                                <td>
                                                    <div v-if="item.jo">
                                                        <nuxt-link :to="'/warehouse/jo/view/' + item.jo.id">{{
                item.jo.jo_number }}</nuxt-link>
                                                    </div>
                                                    <div v-else>
                                                        N/A
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">SPR Number</td>
                                                <td>
                                                    <div v-if="item.spr">
                                                        <nuxt-link :to="'/warehouse/spr/view/' + item.spr.id">{{
                item.spr.spr_number }}</nuxt-link>
                                                    </div>
                                                    <div v-else>
                                                        N/A
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">MEQS Number</td>
                                                <td>
                                                    <div v-if="item.rv && item.rv.meqs">
                                                        <nuxt-link :to="'/warehouse/meqs/view/' + item.rv.meqs.id">
                                                            {{ item.rv.meqs.meqs_number }}
                                                        </nuxt-link>
                                                    </div>
                                                    <div v-else-if="item.jo && item.jo.meqs">
                                                        <nuxt-link :to="'/warehouse/meqs/view/' + item.jo.meqs.id">
                                                            {{ item.jo.meqs.meqs_number }}
                                                        </nuxt-link>
                                                    </div>
                                                    <div v-else-if="item.spr && item.spr.meqs">
                                                        <nuxt-link :to="'/warehouse/meqs/view/' + item.spr.meqs.id">
                                                            {{ item.spr.meqs.meqs_number }}
                                                        </nuxt-link>
                                                    </div>
                                                    <div v-else>
                                                        N/A
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">PO Number/s</td>
                                                <td>
                                                    <div v-if="hasPO">
                                                        <div v-if="item.rv"
                                                            v-for="meqsSupplier in item.rv.meqs!.meqs_suppliers">
                                                            <nuxt-link v-if="meqsSupplier.po"
                                                                :to="'/warehouse/po/view/' + meqsSupplier.po.id">
                                                                {{ meqsSupplier.po.po_number }}
                                                            </nuxt-link>
                                                        </div>
                                                        <div v-else-if="item.jo"
                                                            v-for="meqsSupplier in item.jo.meqs!.meqs_suppliers">
                                                            <nuxt-link v-if="meqsSupplier.po"
                                                                :to="'/warehouse/po/view/' + meqsSupplier.po.id">
                                                                {{ meqsSupplier.po.po_number }}
                                                            </nuxt-link>
                                                        </div>
                                                        <div v-if="item.spr"
                                                            v-for="meqsSupplier in item.spr.meqs!.meqs_suppliers">
                                                            <nuxt-link v-if="meqsSupplier.po"
                                                                :to="'/warehouse/po/view/' + meqsSupplier.po.id">
                                                                {{ meqsSupplier.po.po_number }}
                                                            </nuxt-link>
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        N/A
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">RR Number/s</td>
                                                <td>
                                                    <div v-if="hasRR">
                                                        <div v-if="item.rv"
                                                            v-for="meqsSupplier in item.rv.meqs!.meqs_suppliers">
                                                            <div v-if="meqsSupplier.po && meqsSupplier.po.rrs.length > 0">
                                                                <div v-for="rr in meqsSupplier.po.rrs">
                                                                    <nuxt-link :to="'/warehouse/rr/view/' + rr.id">
                                                                        {{ rr.rr_number }}
                                                                    </nuxt-link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div v-if="item.jo"
                                                            v-for="meqsSupplier in item.jo.meqs!.meqs_suppliers">
                                                            <div v-if="meqsSupplier.po && meqsSupplier.po.rrs.length > 0">
                                                                <div v-for="rr in meqsSupplier.po.rrs">
                                                                    <nuxt-link :to="'/warehouse/rr/view/' + rr.id">
                                                                        {{ rr.rr_number }}
                                                                    </nuxt-link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div v-if="item.spr"
                                                            v-for="meqsSupplier in item.spr.meqs!.meqs_suppliers">
                                                            <div v-if="meqsSupplier.po && meqsSupplier.po.rrs.length > 0">
                                                                <div v-for="rr in meqsSupplier.po.rrs">
                                                                    <nuxt-link :to="'/warehouse/rr/view/' + rr.id">
                                                                        {{ rr.rr_number }}
                                                                    </nuxt-link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        N/A
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Date Requested</td>
                                                <td> {{ formatDate(item.date_requested) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Purpose</td>
                                                <td> {{ item.purpose }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Notes</td>
                                                <td> {{ item.notes }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Requisitioner</td>
                                                <td> {{ getFullname(item.requested_by!.firstname, item.requested_by!.middlename,
                item.requested_by!.lastname) }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
                            </div>
        
                        </div>
        
        
        
        
                        <div class="row pt-3">
                            <div class="col">
        
                                <div v-if="!isMobile">
        
                                    <div class="h5wrapper mb-3">
                                        <hr class="result">
                                        <h5 class="text-warning fst-italic">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                            </client-only> Canvass Items
                                        </h5>
                                        <hr class="result">
                                    </div>
        
                                    <div class="table-responsive">
                                        <table class="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th class="bg-secondary text-white"> No. </th>
                                                    <th class="bg-secondary text-white"> Description </th>
                                                    <th class="bg-secondary text-white"> Item Class </th>
                                                    <th class="bg-secondary text-white"> Unit </th>
                                                    <th class="bg-secondary text-white"> Quantity </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="i, count in item.canvass_items">
                                                    <td> {{ count + 1 }} </td>
                                                    <td> {{ i.item ? `${ i.item.code } - ${ i.item.description }` : i.description }} </td>
                                                    <td> {{ i.item ? 'Stock' : 'Non-Stock' }} </td>
                                                    <td> {{ i.unit ? i.unit.name : 'N/A' }} </td>
                                                    <td> {{ i.quantity }} </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
        
                            </div>
                        </div>
        
                        <hr>
        
                        <div class="row mb-3 pt-3">
                            <div class="col">
                                <div class="d-flex justify-content-end">
                                    <div class="me-2">
                                        <nuxt-link v-if="canSearch(authUser, 'canManageCanvass')" class="btn btn-secondary me-2"
                                            to="/warehouse/canvass">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search Canvass
                                        </nuxt-link>
                                        <button v-if="canPrint(authUser, 'canManageCanvass')" @click="onClickPrint" class="btn btn-danger" data-bs-toggle="modal"
                                            data-bs-target="#purchasingPdfModal">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'print']"/>
                            </client-only> Print Canvass
                                        </button>
                                    </div>
                                    <div>
                                        <nuxt-link v-if="!!item.can_update" class="btn btn-success me-2"
                                            :to="`/warehouse/canvass/${item.id}`">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> Update Canvass
                                        </nuxt-link>
                                        <nuxt-link v-if="canCreate(authUser, 'canManageCanvass')" class="btn btn-primary"
                                            to="/warehouse/canvass/create">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add New Canvass
                                        </nuxt-link>
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

import * as api from '~/composables/warehouse/canvass/canvass.api'
import type { Canvass } from '~/composables/warehouse/canvass/canvass.types';
import { MOBILE_WIDTH } from '~/utils/config';
import { ROUTES } from '~/utils/constants';
import axios from 'axios';
import { canPrint } from '~/utils/permissions';

definePageMeta({
    name: ROUTES.CANVASS_VIEW,
    layout: "layout-warehouse",
    middleware: ['auth']
})

const isLoadingPage = ref(true)
const isLoadingPdf = ref(false)

const config = useRuntimeConfig()
const WAREHOUSE_API_URL = config.public.warehouseApiUrl

const authUser = ref<AuthUser>({} as AuthUser)
const route = useRoute()
const item = ref<Canvass | undefined>()
const isMobile = ref(false)

const pdfUrl = ref('')

onMounted(async () => {

    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);

    authUser.value = getAuthUser()

    item.value = await api.findOne(route.params.id as string)


    isLoadingPage.value = false

})

function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}

const hasPO = computed(() => {

    if (!item.value) return false

    if (item.value.rv && item.value.rv.meqs && item.value.rv.meqs.meqs_suppliers) {

        const meqsSupplier = item.value.rv.meqs.meqs_suppliers.find(i => !!i.po)

        if (meqsSupplier) {
            return true
        }

        return false

    }

    if (item.value.spr && item.value.spr.meqs && item.value.spr.meqs.meqs_suppliers) {

        const meqsSupplier = item.value.spr.meqs.meqs_suppliers.find(i => !!i.po)

        if (meqsSupplier) {
            return true
        }

        return false

    }

    if (item.value.jo && item.value.jo.meqs && item.value.jo.meqs.meqs_suppliers) {

        const meqsSupplier = item.value.jo.meqs.meqs_suppliers.find(i => !!i.po)

        if (meqsSupplier) {
            return true
        }

        return false

    }

})

const hasRR = computed(() => {

    if (!item.value) return false

    if (item.value.rv && item.value.rv.meqs && item.value.rv.meqs.meqs_suppliers) {

        const meqsSupplier = item.value.rv.meqs.meqs_suppliers.find(i => !!i.po)

        if (meqsSupplier && meqsSupplier.po && meqsSupplier.po.rrs.length > 0) {
            return true
        }

        return false

    }

    if (item.value.spr && item.value.spr.meqs && item.value.spr.meqs.meqs_suppliers) {

        const meqsSupplier = item.value.spr.meqs.meqs_suppliers.find(i => !!i.po)

        if (meqsSupplier && meqsSupplier.po && meqsSupplier.po.rrs.length > 0) {
            return true
        }

        return false

    }

    if (item.value.jo && item.value.jo.meqs && item.value.jo.meqs.meqs_suppliers) {

        const meqsSupplier = item.value.jo.meqs.meqs_suppliers.find(i => !!i.po)

        if (meqsSupplier && meqsSupplier.po && meqsSupplier.po.rrs.length > 0) {
            return true
        }

        return false

    }

})


async function onClickPrint() {
    console.log('onClickPrint()');
    try {

        const accessToken = authUser.value.access_token

        isLoadingPdf.value = true

        const response = await axios.get(WAREHOUSE_API_URL + '/canvass/pdf/' + item.value?.id, {
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

</script>
