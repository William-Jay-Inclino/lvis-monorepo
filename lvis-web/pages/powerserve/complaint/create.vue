<template>

    <div class="container">
        <div v-if="!isLoadingPage && authUser" class="card">
            <div class="card-body">
    
                <div>
                    <h2 class="text-warning">Create Complaint</h2>
                    <hr>
            
                    <div class="mb-3">
                        <label class="form-label">
                            Complainant Name <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="complaintData.complainant_name">
                        <small v-if="complaintDataErrors.complainant_name" class="text-danger fst-italic"> {{ error_msg }} </small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Description <span class="text-danger">*</span>
                        </label>
                        <textarea class="form-control form-control-sm small" rows="3" v-model="complaintData.description"></textarea>
                        <small v-if="complaintDataErrors.description" class="text-danger fst-italic"> {{ error_msg }} </small>
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
                        <div class="row">
                            <div class="col">
                                <label class="form-label">
                                    Account Number
                                </label>
                                <input type="text" class="form-control" disabled>
                            </div>
                            <div class="col">
                                <label class="form-label">
                                    Meter Number
                                </label>
                                <input type="text" class="form-control" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Municipality <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select :options="municipalities" label="name" v-model="complaintData.complaint_detail.municipality"></v-select>
                        </client-only>
                        <small v-if="complaintDataErrors.municipality" class="text-danger fst-italic"> {{ error_msg }} </small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Barangay <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select :options="barangays" label="name" v-model="complaintData.complaint_detail.barangay"></v-select>
                        </client-only>
                        <small v-if="complaintDataErrors.barangay" class="text-danger fst-italic"> {{ error_msg }} </small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Sitio</label>
                        <div class="d-flex align-items-center gap-2">
                            <client-only>
                                <v-select 
                                    :options="sitios" 
                                    label="name" 
                                    v-model="complaintData.complaint_detail.sitio"
                                    class="flex-grow-1">
                                </v-select>
                            </client-only>

                            <!-- Dropdown Button -->
                            <div class="dropdown">
                                <button 
                                    :disabled="!complaintData.complaint_detail.barangay" 
                                    class="btn btn-sm btn-primary dropdown-toggle" 
                                    type="button" 
                                    data-bs-toggle="dropdown">
                                    <i class="bi bi-plus"></i> Add
                                </button>
                                
                                <div class="dropdown-menu p-2 add-sitio-dropdown" @click.stop>
                                    <input 
                                        v-model="sitio_name" 
                                        type="text" 
                                        class="form-control form-control-sm mb-2" 
                                        placeholder="Enter sitio name">

                                        <span class="text-muted fst-italic small">Note: This will add a sitio in the database</span>
                                    
                                    <button 
                                        :disabled="is_disabled_save_sitio" 
                                        @click.stop="on_save_sitio()" 
                                        class="btn btn-sm btn-success w-100">
                                        {{ is_saving_sitio ? 'Saving...' : 'Save' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Landmark / Location Reference
                        </label>
                        <input type="text" class="form-control" v-model="complaintData.complaint_detail.landmark">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Report Type <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select :options="report_types" label="name" v-model="complaintData.report_type"></v-select>
                        </client-only>
                        <small v-if="complaintDataErrors.report_type" class="text-danger fst-italic"> {{ error_msg }} </small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Complainant Contact # <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="complaintData.complainant_contact_no">
                        <small v-if="complaintDataErrors.complainant_contact_no" class="text-danger fst-italic"> {{ error_msg }} </small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Assigned Group <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select :options="assignments" label="name" v-model="complaintData.assigned_group"></v-select>
                        </client-only>
                        <div class="text-muted fst-italic small">Options are areas, departments, and divisions</div>
                        <div v-if="complaintDataErrors.assigned_group" class="text-danger fst-italic small"> {{ error_msg }} </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Remarks
                        </label>
                        <textarea class="form-control form-control-sm small" rows="3" v-model="complaintData.remarks"></textarea>
                    </div>
            
                </div>
                
            </div>

            <div class="card-footer">
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

        <div v-else>
            <LoaderSpinner />
        </div>
    </div>


</template>


<script setup lang="ts">

import Swal from 'sweetalert2'
import type { Department } from '~/composables/hr/department/department';
import type { Division } from '~/composables/hr/division/division';
import type { Area } from '~/composables/powerserve/area/area.types';
import type { Consumer, Municipality, Sitio } from '~/composables/powerserve/common';
import * as complaintApi from '~/composables/powerserve/complaint/complaint.api'
import type { CreateComplaintInput, ComplaintReportType, AssignedGroup } from '~/composables/powerserve/complaint/complaint.types';
import { create as create_sitio } from '~/composables/powerserve/sitio/sitio.api'
import { useToast } from "vue-toastification";
import { _complaintDataErrorsInitial, ASSIGNED_GROUP_TYPE, create_complaint_initial } from '~/composables/powerserve/complaint/complaint.constants';

definePageMeta({
    name: ROUTES.COMPLAINT_CREATE,
    layout: "layout-powerserve",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// CONSTANTS
const router = useRouter();
const toast = useToast();


// FLAGS
const isSaving = ref(false)
const is_saving_sitio = ref(false)

const sitio_name = ref('')
const error_msg = ref('This field is required')

// FORM DATA
const complaintData = ref<CreateComplaintInput>(deepClone(create_complaint_initial))
const complaintDataErrors = ref(deepClone(_complaintDataErrorsInitial))

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

const assignments = computed((): AssignedGroup[] => {
    return [
        ...areas.value.map(area => {
            return {
                id: area.id,
                name: area.name,
                type: ASSIGNED_GROUP_TYPE.AREA,
            }
        }),
        ...departments.value.map(department => {
            return {
                id: department.id,
                name: department.name,
                type: ASSIGNED_GROUP_TYPE.DEPARTMENT,
            }
        }),
        ...divisions.value.map(division => {
            return {
                id: division.id,
                name: division.name,
                type: ASSIGNED_GROUP_TYPE.DIVISION,
            }
        }),
    ];
});

const is_disabled_save_sitio = computed(() => {
    if(!complaintData.value.complaint_detail.barangay || sitio_name.value.trim() === '' || is_saving_sitio.value) {
        return true 
    }

    return false 
})


// ======================== WATCHERS ========================  

watch(() => complaintData.value.complaint_detail.municipality, (newVal, oldVal) => {
    complaintData.value.complaint_detail.barangay = null
});

watch(() => complaintData.value.complaint_detail.barangay, (newVal, oldVal) => {
    complaintData.value.complaint_detail.sitio = null
});

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

async function on_save_sitio() {

    if(!complaintData.value.complaint_detail.barangay || sitio_name.value.trim() === '') return 

    is_saving_sitio.value = true
    const { success, msg, data } = await create_sitio({ 
        barangay_id: complaintData.value.complaint_detail.barangay.id, 
        name: sitio_name.value 
    })
    is_saving_sitio.value = false

    if(success && data) {
        toast.success('Sitio added!')
        sitio_name.value = ''

        add_sitio({ sitio: data })

    } else {
        toast.error('Failed to add sitio')
    }
}

async function add_sitio(payload: { sitio: Sitio }) {
    const { sitio } = payload
    
    const municipality = sitio.barangay.municipality
    const barangay = sitio.barangay 

    const _municipality  = municipalities.value.find(i => i.id === municipality.id)

    if(!_municipality) {
        console.error('municipality not found in list: ', municipality);
        return 
    }

    const _barangay = _municipality.barangays.find(i => i.id === barangay.id)

    if(!_barangay) {
        console.error('barangay not found in list: ', _barangay);
        return 
    }

    _barangay.sitios.unshift(sitio)

    complaintData.value.complaint_detail.sitio = {...sitio}

}

// ======================== UTILS ========================  

function isValid(): boolean {

    complaintDataErrors.value = { ..._complaintDataErrorsInitial }

    if (complaintData.value.complainant_name.trim() === '') {
        complaintDataErrors.value.complainant_name = true
    }

    if (complaintData.value.description.trim() === '') {
        complaintDataErrors.value.description = true
    }

    if (!complaintData.value.complaint_detail.municipality) {
        complaintDataErrors.value.municipality = true
    }

    if (!complaintData.value.complaint_detail.barangay) {
        complaintDataErrors.value.barangay = true
    }

    if (complaintData.value.complainant_contact_no.trim() === '') {
        complaintDataErrors.value.complainant_contact_no = true
    }

    if (!complaintData.value.report_type) {
        complaintDataErrors.value.report_type = true
    }

    if (!complaintData.value.assigned_group) {
        complaintDataErrors.value.assigned_group = true
    }

    const hasError = Object.values(complaintDataErrors.value).includes(true);

    if (hasError) {
        Swal.fire({
            title: 'Form has errors!',
            text: 'Please review the form and correct the errors.',
            icon: 'error',
            position: 'top',
        })
        return false
    }

    return true

}


</script>


<style scoped>

    .add-sitio-dropdown {
        min-width: 250px; /* Adjust width */
        max-width: 300px; /* Optional: Limit max width */
        padding: 15px; /* More padding for a bigger feel */
        font-size: 14px; /* Adjust text size */
    }


    .container {
        max-width: 800px; 
        margin: 0 auto; 
    }

</style>