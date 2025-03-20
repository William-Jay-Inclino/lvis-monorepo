<template>
    <div class="mb-3">
        <label class="form-label">Lineman Incharge</label>
        <client-only>
            <v-select :options="linemen" label="fullname" v-model="form.lineman_incharge"></v-select>
        </client-only>
    </div>
    <div class="mb-3">
        <label class="form-label">Affected Area</label>
        <input type="text" class="form-control" v-model="form.affected_area">
    </div>
    <div class="mb-3">
        <label class="form-label">Feeder</label>
        <client-only>
            <v-select :options="feeders" label="name" v-model="form.feeder"></v-select>
        </client-only>
    </div>
    <div class="mb-3">
        <label class="form-label">Cause</label>
        <input type="text" class="form-control" v-model="form.cause">
    </div>
    <div class="mb-3">
        <label class="form-label">Weather Condition</label>
        <client-only>
            <v-select :options="weather_conditions" label="name" v-model="form.weather_condition"></v-select>
        </client-only>
    </div>
    <div class="mb-3">
        <label class="form-label">Device</label>
        <client-only>
            <v-select :options="devices" label="name" v-model="form.device"></v-select>
        </client-only>
    </div>
    <div class="mb-3">
        <label class="form-label">Equipment failed</label>
        <input type="text" class="form-control" v-model="form.equipment_failed">
    </div>
    <div class="mb-3">
        <label class="form-label">Fuse rating</label>
        <input type="text" class="form-control" v-model="form.fuse_rating">
    </div>
</template>

<script setup lang="ts">
    import type { Device, Feeder, Lineman, WeatherCondition } from '~/composables/powerserve/common';
    import type { Create_Power_Interruption_Input } from '~/composables/powerserve/task/task.types';

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

    const form = ref<Create_Power_Interruption_Input>({
        lineman_incharge: null,
        affected_area: '',
        feeder: null,
        cause: '',
        weather_condition: null,
        device: null,
        equipment_failed: '',
        fuse_rating: ''
    })

</script>