<template>
    <div class="textarea-container position-relative">
        <!-- Textarea for editing the comment -->
        <textarea
            class="form-control"
            rows="3"
            v-model="currentNote"
            :disabled="!is_editing || is_saving"
            @keyup.enter="saveComment"
        />
        
        <!-- Buttons inside the textarea bottom-right -->
        <div v-if="is_editing" class="position-absolute bottom-0 end-0 p-2">
            <button @click="cancelEdit" class="btn btn-light btn-sm me-2">
                <client-only>
                    <font-awesome-icon :icon="['fas', 'times-circle']" class="text-danger" />
                </client-only>
            </button>
            <button @click="saveComment" class="btn btn-light btn-sm">
                <client-only>
                    <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success" />
                </client-only>
            </button>
        </div>

        <!-- Display Edit button when not editing -->
        <div v-else class="position-absolute bottom-0 end-0 p-2">
            <button @click="startEdit" class="btn btn-light btn-sm">
                <client-only>
                    <font-awesome-icon :icon="['fas', 'edit']" class="text-primary" />
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
