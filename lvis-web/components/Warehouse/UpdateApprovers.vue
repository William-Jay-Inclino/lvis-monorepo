<template>
    <div>
        <div v-for="approver in approvers" class="mb-3">
            <label class="form-label"> 
                {{ approver.label }}
                <small :class="{ [`badge bg-${approvalStatus[approver.status].color}`]: true }"> {{ approvalStatus[approver.status].label }} </small>
            </label>
            <div class="input-group">
                <input :value="getFullname(approver.approver.firstname, approver.approver.middlename, approver.approver.lastname)" type="text" class="form-control" disabled>
                <button
                    @click="onClickChangeApprover(approver)"    
                    data-bs-toggle="modal"
                    data-bs-target="#changeApproverModal"
                    class="btn btn-primary"
                    type="button"
                    :disabled="approver.status !== APPROVAL_STATUS.PENDING">
                    <i
                    class="fas fa-user-edit"></i>
                        Change Approver
                    </button>
            </div>
        </div>

        <div class="modal fade" id="changeApproverModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-warning">Change Approver</h5>
                        <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">
                                Select Employee <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="newApprover" :clearable="false"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button ref="closeChangeApproverModal" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-close"></i> Close
                        </button>
                        <button @click="handleChangeApprover()" class="btn btn-primary" :disabled="!newApprover || isUpdating">
                            <i class="fas fa-edit"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import type { Employee } from '~/composables/system/employee/employee.types';


    const props = defineProps({ 
        approvers: {
            type: Array as () => Approver[],
            default: () => [],
        },
        employees: {
            type: Array as () => Employee[],
            default: () => [],
        },
        isUpdating: {
            type: Boolean,
            default: false
        },
    });

    const emits = defineEmits(['change-approver'])

    const currentApprover = ref<Approver | null>(null)
    const newApprover = ref<Employee | null>(null)
    const closeChangeApproverModal = ref<HTMLButtonElement>()

    function onClickChangeApprover(approver: Approver) {
        const employee = props.employees.find(i => i.id === approver.approver.id)

        if(!employee) {
            console.error('Employee not found with id: ' + approver.approver.lastname);
            return 
        }

        currentApprover.value = {...approver}
        newApprover.value = {...employee}

    }

    function handleChangeApprover() {
        emits('change-approver', {
            currentApprover: {...currentApprover.value}, 
            newApprover: {...newApprover.value}
        }, closeChangeApproverModal.value)
    }

</script>