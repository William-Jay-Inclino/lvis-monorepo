<template>
    <div>
        <div class="row g-0">
            <div class="col-8">
                <textarea
                    class="form-control form-control-sm"
                    rows="2"
                    v-model="currentNote"
                    :disabled="!is_editing || is_saving"
                    @keyup.enter="saveComment"
                />
            </div>
            <div class="col d-flex align-items-center">
                <!-- Buttons inside the textarea bottom-right -->
                <div v-if="is_editing">
                    <button @click="cancelEdit" class="btn btn-light btn-sm text-danger me-2 ms-2">
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
                <div v-else>
                    <button @click="startEdit" class="btn btn-light btn-sm text-primary ms-2">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'edit']" /> 
                        </client-only>
                    </button>
                </div>
            </div>
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


