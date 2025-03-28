<template>
    <div v-if="task_detail" class="responsive">
        <table class="table table-borderless">
            <tbody>
                <tr>
                    <td width="40%">Linemen Incharge</td>
                    <td class="text-muted">
                        <ul>
                            <li v-for="lineman_incharge in task_detail.linemen_incharge">
                                {{ getFullname(lineman_incharge.lineman.employee.firstname, lineman_incharge.lineman.employee.middlename, lineman_incharge.lineman.employee.lastname) }}
                            </li>
                        </ul>
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
import type { TaskDetailPowerInterruption } from '~/composables/powerserve/task/task-detail-types/power-interruption';



    const props = defineProps({
        task_detail: {
            type: Object as () => TaskDetailPowerInterruption | null,
        },
    })

</script>