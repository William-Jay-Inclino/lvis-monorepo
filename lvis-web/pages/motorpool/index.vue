<template>
    
    <div v-if="authUser && !isLoading">
        
        <div v-if="!show_pms_schedules && !show_trip_schedules" class="card">
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
        </div>

        <div v-if="show_pms_schedules" class="card mt-5">
            <div class="card-header d-flex justify-content-between align-items-center pt-3">
                <h4 class="text-warning">Preventive Maintenance Schedules for This Week</h4>
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

            <transition name="accordion" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                <div v-show="is_expanded_pms_sched" class="card-body">
    
                    <div id="pms-schedules-accordion" class="accordion">
                        <div v-for="(dayGroup, index) in pms_schedules_by_day" :key="dayGroup.day" class="accordion-item">
                            <h2 class="accordion-header" :id="`heading-${index}`">
                                <button
                                    ref="pmsAccordionBtn"
                                    class="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    :data-bs-target="`#collapse-${index}`"
                                    aria-expanded="false"
                                    :aria-controls="`collapse-${index}`"
                                >
                                    <div class="d-flex justify-content-between w-100">
                                        <span class="fst-italic">
                                            {{ dayGroup.day }}
                                        </span>
                                        <div class="d-flex">
                                            <span class="badge bg-orange ms-2">
                                                Pending {{ dayGroup.schedules.filter(i => !i.is_completed).length }}
                                            </span>
                                            <span class="badge bg-primary ms-2">
                                                Completed {{ dayGroup.schedules.filter(i => i.is_completed).length }}
                                            </span>
                                            <span class="me-3"></span>
                                        </div>
                                    </div>
                                </button>
                            </h2>
                            <div
                                :id="`collapse-${index}`"
                                class="accordion-collapse collapse"
                                :aria-labelledby="`heading-${index}`"
                                data-bs-parent="#pms-schedules-accordion"
                            >
                                <div class="accordion-body">
                                    <div v-if="dayGroup.schedules.length === 0" class="text-center">
                                        <small class="text-muted fst-italic">No schedule for this day</small>
                                    </div>
                                    <div v-else class="table-responsive">
                                        <table class="table table-bordered">
                                            <thead class="table-light">
                                                <tr class="table-warning">
                                                    <th class="text-muted">Vehicle</th>
                                                    <th style="white-space: nowrap;" class="text-muted">Ref. No.</th>
                                                    <th style="white-space: nowrap;" class="text-muted">Prev. Service Date</th>
                                                    <th style="white-space: nowrap;" class="text-muted">Prev. Service Mileage</th>
                                                    <th class="text-muted">Cost</th>
                                                    <th style="white-space: nowrap;" class="text-muted text-center">Mark as Completed</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="item in dayGroup.schedules" :key="item.id">
                                                    <td style="white-space: nowrap;">
                                                        <nuxt-link :to="'/motorpool/vehicle/view/' + item.vehicle.id">
                                                            {{ item.vehicle.vehicle_number }}
                                                        </nuxt-link>
                                                        {{ item.vehicle.name }}
                                                    </td>
                                                    <td style="white-space: nowrap;">
                                                        <nuxt-link :to="'/motorpool/vehicle-maintenance/view/' + item.id">
                                                            {{ item.ref_number }}
                                                        </nuxt-link>
                                                    </td>
                                                    <td style="white-space: nowrap;">{{ formatDate(item.service_date) }}</td>
                                                    <td>{{ item.service_mileage }}</td>
                                                    <td>{{ formatToPhpCurrency(item.cost) }}</td>
                                                    <td class="text-center">
                                                        <input
                                                            :disabled="!can_update_pms_status"
                                                            @click="update_vehicle_maintenance_status(item.id)"
                                                            class="form-check-input big-checkbox"
                                                            type="checkbox"
                                                            v-model="item.is_completed"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>

        </div>
        
        <div v-if="show_trip_schedules" class="card mt-5">
            <div class="card-header d-flex justify-content-between align-items-center pt-3">
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

            <transition name="accordion" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                <div v-show="is_expanded_trip_sched" class="card-body">
    
                    <div id="trip-schedules-accordion" class="accordion">
                        <div v-for="(dayGroup, index) in trip_schedules_by_day" :key="dayGroup.day" class="accordion-item">
                            <h2 class="accordion-header" :id="`trip-heading-${index}`">
                                <button
                                    ref="tripAccordionBtn"
                                    class="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    :data-bs-target="`#trip-collapse-${index}`"
                                    aria-expanded="false"
                                    :aria-controls="`trip-collapse-${index}`"
                                >
                                    <div class="d-flex justify-content-between w-100">
                                        <span class="fst-italic">
                                            {{ dayGroup.day }}
                                        </span>
                                        <div class="d-flex flex-wrap badge-container">
                                            <span class="badge bg-orange ms-2">
                                                Pending {{ dayGroup.tickets.filter(i => i.status === TRIP_TICKET_STATUS.PENDING).length }}
                                            </span>
                                            <span class="badge bg-success ms-2">
                                                Approved {{ dayGroup.tickets.filter(i => i.status === TRIP_TICKET_STATUS.APPROVED).length }}
                                            </span>
                                            <span class="badge bg-danger ms-2">
                                                Disapproved {{ dayGroup.tickets.filter(i => i.status === TRIP_TICKET_STATUS.DISAPPROVED).length }}
                                            </span>
                                            <span class="badge bg-warning ms-2">
                                                Cancelled {{ dayGroup.tickets.filter(i => i.status === TRIP_TICKET_STATUS.CANCELLED).length }}
                                            </span>
                                            <span class="badge bg-info ms-2">
                                                In Progress {{ dayGroup.tickets.filter(i => i.status === TRIP_TICKET_STATUS.IN_PROGRESS).length }}
                                            </span>
                                            <span class="badge bg-primary ms-2">
                                                Completed {{ dayGroup.tickets.filter(i => i.status === TRIP_TICKET_STATUS.COMPLETED).length }}
                                            </span>
                                            <span class="me-3"></span>
                                        </div>
                                    </div>
                                </button>
                            </h2>
                            <div
                                :id="`trip-collapse-${index}`"
                                class="accordion-collapse collapse"
                                :aria-labelledby="`trip-heading-${index}`"
                                data-bs-parent="#trip-schedules-accordion"
                            >
                                <div class="accordion-body">
                                    <div v-if="dayGroup.tickets.length === 0" class="text-center">
                                        <small class="text-muted fst-italic">No schedule for this day</small>
                                    </div>
                                    <div v-else class="table-responsive">
                                        <table class="table table-bordered">
                                            <thead class="table-light">
                                                <tr class="table-warning">
                                                    <th class="text-muted"> Time </th>
                                                    <th class="text-muted"> Vehicle </th>
                                                    <th style="white-space: nowrap;" class="text-muted"> Trip No. </th>
                                                    <th class="text-muted"> Driver </th>
                                                    <th class="text-muted"> Destination </th>
                                                    <th class="text-muted text-center"> Status </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="item in dayGroup.tickets" :key="item.id">
                                                    <td style="white-space: nowrap;"> {{ moment(item.start_time).format('h:mm A') }} </td>
                                                    <td style="white-space: nowrap;">
                                                        <nuxt-link :to="'/motorpool/vehicle/view/' + item.vehicle.id">
                                                            {{ item.vehicle.vehicle_number }}
                                                        </nuxt-link>
                                                        {{ item.vehicle.name }}
                                                    </td>
                                                    <td style="white-space: nowrap;"> 
                                                        <nuxt-link :to="'/motorpool/trip-ticket/view/' + item.id">
                                                            {{ item.trip_number }} 
                                                        </nuxt-link>
                                                    </td>
                                                    <td style="white-space: nowrap;"> {{ getFullname(item.driver.firstname, item.driver.middlename, item.driver.lastname) }} </td>
                                                    <td> {{ item.destination }} </td>
                                                    <td class="text-center">
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
                        </div>
                    </div>
                </div>
            </transition>

        </div>

        <div v-if="!show_pms_schedules && !show_trip_schedules" class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <div class="faded-text">
                        <h2 style="font-size: 4rem;">More features coming soon...</h2>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>


</template>



<script setup lang="ts">
    import type { VehicleMaintenance } from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.types';
    import * as vmApi from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.api'
    import type { TripTicket } from '~/composables/motorpool/trip-ticket/trip-ticket.types';
    import { TRIP_TICKET_STATUS, tripTicketStatus } from '~/composables/motorpool/trip-ticket/trip-ticket.enums';
    import moment from 'moment';
    import { useToast } from 'vue-toastification';

    definePageMeta({
        layout: "layout-motorpool"
    })

    const authUser = ref<AuthUser>()
    const toast = useToast();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date()

    const isLoading = ref(true)
    const is_expanded_pms_sched = ref(true)
    const is_expanded_trip_sched = ref(true)

    const pmsAccordionBtn = ref<HTMLButtonElement[]>([]);
    const tripAccordionBtn = ref<HTMLButtonElement[]>([]);

    const pms_schedules = ref<VehicleMaintenance[]>([])
    const trips = ref<TripTicket[]>([])

    onMounted( async() => {
        authUser.value = getAuthUser()

        const { startDate, endDate } = get_start_and_end_of_week()
        
        const response = await vmApi.fetch_dashboard_data({ startDate, endDate })

        pms_schedules.value = response.this_week_pms_schedules
        trips.value = response.this_week_trips
        isLoading.value = false
        
        await nextTick(); // Ensure DOM is updated
        open_todays_accordion(today, pmsAccordionBtn.value)
        open_todays_accordion(today, tripAccordionBtn.value)

    })

    const pms_schedules_by_day = computed(() => {
        const scheduleByDay = daysOfWeek.map(day => ({
            day,
            schedules: [] as VehicleMaintenance[],
        }));

        pms_schedules.value.forEach(schedule => {
            const serviceDate = new Date(schedule.next_service_date);
            const dayIndex = serviceDate.getDay(); 
            scheduleByDay[dayIndex].schedules.push(schedule); 
        });

        return scheduleByDay;
    });

    const trip_schedules_by_day = computed(() => {
        const result = daysOfWeek.map((day) => ({
            day,
            tickets: [] as TripTicket[],
        }));

        trips.value.forEach((ticket) => {
            const dayIndex = new Date(ticket.start_time).getDay(); 
            result[dayIndex].tickets.push(ticket); 
        });

        return result;
    });

    const show_pms_schedules = computed(() => {
        if (!authUser.value) return false;

        if (isAdmin(authUser.value)) return true;

        const permissions = authUser.value.user?.permissions?.warehouse?.canManageMotorpoolDashboard;

        return permissions?.viewPMS || false;
    })

    const show_trip_schedules = computed(() => {
        if (!authUser.value) return false;

        if (isAdmin(authUser.value)) return true;

        const permissions = authUser.value.user?.permissions?.warehouse?.canManageMotorpoolDashboard;

        return permissions?.viewTrips || false;
    })

    const can_update_pms_status = computed(() => {
        if (!authUser.value) return false;

        if (isAdmin(authUser.value)) return true;

        const permissions = authUser.value.user?.permissions?.warehouse?.canManageVehicleMaintenance;

        return permissions?.update || false;
    })

    function get_start_and_end_of_week() {
        const startOfWeek = moment().startOf('week');
        const endOfWeek = moment().endOf('week');

        return {
            startDate: startOfWeek.format(),
            endDate: endOfWeek.format()
        };
    }

    async function update_vehicle_maintenance_status(vm_id: string) {

        const item = pms_schedules.value.find(i => i.id === vm_id)

        if(!item) {
            console.error('Item in pms schedule not found with id of ' + vm_id);
            return 
        }

        const response = await vmApi.update_completion(vm_id, !item.is_completed)
        item.is_completed = response.is_completed

        if(response.success) {
            toast.success(response.msg)
        } else {
            toast.error(response.msg)
        }

    }

    function open_todays_accordion(today: Date, accordionBtns: HTMLButtonElement[]) {

        const todayIndex = today.getDay();

        console.log('todayIndex', todayIndex);

        const todayButton = accordionBtns[todayIndex];
        if (todayButton) {
            todayButton.click();
        }

    }



    // ======================= UTILS ======================= 

    const beforeEnter = (el: Element) => {
        const element = el as HTMLElement;
        element.style.height = '0';
        element.style.opacity = '0';
        element.style.overflow = 'hidden'; 
    };

    const enter = (el: Element, done: () => void) => {
        const element = el as HTMLElement;
        nextTick(() => {
            element.style.transition = 'height 0.5s ease, opacity 0.5s ease'; 
            element.style.height = `${element.scrollHeight}px`;
            element.style.opacity = '1';
            done(); 
        });
    };

    const leave = (el: Element, done: () => void) => {
        const element = el as HTMLElement;
        element.style.transition = 'height 0.5s ease, opacity 0.5s ease';
        element.style.height = '0'; 
        done(); 
    };


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

    .big-checkbox {
        width: 25px;
        height: 25px;
    }

    .accordion-enter-active, .accordion-leave-active {
        transition: height 0.5s ease, opacity 0.5s ease;
    }

    .accordion-enter, .accordion-leave-to {
        height: 0;
        opacity: 0;
        overflow: hidden;
    }

    .badge-container {
        flex-wrap: wrap;
        gap: 0.5rem; /* Adds spacing between badges */
    }

    .badge {
        flex: 1 1 auto; /* Allows badges to shrink and grow within the container */
        text-align: center; /* Centers the text inside badges */
        min-width: 80px; /* Optional: Ensures badges have a readable minimum size */
    }
</style>
