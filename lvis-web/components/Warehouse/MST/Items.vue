<template>
    <div class="table-responsive">
        <table class="table table-bordered table-hover table-sm small">
            <thead>
                <tr>
                    <th class="bg-secondary text-white"> No. </th>
                    <th class="bg-secondary text-white"> Description </th>
                    <th class="bg-secondary text-white"> Qty </th>
                    <th class="bg-secondary text-white"> Unit </th>
                    <th class="bg-secondary text-white"> Unit Price </th>
                    <th class="bg-secondary text-white"> Amount </th>
                    <th class="bg-secondary text-white"> Remove </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i, count in items">
                    <td class="text-muted align-middle"> {{ count + 1 }} </td>
                    <td class="text-muted align-middle"> {{ i.name + ' - ' + i.description }} </td>
                    <td class="text-muted text-center align-middle">
                        <input type="text" :class="{'border border-danger': i.showQtyError}" class="form-control form-control-sm" :value="i.quantity" @keyup="handleQtyUpdate(i, $event)">
                        <small v-show="i.showQtyError" class="fst-italic text-danger">Invalid Quantity</small>
                    </td>
                    <td class="text-muted align-middle"> {{ i.unit.name }} </td>
                    <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.unitPrice) }} </td>
                    <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.quantity * i.unitPrice) }} </td>
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
    import type { AddMSTItem } from '~/composables/warehouse/mst/mst.types';

    const props = defineProps({
        items: {
            type: Array as () => AddMSTItem[],
            default: () => [],
        }
    });

    const emits = defineEmits(['remove-item', 'update-item'])


    function handleQtyUpdate(item: AddMSTItem, event: Event) {
        // @ts-ignore
        emits('update-item', item, {qty: Number(event.target.value)})
    }

</script>