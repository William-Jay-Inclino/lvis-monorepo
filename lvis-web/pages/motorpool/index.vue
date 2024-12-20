<template>
    
    <div v-if="authUser">
        
        <!-- <div class="card">
            <div class="card-body">
                <div class="container">
                    <h1 class="text-warning mt-5"> WELCOME TO MOTORPOOL MANAGEMENT </h1>
                    <div class="row text-muted mb-5 mt-4">
                        <div class="col-lg-6 col-md-6 col-12">
                            "Efficiently manage your organization's vehicles and fuel resources. Track trips, monitor fuel usage, and maintain vehicle records with ease."
                            <br />
                            <br />
                            - Admin
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'smile']" />
                            </client-only>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->

        <div class="card mt-5">
            <div class="card-header d-flex justify-content-between align-items-center mt-2">
                <h4 class="text-warning">Preventive Maintenance Schedule for This Week</h4>
                <button 
                    class="btn btn-light text-primary" 
                    @click="is_expanded_pms_sched = !is_expanded_pms_sched"
                >
                    <div v-if="is_expanded_pms_sched">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'chevron-up']"/>
                        </client-only>
                    </div>
                    <div v-else>
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'chevron-down']"/>
                        </client-only>
                    </div>
                </button>
            </div>

            <div v-show="is_expanded_pms_sched" class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 12%;" class="text-muted"> Service Date </th>
                                <th class="text-muted"> Vehicle </th>
                                <th class="text-muted"> Reference No. </th>
                                <th class="text-muted"> Last Service Date </th>
                                <th class="text-muted"> Last Service Mileage </th>
                                <th class="text-muted"> Cost </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in pms_schedules">
                                <td> {{ get_day_and_time(item.next_service_date) }} </td>
                                <td> 
                                    <nuxt-link :to="'/motorpool/vehicle/view/' + item.vehicle.id">
                                        {{ item.vehicle.vehicle_number + ' ' + item.vehicle.name }} 
                                    </nuxt-link>
                                </td>
                                <td> 
                                    <nuxt-link :to="'/motorpool/vehicle-maintenance/view/' + item.id">{{ item.ref_number }}</nuxt-link>
                                </td>
                                <td> {{ formatDate(item.service_date) }} </td>
                                <td> {{ item.service_mileage }} </td>
                                <td> {{ formatToPhpCurrency(item.cost) }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card mt-5">
            <div class="card-header d-flex justify-content-between align-items-center mt-2">
                <h4 class="text-warning">Trip Schedules for This Week</h4>
                <button 
                    class="btn btn-light text-primary" 
                    @click="is_expanded_trip_sched = !is_expanded_trip_sched"
                >
                    <div v-if="is_expanded_trip_sched">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'chevron-up']"/>
                        </client-only>
                    </div>
                    <div v-else>
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'chevron-down']"/>
                        </client-only>
                    </div>
                </button>
            </div>

            <div v-show="is_expanded_trip_sched" class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 12%;" class="text-muted"> Est. Departure </th>
                                <th class="text-muted"> Vehicle </th>
                                <th class="text-muted"> Trip No. </th>
                                <th class="text-muted"> Driver </th>
                                <th class="text-muted"> Destination </th>
                                <th class="text-muted"> Status </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in trips">
                                <td> {{ get_day_and_time(item.start_time) }} </td>
                                <td> 
                                    <nuxt-link :to="'/motorpool/vehicle/view/' + item.vehicle.id">
                                        {{ item.vehicle.vehicle_number + ' ' + item.vehicle.name }} 
                                    </nuxt-link>
                                </td>
                                <td> 
                                    <nuxt-link :to="'/motorpool/trip-ticket/view/' + item.id">
                                        {{ item.trip_number }} 
                                    </nuxt-link>
                                </td>
                                <td> {{ getFullname(item.driver.firstname, item.driver.middlename, item.driver.lastname) }} </td>
                                <td> {{ item.destination }} </td>
                                <td>
                                    <div :class="{ [`badge bg-${tripTicketStatus[item.status].color}`]: true }">
                                        {{ tripTicketStatus[item.status].label }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <div class="faded-text">
                        <h2 style="font-size: 4rem;">More features coming soon...</h2>
                    </div>
                </div>
            </div>
        </div> -->

    </div>


</template>



<script setup lang="ts">
    import type { VehicleMaintenance } from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.types';
    import * as vmApi from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.api'
    import type { TripTicket } from '~/composables/motorpool/trip-ticket/trip-ticket.types';
    import { tripTicketStatus } from '~/composables/motorpool/trip-ticket/trip-ticket.enums';
    import moment from 'moment';

    definePageMeta({
        layout: "layout-motorpool"
    })

    const authUser = ref<AuthUser>()

    const is_expanded_pms_sched = ref(true)
    const is_expanded_trip_sched = ref(true)

    const pms_schedules = ref<VehicleMaintenance[]>([])
    const trips = ref<TripTicket[]>([])

    onMounted( async() => {
        authUser.value = getAuthUser()

        const { startDate, endDate } = get_start_and_end_of_week()
        
        const response = await vmApi.fetch_dashboard_data({ startDate, endDate })

        pms_schedules.value = response.this_week_pms_schedules
        trips.value = response.this_week_trips
        
    })

    function get_start_and_end_of_week() {
        const startOfWeek = moment().startOf('week');
        const endOfWeek = moment().endOf('week');

        return {
            startDate: startOfWeek.format(),
            endDate: endOfWeek.format()
        };
    }


</script>


<style scoped>
    .faded-text {
        font-weight: bold;
        color: rgba(24, 119, 242, 0.3); /* More faded vibrant blue with reduced opacity */
        animation: fadeIn 2s ease-in-out;
        opacity: 0;
        animation-fill-mode: forwards;
        margin-top: 100px; /* Add some space above the text */
        transform: rotate(-15deg); /* Slant the text */
        text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3); /* Lighter shadow for a more faded look */
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
