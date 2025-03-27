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
                Affected Area <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.affected_area">
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
                Cause <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.cause">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Weather Condition <span class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="weather_conditions" label="name" v-model="form.weather_condition"></v-select>
            </client-only>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Device <span class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="devices" label="name" v-model="form.device"></v-select>
            </client-only>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Equipment failed <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.equipment_failed">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Fuse rating <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.fuse_rating">
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Device, Feeder, Lineman, WeatherCondition } from '~/composables/powerserve/common';
    import type { PowerInterruptionInput } from '~/composables/powerserve/task/dtos/task-detail.input.types';
    import type { Task } from '~/composables/powerserve/task/task.types';

    const props = defineProps({
        task: {
            type: Object as () => Task
        },
        linemen: {
            type: Array as () => Lineman[]
        },
        feeders: {
            type: Array as () => Feeder[]
        },
        weather_conditions: {
            type: Array as () => WeatherCondition[]
        },
        devices: {
            type: Array as () => Device[]
        },
    })

    const form = defineModel<PowerInterruptionInput>()

    const area = computed( () => {
        if(props.task && props.task.task_assignment && props.task.task_assignment.area) {
            return `(Area: ${ props.task.task_assignment.area.name })`
        }

        return `(Area: N/A)`
    })

</script>