<template>
    <div class="textarea-container position-relative">
        <!-- Textarea for editing the comment -->
        <textarea
            class="form-control form-control-sm"
            rows="5"
            v-model="currentNote"
            :disabled="!is_editing || is_saving"
            @keyup.enter="saveComment"
        />
        
        <!-- Buttons inside the textarea bottom-right -->
        <div v-if="is_editing" class="position-absolute bottom-0 end-0 p-2">
            <button @click="cancelEdit" class="btn btn-light btn-sm text-danger me-4">
                <client-only>
                    <font-awesome-icon :icon="['fas', 'times-circle']" />
                </client-only>
            </button>
            <button @click="saveComment" class="btn btn-light btn-sm text-success">
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
            <button @click="startEdit" class="btn btn-light btn-sm text-primary">
                <client-only>
                    <font-awesome-icon :icon="['fas', 'edit']" /> Comment
                </client-only>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch } from 'vue';

    const props = defineProps<{
        pending_id: number,
        notes: string | null; 
        is_editing: boolean;
        is_saving: boolean;
    }>();

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
