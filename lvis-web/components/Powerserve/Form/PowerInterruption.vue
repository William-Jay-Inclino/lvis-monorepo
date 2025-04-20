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
            <label class="label">Distance Travelled (km)</label>
            <input type="number" class="form-control" v-model="form.distance_travel_in_km">
            <div v-if="form_error.distance_travel_in_km" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Cause <span v-show="is_completed" class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="causes" label="name" v-model="form.cause" :clearable=false></v-select>
            </client-only>
            <div v-if="form_error.cause" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Affected Area <span v-show="is_completed" class="text-danger">*</span>
            </label>
            <div v-if="form_error.affected_area" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
            <input type="text" class="form-control" v-model="form.affected_area">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Feeder <span v-show="is_completed" class="text-danger">*</span>
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
                Weather Condition <span v-show="is_completed" class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="weather_conditions" label="name" v-model="form.weather_condition"></v-select>
            </client-only>
            <div v-if="form_error.weather_condition" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Device <span v-show="is_completed" class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="devices" label="name" v-model="form.device"></v-select>
            </client-only>
            <div v-if="form_error.device" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Equipment failed <span v-show="is_completed" class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="equipments" label="name" v-model="form.equipment_failed" :clearable=false></v-select>
            </client-only>
            <div v-if="form_error.equipment_failed" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Fuse rating <span v-show="is_completed" class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.fuse_rating">
            <div v-if="form_error.fuse_rating" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { ActivityCategoryCause, Device, Equipment, Feeder, WeatherCondition } from '~/composables/powerserve/common';
    import type { Lineman } from '~/composables/powerserve/lineman/lineman.types';
    import type { PowerInterruptionError, PowerInterruptionInput } from '~/composables/powerserve/task/task-detail-types/power-interruption';
    import { TASK_STATUS } from '~/composables/powerserve/task/task.constants';
    import type { Task, TaskStatus } from '~/composables/powerserve/task/task.types';

    const props = defineProps({
        task_status: {
            type: Object as () => TaskStatus | null,
            default: null
        },
        form_error: {
            type: Object as () => PowerInterruptionError
        },
        task: {
            type: Object as () => Task
        },
        linemen: {
            type: Array as () => Lineman[],
            default: []
        },
        feeders: {
            type: Array as () => Feeder[],
            default: []
        },
        weather_conditions: {
            type: Array as () => WeatherCondition[],
            default: []
        },
        devices: {
            type: Array as () => Device[],
            default: []
        },
        causes: {
            type: Array as () => ActivityCategoryCause[],
            default: []
        },
        equipments: {
            type: Array as () => Equipment[],
            default: []
        },
    })

    const form = defineModel<PowerInterruptionInput>()

    const error_msg = ref('This field is required')

    const is_completed = computed(() => props.task_status && props.task_status.id === TASK_STATUS.COMPLETED)
    
    const area = computed( () => {
        if(props.task && props.task.task_assignment && props.task.task_assignment.area) {
            return `(Area: ${ props.task.task_assignment.area.name })`
        }

        return `(Area: N/A)`
    })

</script>