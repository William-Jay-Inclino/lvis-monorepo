
<template>
    <div v-if="osriv" class="responsive">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> OSRIV Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>OSRIV #</td>
                            <td class="text-muted"> {{ osriv.osriv_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[osriv.status].color}`]: true }">
                                    {{ approvalStatus[osriv.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Requested by</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(osriv.requested_by!.firstname, osriv.requested_by!.lastname,
                                    osriv.requested_by!.middlename, osriv.requested_by!.name_prefix, osriv.requested_by!.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="osriv.purpose" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(osriv.date_requested) }} </td>
                        </tr>
                        <tr>
                            <td>Department</td>
                            <td class="text-muted"> {{ osriv.requested_by.department.name }} </td>
                        </tr>
                        <tr>
                            <td>Item from</td>
                            <td class="text-muted"> {{ osriv.item_from.name }} </td>
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
                            <tr v-for="i, count in osriv.osriv_approvers">
                                <td class="align-middle"> {{ i.label }} </td>
                                <td class="align-middle"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(osriv.status, i.status)" class="text-muted text-center align-middle">
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
                                        :value="i.notes || 'N/A'"></textarea>
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
                                <th class="bg-secondary text-white align-middle"> No. </th>
                                <th class="bg-secondary text-white align-middle"> Item Code </th>
                                <th class="bg-secondary text-white align-middle"> Description </th>
                                <th class="bg-secondary text-white align-middle"> Unit </th>
                                <th class="bg-secondary text-white align-middle"> Quantity </th>
                                <th class="bg-secondary text-white align-middle"> Unit Price </th>
                                <th class="bg-secondary text-white align-middle"> Amount </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in osriv.osriv_items">
                                <td class="align-middle text-muted"> {{ count + 1 }} </td>
                                <td class="align-middle text-muted">
                                    {{ i.item.code }}
                                </td>
                                <td class="align-middle">
                                    <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ i.item.description }}</textarea>
                                </td>
                                <td class="align-middle text-muted"> {{ i.item.unit.name }} </td>
                                <td class="align-middle text-muted"> {{ i.quantity }} </td>
                                <td class="align-middle text-muted"> {{ formatToPhpCurrency(i.price) }} </td>
                                <td class="align-middle text-muted"> {{ formatToPhpCurrency(i.quantity * i.price) }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
    import type { OSRIV } from '~/composables/warehouse/osriv/osriv.types';

    const props = defineProps({
        osriv: {
            type: Object as () => OSRIV,
        },
    });

</script>