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
            <label class="form-label">Order Number</label>
            <input type="text" class="form-control" v-model="form.order_number">
            <div v-if="form_error.order_number" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Cause</label>
            <input type="text" class="form-control" v-model="form.cause">
            <div v-if="form_error.cause" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">MRV Number</label>
            <input type="text" class="form-control" v-model="form.mrv_number">
            <div v-if="form_error.mrv_number" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">SERIV Number</label>
            <input type="text" class="form-control" v-model="form.seriv_number">
            <div v-if="form_error.seriv_number" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">MST Number</label>
            <input type="text" class="form-control" v-model="form.mst_number">
            <div v-if="form_error.mst_number" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">MCRT Number</label>
            <input type="text" class="form-control" v-model="form.mcrt_number">
            <div v-if="form_error.mcrt_number" class="text-danger small fst-italic">
                {{ error_msg }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Lineman } from '~/composables/powerserve/common';
    import type { LineServicesError, LineServicesInput } from '~/composables/powerserve/task/task-detail-types/line-services';
    import type { Task } from '~/composables/powerserve/task/task.types';

    const props = defineProps({
        form_error: {
            type: Object as () => LineServicesError
        },
        task: {
            type: Object as () => Task
        },
        linemen: {
            type: Array as () => Lineman[],
            default: []
        },
    })

    const form = defineModel<LineServicesInput>()
    const error_msg = ref('This field is required')

    const area = computed( () => {
        if(props.task && props.task.task_assignment && props.task.task_assignment.area) {
            return `(Area: ${ props.task.task_assignment.area.name })`
        }

        return `(Area: N/A)`
    })

</script>