<template>
    <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="attachNoteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">
                        Attach Note
                    </h5>
                    <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <textarea rows="3" class="form-control" :value="note" ref="noteField"></textarea>
                </div>
                <div class="modal-footer">
                    <button ref="closeAddApproverModal" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-close"></i> Close
                    </button>
                    <button @click="attachNote" class="btn btn-primary">
                        <i class="fas fa-paperclip"></i> Attach
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>



<script setup lang="ts">

const emits = defineEmits(['attachNote'])

const props = defineProps({
    canvassItemId: {
        type: String,
        default: () => '',
    },
    note: {
        type: String,
        default: () => '',
    },
});

const noteField = ref<HTMLTextAreaElement>()

function attachNote() {
    console.log('updateNote', props.canvassItemId, noteField.value?.value)
}

</script>