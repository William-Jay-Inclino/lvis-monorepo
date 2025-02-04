
<template>
    <div v-if="gas_slip" class="responsive">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> Gas Slip Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>Gas Slip #</td>
                            <td class="text-muted"> {{ gas_slip.gas_slip_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[gas_slip.status].color}`]: true }">
                                    {{ approvalStatus[gas_slip.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Requested By</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(gas_slip.requested_by.firstname, gas_slip.requested_by.lastname,
                                    gas_slip.requested_by.middlename, gas_slip.requested_by.name_prefix, gas_slip.requested_by.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="gas_slip.purpose" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(gas_slip.used_on) }} </td>
                        </tr>
                        <tr>
                            <td>Vehicle</td>
                            <td class="text-muted"> {{ gas_slip.vehicle.vehicle_number + " " + gas_slip.vehicle.name }} </td>
                        </tr>
                        <tr>
                            <td>Driver</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(gas_slip.driver.firstname, gas_slip.driver.lastname,
                                    gas_slip.driver.middlename, gas_slip.driver.name_prefix, gas_slip.driver.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td>Gas Station</td>
                            <td class="text-muted"> {{ gas_slip.gas_station.name }} </td>
                        </tr>
                        <tr>
                            <td>Type of Fuel</td>
                            <td class="text-muted"> {{ gas_slip.fuel_type.name }} </td>
                        </tr>
                        <tr>
                            <td>With Container</td>
                            <td class="text-muted"> {{ gas_slip.with_container ? 'Yes' : 'No' }} </td>
                        </tr>
                        <tr>
                            <td>No. of Liters</td>
                            <td class="text-muted"> {{ gas_slip.liter_in_text }} </td>
                        </tr>
                        <tr>
                            <td>Actual Liter</td>
                            <td class="text-muted"> {{ gas_slip.actual_liter || 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>Price Per Liter</td>
                            <td class="text-muted"> {{ gas_slip.price_per_liter || 'N/A' }} </td>
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
                            <tr v-for="i, count in gas_slip.gas_slip_approvers">
                                <td class="align-middle no-wrap"> {{ i.label }} </td>
                                <td class="align-middle no-wrap"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(gas_slip.status, i.status)" class="text-muted text-center align-middle no-wrap">
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

    </div>
</template>


<script setup lang="ts">
    import type { GasSlip } from '~/composables/motorpool/gas-slip/gas-slip.types';

    const props = defineProps({
        gas_slip: {
            type: Object as () => GasSlip,
        },
    });

</script>