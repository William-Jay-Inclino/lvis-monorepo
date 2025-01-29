
<template>
    <div v-if="jo && jo.canvass" class="responsive">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> JO Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>JO #</td>
                            <td class="text-muted"> {{ jo.jo_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[jo.status].color}`]: true }">
                                    {{ approvalStatus[jo.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Requisitioner</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(jo.canvass.requested_by!.firstname, jo.canvass.requested_by!.lastname,
                                    jo.canvass.requested_by!.middlename, jo.canvass.requested_by!.name_prefix, jo.canvass.requested_by!.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Requisitioner Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="jo.canvass.purpose" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Requisitioner Notes</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="jo.canvass.notes" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(jo.date_requested) }} </td>
                        </tr>
                        <tr>
                            <td>Classification</td>
                            <td class="text-muted"> {{ jo.classification ? jo.classification.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>Equipment</td>
                            <td class="text-muted"> {{ jo.equipment }} </td>
                        </tr>
                        <tr>
                            <td>Department</td>
                            <td class="text-muted"> {{ jo.department.code }} </td>
                        </tr>
                        <tr>
                            <td>Division</td>
                            <td class="text-muted"> {{ jo.division ? jo.division.code : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td class="align-middle">JO Notes</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="jo.notes" readonly/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row justify-content-center pt-2">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'users']"/>
                        </client-only> Signatories
                    </h5>
                    <hr class="result">
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered table-table-sm small">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white"> Label </th>
                                <th class="bg-secondary text-white"> Approver </th>
                                <th class="bg-secondary text-white"> Status </th>
                                <th class="bg-secondary text-white"> Comment </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in jo.jo_approvers">
                                <td class="align-middle"> {{ i.label }} </td>
                                <td class="align-middle"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(jo.status, i.status)" class="text-muted text-center align-middle">
                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                        {{ approvalStatus[i.status].label }}
                                    </div>
                                    <div class="fst-italic" v-if="i.date_approval">
                                        <small> {{ formatDate(i.date_approval, true) }} </small>
                                    </div>
                                </td>
                                <td v-else class="text-muted text-center align-middle fst-italic">
                                    N/A
                                </td>
                                <td>
                                    <textarea rows="2" class="form-control form-control-sm text-muted" readonly
                                        :value="!isEmptyString(i.notes) ? i.notes : 'N/A'"></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="row justify-content-center pt-2">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                        </client-only> Items
                    </h5>
                    <hr class="result">
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered table-sm small">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white"> No. </th>
                                <th class="bg-secondary text-white"> Description </th>
                                <th class="bg-secondary text-white no-wrap"> Item Class </th>
                                <th class="bg-secondary text-white"> Unit </th>
                                <th class="bg-secondary text-white"> Quantity </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in jo.canvass.canvass_items">
                                <td class="align-middle"> {{ count + 1 }} </td>
                                <td class="align-middle"> 
                                    <textarea class="form-control form-control-sm" rows="2" readonly>{{ i.item ? `${ i.item.code } - ${ i.item.description }` : i.description }}</textarea>
                                </td>
                                <td class="align-middle"> {{ i.item ? 'Stock' : 'Non-Stock' }} </td>
                                <td class="align-middle"> {{ i.unit ? i.unit.name : 'N/A' }} </td>
                                <td class="align-middle"> {{ i.quantity }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
    import type { JO } from '~/composables/purchase/jo/jo.types';

    const props = defineProps({
        jo: {
            type: Object as () => JO,
        },
    });

</script>