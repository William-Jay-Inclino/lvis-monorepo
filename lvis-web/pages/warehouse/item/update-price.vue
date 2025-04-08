<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center">
        
                <div class="col-lg-12">
                    <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3"> Update Item Prices </h5>

                    <div class="mb-3">
                        <button class="btn btn-success">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']" />
                            </client-only> 
                            Update Prices of All Items
                        </button>
                    </div>

                    <!-- Scrollable table container -->
                    <div class="table-scroll-container mb-3">
                        <table class="table table-sm small table-striped mb-0">
                            <thead class="sticky-top bg-white">
                                <tr>
                                    <th>Item Code</th>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                    <th>Latest Price Update</th>
                                    <th>Price</th>
                                    <th>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in items">
                                    <td class="text-muted align-middle"> {{ item.code }} </td>
                                    <td class="text-muted">
                                        <textarea rows="3" class="form-control form-control-sm text-muted small" readonly>{{ item.description }}</textarea>
                                    </td>
                                    <td class="text-muted align-middle"> {{ item.total_quantity }} </td>
                                    <td class="text-muted align-middle"> {{ formatDate(item.latest_price_update) }} </td>
                                    <td class="text-muted align-middle"> {{ formatToPhpCurrency(item.price || 0) }} </td>
                                    <td class="align-middle">
                                        <div v-if="is_price_updated({ latest_price_update: item.latest_price_update })">
                                            <span class="badge bg-success">Up to date</span>
                                        </div>
                                        <div v-else>
                                            <button class="btn btn-light btn-sm text-success fw-bold">Update</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
import { get_all_items } from '~/composables/warehouse/item/item.api'
import type { Item } from '~/composables/warehouse/item/item.type'


definePageMeta({
    name: ROUTES.ITEM_UPDATE_PRICES,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

const now = new Date();
const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

const items = ref<Item[]>([])

onMounted(async () => {
    authUser.value = getAuthUser()

    items.value = await get_all_items()

    isLoadingPage.value = false

})

function is_price_updated(payload: { latest_price_update?: string | null }) {

    const { latest_price_update } = payload

    if(!latest_price_update) {
        return false
    }

    if (new Date(latest_price_update) >= currentMonthStart) {
        return true 
    }

    return false

}


</script>


<style scoped>

    .soft-badge-yellow {
        background: #fff3cd; /* Soft Yellow */
        color: #856404;
    }

    .table-scroll-container {
        max-height: 800px; /* You can adjust this */
        overflow-y: auto;
    }


</style>