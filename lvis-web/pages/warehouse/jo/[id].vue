<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && joData && joData.canvass && !joData.cancelled_at" class="mb-3">
                <h2 class="text-warning">Update JO</h2>
                <hr>
        
                <div v-show="isJODetailForm" class="row justify-content-center">
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
        
                        <div class="mb-3 d-flex align-items-center">
                            <label class="form-label me-2 mb-0">Status:</label>
                            <div :class="{ [`badge bg-${joStatus.color}`]: true }">
                                {{ joStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                JO Number
                            </label>
                            <input type="text" class="form-control" :value="joData.jo_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/jo/view/' + joData.id" target="_blank">View JO details</nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                RC Number
                            </label>
                            <input type="text" class="form-control" :value="joData.canvass.rc_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/canvass/view/' + joData.canvass.id" target="_blank">View canvass
                                details</nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="joData.date_requested" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner
                            </label>
                            <input :value="joData.canvass.requested_by?.fullname" type="text" class="form-control" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Purpose
                            </label>
                            <textarea :value="joData.canvass.purpose" class="form-control" rows="3" disabled> </textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner Notes
                            </label>
                            <textarea :value="joData.canvass.notes" class="form-control" rows="3" disabled> </textarea>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Imd. Sup. <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="supervisors" label="fullname" v-model="joData.supervisor"
                                    :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="joDataErrors.supervisor"> This field is required
                            </small>
                        </div>
        
                        <div class="mb-3" v-if="isAdmin(authUser)">
                            <label class="form-label">
                                Classification
                            </label>
                            <client-only>
                                <v-select @search="handleSearchClassifications" :options="classifications" label="name" v-model="joData.classification"></v-select>
                            </client-only>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Department <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="departments" label="name" v-model="joData.department"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-if="joDataErrors.department"> This field is required
                            </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Equipment
                            </label>
                            <input type="text" class="form-control" v-model="joData.equipment">
                            <small class="text-danger fst-italic" v-if="joDataErrors.equipment"> This field is required </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Notes
                            </label>
                            <textarea class="form-control" rows="3" v-model="joData.notes"></textarea>
                        </div>
        
        
                    </div>
                </div>
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': isJODetailForm, 'col-12': !isJODetailForm }">
        
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/jo/view/${joData.id}`">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="isJODetailForm" @click="updateJoInfo()" type="button" class="btn btn-success"
                                    :disabled="isUpdating">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> {{ isUpdating ? 'Updating...' : 'Update' }}
                                </button>
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
import { getFullname, formatToValidHtmlDate, redirectTo401Page } from '~/utils/helpers'
import { useToast } from "vue-toastification";
import * as joApi from '~/composables/warehouse/jo/jo.api'
import { type JO } from '~/composables/warehouse/jo/jo.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Department } from '~/composables/system/department/department';
import { fetchClassificationsByName } from '~/composables/accounting/classification/classification.api';

definePageMeta({
    name: ROUTES.JO_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// DEPENDENCIES
const route = useRoute()
const router = useRouter();
const toast = useToast();

// FLAGS
const isJODetailForm = ref(true)
const isUpdating = ref(false)
const isUpdatingApproverOrder = ref(false)
const isAddingJoApprover = ref(false)
const isEditingJoApprover = ref(false)

// INITIAL DATA
const _joDataErrorsInitial = {
    supervisor: false,
    department: false,
    equipment: false,
}

// DROPDOWNS
const employees = ref<Employee[]>([])
const classifications = ref<Classification[]>([])
const departments = ref<Department[]>([])


// FORM DATA
const joDataErrors = ref({ ..._joDataErrorsInitial })
const joData = ref<JO>({} as JO)



// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await joApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.jo) {
        return redirectTo401Page()
    }

    if (!response.jo.can_update) {
        return redirectTo401Page()
    }

    populateForm(response.jo)

    employees.value = addPropertyFullName(response.employees)

    classifications.value = response.classifications
    departments.value = response.departments

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const joStatus = computed(() => {

    const approvers = joData.value.jo_approvers

    if (joData.value.cancelled_at) {

        return approvalStatus[APPROVAL_STATUS.CANCELLED]

    }

    const hasDisapproved = approvers.find(i => i.status === APPROVAL_STATUS.DISAPPROVED)

    if (hasDisapproved) {
        return approvalStatus[APPROVAL_STATUS.DISAPPROVED]
    }

    const hasPending = approvers.find(i => i.status === APPROVAL_STATUS.PENDING)

    if (hasPending) {
        return approvalStatus[APPROVAL_STATUS.PENDING]
    }

    return approvalStatus[APPROVAL_STATUS.APPROVED]

})


const supervisors = computed(() => {
    return employees.value.filter(i => i.rank_number >= SUPERVISOR_MIN_RANK)
})


// ======================== FUNCTIONS ========================  

function populateForm(data: JO) {

    if(!data.canvass) return

    data.date_requested = formatToValidHtmlDate(data.date_requested)

    const requestedBy = data.canvass.requested_by
    requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)

    const supervisor = data.supervisor
    supervisor['fullname'] = getFullname(supervisor.firstname, supervisor.middlename, supervisor.lastname)

    data.jo_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    joData.value = data

}

async function updateJoInfo() {

    console.log('update')

    if (!isValidJoInfo()) {
        Swal.fire({
            title: 'Form has errors!',
            text: 'Please review the form and correct the errors.',
            icon: 'error',
            position: 'top',
        })
        return
    }

    console.log('updating...')

    isUpdating.value = true
    const response = await joApi.update(joData.value.id, joData.value)
    isUpdating.value = false

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

function isValidJoInfo(): boolean {

    joDataErrors.value = { ..._joDataErrorsInitial }

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

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

const debouncedSearchClassifications = debounce((input: string, loading: (status: boolean) => void) => {
    searchClassifications(input, loading);
}, 500);

</script>
