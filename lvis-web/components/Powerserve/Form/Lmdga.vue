<template>
    <div v-if="form">
        <div class="mb-3">
            <label class="form-label">
                Linemen Incharge <span class="text-muted"> {{ area }} </span> <span class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="linemen" label="fullname" v-model="form.linemen_incharge" :multiple="true"></v-select>
            </client-only>
            <div class="small text-muted fst-italic">
                Options are based on the area assigned by the custcare personnel
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                KVA Rating <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.kva_rating">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Substation <span class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="substations" label="name" v-model="form.substation"></v-select>
            </client-only>
        </div>
        <div class="mb-3">
            <label class="form-label">
                DT Location <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.dt_location">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Feeder <span class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="feeders" label="name" v-model="form.feeder"></v-select>
            </client-only>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Phase Number <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.phase_number">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Number of HC <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.number_of_hc">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Number of Spans <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.number_of_spans">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Copper Aluminum Primary <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.copper_aluminum_primary">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Copper Aluminum Secondary <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.copper_aluminum_secondary">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Copper Aluminum Ground <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.copper_aluminum_ground">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Size Primary <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.size_primary">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Size Secondary <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.size_secondary">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Size Ground <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.size_ground">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Terminal Connector Primary <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.terminal_connector_primary">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Terminal Connector Secondary <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.terminal_connector_secondary">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Terminal Connector Ground <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.terminal_connector_ground">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Tap Position <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.tap_position">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Brand <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.brand">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Number of Busing Primary <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.number_of_bushing_primary">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Number of Busing Secondary <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.number_of_bushing_secondary">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Protective Device <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.protective_device">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Load Current Sec Bushing <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.load_current_sec_bushing">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Load Current Neutral <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.load_current_neutral">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Load Current One <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.load_current_one">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Load Current Two <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.load_current_two">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Voltage Level One <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.voltage_level_one">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Voltage Level Two <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.voltage_level_two">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Sec Line Conductor Size One <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.sec_line_conductor_size_one">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Sec Line Conductor Size Two <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.sec_line_conductor_size_two">
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Feeder, Lineman, Substation } from '~/composables/powerserve/common';
    import type { LmdgaInput } from '~/composables/powerserve/task/task-detail-types/lmdga';
    import type { Task } from '~/composables/powerserve/task/task.types';

    const props = defineProps({
        task: {
            type: Object as () => Task
        },
        linemen: {
            type: Array as () => Lineman[],
            default: []
        },
        substations: {
            type: Array as () => Substation[],
            default: []
        },
        feeders: {
            type: Array as () => Feeder[],
            default: []
        },
    })

    const form = defineModel<LmdgaInput>()

    const area = computed( () => {
        if(props.task && props.task.task_assignment && props.task.task_assignment.area) {
            return `(Area: ${ props.task.task_assignment.area.name })`
        }

        return `(Area: N/A)`
    })

</script>