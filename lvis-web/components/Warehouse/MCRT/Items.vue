<template>
    <div class="table-responsive">
        <table class="table table-bordered table-hover table-sm small">
            <thead>
                <tr>
                    <th class="bg-secondary text-white"> No. </th>
                    <th class="bg-secondary text-white"> Description </th>
                    <th class="bg-secondary text-white"> Unit </th>
                    <th class="bg-secondary text-white"> Reference Qty </th>
                    <th class="bg-secondary text-white"> Qty returned </th>
                    <th class="bg-secondary text-white"> Qty to return (pending) </th>
                    <th style="width: 10%;" class="bg-secondary text-white"> Qty </th>
                    <th class="bg-secondary text-white"> Unit Price </th>
                    <th class="bg-secondary text-white"> Amount </th>
                    <th class="bg-secondary text-white"> Remove </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i, count in items">
                    <td class="text-muted align-middle"> {{ count + 1 }} </td>
                    <td class="text-muted align-middle"> {{ i.item.code + ' - ' + i.item.description }} </td>
                    <td class="text-muted align-middle"> {{ i.item.unit.name }} </td>
                    <td class="text-muted align-middle"> {{ i.reference_qty }} </td>
                    <td class="text-muted align-middle"> {{ i.qty_returned }} </td>
                    <td class="text-muted align-middle"> {{ i.qty_on_queue }} </td>
                    <td class="text-muted text-center align-middle">
                        <input type="number" :class="{'border border-danger': i.showQtyError}" class="form-control form-control-sm" :value="i.quantity" @input="handleQtyUpdate(i, $event)">
                        <small v-show="i.showQtyError" class="fst-italic text-danger">Invalid Quantity</small>
                    </td>
                    <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.price) }} </td>
                    <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.quantity * i.price) }} </td>
                    <td class="align-middle text-center">
                        <button @click="emits('remove-item', i)" class="btn btn-light btn-sm">
                            <i class="fas fa-trash text-danger"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import type { MCRTItem } from '~/composables/warehouse/mcrt/mcrt-item.types';


    const props = defineProps({
        items: {
            type: Array as () => MCRTItem[],
            default: () => [],
        }
    });

    const emits = defineEmits(['remove-item', 'update-item'])


    function handleQtyUpdate(item: MCRTItem, event: Event) {
        // @ts-ignore
        emits('update-item', item, {qty: Number(event.target.value)})
    }

</script>