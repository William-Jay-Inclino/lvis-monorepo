<template>
    <div class="modal fade" id="assign_task_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title fw-bold"> {{ complaint?.assigned_group ? complaint?.assigned_group.name : 'Broadcast to is undefined' }} </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="responsive">
                        <table class="table table-sm table-bordered">
                            <thead>
                                <tr>
                                    <th>Employee name</th>
                                    <th class="text-center">Assign</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="employee in employees">
                                    <td class="text-muted"> {{ getFullname(employee.firstname, employee.middlename, employee.lastname) }} </td>
                                    <td class="text-center">  
                                        <button class="btn btn-sm btn-primary"> Assign </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Employee } from '~/composables/hr/employee/employee.types';
import type { Complaint } from '~/composables/powerserve/complaint/complaint.types';


    const props = defineProps({
        complaint: {
            type: Object as () => Complaint,
        },
        employees: {
            type: Array as () => Employee[],
            default: []
        },
        is_loading_employees: {
            type: Boolean,
            default: false,
        }
    })

</script>