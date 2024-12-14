<template>
    <!-- Modal -->
    <div class="modal fade" id="addItemModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning">Add Item</h5>
                    <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="mb-3">
                        <div class="row">
                            <div class="col">
                                <div class="input-group">
                                    <!-- Dropdown -->
                                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Search by - {{ searchBy }}
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a @click="handleSearchByChange(SEARCH_BY.CODE)" class="dropdown-item" href="javascript:void(0)">Code</a></li>
                                        <li><a @click="handleSearchByChange(SEARCH_BY.DESC)" class="dropdown-item" href="javascript:void(0)">Description</a></li>
                                    </ul>
        
                                    <!-- Input -->
                                    <input type="text" class="form-control" v-model="searchInput">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered table-hover table-sm small">
                            <thead>
                                <tr>
                                    <th width="10%">Code</th>
                                    <th>Item Description</th>
                                    <th>Unit</th>
                                    <!-- <th>Item Type</th> -->
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody> 
                                <tr v-for="item in filteredItems">
                                    <td class="align-middle text-muted"> {{ item.code }} </td>
                                    <td class="align-middle text-muted"> {{ item.description }} {{ item.project_item ? `(${item.project_item.project.name})` : '' }} </td>
                                    <td class="align-middle text-muted"> {{ item.unit.name }} </td>
                                    <!-- <td class="align-middle text-muted"> {{ item.item_type.name }} </td> -->
                                    <td class="align-middle text-center">
                                        <button @click="emits('add-item', item.id)" v-if="!item.isAdded" class="btn btn-primary btn-sm">
                                            Add
                                        </button>
                                        <span class="text-success fw-bold" v-else> Added </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import type { AddItem } from '~/composables/warehouse/item/item.type';

    type _Item = AddItem & {
        isAdded: boolean
    }

    enum SEARCH_BY {
        CODE = 'CODE',
        DESC = 'DESCRIPTION',
    }

    const props = defineProps({
        items: {
            type: Array as () => AddItem[],
            default: () => [],
        },
        addedItemIds: {
            type: Array as () => String[],
            default: () => [],
        }
    });

    const emits = defineEmits(['add-item'])

    const searchBy = ref<SEARCH_BY>(SEARCH_BY.CODE)
    // const filterBy = ref<ITEM_TYPE>(ITEM_TYPE.OFFICE_SUPPLY)
    const searchInput = ref('')

    const filteredItems = computed(() => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        // const itemTypeFilter = filterBy.value;

        return props.items
            .map(item => ({
                ...item,
                isAdded: props.addedItemIds.includes(item.id),
            }))
            .filter(item => {
                const matchesSearch = searchTerm === '' || (
                    (searchBy.value === SEARCH_BY.CODE ? item.code : item.description)
                    .toLowerCase()
                    .includes(searchTerm)
                );

                return matchesSearch;
            });
    });

    function handleSearchByChange(payload: SEARCH_BY) {
        searchBy.value = payload
    }

    // function handleFilterByChange(payload: ITEM_TYPE) {
    //     filterBy.value = payload
    // }

</script>