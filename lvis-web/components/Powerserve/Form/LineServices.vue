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
            <label class="form-label">Order Number</label>
            <input type="text" class="form-control" v-model="form.order_number">
        </div>
        <div class="mb-3">
            <label class="form-label">Cause</label>
            <input type="text" class="form-control" v-model="form.cause">
        </div>
        <div class="mb-3">
            <label class="form-label">MRV Number</label>
            <input type="text" class="form-control" v-model="form.mrv_number">
        </div>
        <div class="mb-3">
            <label class="form-label">SERIV Number</label>
            <input type="text" class="form-control" v-model="form.seriv_number">
        </div>
        <div class="mb-3">
            <label class="form-label">MST Number</label>
            <input type="text" class="form-control" v-model="form.order_number">
        </div>
        <div class="mb-3">
            <label class="form-label">MCRT Number</label>
            <input type="text" class="form-control" v-model="form.order_number">
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Lineman } from '~/composables/powerserve/common';
    import type { LineServicesInput } from '~/composables/powerserve/task/task-detail-types/line-services';
    import type { Task } from '~/composables/powerserve/task/task.types';

    const props = defineProps({
        task: {
            type: Object as () => Task
        },
        linemen: {
            type: Array as () => Lineman[],
            default: []
        },
    })

    const form = defineModel<LineServicesInput>()

    const area = computed( () => {
        if(props.task && props.task.task_assignment && props.task.task_assignment.area) {
            return `(Area: ${ props.task.task_assignment.area.name })`
        }

        return `(Area: N/A)`
    })

</script>