<template>

    <div v-if="!isLoadingPage && authUser">
        
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title text-warning">OSRIV Summary</h5>
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
                            <label class="label">Code</label>
                            <client-only>
                                <v-select @option:selected="onChangeCode" :options="codes" label="code" v-model="code" :clearable="false"></v-select>
                            </client-only>
                        </div>
                        <div v-show="code === '508' || code === '503'" class="mb-3">
                            <label class="label">Departments</label>
                            <client-only>
                                <v-select :options="departments" label="code" v-model="filters.departments" :clearable="false" multiple></v-select>
                            </client-only>
                            <small v-if="filterErrors.departments" class="fst-italic text-danger"> {{ errorMsg }} </small>
                        </div>
                        <div v-show="code === '504'" class="mb-3">
                            <label class="label">Requisitioner</label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="filters.requested_by"></v-select>
                            </client-only>
                            <small v-if="filterErrors.requested_by" class="fst-italic text-danger"> {{ errorMsg }} </small>
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
    import * as osrivReportApi from '~/composables/warehouse/osriv/osriv-reports.api'
    import axios from 'axios';
    import type { Employee } from '~/composables/hr/employee/employee.types';
    import type { Department } from '~/composables/hr/department/department';

    definePageMeta({
        name: ROUTES.OSRIV_SUMMARY_REPORT,
        layout: "layout-warehouse",
        middleware: ['auth'],
    })

    interface Filters {
        startDate: string,
        endDate: string,
        departments: Department[],
        requested_by: Employee | null,
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
    const employees = ref<Employee[]>([])
    const departments = ref<Department[]>([])
    const codes = ref<string[]>(['508', '504', '503'])
    const code = ref(codes.value[0])

    const _filterErrorsInitial = {
        startDate: false,
        endDate: false,
        departments: false,
        requested_by: false,
    }

    const filterErrors = ref({..._filterErrorsInitial})

    const filters = ref<Filters>({
        startDate: '',
        endDate: '',
        departments: [],
        requested_by: null,
    })

    const departmentsByCode = computed( (): Department[] => {
        
        if(code.value === '508') {
            const x = ['OGM', 'ISD', 'IAD', 'TSD', 'CETD']
            return departments.value.filter(i => x.includes(i.code))
        }

        if(code.value === '503') {
            const x = ['FSD']
            return departments.value.filter(i => x.includes(i.code))
        }

        return []

    })

    onMounted( async() => {

        authUser.value = getAuthUser()

        const response = await osrivReportApi.fetchFilterData()

        employees.value = response.employees.map(i => ({...i, fullname: getFullname(i.firstname, i.middlename, i.lastname)}))
        departments.value = response.departments

        onChangeCode()

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

        // isLoadingPdf.value = true 
        // const response = await osrivReportApi.get_trip_ticket_summary_report({
        //     startDate: filters.value.startDate,
        //     endDate: filters.value.endDate,
        //     authUser: authUser.value,
        //     apiUrl: WAREHOUSE_API_URL,
        //     vehicleNumber: filters.value.vehicle?.vehicle_number,
        // })
        // isLoadingPdf.value = false 
        // pdfUrl.value = response.pdfUrl
        
    }

    function onChangeCode() {
        filters.value.requested_by = null
        filters.value.departments = departmentsByCode.value.map(i => ({...i}))
    }

    function isValidFilters(filters: Filters): boolean {

        filterErrors.value = {..._filterErrorsInitial}

        if(!filters.startDate || filters.startDate.trim() === '') {
            filterErrors.value.startDate = true 
        }

        if(!filters.endDate || filters.endDate.trim() === '') {
            filterErrors.value.endDate = true 
        }

        if( (code.value === '508' || code.value === '503') && filters.departments.length === 0) {
            filterErrors.value.departments = true 
        }

        if(code.value === '504' && !filters.requested_by) {
            filterErrors.value.requested_by = true 
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