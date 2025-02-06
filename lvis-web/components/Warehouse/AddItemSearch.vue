<template>
    <div class="card">
        <div class="card-body">

            <div class="row align-items-center">

                <!-- Search Input -->
                <div class="col-10 p-1">
                    <client-only>
                        <v-select 
                            :options="filteredItems" 
                            label="label" 
                            v-model="selectedItem"
                            placeholder="Search here..."
                        ></v-select>
                    </client-only>
                </div>

                <!-- Add Button -->
                <div class="col-2 p-1">
                    <button :disabled="!selectedItem" @click="handleAddItem()" class="btn btn-success w-100" type="button">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'plus']" />
                        </client-only>
                    </button>
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
        CODE = 'Code',
        DESC = 'Description',
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

    const searchBy = ref<SEARCH_BY>(SEARCH_BY.DESC)
    const searchInput = ref('')
    const selectedItem = ref<AddItem>()

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

    function handleAddItem() {

        if(selectedItem.value) {
            emits('add-item', selectedItem.value.id)
        }

    }

</script>