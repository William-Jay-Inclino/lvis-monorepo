<template>
    <div v-if="form && form_error">
        <div class="mb-3">
            <label class="form-label">
                Linemen Incharge <span class="text-muted"> {{ area }} </span> <span class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="linemen" label="fullname" v-model="form.linemen_incharge" :multiple="true"></v-select>
            </client-only>
            <div v-if="form_error.linemen_incharge" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
            <div class="small text-muted fst-italic">
                Options are based on the area assigned by the custcare personnel
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                KVA Rating
            </label>
            <input type="text" class="form-control" v-model="form.kva_rating">
            <div v-if="form_error.kva_rating" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Substation
            </label>
            <client-only>
                <v-select :options="substations" label="name" v-model="form.substation"></v-select>
            </client-only>
            <div v-if="form_error.substation" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                DT Location
            </label>
            <input type="text" class="form-control" v-model="form.dt_location">
            <div v-if="form_error.dt_location" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Feeder
            </label>
            <client-only>
                <v-select :options="feeders" label="name" v-model="form.feeder"></v-select>
            </client-only>
            <div v-if="form_error.feeder" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Phase Number
            </label>
            <input type="text" class="form-control" v-model="form.phase_number">
            <div v-if="form_error.phase_number" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Number of HC
            </label>
            <input type="text" class="form-control" v-model="form.number_of_hc">
            <div v-if="form_error.number_of_hc" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Number of Spans
            </label>
            <input type="text" class="form-control" v-model="form.number_of_spans">
            <div v-if="form_error.number_of_spans" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Copper Aluminum Primary
            </label>
            <input type="text" class="form-control" v-model="form.copper_aluminum_primary">
            <div v-if="form_error.copper_aluminum_primary" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Copper Aluminum Secondary
            </label>
            <input type="text" class="form-control" v-model="form.copper_aluminum_secondary">
            <div v-if="form_error.copper_aluminum_secondary" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Copper Aluminum Ground
            </label>
            <input type="text" class="form-control" v-model="form.copper_aluminum_ground">
            <div v-if="form_error.copper_aluminum_ground" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Size Primary
            </label>
            <input type="text" class="form-control" v-model="form.size_primary">
            <div v-if="form_error.size_primary" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Size Secondary
            </label>
            <input type="text" class="form-control" v-model="form.size_secondary">
            <div v-if="form_error.size_secondary" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Size Ground
            </label>
            <input type="text" class="form-control" v-model="form.size_ground">
            <div v-if="form_error.size_ground" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Terminal Connector Primary
            </label>
            <input type="text" class="form-control" v-model="form.terminal_connector_primary">
            <div v-if="form_error.terminal_connector_primary" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Terminal Connector Secondary
            </label>
            <input type="text" class="form-control" v-model="form.terminal_connector_secondary">
            <div v-if="form_error.terminal_connector_secondary" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Terminal Connector Ground
            </label>
            <input type="text" class="form-control" v-model="form.terminal_connector_ground">
            <div v-if="form_error.terminal_connector_ground" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Tap Position
            </label>
            <input type="text" class="form-control" v-model="form.tap_position">
            <div v-if="form_error.tap_position" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Brand
            </label>
            <input type="text" class="form-control" v-model="form.brand">
            <div v-if="form_error.brand" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Number of Busing Primary
            </label>
            <input type="text" class="form-control" v-model="form.number_of_bushing_primary">
            <div v-if="form_error.number_of_bushing_primary" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Number of Busing Secondary
            </label>
            <input type="text" class="form-control" v-model="form.number_of_bushing_secondary">
            <div v-if="form_error.number_of_bushing_secondary" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Protective Device
            </label>
            <input type="text" class="form-control" v-model="form.protective_device">
            <div v-if="form_error.protective_device" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Load Current Sec Bushing
            </label>
            <input type="text" class="form-control" v-model="form.load_current_sec_bushing">
            <div v-if="form_error.load_current_sec_bushing" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Load Current Neutral
            </label>
            <input type="text" class="form-control" v-model="form.load_current_neutral">
            <div v-if="form_error.load_current_neutral" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Load Current One
            </label>
            <input type="text" class="form-control" v-model="form.load_current_one">
            <div v-if="form_error.load_current_one" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Load Current Two
            </label>
            <input type="text" class="form-control" v-model="form.load_current_two">
            <div v-if="form_error.load_current_two" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Voltage Level One
            </label>
            <input type="text" class="form-control" v-model="form.voltage_level_one">
            <div v-if="form_error.voltage_level_one" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Voltage Level Two
            </label>
            <input type="text" class="form-control" v-model="form.voltage_level_two">
            <div v-if="form_error.voltage_level_two" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Sec Line Conductor Size One
            </label>
            <input type="text" class="form-control" v-model="form.sec_line_conductor_size_one">
            <div v-if="form_error.sec_line_conductor_size_one" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Sec Line Conductor Size Two
            </label>
            <input type="text" class="form-control" v-model="form.sec_line_conductor_size_two">
            <div v-if="form_error.sec_line_conductor_size_two" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Feeder, Substation } from '~/composables/powerserve/common';
    import type { Lineman } from '~/composables/powerserve/lineman/lineman.types';
    import type { LmdgaError, LmdgaInput } from '~/composables/powerserve/task/task-detail-types/lmdga';
    import { TASK_STATUS } from '~/composables/powerserve/task/task.constants';
    import type { Task, TaskStatus } from '~/composables/powerserve/task/task.types';

    const props = defineProps({
        task_status: {
            type: Object as () => TaskStatus | null,
            default: null
        },
        form_error: {
            type: Object as () => LmdgaError
        },
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
    const error_msg = ref('This field is required')

    const is_completed = computed(() => props.task_status && props.task_status.id === TASK_STATUS.COMPLETED)

    const area = computed( () => {
        if(props.task && props.task.task_assignment && props.task.task_assignment.area) {
            return `(Area: ${ props.task.task_assignment.area.name })`
        }

        return `(Area: N/A)`
    })

</script>