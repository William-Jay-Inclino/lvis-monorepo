<template>
    <div class="textarea-container position-relative">
        <!-- Textarea for editing the comment -->
        <textarea
            class="form-control form-control-sm text-muted"
            rows="4"
            v-model="currentNote"
            :disabled="!is_editing || is_saving"
            @keyup.enter="saveComment"
        />
        
        <!-- Buttons inside the textarea bottom-right -->
        <div v-if="is_editing" class="position-absolute bottom-0 end-0 p-2">
            <button @click="cancelEdit" class="btn btn-light btn-sm text-danger me-2 mb-2">
                <client-only>
                    <font-awesome-icon :icon="['fas', 'times-circle']" />
                </client-only>
            </button>
            <button @click="saveComment" class="btn btn-light btn-sm text-success me-2 mb-2">
                <client-only>
                    <font-awesome-icon 
                        v-if="!is_saving" 
                        :icon="['fas', 'check-circle']" 
                    />
                    <span 
                        v-else 
                        class="spinner-border spinner-border-sm text-success" 
                        role="status" 
                        aria-hidden="true">
                    </span>
                </client-only>
            </button>
        </div>

        <!-- Display Edit button when not editing -->
        <div v-else class="position-absolute bottom-0 end-0 p-2">
            <button @click="startEdit" class="btn btn-light btn-sm text-primary me-2 mb-2">
                <client-only>
                    <font-awesome-icon :icon="['fas', 'edit']" />
                </client-only>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch } from 'vue';

    const props = defineProps({
        pending_id: {
            type: Number,
            default: null,
        },
        notes: {
            type: [String, null],
            default: null
        },
        is_editing: {
            type: Boolean,
            default: false,
        },
        is_saving: {
            type: Boolean,
            default: false,
        },
    });

    const emits = defineEmits(['save', 'cancel', 'start-edit']);

    const currentNote = ref(props.notes || '');

    watch(() => props.notes, (newValue) => {
        currentNote.value = newValue || ''; 
    });

    const startEdit = () => {
        emits('start-edit', props.pending_id); 
    };

    const cancelEdit = () => {
        currentNote.value = props.notes || '';
        emits('cancel', props.pending_id); 
    };

    const saveComment = () => {
        emits('save', props.pending_id, currentNote.value);
    };
</script>



<style scoped>
    .textarea-container {
        position: relative;
    }
</style>
