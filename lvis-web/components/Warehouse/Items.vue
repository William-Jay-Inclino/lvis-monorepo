<template>
    <div v-if="items.length > 0" class="mb-3">
        <div class="alert alert-info">
            <small class="fst-italic">
                Quantity Request should be greater than 0 and less than or equal to the available quantity
            </small>
        </div>
        
        <table class="table table-bordered table-hovered table-sm small">
            <thead>
                <tr>
                    <th class="text-muted">Description</th>
                    <th class="text-muted">Unit</th>
                    <th class="text-muted">Available Qty</th>
                    <th class="text-muted">Avg. Price</th>
                    <th class="text-muted">Quantity Request</th>
                    <th class="text-muted">Amount</th>
                    <th class="text-muted">Remove</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i, indx in items">
                    <td class="text-muted align-middle"> {{ i.name + ' - ' + i.description }} </td>
                    <td class="text-muted align-middle"> {{ i.unit.name }} </td>
                    <td class="text-muted align-middle"> {{ i.available_quantity }} </td>
                    <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.GWAPrice) }} </td>
                    <td class="text-muted align-middle">
                        <input
                            type="number"
                            class="form-control form-control-sm"
                            :class="{'border-danger': i.qty_request <= 0 || i.qty_request > i.available_quantity}"
                            v-model="i.qty_request"/>
                    </td>
                    <td class="text-muted">
                        <input
                            type="text"
                            class="form-control form-control-sm"
                            disabled
                            :value="formatToPhpCurrency(i.GWAPrice * i.qty_request)"/>
                    </td>
                    <td class="text-center">
                        <button @click="handleRemoveItem(i)" class="btn btn-sm btn-light">
                            <i class="fas fa-trash text-danger"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">

    import type { AddItem } from '~/composables/warehouse/item/item.type';


    const emits = defineEmits(['removeItem']);
        
    const props = defineProps({
        items: {
            type: Array as () => AddItem[],
            default: () => [],
        },
    });
    function handleRemoveItem(item: AddItem) {
        emits('removeItem', {...item})
    } 

</script>