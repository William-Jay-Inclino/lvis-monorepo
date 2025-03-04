<template>
    <div class="table-responsive">
        <table class="table table-hover">
            <thead class="soft-header">
                <tr>
                    <th class="text-nowrap">Ref #</th>
                    <th class="text-nowrap">Complainant</th>
                    <th class="text-nowrap">Contact #</th>
                    <th class="text-nowrap">Nature of Complaint</th>
                    <th class="text-nowrap">Assigned</th>
                    <th class="text-nowrap">Municipality</th>
                    <th class="text-nowrap">Barangay</th>
                    <th class="text-nowrap">Sitio</th>
                    <th class="text-nowrap">Status</th>
                    <th class="text-nowrap">Description</th>
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
                    <td class="text-muted align-middle text-nowrap"> {{ item.complainant_name }} </td>
                    <td class="text-muted align-middle text-nowrap"> {{ item.complainant_contact_no }} </td>
                    <td class="text-muted align-middle"> 
                        <textarea class="form-control text-muted small-textarea" readonly>{{ item.nature_of_complaint?.name }}</textarea> 
                    </td>
                    <td class="text-muted align-middle text-nowrap"> {{ getAssignmentLabel(item.assigned_to) }} </td>
                    <td class="text-muted align-middle text-nowrap"> {{ item.detail?.municipality?.name }} </td>
                    <td class="text-muted align-middle text-nowrap"> {{ item.detail?.barangay?.name }} </td>
                    <td class="text-muted align-middle text-nowrap"> {{ item.detail?.sitio?.name }} </td>
                    <td class="text-muted align-middle text-nowrap">
                        <span :class="`badge soft-badge-${ item.complaint_status?.color_class }`"> {{ item.complaint_status?.name }} </span>
                    </td>
                    <td>
                        <textarea class="form-control text-muted small-textarea" readonly>{{ item.description }}</textarea>
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
    import type { Complaint, ComplaintAssignment } from '~/composables/powerserve/complaints/complaints.types';
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
/* Fixed Card Height */
.soft-wrapper {
    background: #f8f9fa; /* Light gray */
    border-radius: 12px;
    /* height: 600px;  */
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Ensure the Card Body Fills the Space */
.card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Scrollable Table */
/* .table-responsive {
    flex-grow: 1;
    max-height: 500px;
    overflow-y: auto;
} */

/* Soft Header */
.soft-header {
    background: #e6e0f8; /* Pastel lavender */
    color: #4a3f78; /* Muted purple */
    font-weight: bold;
}


/* Small Textarea */
.small-textarea {
    font-size: 0.875rem; /* Small text */
    height: 60px; /* Reduce height */
    padding: 5px;
    resize: none; /* Prevent resizing */
}

/* Search & Filter */
.d-flex {
    gap: 8px; /* Reduce gap */
}

.search-input {
    width: 230px;
    border-radius: 6px;
    padding: 6px 10px;
}

.filter-dropdown {
    width: 160px;
    border-radius: 6px;
    padding: 6px 10px;
}
</style>
