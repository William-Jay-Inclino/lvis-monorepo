<template>

    <div>

        <div class="table-responsive">

            <table class="table table-hover">

                <thead>
                    <tr>
                        <th class="bg-secondary text-white">No.</th>
                        <th class="bg-secondary text-white">Description</th>
                        <th class="bg-secondary text-white">Item Class</th>
                        <th class="bg-secondary text-white">Unit</th>
                        <th class="bg-secondary text-white">Quantity </th>
                        <th class="bg-secondary text-white text-center">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'cog']" />
                            </client-only>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item, i in canvassItems">
                        <td class="text-muted align-middle"> {{ i + 1 }} </td>
                        <td class="text-muted">
                            <textarea :value="item.description" class="form-control form-control-sm" rows="5" readonly></textarea>
                        </td>
                        <td class="text-muted align-middle"> {{ item.item ? 'Stock' : 'Non-Stock' }} </td>
                        <td class="text-muted align-middle"> {{ item.unit ? item.unit.name : 'N/A' }} </td>
                        <td class="text-muted align-middle"> {{ item.quantity }} </td>
                        <td class="text-muted text-center align-middle">
                            <div class="d-flex w-100">
                                <button @click="removeItem(i)"
                                    class="btn btn-sm btn-light w-50 me-2">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'trash']" class="text-danger"/>
                                    </client-only>
                                </button>
                                <button @click="onClickEdit(i)" class="btn btn-sm btn-light w-50" data-bs-toggle="modal"
                                    data-bs-target="#canvassItemModal">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'edit']" class="text-primary"/>
                                    </client-only>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="7" class="text-center">
                            <button data-testid="add-item" @click="onCLickAdd()" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                data-bs-target="#canvassItemModal">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'plus-circle']" />
                                </client-only> Add Item
                            </button>
                        </td>
                    </tr>
                </tfoot>

            </table>

        </div>

        <!-- Modal -->
        <div class="modal fade" id="canvassItemModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-warning" id="exampleModalLabel">{{ formIsAdd ? 'Add' : 'Edit' }}
                            Item</h5>
                        <button @click="closeModal" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Item Class
                            </label>
                            <div class="row">
                                <div class="col">
                                    <div class="form-check form-check-inline">
                                        <input data-testid="item-class-stock" class="form-check-input" type="radio" :value="true" v-model="itemIsStock"
                                            @change="onChangeItemClass">
                                        <label class="form-check-label" for="inlineRadio1">Stock</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input data-testid="item-class-non-stock" class="form-check-input" type="radio" :value="false"
                                            v-model="itemIsStock" @change="onChangeItemClass">
                                        <label class="form-check-label" for="inlineRadio2">Non-Stock</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3" v-if="itemIsStock">
                            <label class="form-label">
                                Item <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select @search="handleSearchItems" :options="availableItems" label="label" v-model="canvassItem.item"
                                    @option:selected="onChangeItem" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-muted fst-italic"> Enter item code or name </small>
                            <small class="text-danger fst-italic" v-if="canvassItemErrors.item">
                                This field is required
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Description <span class="text-danger">*</span>
                            </label>
                            <textarea data-testid="description" v-model="canvassItem.description" class="form-control form-control-sm" rows="5"
                                :readonly="itemIsStock"></textarea>
                            <small class="text-danger fst-italic" v-if="canvassItemErrors.description">
                                This field is required
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Unit</label>
                            <div v-if="!itemIsStock">
                                <client-only>
                                    <v-select data-testid="unit" :options="units" label="name" v-model="canvassItem.unit"></v-select>
                                </client-only>
                            </div>
                            <div v-else>
                                <input data-testid="unit" type="text" class="form-control" disabled
                                    :value="canvassItem.unit ? canvassItem.unit.name : ''">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Quantity <span class="text-danger">*</span>
                            </label>
                            <input data-testid="quantity" type="number" class="form-control"
                                v-model="canvassItem.quantity">
                            <small class="text-danger fst-italic" v-if="canvassItemErrors.quantity">
                                This field is required and quantity must be greater than 0
                            </small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button ref="closeBtnModal" @click="closeModal" class="btn btn-secondary"
                            data-bs-dismiss="modal">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'close']"/>
                            </client-only> Close
                        </button>
                        <button data-testid="modal-add-item" v-if="formIsAdd" @click="addItem" class="btn btn-primary" :disabled="isAdding">
                            <client-only>
                                    <font-awesome-icon :icon="['fas', 'plus-circle']"/>
                                </client-only> {{ isAdding ? 'Adding...' : 'Add' }} Item
                        </button>
                        <button v-else @click="editItem" class="btn btn-primary" :disabled="isEditing">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'edit']"/>
                            </client-only> {{ isEditing ? 'Editing...' : 'Edit' }} Item
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>




<script setup lang="ts">
import type { CanvassItem } from '~/composables/purchase/canvass/canvass-item.types';
import { fetchItemsByCode } from '~/composables/warehouse/item/item.api';
import type { Item } from '~/composables/warehouse/item/item.type';
import { MOBILE_WIDTH } from '~/utils/config';


const emits = defineEmits(['addItem', 'removeItem', 'editItem', 'searchedItems']);

const props = defineProps({
    canvassItems: {
        type: Array as () => CanvassItem[],
        default: () => [],
    },
    units: {
        type: Array as () => Unit[],
        default: () => [],
    },
    items: {
        type: Array as () => Item[],
        default: () => [],
    },
    isAdding: {
        type: Boolean,
        default: false
    },
    isEditing: {
        type: Boolean,
        default: false
    },
});


const isMobile = ref(false)
const formIsAdd = ref(true)
const itemIsStock = ref(false)
const editItemIndx = ref()

const closeBtnModal = ref<HTMLButtonElement>()

const _canvassItemErrorsInitial = {
    item: false,
    description: false,
    quantity: false
}

const _canvassItemInitial: CanvassItem = {
    id: '',
    canvass_id: '',
    unit: null,
    item: null,
    description: '',
    quantity: 0
}
const canvassItemErrors = ref({ ..._canvassItemErrorsInitial })

const canvassItem = ref<CanvassItem>({ ..._canvassItemInitial })

onMounted(() => {

    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile)

})

const availableItems = computed(() => {
    return props.items.filter(
        (item) => !props.canvassItems.some((canvassItem) => canvassItem.item?.id === item.id)
    );
});

function addItem() {

    if (!isValidCanvassItem()) {
        return
    }

    console.log('adding')

    emits("addItem", canvassItem.value, closeBtnModal.value)

}

function removeItem(indx: number) {
    emits("removeItem", indx)
}

function editItem() {
    if (!isValidCanvassItem()) {
        return
    }

    emits("editItem", canvassItem.value, closeBtnModal.value, editItemIndx.value)
}

function onCLickAdd() {
    formIsAdd.value = true
}

function onClickEdit(indx: number) {
    formIsAdd.value = false
    editItemIndx.value = indx

    const item = props.canvassItems[indx]

    if (item.item) {
        itemIsStock.value = true
    } else {
        itemIsStock.value = false
    }

    canvassItem.value = { ...item }

}

function closeModal() {
    canvassItem.value = { ..._canvassItemInitial }
    canvassItemErrors.value = { ..._canvassItemErrorsInitial }
    formIsAdd.value = true
    itemIsStock.value = false
    editItemIndx.value = undefined
}

function onChangeItemClass() {

    if (itemIsStock.value && canvassItem.value.item) {

        canvassItem.value.unit = canvassItem.value.item.unit || null
        canvassItem.value.description = canvassItem.value.item.description


    } else {
        canvassItem.value.item = null
        canvassItem.value.description = ''
        canvassItem.value.unit = null
    }

}

function onChangeItem() {

    if (!canvassItem.value.item) return

    canvassItem.value.description = canvassItem.value.item.description
    canvassItem.value.unit = canvassItem.value.item.unit || null

}

async function handleSearchItems(input: string, loading: (status: boolean) => void ) {


    if(input.trim() === ''){
        emits("searchedItems", [])
        return 
    } 

    debouncedSearchItems(input, loading)

}

async function searchItems(input: string, loading: (status: boolean) => void) {
    console.log('searchItems');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchItemsByCode(input);

        console.log('response', response);
        emits("searchedItems", response)
        
    } catch (error) {
        console.error('Error fetching Items:', error);
    } finally {
        loading(false);
    }
}

// ======================== UTILS ======================== 

function isValidCanvassItem(): boolean {

    canvassItemErrors.value = { ..._canvassItemErrorsInitial }

    // description is required if class is non stock
    if (!itemIsStock.value && canvassItem.value.description.trim() === '') {
        canvassItemErrors.value.description = true
    }

    if (!canvassItem.value.quantity) {
        canvassItemErrors.value.quantity = true
    } else if (canvassItem.value.quantity <= 0) {
        canvassItemErrors.value.quantity = true
    }

    // item is required if class is stock
    if (itemIsStock.value && !canvassItem.value.item) {
        canvassItemErrors.value.item = true
    }

    const hasError = Object.values(canvassItemErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}

function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}


const debouncedSearchItems = debounce((input: string, loading: (status: boolean) => void) => {
    searchItems(input, loading);
}, 500);

</script>