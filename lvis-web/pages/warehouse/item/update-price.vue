<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center">
        
                <div class="col-lg-12">
                    <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3"> Update Item Prices </h5>

                    <div class="alert alert-light small mb-3" role="alert">
                        <div class="mb-2">
                            <strong>{{ total_outdated_items }} Items </strong> have outdated prices that need updating.
                            Click this <button @click="update_prices_of_all_items()" :disabled="isUpdatingPrices || total_updated_items > 0 || total_outdated_items === 0" class="btn btn-sm btn-success">button</button> to update their prices.
                        </div>
                        <div>
                            <strong>How prices are calculated:</strong>
                            <ul class="fst-italic">
                                <li><strong>New Price</strong> = (Previous Month's Total Price) ÷ (Previous Month's Total Quantity)</li>
                                <li><strong>Previous Month's Total Price</strong> = Sum of all Receiving Report (RR) and Issuance transactions</li>
                                <li><strong>Previous Month's Total Quantity</strong> = Previous month's ending inventory balance</li>
                            </ul>
                        </div>
                        <div class="text-danger">
                            <strong>Note:</strong> If inventory was closed out (zero quantity) or no transactions occurred,
                            the price will remain unchanged.
                        </div>
                    </div>

                    <div v-if="isUpdatingPrices" class="mb-3 p-3 border rounded bg-light">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span class="spinner-border spinner-border-sm text-primary" role="status"></span>
                                <strong class="ms-2">Updating Prices...</strong>
                            </div>
                            <span class="badge bg-primary">
                                {{ Math.round((total_updated_items / total_outdated_items) * 100) || 0 }}%
                            </span>
                        </div>
                        <div class="progress" style="height: 6px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" 
                                role="progressbar" 
                                :style="{ width: `${(total_updated_items / total_outdated_items) * 100 || 0}%` }">
                            </div>
                        </div>
                        <div class="small text-muted mt-2">
                            Processed {{ total_updated_items }} of {{ total_outdated_items }} items
                        </div>
                    </div>

                    <div v-if="!isUpdatingPrices && total_updated_items > 0" class="alert alert-success mb-3">
                        Prices for all items below have been successfully updated!
                    </div>

                    <ul class="list-group flex-grow-1 mb-4" style="max-height: 1000px; overflow-y: auto;">
                        <li v-for="item, i in updated_price_items" :key="`k-${ i }`" 
                            class="list-group-item position-relative">  
                            <div>
                                <div class="d-flex justify-content-between">
                                    <strong class="text-muted">{{ item.updated_item.code + ' ' + item.updated_item.description }}</strong>
                                    <span class="badge bg-success position-absolute top-0 end-0 mt-1 me-1">Up to date</span>
                                </div>
                                <div class="text-muted small mt-1"> 
                                    Previous Price: {{ formatToPhpCurrency(item.previous_item.price || 0) }} | 
                                    New Price: {{ formatToPhpCurrency(item.updated_item.price || 0) }}
                                </div>
                            </div>
                            <nuxt-link class="btn btn-outline-light btn-sm"
                                :to="'/warehouse/item/view/' + item.updated_item.id" target="_blank">
                                <small class="text-info"> View Item </small>
                            </nuxt-link>
                        </li>
                    </ul>

                </div>
            </div>
        
            <div v-else>
                <LoaderSpinner />
            </div>
            
        </div>
    </div>

</template>


<script setup lang="ts">
import { get_all_outdated_price_items, update_item_price } from '~/composables/warehouse/item/item.api'
import type { Item } from '~/composables/warehouse/item/item.type'


definePageMeta({
    name: ROUTES.ITEM_UPDATE_PRICES,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

type UpdatedItem = {
    previous_item: Item,
    updated_item: Item
}

const authUser = ref<AuthUser>({} as AuthUser)
const isLoadingPage = ref(true)
const isUpdatingPrices = ref(false)

const now = new Date();
const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

const outdated_price_items = ref<Item[]>([])
const updated_price_items = ref<UpdatedItem[]>([])

onMounted(async () => {
    authUser.value = getAuthUser()

    outdated_price_items.value = await get_all_outdated_price_items()

    isLoadingPage.value = false

})

const total_outdated_items = computed( () => outdated_price_items.value.length)
const total_updated_items = computed( () => updated_price_items.value.length)


async function update_prices_of_all_items() {
    console.log('update_prices_of_all_items');
    isUpdatingPrices.value = true;
    updated_price_items.value = []; // Reset the array
    
    try {
        for (const item of outdated_price_items.value) {
            const response = await update_item_price({ item_id: item.id });
            
            if (response.success && response.previous_item && response.updated_item) {
                updated_price_items.value.push({
                    previous_item: response.previous_item,
                    updated_item: response.updated_item
                });
            }
            
            // Small delay for smooth animation (optional)
            await new Promise(resolve => setTimeout(resolve, 20));
        }
    } catch (error) {
        console.error('Error updating prices:', error);
    } finally {
        isUpdatingPrices.value = false;
    }
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

    /* Custom scrollbar */
    .list-group::-webkit-scrollbar {
        width: 8px;
    }
    .list-group::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    .list-group::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }
    .list-group::-webkit-scrollbar-thumb:hover {
        background: #555;
    }


</style>