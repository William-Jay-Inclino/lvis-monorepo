<template>
    <div>
        <div class="mb-3">
            <table class="table table-bordered table-hovered table-sm small">
                <thead>
                    <tr>
                        <th class="text-muted">Description</th>
                        <th class="text-muted">Unit</th>
                        <th class="text-muted">Available Qty</th>
                        <th class="text-muted">Avg. Price</th>
                        <th width="10%" class="text-muted">Quantity</th>
                        <th class="text-muted">Amount</th>
                        <th class="text-muted">Remove</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i, indx in items">
                        <td class="text-muted align-middle">
                            {{ i.item.code + ' - ' + i.item.description }}
                        </td>
                        <td class="text-muted align-middle"> {{ i.item.unit.name }} </td>
                        <td class="text-muted align-middle"> {{ i.item.total_quantity - i.item.quantity_on_queue }} </td>
                        <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.price) }} </td>
                        <td class="text-muted align-middle">
                            <input
                                type="number"
                                class="form-control form-control-sm text-center"
                                :class="{'border-danger': i.quantity <= 0 || i.quantity > (i.item.total_quantity - i.item.quantity_on_queue)}"
                                :value="i.quantity"/>
                        </td>
                        <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.price * i.quantity) }} </td>
                        <td class="text-center align-middle">
                            <button @click="handleRemoveItem(i)" class="btn btn-sm btn-light">
                                <i class="fas fa-trash text-danger"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="modal fade" id="updateItemModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-warning">Update Item</h5>
                        <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-close"></i> Close
                        </button>
                        <button @click="handleUpdateItem()" class="btn btn-primary" :disabled="isUpdating">
                            <i class="fas fa-edit"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import type { OSRIVItem } from '~/composables/warehouse/osriv/osriv-item.types';

    interface Props {
        items: OSRIVItem[],
        isUpdating: boolean,
    }

    const props = defineProps<Props>();
    const emits = defineEmits(['update-item'])


    function handleUpdateItem() {
        console.log('handleUpdateItem');
    }

    function handleRemoveItem(i: OSRIVItem) {
        console.log('handleRemoveItem', i);
    }
    

</script>