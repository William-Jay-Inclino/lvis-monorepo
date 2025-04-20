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
                    <td> Cause </td>
                    <td class="text-muted"> {{ task_detail.cause.name }} </td>
                </tr>
                <tr>
                    <td> Distance Travelled </td>
                    <td class="text-muted"> {{ task_detail.distance_travel_in_km }} km </td>
                </tr>
                <tr>
                    <td> Order Number </td>
                    <td class="text-muted"> {{ task_detail.order_number }} </td>
                </tr>
                <tr>
                    <td> Cause </td>
                    <td class="text-muted"> {{ task_detail.cause.name }} </td>
                </tr>
                <tr>
                    <td> MRV Number </td>
                    <td class="text-muted"> {{ task_detail.mrv_number }} </td>
                </tr>
                <tr>
                    <td> SERIV Number </td>
                    <td class="text-muted"> {{ task_detail.seriv_number }} </td>
                </tr>
                <tr>
                    <td> MST Number </td>
                    <td class="text-muted"> {{ task_detail.mst_number }} </td>
                </tr>
                <tr>
                    <td> MCRT Number </td>
                    <td class="text-muted"> {{ task_detail.mcrt_number }} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script setup lang="ts">
    import type { TaskDetailLineServices } from '~/composables/powerserve/task/task-detail-types/line-services';



    const props = defineProps({
        task_detail: {
            type: Object as () => TaskDetailLineServices | null,
        },
    })

</script>