<template>
    <div class="row g-2">
        <div class="col-md-3">
            <label class="form-label small fw-semibold">Nature of Complaint</label>
            <client-only>
                <v-select :options="nature_of_complaints" label="name" v-model="nature_of_complaint"></v-select>
            </client-only>
        </div>
        <div class="col-md-3">
            <label class="form-label small fw-semibold">Municipality</label>
            <client-only>
                <v-select :options="municipalities" label="name" v-model="municipality"></v-select>
            </client-only>
        </div>
        <div class="col-md-3">
            <label class="form-label small fw-semibold">Assignment</label>
            <client-only>
                <v-select :options="assignments" label="name" v-model="assignment"></v-select>
            </client-only>
        </div>
        <div class="col-md-3">
            <label class="form-label small fw-semibold">Status</label>
            <client-only>
                <v-select :options="complaint_statuses" label="name" v-model="complaint_status"></v-select>
            </client-only>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Area, Assignment, Department, Municipality } from '~/composables/powerserve/common';
    import type { ComplaintStatus, NatureOfComplaint } from '~/composables/powerserve/complaints/complaints.types';


    const props = defineProps({
        nature_of_complaints: {
            type: Array as () => NatureOfComplaint[],
            default: () => [],
        },
        municipalities: {
            type: Array as () => Municipality[],
            default: () => [],
        },
        assignments: {
            type: Array as () => Assignment[],
            default: () => [],
        },
        complaint_statuses: {
            type: Array as () => ComplaintStatus[],
            default: () => [],
        },
    });

    const nature_of_complaint = ref<NatureOfComplaint>()
    const municipality = ref<Municipality>()
    const assignment = ref<Area | Department | Division>()
    const complaint_status = ref<ComplaintStatus>()


</script>