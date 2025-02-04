
<template>
    <div v-if="mrv" class="responsive">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> MRV Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>MRV #</td>
                            <td class="text-muted"> {{ mrv.mrv_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[mrv.status].color}`]: true }">
                                    {{ approvalStatus[mrv.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Requested by</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(mrv.requested_by!.firstname, mrv.requested_by!.lastname,
                                    mrv.requested_by!.middlename, mrv.requested_by!.name_prefix, mrv.requested_by!.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="mrv.purpose" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(mrv.date_requested) }} </td>
                        </tr>
                        <tr>
                            <td>Request Type</td>
                            <td class="text-muted"> {{ warehouseRequestTypeMapper[mrv.request_type] }} </td>
                        </tr>
                        <tr v-if="showORnumber(mrv.request_type)">
                            <td>OR Number</td>
                            <td class="text-muted"> {{ mrv.or_number ? mrv.or_number : 'N/A' }} </td>
                        </tr>
                        <tr v-if="showMWOnumber(mrv.request_type)">
                            <td>MWO Number</td>
                            <td class="text-muted">
                                <span v-if="mrv.mwo_number">
                                    {{ mrv.mwo_number }}
                                </span>
                                <span class="fst-italic" v-else>
                                    <small class="text-danger">MWO number is automatically assigned when approved</small>
                                </span> 
                            </td>
                        </tr>
                        <tr v-if="showCWOnumber(mrv.request_type)">
                            <td>CWO Number</td>
                            <td class="text-muted"> {{ mrv.cwo_number ? mrv.cwo_number : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>JO Number</td>
                            <td class="text-muted"> {{ mrv.jo_number ? mrv.jo_number : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>Item from</td>
                            <td class="text-muted"> {{ mrv.item_from.name }} </td>
                        </tr>
                        <tr>
                            <td>Project Name</td>
                            <td class="text-muted"> {{ mrv.project ? mrv.project.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Consumer Name</td>
                            <td>
                                <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ mrv.consumer_name }} </textarea>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Location</td>
                            <td>
                                <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ mrv.location }} </textarea>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Purpose</td>
                            <td>
                                <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ mrv.purpose }} </textarea>
                            </td>
                        </tr>
                        <tr>
                            <td>Withdrawn by</td>
                            <td class="text-muted" v-if="mrv.withdrawn_by"> 
                                {{
                                    getFullnameWithTitles(
                                        mrv.withdrawn_by.firstname,
                                        mrv.withdrawn_by.lastname, 
                                        mrv.withdrawn_by.middlename, 
                                        mrv.withdrawn_by.name_prefix, 
                                        mrv.withdrawn_by.name_suffix
                                    ) 
                                }} 
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
                            <tr v-for="i, count in mrv.mrv_approvers">
                                <td class="align-middle no-wrap"> {{ i.label }} </td>
                                <td class="align-middle no-wrap"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(mrv.status, i.status)" class="text-muted text-center align-middle no-wrap">
                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                        {{ approvalStatus[i.status].label }}
                                    </div>
                                    <div class="fst-italic" v-if="i.date_approval">
                                        <small> {{ formatDate(i.date_approval, true) }} </small>
                                    </div>
                                </td>
                                <td v-else class="text-muted text-center align-middle fst-italic no-wrap">
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
                                <th class="bg-secondary text-white align-middle"> No. </th>
                                <th class="bg-secondary text-white align-middle no-wrap"> Item Code </th>
                                <th class="bg-secondary text-white align-middle"> Description </th>
                                <th class="bg-secondary text-white align-middle"> Unit </th>
                                <th class="bg-secondary text-white align-middle"> Quantity </th>
                                <th class="bg-secondary text-white align-middle no-wrap"> Unit Price </th>
                                <th class="bg-secondary text-white align-middle"> Amount </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in mrv.mrv_items">
                                <td class="align-middle text-muted"> {{ count + 1 }} </td>
                                <td class="align-middle text-muted no-wrap">
                                    {{ i.item.code }}
                                </td>
                                <td class="align-middle">
                                    <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ i.item.description }}</textarea>
                                </td>
                                <td class="align-middle text-muted no-wrap"> {{ i.item.unit.name }} </td>
                                <td class="align-middle text-muted"> {{ i.quantity }} </td>
                                <td class="align-middle text-muted no-wrap"> {{ formatToPhpCurrency(i.price) }} </td>
                                <td class="align-middle text-muted no-wrap"> {{ formatToPhpCurrency(i.quantity * i.price) }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
    import type { MRV } from '~/composables/warehouse/mrv/mrv.types';

    const props = defineProps({
        mrv: {
            type: Object as () => MRV,
        },
    });

</script>