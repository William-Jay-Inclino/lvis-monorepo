<template>
    <div class="table-responsive">
        <table class="table">
            <thead class="soft-header">
                <tr>
                    <th class="text-nowrap">Ref #</th>
                    <th class="text-nowrap">Complainant</th>
                    <!-- <th class="text-nowrap">Contact #</th> -->
                    <th class="text-nowrap">Description</th>
                    <th class="text-nowrap">Nature of Complaint</th>
                    <th class="text-nowrap">Location</th>
                    <th class="text-nowrap">Assign to</th>
                    <th class="text-nowrap">Status</th>
                    <th class="text-center text-nowrap">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'cog']" />
                        </client-only>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in complaints">
                    <td class="text-muted align-middle text-nowrap">
                        <nuxt-link> {{ item.ref_number }} </nuxt-link>
                    </td>
                    <!-- <td class="text-muted align-middle text-nowrap"> {{ item.complainant_name }} </td>
                    <td class="text-muted align-middle text-nowrap"> {{ item.complainant_contact_no }} </td> -->
                    <td>
                        <textarea rows="3" class="form-control form-control-sm text-muted small" readonly>{{ `Name: ${ item.complainant_name } \nContact: ${ item.complainant_contact_no }` }}</textarea>
                    </td>
                    <td>
                        <textarea rows="3" class="form-control form-control-sm text-muted small" readonly>{{ item.description }}</textarea>
                    </td>
                    <td class="text-muted align-middle"> 
                        <textarea rows="3" class="form-control form-control-sm text-muted small" readonly>{{ item.nature_of_complaint?.name }}</textarea> 
                    </td>
                    <td class="text-muted align-middle"> 
                        <textarea rows="3" class="form-control form-control-sm text-muted small" readonly>{{ item.complaint_detail?.location }}</textarea> 
                    </td>
                    <td class="text-muted align-middle text-nowrap"> {{ getAssignmentLabel(item.assigned_to) }} </td>
                    <td class="text-muted align-middle text-nowrap">
                        <span :class="`badge soft-badge-${ item.status?.color_class }`"> {{ item.status?.name }} </span>
                    </td>
                    <td class="text-muted align-middle text-center text-nowrap">
                        <div class="dropdown">
                            <button class="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'ellipsis-v']"/>
                                </client-only>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a
                                        class="dropdown-item"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#complaint_details_modal"
                                        @click="onViewDetails(item)"
                                    >
                                      View Details
                                    </a>
                                </li>
                                <li><a class="dropdown-item" href="#">Edit Complaint</a></li>
                                <li><a class="dropdown-item text-danger" href="#">Cancel Complaint</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script setup lang="ts">
    import type { Complaint } from '~/composables/powerserve/complaints/complaints.types';
    import { getAssignmentLabel } from '~/composables/powerserve/complaints/complaints.helper';


    const emits = defineEmits(['view-details'])

    const props = defineProps({
        complaints: {
            type: Array as () => Complaint[],
            default: () => [],
        }
    });

    function onViewDetails(item: Complaint) {
        emits('view-details', { complaint: deepClone(item) })
    }

</script>

<style scoped>

    .table-responsive {
        min-height: 300px;
    }


</style>
