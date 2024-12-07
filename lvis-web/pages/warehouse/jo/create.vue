<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Create JO</h2>
                <hr>
        
                <div class="row pb-3">
                    <div class="col">
                        <div class="row justify-content-center pt-3">
        
                            <div class="col-lg-6">

                                <div class="alert alert-info" role="alert">
                                    <div>
                                        <small class="fst-italic">
                                            - Fields with * are required
                                        </small>
                                    </div>
                                    <div>
                                        <small class="fst-italic">
                                            - Only employees with a rank higher than {{ SUPERVISOR_MIN_RANK - 1 }} are included as options in the <b>Imd. Sup.</b> field.
                                        </small>
                                    </div>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        RC Number <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select @search="handleSearchRcNumber" @option:selected="onRcNumberSelected" :options="canvasses" label="rc_number"
                                            v-model="joData.canvass">
                                            <template v-slot:option="option">
                                                <div v-if="option.is_referenced" class="row">
                                                    <div class="col">
                                                        <span class="text-danger">{{ option.rc_number }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-muted fst-italic">
                                                            Referenced
                                                        </small>
                                                    </div>
                                                </div>
                                                <div v-else class="row">
                                                    <div class="col">
                                                        <span>{{ option.rc_number }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-success fst-italic"> Available </small>
                                                    </div>
                                                </div>
                                            </template>
                                        </v-select>
                                    </client-only>
                                    <nuxt-link v-if="joData.canvass" class="btn btn-sm btn-light text-primary"
                                        :to="'/warehouse/canvass/view/' + joData.canvass.id" target="_blank">View
                                        canvass details</nuxt-link>
                                    <small class="text-danger fst-italic" v-if="joDataErrors.canvass"> This field is required
                                    </small>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Requisitioner
                                    </label>
                                    <input v-if="joData.canvass"
                                        :value="getFullname(joData.canvass.requested_by!.firstname, joData.canvass.requested_by!.middlename, joData.canvass.requested_by!.lastname)"
                                        type="text" class="form-control" disabled>
                                    <input v-else type="text" class="form-control" disabled>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Purpose
                                    </label>
                                    <textarea v-if="joData.canvass" :value="joData.canvass.purpose" class="form-control"
                                        rows="3" disabled> </textarea>
                                    <textarea v-else class="form-control" rows="3" disabled> </textarea>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Requisitioner Notes
                                    </label>
                                    <textarea v-if="joData.canvass" :value="joData.canvass.notes" class="form-control" rows="3"
                                        disabled> </textarea>
                                    <textarea v-else class="form-control" rows="3" disabled> </textarea>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Imd. Sup. <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select @search="handleSearchEmployees" :options="supervisors" label="fullname" v-model="joData.supervisor"></v-select>
                                    </client-only>
                                    <small class="text-danger fst-italic" v-if="joDataErrors.supervisor"> This field is required
                                    </small>
                                </div>
        
                                <div class="mb-3" v-if="isAdmin(authUser)">
                                    <label class="form-label">
                                        Classification
                                    </label>
                                    <client-only>
                                        <v-select @search="handleSearchClassifications" :options="classifications" label="name"
                                            v-model="joData.classification"></v-select>
                                    </client-only>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Department <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select :options="departments" label="code" v-model="joData.department"></v-select>
                                    </client-only>
                                    <small class="text-danger fst-italic" v-if="joDataErrors.department"> This field is required
                                    </small>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Equipment
                                    </label>
                                    <input type="text" class="form-control" v-model="joData.equipment">
                                    <small class="text-danger fst-italic" v-if="joDataErrors.equipment"> This field is required
                                    </small>
                                </div>
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Notes
                                    </label>
                                    <textarea class="form-control" rows="3" v-model="joData.notes"></textarea>
                                </div>
        
                                <div class="d-flex justify-content-between">
                                    <nuxt-link class="btn btn-secondary" to="/warehouse/jo">
                                        <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search JO
                                    </nuxt-link>
                                    <button @click="save()" type="button" class="btn btn-primary" :disabled="isSaving">
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


</template>


<script setup lang="ts">

import Swal from 'sweetalert2'
import { getFullname } from '~/utils/helpers'
import * as joApi from '~/composables/warehouse/jo/jo.api'
import type { Canvass } from '~/composables/warehouse/canvass/canvass.types';
import type { CreateJoInput } from '~/composables/warehouse/jo/jo.types';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchCanvassesByRcNumber } from '~/composables/warehouse/canvass/canvass.api';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Department } from '~/composables/system/department/department';
import { fetchClassificationsByName } from '~/composables/system/classification/classification.api';

definePageMeta({
    name: ROUTES.JO_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// CONSTANTS
const router = useRouter();

// FLAGS
const isSaving = ref(false)

// INITIAL DATA
const _joDataErrorsInitial = {
    canvass: false,
    supervisor: false,
    department: false,
    equipment: false,
}

// FORM DATA
const joData = ref<CreateJoInput>({
    canvass: null,
    supervisor: null,
    classification: null,
    department: null,
    equipment: '',
    notes: '',
    approvers: []
})
const joDataErrors = ref({ ..._joDataErrorsInitial })

let currentCanvass: Canvass | null = null


// DROPDOWNS
const canvasses = ref<Canvass[]>([])
const employees = ref<Employee[]>([])
const classifications = ref<Classification[]>([])
const departments = ref<Department[]>([])



// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await joApi.fetchFormDataInCreate()

    canvasses.value = response.canvasses

    employees.value = addPropertyFullName(response.employees)

    joData.value.approvers = response.approvers
    classifications.value = response.classifications
    departments.value = response.departments

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const canvassId = computed(() => {
    if (joData.value.canvass) {
        return joData.value.canvass.id
    }
    return null
})

const supervisors = computed(() => {
    return employees.value.filter(i => i.rank_number >= SUPERVISOR_MIN_RANK)
})

// ======================== WATCHERS ========================  
// set currentCanvass to null if rc number field is deselected
watch(canvassId, (val) => {

    if (!val) {
        console.log('rc number deselected')
        currentCanvass = null
    }

})



// ======================== FUNCTIONS ========================  

async function save() {

    console.log('save')

    if (!isValid()) {
        return
    }

    console.log('saving...')

    isSaving.value = true
    const response = await joApi.create(joData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/jo/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

// check if canvass is_referenced. If true then rollback to previous canvass else set new current canvass
function onRcNumberSelected(payload: Canvass) {
    console.log('onRcNumberSelected()', payload)
    if (payload.is_referenced) {
        if (currentCanvass) {
            joData.value.canvass = currentCanvass
        } else {
            joData.value.canvass = null
        }
    } else {
        currentCanvass = payload
    }
}

async function handleSearchRcNumber(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === '') {
        canvasses.value = []
        return
    } 

    debouncedSearchRcNumbers(input, loading)

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

}

async function handleSearchClassifications(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        classifications.value = []
        return 
    } 

    debouncedSearchClassifications(input, loading)

}

async function searchEmployees(input: string, loading: (status: boolean) => void) {
    console.log('searchEmployees');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchEmployees(input);
        console.log('response', response);
        employees.value = addPropertyFullName(response)
    } catch (error) {
        console.error('Error fetching Employees:', error);
    } finally {
        loading(false);
    }
}

async function searchRcNumbers(input: string, loading: (status: boolean) => void) {
    console.log('searchRcNumbers');
    console.log('input', input);

    loading(true)

    try {
        const response = await fetchCanvassesByRcNumber(input);
        console.log('response', response);
        canvasses.value = response;
    } catch (error) {
        console.error('Error fetching RC numbers:', error);
    } finally {
        loading(false);
    }
}


async function searchClassifications(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchClassificationsByName(input);
        classifications.value = response
    } catch (error) {
        console.error('Error fetching Classifications:', error);
    } finally {
        loading(false);
    }
}

// ======================== UTILS ========================  

function isValid(): boolean {

    joDataErrors.value = { ..._joDataErrorsInitial }

    if (!joData.value.canvass) {
        joDataErrors.value.canvass = true
    }

    if (!joData.value.supervisor) {
        joDataErrors.value.supervisor = true
    }

    if (!joData.value.department) {
        joDataErrors.value.department = true
    }

    const hasError = Object.values(joDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}

const debouncedSearchRcNumbers = debounce((input: string, loading: (status: boolean) => void) => {
  searchRcNumbers(input, loading);
}, 500);

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

const debouncedSearchClassifications = debounce((input: string, loading: (status: boolean) => void) => {
    searchClassifications(input, loading);
}, 500);

</script>
