<template>

    <div class="page-wrapper">

        <div class="container my-5">
            <h1 class="text-center mb-4">RFID Trip Tracker</h1>
        
            <!-- RFID Scan Section -->
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h5 class="card-title text-center text-warning fw-bold">Enter RFID Information</h5>
                    <div class="form-group">
                        <input 
                            autofocus
                            type="text" 
                            class="form-control" 
                            placeholder="Enter RFID here" 
                            v-model="rfid" 
                        />
                    </div>
                    <div v-if="rfid" class="alert alert-info mt-3">
                        Scanned RFID: {{ rfid }}
                    </div>
                </div>
            </div>
        
            <!-- Trip Information Section -->
            <div class="card shadow-sm" v-if="trip">

                <div class="card-header bg-dark text-white">
                    Trip Information
                </div>

                <div class="card-body">

                    <div class="responsive">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td width="50%"> Trip No. </td>
                                    <td>  </td>
                                </tr>
                                <tr>
                                    <td> Vehicle No. </td>
                                    <td>  </td>
                                </tr>
                                <tr>
                                    <td> Vehicle Plate No. </td>
                                    <td>  </td>
                                </tr>
                                <tr>
                                    <td> Driver </td>
                                    <td>  </td>
                                </tr>
                                <tr>
                                    <td class="align-middle"> Passengers </td>
                                    <td>
                                        <textarea class="form-control form-control-sm" rows="3" readonly> </textarea>
                                    </td> 
                                </tr>
                                <tr>
                                    <td class="align-middle"> Destination </td>
                                    <td>
                                        <textarea class="form-control form-control-sm" rows="3" readonly> </textarea>
                                    </td> 
                                </tr>
                                <tr>
                                    <td class="align-middle"> Purpose </td>
                                    <td>
                                        <textarea class="form-control form-control-sm" rows="3" readonly> </textarea>
                                    </td> 
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="h5wrapper mb-3">
                        <hr class="result">
                        <h5 class="text-warning fst-italic">
                            <i class="fas fa-calendar-alt"></i> Trip Schedule
                        </h5>
                        <hr class="result">
                    </div>

                    <div class="responsive">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td width="50%"> Departure Time </td>
                                    <td>  </td>
                                </tr>
                                <tr>
                                    <td> Arrival Time </td>
                                    <td>  </td>
                                </tr>
                                <tr>
                                    <td> Actual Departure Time </td>
                                    <td>  </td>
                                </tr>
                                <tr>
                                    <td> Actual Arrival Time </td>
                                    <td>  </td>
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
  
    const rfid = ref('')
    const trip = ref<TripTicket | null>(null)

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
  