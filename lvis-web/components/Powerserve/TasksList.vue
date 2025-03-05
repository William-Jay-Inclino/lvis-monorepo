<template>
    <div class="table-responsive">
        <table class="table table-hover">
            <thead class="soft-header">
                <tr>
                    <th>Ref #</th>
                    <th>Complainant</th>
                    <th>Task</th>
                    <th>Municipality</th>
                    <th>Barangay</th>
                    <th>Sitio</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th class="text-center">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'cog']" />
                        </client-only>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in tasks" :key="item._id">
                    <td class="text-muted align-middle no-wrap">
                        <nuxt-link> {{ item.ref_number }} </nuxt-link>
                    </td>
                    <td class="text-muted align-middle"> {{ item.complaint?.complainant_name }} </td>
                    <td class="text-muted align-middle"> 
                        <textarea class="form-control text-muted small-textarea" readonly>{{ item.complaint?.nature_of_complaint?.name }}</textarea> 
                    </td>
                    <td class="text-muted align-middle text-nowrap"> {{ item.complaint?.detail?.municipality?.name }} </td>
                    <td class="text-muted align-middle text-nowrap"> {{ item.complaint?.detail?.barangay?.name }} </td>
                    <td class="text-muted align-middle text-nowrap"> {{ item.complaint?.detail?.sitio?.name }} </td>
                    <td class="text-muted align-middle text-nowrap">
                        <span :class="`badge soft-badge-${ item.task_status?.color_class }`"> {{ item.task_status?.name }} </span>
                    </td>
                    <td class="text-muted align-middle"> {{ item.created_at }} </td>
                    <td class="text-muted align-middle text-center">
                        <div class="dropdown">
                            <button class="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'ellipsis-v']"/>
                                </client-only>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">View Details</a></li>
                                <li><a class="dropdown-item" href="#">Update Status</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
    import type { Task, TaskStatus } from '~/composables/powerserve/tasks/tasks.types';


    const props = defineProps({
        tasks: {
            type: Object as () => Task[],
            default: () => [],
        }
    });
</script>

<style scoped>
</style>
