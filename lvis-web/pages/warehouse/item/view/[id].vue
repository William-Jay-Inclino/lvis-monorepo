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
                                        <i class="fas fa-info-circle"></i> Item Info
                                    </h5>
                                    <hr class="result">
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <tbody>
                                            <tr>
                                                <td class="text-muted">Item Code</td>
                                                <td> {{ item.code }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Name</td>
                                                <td> {{ item.name }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Description</td>
                                                <td> {{ item.description }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Item Type</td>
                                                <td> {{ itemTypeMapper[item.item_type] }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Unit</td>
                                                <td> {{ item.unit.name }} </td>
                                            </tr>
                                            <tr>
                                                <td class="text-muted">Alert Level</td>
                                                <td> {{ item.alert_level }}% ({{ item.total_quantity * (item.alert_level / 100)
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
                                                <td class="text-muted">Initial Quantity</td>
                                                <td> {{ item.initial_quantity }} </td>
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
                                        <i class="fas fa-history"></i> Item Transactions
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
                                                <th class="bg-secondary text-white"> Price </th>
                                                <th class="bg-secondary text-white"> Date </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i in item.item_transactions">
                                                <td class="text-muted"> TXN-{{ formatTxnNumber(i.id) }} </td>
                                                <td class="text-muted">
                                                    <div v-if="i.rr_item">
                                                        <nuxt-link :to="'/warehouse/rr/view/' + i.rr_item.rr!.id"
                                                            target="_blank">
                                                            {{ `RR#${i.rr_item.rr?.rr_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else-if="i.osriv_item">
                                                        <nuxt-link :to="'/warehouse/osriv/view/' + i.osriv_item.osriv!.id"
                                                            target="_blank">
                                                            {{ `OSRIV#${i.osriv_item.osriv?.osriv_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else-if="i.seriv_item">
                                                        <nuxt-link :to="'/warehouse/seriv/view/' + i.seriv_item.seriv!.id"
                                                            target="_blank">
                                                            {{ `SERIV#${i.seriv_item.seriv?.seriv_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else-if="i.mrv_item">
                                                        <nuxt-link :to="'/warehouse/mrv/view/' + i.mrv_item.mrv!.id"
                                                            target="_blank">
                                                            {{ `MRV#${i.mrv_item.mrv?.mrv_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else-if="i.mcrt_item">
                                                        <nuxt-link :to="'/warehouse/mcrt/view/' + i.mcrt_item.mcrt!.id"
                                                            target="_blank">
                                                            {{ `MCRT#${i.mcrt_item.mcrt?.mcrt_number}` }}
                                                        </nuxt-link>
        
                                                    </div>
                                                    <div v-else>
                                                        Initial Transaction
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
                                        <button v-if="canRead(authUser, 'canManageItem')" class="btn btn-secondary"
                                            @click="onClickGoToList">
                                            <i class="fas fa-list"></i> Go to List
                                        </button>
                                        <button v-if="canEdit(authUser, 'canManageItem')" class="btn btn-success"
                                            @click="onClickUpdate">
                                            <i class="fas fa-sync"></i> Update
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageItem')" class="btn btn-primary"
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
    const indx = item.value!.item_transactions.length - 1
    const initialTransaction = item.value!.item_transactions[indx]
    return formatToPhpCurrency(initialTransaction.price)
})

const highestPrice = computed(() => {
    const largestNumber = item.value!.item_transactions.reduce((max: number, obj: ItemTransaction) => obj.price > max ? obj.price : max, item.value!.item_transactions[0].price);

    return formatToPhpCurrency(largestNumber)
})

const lowestPrice = computed(() => {
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
