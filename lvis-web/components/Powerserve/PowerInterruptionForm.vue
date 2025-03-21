<template>
    <div v-if="form">
        <div class="mb-3">
            <label class="form-label">
                Lineman Incharge <span class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="linemen" label="fullname" v-model="form.lineman_incharge"></v-select>
            </client-only>
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

    const props = defineProps({
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

</script>