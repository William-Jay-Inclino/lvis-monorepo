<template>

    <div v-if="!isLoadingPage && authUser">
        
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title text-warning">Trip Ticket Per Vehicle Type</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="label">Start Date</label>
                            <input type="date" v-model="filters.startDate" class="form-control">
                            <small v-if="filterErrors.startDate" class="fst-italic text-danger"> {{ errorMsg }} </small>
                        </div>
                        <div class="mb-3">
                            <label class="label">End Date</label>
                            <input type="date" v-model="filters.endDate" class="form-control">
                            <small v-if="filterErrors.endDate" class="fst-italic text-danger"> {{ errorMsg }} </small>
                        </div>
                        <div class="mb-3">
                            <label class="label">Vehicle Type</label>
                            <client-only>
                                <v-select :options="vehicle_types" label="label" v-model="filters.vehicleType" :clearable="false" :disabled="filters.allVehicles === true"></v-select>
                            </client-only>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="filters.allVehicles">
                                <label class="form-check-label" for="flexCheckDefault">
                                    All Vehicles
                                </label>
                            </div>
                            <small v-if="filterErrors.vehicleType" class="fst-italic text-danger"> {{ errorMsg }} </small>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button @click="onClickPrint" class="btn btn-danger float-end" :disabled="isLoadingPdf">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'print']" v-if="!isLoadingPdf" />
                            </client-only> 
                            <span v-if="isLoadingPdf" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {{ isLoadingPdf ? 'Loading...' : 'Print Preview' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row justify-content-center pt-3">
            <div class="col-lg-10">
                <div class="pdf-container" v-show="pdfUrl && !isLoadingPdf">
                    <iframe
                        :src="pdfUrl" 
                        style="border: none; width: 100%; height: 60%;"
                    ></iframe>
                </div>
                <div v-show="isLoadingPdf">
                    <LoaderSpinner />
                </div>
            </div>
        </div>

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>

</template>

<script setup lang="ts">

    import Swal from 'sweetalert2'
    import * as tripReportApi from '~/composables/motorpool/trip-ticket/trip-ticket-reports.api'
    import axios from 'axios';
    import type { VehicleType } from '~/composables/motorpool/vehicle/vehicle.types';

    definePageMeta({
        name: ROUTES.TRIP_TICKET_PER_VEHICLE_TYPE_REPORT,
        layout: "layout-motorpool",
        middleware: ['auth'],
    })

    interface Filters {
        startDate: string,
        endDate: string,
        vehicleType: VehicleType,
        allVehicles: boolean,
    }

    // CONFIGS
    const config = useRuntimeConfig()
    const WAREHOUSE_API_URL = config.public.warehouseApiUrl

    // CONSTANTS
    const authUser = ref<AuthUser>({} as AuthUser)
    const errorMsg = 'This field is required'

    // FLAGS
    const isLoadingPage = ref(true)
    const isLoadingPdf = ref(false)

    const pdfUrl = ref()
    const vehicle_types = ref<VehicleType[]>(['SV', 'VH'])

    const _filterErrorsInitial = {
        startDate: false,
        endDate: false,
        vehicleType: false,
    }

    const filterErrors = ref({..._filterErrorsInitial})

    const filters = ref<Filters>({
        startDate: '',
        endDate: '',
        vehicleType: 'SV',
        allVehicles: false
    })

    onMounted( async() => {

        authUser.value = getAuthUser()
        isLoadingPage.value = false

    })


    async function onClickPrint() {
        console.log('onClickPrint()');

        if(!isValidFilters(filters.value)) {

            Swal.fire({
                title: 'Error!',
                text: 'Please check the form for errors.',
                icon: 'warning',
                position: 'top',
            })
            return

        }

        isLoadingPdf.value = true 
        const response = await tripReportApi.get_trip_ticket_summary_report({
            startDate: filters.value.startDate,
            endDate: filters.value.endDate,
            vehicleType: filters.value.vehicleType,
            allVehicles: filters.value.allVehicles,
            authUser: authUser.value,
            apiUrl: WAREHOUSE_API_URL,
        })
        isLoadingPdf.value = false 
        pdfUrl.value = response.pdfUrl
        
    }

    function isValidFilters(filters: Filters): boolean {

        console.log('filters', filters);

        filterErrors.value = {..._filterErrorsInitial}

        if(!filters.startDate || filters.startDate.trim() === '') {
            filterErrors.value.startDate = true 
        }

        if(!filters.endDate || filters.endDate.trim() === '') {
            filterErrors.value.endDate = true 
        }

        if(!filters.vehicleType) {
            filterErrors.value.vehicleType = true 
        }

        const hasError = Object.values(filterErrors.value).includes(true);

        if (hasError) {
            return false
        }

        return true

    }

</script>


<style scoped>
.pdf-container {
  position: relative;
  padding-top: 141.42%; /* Aspect ratio for A4 (297mm / 210mm) */
  width: 100%;
  height: 0;
}

.pdf-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@media (max-width: 576px) {
  .pdf-container {
    max-height: 60vh; /* 60% of viewport height for small screens */
  }
}

@media (min-width: 577px) and (max-width: 992px) {
  .pdf-container {
    max-height: 75vh; /* 75% of viewport height for medium screens */
  }
}

@media (min-width: 993px) {
  .pdf-container {
    max-height: 80vh; /* Default max height for larger screens */
  }
}
</style>