<template>

    <div class="container">
        <div class="card">
            <div class="card-body">
    
                <div v-if="!isLoadingPage && authUser">
                    <h2 class="text-warning">Create Complaint</h2>
                    <hr>
            
                    <div class="row pb-3">
                        <div class="col">
                            <div class="row justify-content-center pt-3">
            
                                <div class="col-lg-6">
    
                                    <div class="alert alert-info" role="alert">
                                        <div>
                                            <small class="fst-italic">
                                                Fields with * are required
                                            </small>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Report Type <span class="text-danger">*</span>
                                        </label>
                                        <client-only>
                                            <v-select :options="report_types" label="name" v-model="complaintData.report_type"></v-select>
                                        </client-only>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Complainant Name <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="form-control" v-model="complaintData.complainant_name">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Complainant Contact # <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="form-control" v-model="complaintData.complainant_contact_no">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Description <span class="text-danger">*</span>
                                        </label>
                                        <textarea class="form-control form-control-sm small" rows="3" v-model="complaintData.description"></textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Account Number
                                        </label>
                                        <input type="text" class="form-control" v-model="complaintData.complaint_detail.account_number">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Meter Number
                                        </label>
                                        <input type="text" class="form-control" v-model="complaintData.complaint_detail.meter_number">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Consumer
                                        </label>
                                        <client-only>
                                            <v-select :options="consumers" label="name" v-model="complaintData.complaint_detail.consumer"></v-select>
                                        </client-only>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Municipality <span class="text-danger">*</span>
                                        </label>
                                        <client-only>
                                            <v-select @option:selected="onChangeMunicipality" :options="municipalities" label="name" v-model="complaintData.complaint_detail.municipality"></v-select>
                                        </client-only>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Barangay <span class="text-danger">*</span>
                                        </label>
                                        <client-only>
                                            <v-select @option:selected="onChangeBarangay" :options="barangays" label="name" v-model="complaintData.complaint_detail.barangay"></v-select>
                                        </client-only>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Sitio
                                        </label>
                                        <client-only>
                                            <v-select :options="sitios" label="name" v-model="complaintData.complaint_detail.sitio"></v-select>
                                        </client-only>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Landmark
                                        </label>
                                        <input type="text" class="form-control" v-model="complaintData.complaint_detail.landmark">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Remarks
                                        </label>
                                        <textarea class="form-control form-control-sm small" rows="3" v-model="complaintData.remarks"></textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">
                                            Broadcast to <span class="text-danger">*</span>
                                        </label>
                                        <client-only>
                                            <v-select :options="assignments" label="name" v-model="complaintData.assigned_to"></v-select>
                                        </client-only>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <nuxt-link class="btn btn-secondary" to="/powerserve/complaint">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'search']" />
                                            </client-only> 
                                            Search Complaint
                                        </nuxt-link>
                                        <button data-testid="save" @click="save()" type="button" class="btn btn-primary" :disabled="isSaving">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'save']"/>
                                            </client-only> {{ isSaving ? 'Saving...' : 'Save' }}
                                        </button>
                                    </div>
            
                                </div>
            
                            </div>
                        </div>
                    </div>
            
            
                </div>
            
                <div v-else>
                    <LoaderSpinner />
                </div>
                
            </div>
        </div>
    </div>


</template>


<script setup lang="ts">

import Swal from 'sweetalert2'
import type { Department } from '~/composables/hr/department/department';
import type { Division } from '~/composables/hr/division/division';
import type { Area } from '~/composables/powerserve/area/area.types';
import type { Assignment, Consumer, Municipality } from '~/composables/powerserve/common';
import * as complaintApi from '~/composables/powerserve/complaint/complaint.api'
import type { CreateComplaintInput, ComplaintReportType } from '~/composables/powerserve/complaint/complaint.types';

definePageMeta({
    name: ROUTES.COMPLAINT_CREATE,
    layout: "layout-powerserve",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// CONSTANTS
const router = useRouter();

// FLAGS
const isSaving = ref(false)

// INITIAL DATA
const _complaintDataErrorsInitial = {
    complainant_name: false,
}

// FORM DATA
const complaintData = ref<CreateComplaintInput>({
    report_type: null,
    complainant_name: '',
    complainant_contact_no: '',
    description: '',
    remarks: '',
    complaint_detail: {
        account_number: '',
        meter_number: '',
        consumer: null,
        municipality: null,
        barangay: null,
        sitio: null,
        landmark: '',
    },
    assigned_to: null
})
const complaintDataErrors = ref({ ..._complaintDataErrorsInitial })

// DROPDOWNS
const report_types = ref<ComplaintReportType[]>([])
const municipalities = ref<Municipality[]>([])
const departments = ref<Department[]>([])
const divisions = ref<Division[]>([])
const areas = ref<Area[]>([])
const consumers = ref<Consumer[]>([])

// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await complaintApi.fetchFormDataInCreate()

    report_types.value = response.report_types
    municipalities.value = response.municipalities
    departments.value = response.departments
    divisions.value = response.divisions
    areas.value = response.areas

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const barangays = computed( () => {
    if(!complaintData.value.complaint_detail.municipality) {
        return []
    }

    return complaintData.value.complaint_detail.municipality.barangays
})

const sitios = computed( () => {
    if(!complaintData.value.complaint_detail.barangay) {
        return []
    }

    return complaintData.value.complaint_detail.barangay?.sitios
})

const assignments = computed((): Assignment[] => {
    return [
        ...areas.value.map((area: any) => ({ ...area, type: "area" as const })),
        ...departments.value.map(department => ({ ...department, type: "department" as const })),
        ...divisions.value.map(division => ({ ...division, type: "division" as const })),
    ];
});


// ======================== WATCHERS ========================  


// ======================== FUNCTIONS ========================  

async function save() {

    console.log('save')

    if (!isValid()) {
        Swal.fire({
            title: 'Form has errors!',
            text: 'Please review the form and correct the errors.',
            icon: 'error',
            position: 'top',
        })
        return
    }

    console.log('saving...')

    isSaving.value = true
    const response = await complaintApi.create(complaintData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/powerserve/complaint/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}


// ======================== UTILS ========================  

function isValid(): boolean {

    complaintDataErrors.value = { ..._complaintDataErrorsInitial }

    if (!complaintData.value.complainant_name) {
        complaintDataErrors.value.complainant_name = true
    }

    const hasError = Object.values(complaintDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}

function onChangeMunicipality() {
    complaintData.value.complaint_detail.barangay = null
}

function onChangeBarangay() {
    complaintData.value.complaint_detail.sitio = null
}

</script>
