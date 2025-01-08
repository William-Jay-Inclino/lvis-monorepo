<template>
    <div class="table-responsive">
        <table class="table table-bordered table-hover table-sm small">
            <thead>
                <tr>
                    <th class="bg-secondary text-white"> No. </th>
                    <th class="bg-secondary text-white"> Description </th>
                    <th style="width: 10%" class="bg-secondary text-white"> Qty </th>
                    <th class="bg-secondary text-white"> Unit </th>
                    <th class="bg-secondary text-white"> Unit Price </th>
                    <th class="bg-secondary text-white"> Amount </th>
                    <th class="bg-secondary text-white"> Status </th>
                    <th class="bg-secondary text-white"> Remove </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i, count in items">
                    <td class="text-muted align-middle"> {{ count + 1 }} </td>
                    <td class="text-muted align-middle">
                        <textarea class="form-control form-control-sm" rows="5" readonly>{{ i.item.code + ' - ' + i.item.description }}</textarea>
                    </td>
                    <td class="text-muted text-center align-middle">
                        <input data-test="item-qty" type="number" :class="{'border border-danger': i.showQtyError}" class="form-control form-control-sm" :value="i.quantity" @input="handleQtyUpdate(i, $event)">
                        <small v-show="i.showQtyError" class="fst-italic text-danger">Invalid Quantity</small>
                    </td>
                    <td class="text-muted align-middle"> {{ i.item.unit.name }} </td>
                    <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.price) }} </td>
                    <td class="text-muted align-middle"> {{ formatToPhpCurrency(i.quantity * i.price) }} </td>
                    <td class="text-muted align-middle">
                        <select @change="handleStatusChange(i, $event)" class="form-select form-select-sm" :value="i.status">
                            <option :value="i.id" v-for="i in mstStatusArray"> {{ i.name }} </option>
                        </select>
                    </td>
                    <td class="align-middle text-center">
                        <button @click="emits('remove-item', i)" class="btn btn-light btn-sm">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'trash']" class="text-danger"/>
                            </client-only>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
    import type { MSTItem } from '~/composables/warehouse/mst/mst-item.types';


    const props = defineProps({
        items: {
            type: Array as () => MSTItem[],
            default: () => [],
        }
    });

    const emits = defineEmits(['remove-item', 'update-item', 'status-change'])

    const mstStatusArray = ref([...itemStatusArray])

    function handleQtyUpdate(mstItem: MSTItem, event: Event) {
        // @ts-ignore
        emits('update-item', mstItem, {qty: Number(event.target.value)})
    }

    function handleStatusChange(mstItem: MSTItem, event: Event) {
        // @ts-ignore
        emits('status-change', mstItem, {status: Number(event.target.value)});
    }

</script>