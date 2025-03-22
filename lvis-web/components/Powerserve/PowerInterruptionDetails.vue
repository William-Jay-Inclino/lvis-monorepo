<template>
    <div v-if="task_detail" class="responsive">
        <table class="table table-borderless">
            <tbody>
                <tr>
                    <td width="40%">Lineman Incharge</td>
                    <td class="text-muted">
                        {{ getFullname(task_detail.lineman.employee.firstname, task_detail.lineman.employee.middlename, task_detail.lineman.employee.lastname) }} 
                    </td>
                </tr>
                <tr>
                    <td> Affected Area </td>
                    <td class="text-muted"> {{ task_detail.affected_area }} </td>
                </tr>
                <tr>
                    <td> Feeder </td>
                    <td class="text-muted"> {{ task_detail.feeder.name }} </td>
                </tr>
                <tr>
                    <td> Cause </td>
                    <td class="text-muted"> {{ task_detail.cause }} </td>
                </tr>
                <tr>
                    <td> Weather Condition </td>
                    <td class="text-muted"> {{ task_detail.weather_condition.name }} </td>
                </tr>
                <tr>
                    <td> Device </td>
                    <td class="text-muted"> {{ task_detail.device.name }} </td>
                </tr>
                <tr>
                    <td> Equipment Failed </td>
                    <td class="text-muted"> {{ task_detail.equipment_failed }} </td>
                </tr>
                <tr>
                    <td> Fuse Rating </td>
                    <td class="text-muted"> {{ task_detail.fuse_rating }} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script setup lang="ts">
import type { TaskDetailPowerInterruption } from '~/composables/powerserve/task/task.types';


    const props = defineProps({
        task_detail: {
            type: Object as () => TaskDetailPowerInterruption | null,
        },
    })

</script>