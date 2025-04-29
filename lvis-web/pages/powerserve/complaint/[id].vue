<template>

    <div v-if="!isLoadingPage && authUser" class="container">

        <div class="row">
            <div class="col-lg-6 col-md-8 col-sm-12">
                <PowerserveConsumerDetails :consumer="complaintData.complaint_detail.consumer" @select-consumer="handle_select_consumer" class="mb-3" />
            </div>
            <div class="col-lg-6 col-md-4 col-sm-12">
                <div class="card">
                    <div class="card-body">
            
                        <div>
                            <h2 class="text-warning">Update Complaint</h2>
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
                                    <v-select :options="assignments" label="name" v-model="complaintData.assigned_group" :disabled="has_active_task"></v-select>
                                </client-only>
                                <div v-if="complaintDataErrors.assigned_group" class="text-danger fst-italic small"> {{ error_msg }} </div>
                                <div v-if="!has_active_task" class="text-muted fst-italic small">Options are areas, departments, and divisions</div>
                                <div v-else class="text-danger fst-italic small">Cannot update this field—an assignee already exists</div>
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
            </div>
        </div>

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>


</template>


<script setup lang="ts">

import Swal from 'sweetalert2'
import type { Department } from '~/composables/hr/department/department';
import type { Division } from '~/composables/hr/division/division';
import type { Area } from '~/composables/powerserve/area/area.types';
import * as complaintApi from '~/composables/powerserve/complaint/complaint.api'
import type { ComplaintReportType, UpdateComplaintInput, Complaint, AssignedGroup } from '~/composables/powerserve/complaint/complaint.types';
import { create as create_sitio } from '~/composables/powerserve/sitio/sitio.api'
import { useToast } from "vue-toastification";
import { _complaintDataErrorsInitial, ASSIGNED_GROUP_TYPE, update_complaint_initial } from '~/composables/powerserve/complaint/complaint.constants';
import { get_assigned_group } from '~/composables/powerserve/complaint/complaint.helper';
import { TASK_STATUS } from '~/composables/powerserve/task/task.constants';
import type { Consumer } from '~/composables/powerserve/consumer/consumer.types';
import type { Municipality } from '~/composables/powerserve/municipality/municipality';
import type { Sitio } from '~/composables/powerserve/sitio/sitio.types';

definePageMeta({
    name: ROUTES.COMPLAINT_UPDATE,
    layout: "layout-powerserve",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// CONSTANTS
const router = useRouter();
const route = useRoute()
const toast = useToast();


// FLAGS
const isSaving = ref(false)
const is_saving_sitio = ref(false)


const sitio_name = ref('')
const error_msg = ref('This field is required')
const existing_complaint = ref<Complaint>()

// FORM DATA
const complaintData = ref<UpdateComplaintInput>(deepClone(update_complaint_initial))
const complaintDataErrors = ref(deepClone(_complaintDataErrorsInitial))

// DROPDOWNS
const report_types = ref<ComplaintReportType[]>([])
const municipalities = ref<Municipality[]>([])
const departments = ref<Department[]>([])
const divisions = ref<Division[]>([])
const areas = ref<Area[]>([])

// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await complaintApi.fetchFormDataInUpdate({ complaint_id: Number(route.params.id) })

    if(!response.complaint) {
        return redirectTo401Page()
    }

    const _complaint = deepClone(response.complaint)

    existing_complaint.value = _complaint
    report_types.value = response.report_types
    municipalities.value = response.municipalities
    departments.value = response.departments
    divisions.value = response.divisions
    areas.value = response.areas

    populate_form({ complaint: _complaint })

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

const has_active_task = computed( () => {

    if(!existing_complaint.value){
        return false
    }

    const _task = existing_complaint.value.tasks.find(i => i.task_status_id === TASK_STATUS.ASSIGNED || i.task_status_id === TASK_STATUS.ONGOING)

    if(_task) {
        return true 
    }

    return false

})  


// ======================== WATCHERS ========================  

watch(() => complaintData.value.complaint_detail.municipality, (newVal, oldVal) => {

    const brgy = complaintData.value.complaint_detail.barangay

    if(newVal && brgy) {

        const _brgy = newVal.barangays.find(i => i.id === brgy.id)

        if(!_brgy) {
            complaintData.value.complaint_detail.barangay = null
        }
    } else {
        complaintData.value.complaint_detail.barangay = null
    }


});

watch(() => complaintData.value.complaint_detail.barangay, (newVal, oldVal) => {
    const sitio = complaintData.value.complaint_detail.sitio

    if(newVal && sitio) {

        const _sitio = newVal.sitios.find(i => i.id === sitio.id)

        if(!_sitio) {
            complaintData.value.complaint_detail.sitio = null
        }
        
    } else {
        complaintData.value.complaint_detail.sitio = null
    }
});

// ======================== FUNCTIONS ========================  

async function save() {

    console.log('save')

    if(!existing_complaint.value) return

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
    const response = await complaintApi.update({ input: complaintData.value, complaint_id: existing_complaint.value.id })
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
        barangay: complaintData.value.complaint_detail.barangay, 
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

async function populate_form(payload: { complaint: Complaint }) {

    const { complaint } = payload

    console.log('payload', payload);
    const municipality = complaint.complaint_detail.barangay.municipality
    const barangay = complaint.complaint_detail.barangay

    const _municipality = municipalities.value.find(i => i.id === municipality.id)

    if(!_municipality) {
        console.error('municipality not found in municipalities with id ' + municipality.id);
        return
    }

    const _barangay = _municipality.barangays.find(i => i.id === barangay.id)

    if(!_barangay) {
        console.error('barangay not found in barangays with id ' + barangay.id);
        return
    }


    // populate assigned group
    const assigned_group = get_assigned_group({
        complaint,
        areas: areas.value,
        departments: departments.value,
        divisions: divisions.value,
    }) 


    complaintData.value = {
        report_type: complaint.report_type,
        complainant_name: complaint.complainant_name,
        complainant_contact_no: complaint.complainant_contact_no,
        description: complaint.description,
        remarks: complaint.remarks,
        complaint_detail: {
            consumer: complaint.complaint_detail.consumer || null,
            municipality: _municipality,
            barangay: _barangay,
            sitio: complaint.complaint_detail.sitio || null,
            landmark: complaint.complaint_detail.landmark || '',
        },
        assigned_group
    }


}

// ======================== UTILS ========================  

function handle_select_consumer(payload: { consumer: Consumer }) {
    const { consumer } = payload
    complaintData.value.complaint_detail.consumer = consumer

}

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
        max-width: 1400px; 
        margin: 0 auto; 
    }

</style>