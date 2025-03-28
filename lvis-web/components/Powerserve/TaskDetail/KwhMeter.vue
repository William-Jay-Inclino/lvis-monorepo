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
                    <td> Meter Number </td>
                    <td class="text-muted"> {{ task_detail.meter_number }} </td>
                </tr>
                <tr>
                    <td> Meter Brand </td>
                    <td class="text-muted"> {{ task_detail.meter_brand.name }} </td>
                </tr>
                <tr>
                    <td> Last Reading </td>
                    <td class="text-muted"> {{ task_detail.last_reading }} </td>
                </tr>
                <tr>
                    <td> Initial Reading </td>
                    <td class="text-muted"> {{ task_detail.initial_reading }} </td>
                </tr>
                <tr>
                    <td> Meter Class </td>
                    <td class="text-muted"> {{ task_detail.meter_class }} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script setup lang="ts">
    import type { TaskDetailKwhMeter } from '~/composables/powerserve/task/task-detail-types/kwh-meter';



    const props = defineProps({
        task_detail: {
            type: Object as () => TaskDetailKwhMeter | null,
        },
    })

</script>