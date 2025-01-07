<template>
    <div class="mb-3">
        <div class="alert alert-info">
            <div>
                <small class="fst-italic">
                    - Quantity Request should be greater than 0 and less than or equal to the available quantity
                </small>
            </div>
            <div>
                <small class="fst-italic">
                    - Available items to add are based on the project
                </small>
            </div>
        </div>
        
        <table class="table table-bordered table-hovered table-sm small">
            <thead>
                <tr>
                    <th class="text-muted text-center">Description</th>
                    <th class="text-muted text-center">Unit</th>
                    <th class="text-muted text-center">Available Quantity</th>
                    <th class="text-muted text-center">Average Price</th>
                    <th width="10%" class="text-muted text-center">Quantity</th>
                    <th class="text-muted text-center">Amount</th>
                    <th v-if="hasFieldStatus" class="text-muted text-center">Status</th>
                    <th class="text-muted text-center">Remove</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i, indx in items">
                    <td class="text-muted align-middle">
                        <textarea class="form-control form-control-sm" rows="5" readonly>{{ i.label }} {{ i.project_item ? `(${i.project_item.project.name})` : '' }}</textarea>
                    </td>
                    <td class="text-muted align-middle text-center"> {{ i.unit.name }} </td>
                    <td class="text-muted align-middle text-center"> {{ i.available_quantity }} </td>
                    <td class="text-muted align-middle text-center"> {{ formatToPhpCurrency(i.GWAPrice) }} </td>
                    <td class="text-muted align-middle text-center">
                        <input
                            data-test="item-qty"
                            type="number"
                            class="form-control form-control-sm text-center"
                            :class="{'border-danger': !isValidQty(i)}"
                            :value="i.qty_request"
                            @input="updateItemQty(i, $event)"
                            />
                    </td>
                    <td class="text-muted align-middle text-center"> {{ formatToPhpCurrency(i.GWAPrice * i.qty_request) }} </td>
                    <td v-if="i.statusObject" class="text-muted align-middle text-center">
                        <select @change="handleStatusChange(i, $event)" class="form-select form-select-sm" :value="i.statusObject.id">
                            <option :value="i.id" v-for="i in mstStatusArray"> {{ i.name }} </option>
                        </select>
                    </td>
                    <td class="text-center align-middle">
                        <button @click="handleRemoveItem(i)" class="btn btn-sm btn-light">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'trash']" class="text-danger" />
                            </client-only>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">

    import type { AddItem } from '~/composables/warehouse/item/item.type';


    const emits = defineEmits(['removeItem', 'updateQty', 'status-change']);
        
    const props = defineProps({
        items: {
            type: Array as () => AddItem[],
            default: () => [],
        },
        hasFieldStatus: {
            type: Boolean,
            default: () => false
        },
        shouldValidateQty: {
            type: Boolean,
            default: () => true
        }
    });

    const mstStatusArray = ref([...itemStatusArray])

    function handleRemoveItem(item: AddItem) {
        emits('removeItem', {...item})
    } 

    function updateItemQty(item: AddItem, event: Event) {
        // @ts-ignore
        emits('updateQty', item, Number(event.target.value))
    }

    function handleStatusChange(item: AddItem, event: Event) {
        // @ts-ignore
        emits('status-change', {item, status: Number(event.target.value)});
    }

    function isValidQty(item: AddItem) {

        if(!props.shouldValidateQty) {
            return true 
        }

        if(item.qty_request <= 0 || item.qty_request > item.available_quantity) {
            return false 
        }

        return true

    }

</script>
