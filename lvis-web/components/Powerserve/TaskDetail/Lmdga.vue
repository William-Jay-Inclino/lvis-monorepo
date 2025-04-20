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
                    <td> Distance Travelled </td>
                    <td class="text-muted"> {{ task_detail.distance_travel_in_km }} km </td>
                </tr>
                <tr>
                    <td> KVA Rating </td>
                    <td class="text-muted"> {{ task_detail.kva_rating }} </td>
                </tr>
                <tr>
                    <td> Substation </td>
                    <td class="text-muted"> {{ task_detail.substation.name }} </td>
                </tr>
                <tr>
                    <td> DT Location </td>
                    <td class="text-muted"> {{ task_detail.dt_location }} </td>
                </tr>
                <tr>
                    <td> Feeder </td>
                    <td class="text-muted"> {{ task_detail.feeder.name }} </td>
                </tr>
                <tr>
                    <td> Phase Number </td>
                    <td class="text-muted"> {{ task_detail.phase_number }} </td>
                </tr>
                <tr>
                    <td> Number of HC </td>
                    <td class="text-muted"> {{ task_detail.number_of_hc }} </td>
                </tr>
                <tr>
                    <td> Number of Spans </td>
                    <td class="text-muted"> {{ task_detail.number_of_spans }} </td>
                </tr>
                <tr>
                    <td> Copper Aluminum Primary </td>
                    <td class="text-muted"> {{ task_detail.copper_aluminum_primary }} </td>
                </tr>
                <tr>
                    <td> Copper Aluminum Secondary </td>
                    <td class="text-muted"> {{ task_detail.copper_aluminum_secondary }} </td>
                </tr>
                <tr>
                    <td> Copper Aluminum Ground </td>
                    <td class="text-muted"> {{ task_detail.copper_aluminum_ground }} </td>
                </tr>
                <tr>
                    <td> Size Primary </td>
                    <td class="text-muted"> {{ task_detail.size_primary }} </td>
                </tr>
                <tr>
                    <td> Size Secondary </td>
                    <td class="text-muted"> {{ task_detail.size_secondary }} </td>
                </tr>
                <tr>
                    <td> Size Ground </td>
                    <td class="text-muted"> {{ task_detail.size_ground }} </td>
                </tr>
                <tr>
                    <td> Terminal Connector Primary </td>
                    <td class="text-muted"> {{ task_detail.terminal_connector_primary }} </td>
                </tr>
                <tr>
                    <td> Terminal Connector Secondary </td>
                    <td class="text-muted"> {{ task_detail.terminal_connector_secondary }} </td>
                </tr>
                <tr>
                    <td> Terminal Connector Ground </td>
                    <td class="text-muted"> {{ task_detail.terminal_connector_ground }} </td>
                </tr>
                <tr>
                    <td> Tap Position </td>
                    <td class="text-muted"> {{ task_detail.tap_position }} </td>
                </tr>
                <tr>
                    <td> Brand </td>
                    <td class="text-muted"> {{ task_detail.brand }} </td>
                </tr>
                <tr>
                    <td> Number of Bushing Primary </td>
                    <td class="text-muted"> {{ task_detail.number_of_bushing_primary }} </td>
                </tr>
                <tr>
                    <td> Number of Bushing Secondary </td>
                    <td class="text-muted"> {{ task_detail.number_of_bushing_secondary }} </td>
                </tr>
                <tr>
                    <td> Protective Device </td>
                    <td class="text-muted"> {{ task_detail.protective_device }} </td>
                </tr>
                <tr>
                    <td> Load Current Sec Bushing </td>
                    <td class="text-muted"> {{ task_detail.load_current_sec_bushing }} </td>
                </tr>
                <tr>
                    <td> Load Current Neutral </td>
                    <td class="text-muted"> {{ task_detail.load_current_neutral }} </td>
                </tr>
                <tr>
                    <td> Load Current One </td>
                    <td class="text-muted"> {{ task_detail.load_current_one }} </td>
                </tr>
                <tr>
                    <td> Load Current Two </td>
                    <td class="text-muted"> {{ task_detail.load_current_two }} </td>
                </tr>
                <tr>
                    <td> Voltage Level One </td>
                    <td class="text-muted"> {{ task_detail.voltage_level_one }} </td>
                </tr>
                <tr>
                    <td> Voltage Level Two </td>
                    <td class="text-muted"> {{ task_detail.voltage_level_two }} </td>
                </tr>
                <tr>
                    <td> Sec Line Conductor Size One </td>
                    <td class="text-muted"> {{ task_detail.sec_line_conductor_size_one }} </td>
                </tr>
                <tr>
                    <td> Sec Line Conductor Size Two </td>
                    <td class="text-muted"> {{ task_detail.sec_line_conductor_size_two }} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script setup lang="ts">
    import type { TaskDetailLmdga } from '~/composables/powerserve/task/task-detail-types/lmdga';



    const props = defineProps({
        task_detail: {
            type: Object as () => TaskDetailLmdga | null,
        },
    })

</script>