<template>
    <div>

        <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="requiredNotesModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div data-testid="required-notes-modal" class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">
                        Attach Notes & Save MEQS
                    </h5>
                    <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="row mb-3">
                        <div class="col">
                            <small class="text-danger fst-italic">
                                You are required to attach notes for the items listed below
                            </small>
                        </div>
                    </div>

                    <hr>

                    <div class="mb-3" v-for="item, i in itemsNeedingJustification">
                        <label class="form-label">
                            {{ i + 1 }}. <span class="fw-bold">{{ item.canvassItem.description }}</span> 
                            <span class="text-danger">*</span>
                        </label>
                        <textarea
                            rows="3"
                            class="form-control test-item"
                            :value="item.awardedItem.notes"
                            @input="updateNotes(item.awardedItem.canvass_item.id, $event)"
                        >
                        </textarea>
                        <small class="text-muted fst-italic">
                            Why choose
                            <span class="fw-bold">
                                <!-- {{ item.awardedItem.meqsSupplier?.supplier?.name }} at -->
                                {{ item.awardedItem.meqs_supplier?.supplier?.name }} at
                                <span class="text-danger"> {{ formatToPhpCurrency(item.awardedItem.price) }} </span> PHP
                            </span> 
                            over the lowest price item
                            <span class="fw-bold">
                                <!-- {{ item.lowestPriceItem.meqsSupplier?.supplier?.name }} at -->
                                {{ item.lowestPriceItem.meqs_supplier?.supplier?.name }} at
                                <span class="text-danger"> {{ formatToPhpCurrency(item.lowestPriceItem.price) }} </span> PHP ?
                            </span>
                        </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button ref="closeRequiredNotesBtn" class="btn btn-secondary" data-bs-dismiss="modal">
                        <client-only>
                                <font-awesome-icon :icon="['fas', 'close']"/>
                            </client-only> Close
                    </button>
                    <button data-testid="modal-notes-save-meqs" @click="save" class="btn btn-primary" :disabled="!canSave || isSavingMeqs">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'save']"/>
                        </client-only> {{ isSavingMeqs ? 'Saving...' : 'Save' }}
                    </button>
                </div>
                </div>
            </div>
        </div>
        


    </div>
</template>


<script setup lang="ts">
import type { CanvassItemWithSuppliers } from '~/composables/purchase/meqs/meqs.types';


const emits = defineEmits(['save', 'updateNotes']);


const props = defineProps({
    itemsNeedingJustification: {
        type: Array as () => CanvassItemWithSuppliers[],
        default: () => [],
    },
    isSavingMeqs: {
        type: Boolean,
        default: false
    }
});

const closeRequiredNotesBtn = ref<HTMLButtonElement>()

const canSave = computed( () => {

    let hasEmptyNotes = false

    for(let item of props.itemsNeedingJustification) {
        if(item.awardedItem.notes.trim() === '') {
            hasEmptyNotes = true 
            break
        }
    }

    return !hasEmptyNotes

})


function updateNotes(canvass_item_id: string, event: Event) {

    // @ts-ignore
    const note = event.target.value
    emits('updateNotes', canvass_item_id, note)
}

function save() {

    emits('save', closeRequiredNotesBtn.value)

}


</script>