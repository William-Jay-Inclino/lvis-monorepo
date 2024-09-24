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
                    <td class="text-muted align-middle"> {{ i.qty_request }} </td>
                    <td class="text-muted align-middle"> {{ i.unit.name }} </td>
                    <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.GWAPrice) }} </td>
                    <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.qty_request * i.GWAPrice) }} </td>
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
    import type { AddItem } from '~/composables/warehouse/item/item.type';

    const props = defineProps({
        items: {
            type: Array as () => AddItem[],
            default: () => [],
        }
    });

    const emits = defineEmits(['remove-item'])

</script>