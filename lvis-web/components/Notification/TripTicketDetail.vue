
<template>
    <div v-if="trip_ticket" class="responsive">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> Trip Ticket Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>Trip Ticket #</td>
                            <td class="text-muted"> {{ trip_ticket.trip_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${tripTicketStatus[trip_ticket.status].color}`]: true }">
                                    {{ tripTicketStatus[trip_ticket.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Prepared By</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(trip_ticket.prepared_by.firstname, trip_ticket.prepared_by.lastname,
                                    trip_ticket.prepared_by.middlename, trip_ticket.prepared_by.name_prefix, trip_ticket.prepared_by.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="trip_ticket.purpose" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Vehicle</td>
                            <td class="text-muted"> {{ trip_ticket.vehicle.vehicle_number + " " + trip_ticket.vehicle.name }} </td>
                        </tr>
                        <tr>
                            <td>Driver</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(trip_ticket.driver.firstname, trip_ticket.driver.lastname,
                                    trip_ticket.driver.middlename, trip_ticket.driver.name_prefix, trip_ticket.driver.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Passengers</td>
                            <td>
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="trip_ticket.passengers" readonly></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Destination</td>
                            <td>
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="trip_ticket.destination" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Estimated Departure</td>
                            <td class="text-muted"> {{ formatDate(trip_ticket.start_time, true) }} </td>
                        </tr>
                        <tr>
                            <td>Estimated Arrival</td>
                            <td class="text-muted"> {{ formatDate(trip_ticket.end_time, true) }} </td>
                        </tr>
                        <tr>
                            <td>Is Operation</td>
                            <td class="text-muted"> {{ trip_ticket.is_operation ? 'Yes' : 'No' }} </td>
                        </tr>
                        <tr>
                            <td>Is Stay In</td>
                            <td class="text-muted"> {{ trip_ticket.is_stay_in ? 'Yes' : 'No' }} </td>
                        </tr>
                        <tr>
                            <td>Is Personal</td>
                            <td class="text-muted"> {{ trip_ticket.is_personal ? 'Yes' : 'No' }} </td>
                        </tr>
                        <tr>
                            <td>Is Out Of Coverage</td>
                            <td class="text-muted"> {{ trip_ticket.is_out_of_coverage ? 'Yes' : 'No' }} </td>
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
                            <tr v-for="i, count in trip_ticket.trip_ticket_approvers">
                                <td class="align-middle no-wrap"> {{ i.label }} </td>
                                <td class="align-middle no-wrap"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(trip_ticket.status, i.status)" class="text-muted text-center align-middle no-wrap">
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
    import type { TripTicket } from '~/composables/motorpool/trip-ticket/trip-ticket.types';
    import { TRIP_TICKET_STATUS, tripTicketStatus } from '~/composables/motorpool/trip-ticket/trip-ticket.enums';

    const props = defineProps({
        trip_ticket: {
            type: Object as () => TripTicket,
        },
    });

</script>