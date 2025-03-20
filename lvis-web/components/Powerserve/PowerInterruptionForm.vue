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
        <label class="form-label">Cause</label>
        <input type="text" class="form-control" v-model="form.cause">
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
    import type { Lineman } from '~/composables/powerserve/common';
    import type { Create_Power_Interruption_Input } from '~/composables/powerserve/task/task.types';

    const props = defineProps({
        linemen: {
            type: Array as () => Lineman[]
        },
    })

    const form = ref<Create_Power_Interruption_Input>({
        lineman_incharge: null,
        affected_area: '',
        cause: '',
        equipment_failed: '',
        fuse_rating: ''
    })

</script>