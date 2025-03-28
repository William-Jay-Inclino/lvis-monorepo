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
                    <td> SCO Number </td>
                    <td class="text-muted"> {{ task_detail.sco_number }} </td>
                </tr>
                <tr>
                    <td> Old Serial Number </td>
                    <td class="text-muted"> {{ task_detail.old_serial_number }} </td>
                </tr>
                <tr>
                    <td> New Serial Number </td>
                    <td class="text-muted"> {{ task_detail.new_serial_number }} </td>
                </tr>
                <tr>
                    <td> SERIV Number </td>
                    <td class="text-muted"> {{ task_detail.seriv_number }} </td>
                </tr>
                <tr>
                    <td> KVA Rating </td>
                    <td class="text-muted"> {{ task_detail.kva_rating }} </td>
                </tr>
                <tr>
                    <td> Cause </td>
                    <td class="text-muted"> {{ task_detail.cause }} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script setup lang="ts">
    import type { TaskDetailDles } from '~/composables/powerserve/task/task-detail-types/dles';



    const props = defineProps({
        task_detail: {
            type: Object as () => TaskDetailDles | null,
        },
    })

</script>