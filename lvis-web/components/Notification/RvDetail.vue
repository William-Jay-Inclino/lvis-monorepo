
<template>
    <div v-if="rv && rv.canvass" class="responsive">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> RV Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>RV #</td>
                            <td class="text-muted"> {{ rv.rv_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[rv.status].color}`]: true }">
                                    {{ approvalStatus[rv.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Requisitioner</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(rv.canvass.requested_by!.firstname, rv.canvass.requested_by!.lastname,
                                    rv.canvass.requested_by!.middlename, rv.canvass.requested_by!.name_prefix, rv.canvass.requested_by!.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Requisitioner Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm" :value="rv.canvass.purpose" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Requisitioner Notes</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm" :value="rv.canvass.notes" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(rv.date_requested) }} </td>
                        </tr>
                        <tr>
                            <td>Classification</td>
                            <td class="text-muted"> {{ rv.classification ? rv.classification.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>Work Order No</td>
                            <td class="text-muted"> {{ rv.work_order_no }} </td>
                        </tr>
                        <tr>
                            <td>Work Order Date</td>
                            <td class="text-muted"> {{ formatDate(rv.work_order_date) }} </td>
                        </tr>
                        <tr>
                            <td class="text-white align-middle">RV Notes</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm" :value="rv.notes" readonly/>
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
                            <tr v-for="i, count in rv.rv_approvers">
                                <td class="align-middle"> {{ i.label }} </td>
                                <td class="align-middle"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(rv.status, i.status)" class="text-muted text-center align-middle">
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
                                <th class="bg-secondary text-white"> No. </th>
                                <th class="bg-secondary text-white"> Description </th>
                                <th class="bg-secondary text-white"> Item Class </th>
                                <th class="bg-secondary text-white"> Unit </th>
                                <th class="bg-secondary text-white"> Quantity </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in rv.canvass.canvass_items">
                                <td class="align-middle text-muted"> {{ count + 1 }} </td>
                                <td class="align-middle"> 
                                    <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ i.item ? `${ i.item.code } - ${ i.item.description }` : i.description }}</textarea>
                                </td>
                                <td class="align-middle text-muted"> {{ i.item ? 'Stock' : 'Non-Stock' }} </td>
                                <td class="align-middle text-muted"> {{ i.unit ? i.unit.name : 'N/A' }} </td>
                                <td class="align-middle text-muted"> {{ i.quantity }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
    import type { RV } from '~/composables/purchase/rv/rv.types';

    const props = defineProps({
        rv: {
            type: Object as () => RV,
        },
    });

</script>