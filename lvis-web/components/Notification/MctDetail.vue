
<template>
    <div v-if="mct" class="responsive">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> MCT Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>MCT #</td>
                            <td class="text-muted"> {{ mct.mct_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[mct.status].color}`]: true }">
                                    {{ approvalStatus[mct.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Requested by</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(mct.mrv.requested_by!.firstname, mct.mrv.requested_by!.lastname,
                                    mct.mrv.requested_by!.middlename, mct.mrv.requested_by!.name_prefix, mct.mrv.requested_by!.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="mct.mrv.purpose" readonly/>
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
                        </client-only> MCT Signatories
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
                            <tr v-for="i, count in mct.mct_approvers">
                                <td class="align-middle"> {{ i.label }} </td>
                                <td class="align-middle"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(mct.status, i.status)" class="text-muted text-center align-middle">
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
                            <td class="text-muted"> {{ mct.mrv.mrv_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[mct.mrv.status].color}`]: true }">
                                    {{ approvalStatus[mct.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Requested by</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(mct.mrv.requested_by!.firstname, mct.mrv.requested_by!.lastname,
                                    mct.mrv.requested_by!.middlename, mct.mrv.requested_by!.name_prefix, mct.mrv.requested_by!.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="mct.mrv.purpose" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(mct.mrv.date_requested) }} </td>
                        </tr>
                        <tr>
                            <td>Request Type</td>
                            <td class="text-muted"> {{ warehouseRequestTypeMapper[mct.mrv.request_type] }} </td>
                        </tr>
                        <tr v-if="showORnumber(mct.mrv.request_type)">
                            <td>OR Number</td>
                            <td class="text-muted"> {{ mct.mrv.or_number ? mct.mrv.or_number : 'N/A' }} </td>
                        </tr>
                        <tr v-if="showMWOnumber(mct.mrv.request_type)">
                            <td>MWO Number</td>
                            <td class="text-muted">
                                <span v-if="mct.mrv.mwo_number">
                                    {{ mct.mrv.mwo_number }}
                                </span>
                                <span class="fst-italic" v-else>
                                    <small class="text-danger">MWO number is automatically assigned when approved</small>
                                </span> 
                            </td>
                        </tr>
                        <tr v-if="showCWOnumber(mct.mrv.request_type)">
                            <td>CWO Number</td>
                            <td class="text-muted"> {{ mct.mrv.cwo_number ? mct.mrv.cwo_number : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>JO Number</td>
                            <td class="text-muted"> {{ mct.mrv.jo_number ? mct.mrv.jo_number : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>Item from</td>
                            <td class="text-muted"> {{ mct.mrv.item_from.name }} </td>
                        </tr>
                        <tr>
                            <td>Project Name</td>
                            <td class="text-muted"> {{ mct.mrv.project ? mct.mrv.project.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Consumer Name</td>
                            <td>
                                <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ mct.mrv.consumer_name }} </textarea>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Location</td>
                            <td>
                                <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ mct.mrv.location }} </textarea>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Purpose</td>
                            <td>
                                <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ mct.mrv.purpose }} </textarea>
                            </td>
                        </tr>
                        <tr>
                            <td>Withdrawn by</td>
                            <td class="text-muted" v-if="mct.mrv.withdrawn_by"> 
                                {{
                                    getFullnameWithTitles(
                                        mct.mrv.withdrawn_by.firstname,
                                        mct.mrv.withdrawn_by.lastname, 
                                        mct.mrv.withdrawn_by.middlename, 
                                        mct.mrv.withdrawn_by.name_prefix, 
                                        mct.mrv.withdrawn_by.name_suffix
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
                        </client-only> MRV Signatories
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
                            <tr v-for="i, count in mct.mrv.mrv_approvers">
                                <td class="align-middle"> {{ i.label }} </td>
                                <td class="align-middle"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(mct.status, i.status)" class="text-muted text-center align-middle">
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
                                <th class="bg-secondary text-white align-middle no-wrap"> Item Code </th>
                                <th class="bg-secondary text-white align-middle"> Description </th>
                                <th class="bg-secondary text-white align-middle"> Unit </th>
                                <th class="bg-secondary text-white align-middle"> Quantity </th>
                                <th class="bg-secondary text-white align-middle no-wrap"> Unit Price </th>
                                <th class="bg-secondary text-white align-middle"> Amount </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in mct.mrv.mrv_items">
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
    import type { MCT } from '~/composables/warehouse/mct/mct.types';

    const props = defineProps({
        mct: {
            type: Object as () => MCT,
        },
    });

</script>