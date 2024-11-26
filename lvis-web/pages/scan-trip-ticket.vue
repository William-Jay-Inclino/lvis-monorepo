<template>

    <div class="page-wrapper">

        <div class="container my-5">
            <h1 class="text-center mb-4">Trip Ticket Tracker</h1>
        
            <!-- RFID Scan Section -->
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h5 class="card-title text-center text-warning fw-bold">Enter RFID</h5>
                    <div class="form-group">
                        <input 
                            ref="rfidInput"
                            :disabled="is_scanning_rfid"
                            autofocus
                            type="text" 
                            class="form-control" 
                            v-model="rfid" 
                            @keyup.enter="handle_rfid_scan"
                        />
                    </div>
                    <div v-if="is_scanning_rfid" class="alert alert-info mt-3">
                        Scanning RFID please wait...
                    </div>
                </div>
            </div>
        
            <!-- Trip Information Section -->
            <div class="card shadow-sm" v-if="trip_ticket">

                <div class="card-header bg-dark text-white">
                    Trip Information
                </div>

                <div class="card-body">

                    <div class="responsive">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td width="50%"> Status </td>
                                    <td>
                                        <div :class="{ [`badge bg-${tripTicketStatus[trip_ticket.status].color}`]: true }">
                                            {{ tripTicketStatus[trip_ticket.status].label }}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td> Trip No. </td>
                                    <td> {{ trip_ticket.trip_number }} </td>
                                </tr>
                                <tr>
                                    <td> Vehicle No. </td>
                                    <td> {{ trip_ticket.vehicle.vehicle_number + ' ' +  trip_ticket.vehicle.name }} </td>
                                </tr>
                                <tr>
                                    <td> Vehicle Plate No. </td>
                                    <td> {{ trip_ticket.vehicle.plate_number }} </td>
                                </tr>
                                <tr>
                                    <td> Driver </td>
                                    <td> {{ getFullname(trip_ticket.driver.firstname, trip_ticket.driver.middlename, trip_ticket.driver.lastname) }} </td>
                                </tr>
                                <tr>
                                    <td class="align-middle"> Passengers </td>
                                    <td>
                                        <textarea :value="trip_ticket.passengers" class="form-control form-control-sm" rows="3" readonly> </textarea>
                                    </td> 
                                </tr>
                                <tr>
                                    <td class="align-middle"> Destination </td>
                                    <td>
                                        <textarea :value="trip_ticket.destination" class="form-control form-control-sm" rows="3" readonly> </textarea>
                                    </td> 
                                </tr>
                                <tr>
                                    <td class="align-middle"> Purpose </td>
                                    <td>
                                        <textarea :value="trip_ticket.purpose" class="form-control form-control-sm" rows="3" readonly> </textarea>
                                    </td> 
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="h5wrapper mb-3">
                        <hr class="result">
                        <h5 class="text-warning fst-italic">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'calendar-alt']" />
                            </client-only> Trip Schedule
                        </h5>
                        <hr class="result">
                    </div>

                    <div class="responsive">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td width="50%"> Departure Time </td>
                                    <td> {{ formatDate(trip_ticket.start_time, true) }} </td>
                                </tr>
                                <tr>
                                    <td> Arrival Time </td>
                                    <td> {{ formatDate(trip_ticket.end_time, true) }} </td>
                                </tr>
                                <tr>
                                    <td> Actual Departure Time </td>
                                    <td> {{ formatDate(trip_ticket.actual_start_time, true) }} </td>
                                </tr>
                                <tr>
                                    <td> Actual Arrival Time </td>
                                    <td> {{ formatDate(trip_ticket.actual_end_time, true) }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>

    </div>
  </template>
  

<script setup lang="ts">

    import { ref } from 'vue'
    import type { TripTicket } from '~/composables/warehouse/trip-ticket/trip-ticket.types';
    import { updateActualTime } from '~/composables/warehouse/trip-ticket/trip-ticket.api'
    import { useToast } from "vue-toastification";
    import Swal from 'sweetalert2'
    import { tripTicketStatus } from '~/composables/warehouse/trip-ticket/trip-ticket.enums';

    const toast = useToast();

    const rfid = ref('')
    const rfidInput = ref<HTMLInputElement | null>(null)
    const trip_ticket = ref<TripTicket | null>(null)
    const is_scanning_rfid = ref(false)


    async function handle_rfid_scan() {
        console.log('handle_rfid_scan', rfid.value);

        if(is_scanning_rfid.value) return

        if(!rfid.value) {
            toast.error("Please enter RFID")
            focusRFIDInput()
            return
        }

        is_scanning_rfid.value = true 

        try {
            const response = await updateActualTime(rfid.value);
            rfid.value = '';

            if (response.success === true && response.data) {
                Swal.fire({
                    title: 'Success!',
                    text: response.msg,
                    icon: 'success',
                    position: 'top',
                    timer: 3000,
                });

                trip_ticket.value = response.data;
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.msg,
                    icon: 'error',
                    position: 'top',
                    timer: 3000,
                });

                if(response.data) {
                    trip_ticket.value = response.data
                }

            }
        } catch (error) {
            console.error("Error during RFID scan:", error);
            toast.error("An error occurred while scanning RFID");
        } finally {
            console.log('finally');
            is_scanning_rfid.value = false; 
            await focusRFIDInput();
        }

    } 

    const focusRFIDInput = async() => {
        await nextTick()
        rfidInput.value?.focus()
    }

</script>
  


<style scoped>
    .container {
        max-width: 600px;
    }
    
    .card-header {
        font-size: 1.25rem;
    }
    
    .card-body {
        padding: 1.5rem;
    }
    
    .page-wrapper {
        width: 100%;
        height: 100vh;
        display: inline-block;
        display: flex;
        background: rgb(142,207,255);
        background: linear-gradient(141deg, rgba(142,207,255,1) 0%, rgba(255,255,255,1) 100%);
    }

</style>
  