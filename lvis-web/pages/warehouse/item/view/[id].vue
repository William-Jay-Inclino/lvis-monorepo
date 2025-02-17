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
                            </client-only> Item Info
                                    </h5>
                                    <hr class="result">
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <tbody>
                                            <tr>
                                                <td class="text-muted">Item Code</td>
                                                <td data-testid="item-code"> {{ item.code }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Description</td>
                                                <td>
                                                    <textarea class="form-control form-control-sm" rows="5" readonly>{{ item.description }}</textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Item Type</td>
                                                <td> {{ item.item_type.name }} </td>
                                            </tr>
                                            <tr v-if="item.project_item">
                                                <td class="text-muted">Project</td>
                                                <td> {{ item.project_item.project.name }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Unit</td>
                                                <td> {{ item.unit.name }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Alert Level</td>
                                                <td> {{ item.alert_level }}% ({{ Math.round(item.total_quantity * (item.alert_level / 100))
                                                    }} Qty) </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Total Quantity</td>
                                                <td> {{ item.total_quantity }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Quantity on Queue</td>
                                                <td> {{ item.quantity_on_queue }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Available Quantity</td>
                                                <td> {{ item.total_quantity - item.quantity_on_queue }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Highest Price</td>
                                                <td> {{ highestPrice }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Lowest Price</td>
                                                <td> {{ lowestPrice }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">GWA Price</td>
                                                <td> {{ formatToPhpCurrency(item.GWAPrice) }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Initial Price</td>
                                                <td> {{ initialPrice }} </td>
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
                                <font-awesome-icon :icon="['fas', 'history']" />
                            </client-only> Item Transactions
                                    </h5>
                                    <hr class="result">
                                </div>
        
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white"> Txn Number </th>
                                                <th class="bg-secondary text-white"> Transaction </th>
                                                <th class="bg-secondary text-white"> Type </th>
                                                <th class="bg-secondary text-white"> Quantity </th>
                                                <th class="bg-secondary text-white"> Stock Balance </th>
                                                <th class="bg-secondary text-white"> Price </th>
                                                <th class="bg-secondary text-white"> Date </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in item.item_transactions">
                                                <td class="text-muted"> TXN-{{ formatTxnNumber(i.id) }} </td>
                                                <td class="text-muted">
                                                    <div v-if="i.rr_item">
                                                        <nuxt-link :data-testid="`rr-${ i.rr_item.rr?.rr_number }`" :to="'/warehouse/rr/view/' + i.rr_item.rr!.id"
                                                            target="_blank">
                                                            {{ `RR#${i.rr_item.rr?.rr_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else-if="i.osriv_item">
                                                        <nuxt-link :data-testid="`osriv-${ i.osriv_item.osriv.osriv_number }`" :to="'/warehouse/osriv/view/' + i.osriv_item.osriv!.id"
                                                            target="_blank">
                                                            {{ `OSRIV#${i.osriv_item.osriv?.osriv_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else-if="i.seriv_item">
                                                        <nuxt-link :data-testid="`seriv-${ i.seriv_item.seriv.seriv_number }`" :to="'/warehouse/seriv/view/' + i.seriv_item.seriv!.id"
                                                            target="_blank">
                                                            {{ `SERIV#${i.seriv_item.seriv?.seriv_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else-if="i.mrv_item && i.mrv_item.mrv.mct">
                                                        <nuxt-link :data-testid="`mct-${ i.mrv_item.mrv.mct.mct_number }`" :to="'/warehouse/mct/view/' + i.mrv_item.mrv.mct.id"
                                                            target="_blank">
                                                            {{ `MCT#${i.mrv_item.mrv?.mct.mct_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else-if="i.mcrt_item">
                                                        <nuxt-link :data-testid="`mcrt-${ i.mcrt_item.mcrt.mcrt_number }`" :to="'/warehouse/mcrt/view/' + i.mcrt_item.mcrt!.id"
                                                            target="_blank">
                                                            {{ `MCRT#${i.mcrt_item.mcrt?.mcrt_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else-if="i.mst_item">
                                                        <nuxt-link :data-testid="`mst-${ i.mst_item.mst.mst_number }`" :to="'/warehouse/mst/view/' + i.mst_item!.mst!.id"
                                                            target="_blank">
                                                            {{ `MST#${i.mst_item!.mst?.mst_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else-if="i.is_initial">
                                                        Initial Transaction
                                                    </div>
                                                    <div v-else>
                                                        {{ i.remarks }}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span :class="{
                                                            'text-success': i.type === ITEM_TRANSACTION_TYPE.STOCK_IN,
                                                            'text-danger': i.type === ITEM_TRANSACTION_TYPE.STOCK_OUT
                                                    }">
                                                        {{ itemTransaction[i.type].label }}
                                                    </span>
                                                </td>
                                                <td class="text-muted"> {{ i.quantity }} </td>
                                                <td class="text-muted"> {{ i.stock_balance ? i.stock_balance : 'N/A' }} </td>
                                                <td class="text-muted"> {{ formatToPhpCurrency(i.price) }} </td>
                                                <td class="text-muted"> {{ formatDate(i.created_at) }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
        
                            </div>
                        </div>
        
                        <hr>
        
                        <div class="row pt-5">
                            <div class="col">
                                <div class="d-flex justify-content-end gap-2">
                                    <div class="d-flex justify-content-end gap-2">
                                        <button v-if="canSearch(authUser, 'canManageItem')" class="btn btn-secondary"
                                            @click="onClickGoToList">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'list']"/>
                            </client-only> Go to List
                                        </button>
                                        <button v-if="canEdit(authUser, 'canManageItem')" class="btn btn-success"
                                            @click="onClickUpdate">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> Update
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageItem')" class="btn btn-primary"
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

import type { ItemTransaction } from '~/composables/warehouse/item/item-transaction.type';
import * as itemApi from '~/composables/warehouse/item/item.api'
import type { Item } from '~/composables/warehouse/item/item.type';
import { itemTransaction } from '~/utils/constants';

definePageMeta({
    name: ROUTES.ITEM_VIEW,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const router = useRouter()
const route = useRoute()
const item = ref<Item | undefined>()

onMounted(async () => {
    authUser.value = getAuthUser()
    item.value = await itemApi.findOne(route.params.id as string)
    isLoadingPage.value = false

})

const initialPrice = computed(() => {

    if(item.value?.item_transactions.length === 0) return 0

    const indx = item.value!.item_transactions.length - 1
    const initialTransaction = item.value!.item_transactions[indx]
    return formatToPhpCurrency(initialTransaction.price)
})

const highestPrice = computed(() => {

    if(item.value?.item_transactions.length === 0) return 0

    const largestNumber = item.value!.item_transactions.reduce((max: number, obj: ItemTransaction) => obj.price > max ? obj.price : max, item.value!.item_transactions[0].price);

    return formatToPhpCurrency(largestNumber)
})

const lowestPrice = computed(() => {
    
    if(item.value?.item_transactions.length === 0) return 0
    
    const smallesNumber = item.value!.item_transactions.reduce((max: number, obj: ItemTransaction) => obj.price < max ? obj.price : max, item.value!.item_transactions[0].price);

    return formatToPhpCurrency(smallesNumber)
})

function formatTxnNumber(n: number) {
    return n.toString().padStart(5, '0');
}


const onClickGoToList = () => router.push(`/warehouse/item`);
const onClickAddNew = () => router.push(`/warehouse/item/create`);
const onClickUpdate = () => router.push(`/warehouse/item/${item.value?.id}`);

</script>
