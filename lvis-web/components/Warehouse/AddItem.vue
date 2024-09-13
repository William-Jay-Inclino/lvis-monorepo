<template>
    <div class="col-lg-10">
        
        <div class="mb-3">
            <small class="form-label fst-italic text-muted">
                Input the name of the item in the search field below
            </small>
            <client-only>
                <v-select :options="items" :value="selectedItems" label="name" multiple @option:selected="handleUpdateItems" @option:deselected="handleRemoveItem"></v-select>
            </client-only>
        </div>

        <div v-if="selectedItems.length > 0" class="mb-3">

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
                        <th class="text-muted">Ave. Price</th>
                        <th class="text-muted">Quantity Request</th>
                        <th class="text-muted">Amount</th>
                        <th class="text-muted">Remove</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i, indx in selectedItems">
                        <td class="text-muted"> {{ i.name + ' - ' + i.description }} </td>
                        <td class="text-muted"> {{ i.unit.name }} </td>
                        <td class="text-muted"> {{ i.available_quantity }} </td>
                        <td class="text-muted"> {{ i.GWAPrice }} </td>
                        <td class="text-muted">
                            <input
                                type="number"
                                class="form-control"
                                :class="{'border-danger': i.qty_input <= 0 || i.qty_input > i.available_quantity}"
                                v-model="i.qty_input"/>
                        </td>
                        <td class="text-muted">
                            <input
                                type="number"
                                class="form-control"
                                :value="i.GWAPrice * i.qty_input"/>
                        </td>
                        <td class="text-center">
                            <button @click="handleRemoveItem(i)" class="btn btn-sm btn-light me-3">
                                <i class="fas fa-trash text-danger"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>

<script setup lang="ts">

    import type { AddItem } from '~/composables/warehouse/item/item.type';


    const emits = defineEmits(['updateItems', 'removeItem', 'updateQty']);
        
    const props = defineProps({
        items: {
            type: Array as () => AddItem[],
            default: () => [],
        },
        selectedItems: {
            type: Array as () => AddItem[],
            default: () => [],
        },
    });

    // const itemsSelected = ref<AddItem[]>([])

    // const itemsToAdd = computed((): AddItem[] => {
    //     return props.items.map(i => {
    //         const x: AddItem = {
    //             id: i.id,
    //             code: i.code,
    //             name: i.name,
    //             description: i.description,
    //             available_quantity: i.available_quantity,
    //             unit: i.unit,
    //             qty_input: 0,
    //             GWAPrice: i.GWAPrice,
    //         }

    //         return x
    //     })
    // })

    function handleUpdateItems(items: AddItem[]) {
        console.log('handleUpdateItems', items);
        emits('updateItems', items.map(item => ({ ...item })))
    } 

    function handleRemoveItem(item: AddItem) {
        emits('removeItem', {...item})
    } 

</script>