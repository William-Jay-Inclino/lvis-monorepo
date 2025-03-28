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
                Meter Number <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.meter_number">
            <div v-if="form_error.meter_number" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Meter Brand <span class="text-danger">*</span>
            </label>
            <client-only>
                <v-select :options="meter_brands" label="name" v-model="form.meter_brand" :clearable=false></v-select>
            </client-only>
            <div v-if="form_error.meter_brand" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Last Reading <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.last_reading">
            <div v-if="form_error.last_reading" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Initial Reading <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.initial_reading">
            <div v-if="form_error.initial_reading" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">
                Meter Class <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" v-model="form.meter_class">
            <div v-if="form_error.meter_class" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Lineman, MeterBrand } from '~/composables/powerserve/common';
    import type { KwhMeterError, KwhMeterInput } from '~/composables/powerserve/task/task-detail-types/kwh-meter';
    import type { Task } from '~/composables/powerserve/task/task.types';


    const props = defineProps({
        form_error: {
            type: Object as () => KwhMeterError
        },
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
    const error_msg = ref('This field is required')

    const area = computed( () => {
        if(props.task && props.task.task_assignment && props.task.task_assignment.area) {
            return `(Area: ${ props.task.task_assignment.area.name })`
        }

        return `(Area: N/A)`
    })

</script>