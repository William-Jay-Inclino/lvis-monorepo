<template>

    <div v-if="!isLoadingPage && authUser">
        
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Apply Filters</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="label">Start Date</label>
                            <input type="date" v-model="filters.startDate" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="label">End Date</label>
                            <input type="date" v-model="filters.endDate" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="label">Vehicle</label>
                            <client-only>
                                <v-select @search="handleSearchVehicles" :options="vehicles" label="label" v-model="filters.vehicle" :clearable="false"></v-select>
                            </client-only>
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
                        style="border: none; width: 100%; height: 100%;"
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

    import * as tripReportApi from '~/composables/motorpool/trip-ticket/trip-ticket-reports.api'
    import { fetchVehicles } from '~/composables/motorpool/vehicle/vehicle.api'
    import axios from 'axios';

    definePageMeta({
        name: ROUTES.TRIP_TICKET_SUMMARY_REPORT,
        layout: "layout-motorpool",
        middleware: ['auth'],
    })

    interface Filters {
        startDate: string,
        endDate: string,
        vehicle: Vehicle | null
    }

    // CONFIGS
    const config = useRuntimeConfig()
    const WAREHOUSE_API_URL = config.public.warehouseApiUrl

    // CONSTANTS
    const authUser = ref<AuthUser>({} as AuthUser)


    // FLAGS
    const isLoadingPage = ref(true)
    const isLoadingPdf = ref(false)

    const pdfUrl = ref()
    const vehicles = ref<Vehicle[]>([])

    const filters = ref<Filters>({
        startDate: '',
        endDate: '',
        vehicle: null
    })

    onMounted( async() => {

        authUser.value = getAuthUser()

        const response = await tripReportApi.fetchFilterData()
        vehicles.value = response.vehicles.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))

        isLoadingPage.value = false

    })


    async function onClickPrint() {
        console.log('onClickPrint()');

        try {

            const accessToken = authUser.value.access_token
            isLoadingPdf.value = true

            console.log('filters.value', filters.value);

            const _filters = {
                startDate: filters.value.startDate,
                endDate: filters.value.endDate,
                vehicleNumber: filters.value.vehicle?.vehicle_number
            }

            // Convert filters to query parameters
            const queryParams = new URLSearchParams(
                Object.entries(_filters).reduce((acc: Record<string, string>, [key, value]) => {
                    if (value !== undefined && value !== null) {
                        acc[key] = String(value);
                    }
                    return acc;
                }, {})
            );

            console.log('queryParams', queryParams);

            const response = await axios.get(
                `${WAREHOUSE_API_URL}/trip-ticket/summary-report/?${queryParams}`,
                {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log('response', response);

            isLoadingPdf.value = false

            const blob = new Blob([response.data], { type: 'application/pdf' });
            pdfUrl.value = window.URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    }


    async function handleSearchVehicles(input: string, loading: (status: boolean) => void ) {

        if(input.trim() === ''){
            vehicles.value = []
            return 
        } 

        debouncedSearchVehicles(input, loading)

    }

    async function searchVehicles(input: string, loading: (status: boolean) => void) {

        loading(true)

        try {
            const response = await fetchVehicles(input);
            vehicles.value = response.map(i => ({...i, label: `${i.vehicle_number} ${i.name}`}))
        } catch (error) {
            console.error('Error fetching Employees:', error);
        } finally {
            loading(false);
        }
    }

    const debouncedSearchVehicles = debounce((input: string, loading: (status: boolean) => void) => {
        searchVehicles(input, loading);
    }, 500);

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