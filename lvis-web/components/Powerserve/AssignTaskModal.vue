<template>
    <div class="modal fade" id="assign_task_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title"> Assign Task </h5>
                    <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label"> Task Ref # </label>
                        <input type="text" class="form-control" disabled :value="task?.ref_number">
                    </div>
                    <div class="mb-3">
                        <label class="form-label"> Date Created </label>
                        <input type="text" class="form-control" disabled :value="formatDate(task?.created_at, true)">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Task Description</label>
                        <textarea class="form-control form-control-sm" rows="3" placeholder="Add notes here if needed..." disabled>{{ task?.description }}</textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label"> 
                            Select Assignee <span class="text-danger">*</span> 
                        </label>
                        <client-only>
                            <v-select :options="employees" label="fullname" v-model="assignee" :clearable="false"></v-select>
                        </client-only>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Add Note</label>
                        <textarea v-model="note" class="form-control form-control-sm" rows="3" placeholder="Add notes here if needed..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button :disabled="is_assigning" @click="onClickAssign()" type="button" class="btn btn-primary"> {{ is_assigning ? 'Assigning...' : 'Assign' }} </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Employee } from '~/composables/hr/employee/employee.types';
    import type { Task } from '~/composables/powerserve/task/task.types';

    const emits = defineEmits(['assign'])

    const props = defineProps({
        task: {
            type: Object as () => Task,
        },
        employees: {
            type: Array as () => Employee[],
            default: []
        },
        is_assigning: {
            type: Boolean,
            default: false
        }
    })

    const closeBtn = ref<HTMLButtonElement>()
    const assignee = ref<Employee>()
    const note = ref('')

    function onClickAssign() {
        emits('assign', { 
            task: props.task, 
            assignee: {...assignee.value}, 
            note: note.value, 
            closeBtn: closeBtn.value 
        })
    }

</script>