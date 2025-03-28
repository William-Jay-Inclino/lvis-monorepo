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
                Meter Number <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.meter_number">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Meter Brand <span class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="meter_brands" label="name" v-model="form.meter_brand" :clearable=false></v-select>
            </client-only>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Last Reading <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.last_reading">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Initial Reading <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.initial_reading">
        </div>
        <div class="mb-3">
            <label class="form-label">
                Meter Class <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.meter_class">
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Lineman, MeterBrand } from '~/composables/powerserve/common';
    import type { KwhMeterInput } from '~/composables/powerserve/task/task-detail-types/kwh-meter';
    import type { Task } from '~/composables/powerserve/task/task.types';


    const props = defineProps({
        task: {
            type: Object as () => Task
        },
        linemen: {
            type: Array as () => Lineman[],
            default: []
        },
        meter_brands: {
            type: Array as () => MeterBrand[],
            default: []
        },
    })

    const form = defineModel<KwhMeterInput>()

    const area = computed( () => {
        if(props.task && props.task.task_assignment && props.task.task_assignment.area) {
            return `(Area: ${ props.task.task_assignment.area.name })`
        }

        return `(Area: N/A)`
    })

</script>