<template>

    <div v-if="!isLoadingPage && authUser">
        
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title text-warning">MCRT Summary</h5>
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
                    </div>
                    <div class="card-footer">
                        <!-- <button @click="onClickPrint" class="btn btn-danger float-end" :disabled="isLoadingPdf">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'print']" v-if="!isLoadingPdf" />
                            </client-only> 
                            <span v-if="isLoadingPdf" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {{ isLoadingPdf ? 'Loading...' : 'Print Preview' }}
                        </button> -->
                        <button @click="onClickDownloadCsv" class="btn btn-success float-end me-2" :disabled="isLoadingCsv">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'file-csv']" v-if="!isLoadingCsv" />
                            </client-only>
                            <span v-if="isLoadingCsv" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {{ isLoadingCsv ? 'Loading...' : 'Download CSV' }}
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
    import * as mcrtApi from '~/composables/warehouse/mcrt/mcrt-reports.api'

    definePageMeta({
        name: ROUTES.MCRT_SUMMARY_REPORT,
        layout: "layout-warehouse",
        middleware: ['auth'],
    })

    interface Filters {
        startDate: string,
        endDate: string,
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
    const isLoadingCsv = ref(false)
    const csvUrl = ref<string | null>(null)

    const pdfUrl = ref()

    const _filterErrorsInitial = {
        startDate: false,
        endDate: false,
    }

    const filterErrors = ref({..._filterErrorsInitial})

    const filters = ref<Filters>({
        startDate: '',
        endDate: '',
    })


    onMounted( async() => {

        authUser.value = getAuthUser()

        // const response = await osrivReportApi.fetchFilterData()
        isLoadingPage.value = false

    })

    // async function onClickPrint() {
    //     console.log('onClickPrint()');

    //     if(!isValidFilters(filters.value)) {

    //         Swal.fire({
    //             title: 'Error!',
    //             text: 'Please check the form for errors.',
    //             icon: 'warning',
    //             position: 'top',
    //         })
    //         return

    //     }

    //     isLoadingPdf.value = true 
    //     const response = await serivApi.get_seriv_summary_report({
    //         startDate: filters.value.startDate,
    //         endDate: filters.value.endDate,
    //         authUser: authUser.value,
    //         apiUrl: WAREHOUSE_API_URL,
    //     })
    //     isLoadingPdf.value = false 
    //     pdfUrl.value = response.pdfUrl
        
    // }

    async function onClickDownloadCsv() {
        if(!isValidFilters(filters.value)) {
            Swal.fire({
                title: 'Error!',
                text: 'Please check the form for errors.',
                icon: 'warning',
                position: 'top',
            })
            return
        }

        isLoadingCsv.value = true
        const response = await mcrtApi.get_mcrt_summary_csv({
            startDate: filters.value.startDate,
            endDate: filters.value.endDate,
            authUser: authUser.value,
            apiUrl: WAREHOUSE_API_URL,
        })
        isLoadingCsv.value = false

        if (response.csvUrl) {
            // Trigger download
            const link = document.createElement('a')
            link.href = response.csvUrl
            link.download = `mcrt-summary-${filters.value.startDate}_to_${filters.value.endDate}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            // Optionally, revoke the object URL after download
            setTimeout(() => window.URL.revokeObjectURL(response.csvUrl), 1000)
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to generate CSV.',
                icon: 'error',
                position: 'top',
            })
        }
    }


    function isValidFilters(filters: Filters): boolean {

        filterErrors.value = {..._filterErrorsInitial}

        if(!filters.startDate || filters.startDate.trim() === '') {
            filterErrors.value.startDate = true 
        }

        if(!filters.endDate || filters.endDate.trim() === '') {
            filterErrors.value.endDate = true 
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