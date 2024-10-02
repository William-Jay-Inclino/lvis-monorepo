<template>
    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && osrivData && !osrivData.cancelled_at" class="mb-3">

                <h2 class="text-warning">Update OSRIV</h2>

                <hr>

                <div class="row pt-3 mb-5">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="form = FORM.UPDATE_INFO">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_INFO }" href="#">
                                    <i class="fas fa-info-circle"></i> OSRIV Info
                                </a>
                            </li>
                            <li class="nav-item" @click="form = FORM.UPDATE_APPROVERS">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_APPROVERS }" href="#">
                                    <i class="fas fa-users"></i> Approvers
                                </a>
                            </li>
                            <li class="nav-item" @click="form = FORM.UPDATE_ITEMS">
                                <a class="nav-link" :class="{ 'active': form === FORM.UPDATE_ITEMS }" href="#">
                                    <i class="fas fa-users"></i> Items
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
        
                <div v-show="form === FORM.UPDATE_INFO" class="row justify-content-center">
                    <div class="col-lg-6">
                        
                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>
                        
                        <div class="mb-3 d-flex align-items-center">
                            <label class="form-label me-2 mb-0">Status:</label>
                            <div :class="{ [`badge bg-${osrivStatus.color}`]: true }">
                                {{ osrivStatus.label }}
                            </div>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                OSRIV Number
                            </label>
                            <input type="text" class="form-control" :value="osrivData.osriv_number" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="osrivData.date_requested" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Item From <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="stations" label="name" v-model="osrivData.item_from" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="osrivDataErrors.item_from"> {{ errorMsg }} </small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Purpose <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="osrivData.purpose" class="form-control" rows="3"> </textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner <span class="text-danger">*</span>
                            </label>
                            <input v-model="osrivData.requested_by.fullname" type="text" class="form-control">
                        </div>
        
        
        
                    </div>
                </div>

                <div v-show="form === FORM.UPDATE_APPROVERS" class="row justify-content-center">
                    <div class="col-lg-6">
                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Only pending status can be change
                            </small>
                        </div>

                        <WarehouseUpdateApprovers :approvers="approvers" :employees="employees" @change-approver="handleChangeApprover"/>
                    </div>
                </div>

                <div v-show="form === FORM.UPDATE_ITEMS" class="row justify-content-center">
                    items
                </div>
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': form === FORM.UPDATE_INFO || form === FORM.UPDATE_APPROVERS, 'col-12': form === FORM.UPDATE_ITEMS }">
        
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/osriv/view/${osrivData.id}`">
                                    <i class="fas fa-chevron-left"></i> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="form === FORM.UPDATE_INFO" @click="updateOsrivInfo()" type="button" class="btn btn-success"
                                    :disabled="isUpdating">
                                    <i class="fas fa-sync"></i> {{ isUpdating ? 'Updating...' : 'Update' }}
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
import { getFullname, formatToValidHtmlDate } from '~/utils/helpers'
import { useToast } from "vue-toastification";
import * as osrivApi from '~/composables/warehouse/osriv/osriv.api'
import { type OSRIV, type UpdateOsrivInput } from '~/composables/warehouse/osriv/osriv.types';
import { approvalStatus } from '~/utils/constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Station } from '~/composables/warehouse/station/station';

definePageMeta({
    name: ROUTES.OSRIV_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const enum FORM {
    UPDATE_INFO,
    UPDATE_APPROVERS,
    UPDATE_ITEMS,
}

const authUser = ref<AuthUser>({} as AuthUser)

// CONSTANTS
const errorMsg = 'This field is required'
const router = useRouter()

// DEPENDENCIES
const route = useRoute()
const toast = useToast();

// FLAGS
const isUpdating = ref(false)
const isLoadingPage = ref(true)

// INITIAL DATA
const _osrivDataErrorsInitial = {
    requested_by: false,
    purpose: false,
    item_from: false,
}

const form = ref<FORM>(FORM.UPDATE_INFO)

// DROPDOWNS
const employees = ref<Employee[]>([])
const stations = ref<Station[]>([])


// FORM DATA
const osrivDataErrors = ref({ ..._osrivDataErrorsInitial })
const osrivData = ref<OSRIV>({} as OSRIV)



// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await osrivApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.osriv) {
        return redirectTo401Page()
    }

    if (!response.osriv.can_update) {
        return redirectTo401Page()
    }

    populateForm(response.osriv)

    employees.value = addPropertyFullName(response.employees)

    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

const osrivStatus = computed(() => {

    const approvers = osrivData.value.osriv_approvers

    if (osrivData.value.cancelled_at) {

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

const approvers = computed( (): Approver[] => {

    return osrivData.value.osriv_approvers.map(i => {
        return {
            id: i.id,
            approver: i.approver,
            date_approval: i.date_approval,
            notes: i.notes,
            status: i.status,
            label: i.label,
            order: i.order,
        }
    })

})


// ======================== FUNCTIONS ========================  

function populateForm(data: OSRIV) {

    data.date_requested = formatToValidHtmlDate(data.date_requested)

    const requestedBy = data.requested_by
    requestedBy!['fullname'] = getFullname(requestedBy!.firstname, requestedBy!.middlename, requestedBy!.lastname)

    data.osriv_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })

    osrivData.value = data

}

async function updateOsrivInfo() {

    console.log('update')

    if (!isValidOsrivInfo()) {
        return
    }

    console.log('updating...')

    const data: UpdateOsrivInput = {
        purpose: osrivData.value.purpose,
        requested_by: osrivData.value.requested_by,
        item_from: osrivData.value.item_from,
    }

    isUpdating.value = true
    const response = await osrivApi.update(osrivData.value.id, osrivData.value)
    isUpdating.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        osrivData.value.osriv_approvers = response.data.osriv_approvers.map(i => {
            i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
            i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
            return i
        })

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

// ======================== CHILD EVENTS: <WarehouseApproverV2> ========================  

async function handleChangeApprover(payload: {currentApprover: Approver, newApprover: Employee}) {
    console.log('handleChangeApprover', payload);
}


// ======================== UTILS ========================  

function isValidOsrivInfo(): boolean {

    osrivDataErrors.value = { ..._osrivDataErrorsInitial }

    if(osrivData.value.purpose.trim() === '') {
        osrivDataErrors.value.purpose = true
    }

    if (!osrivData.value.requested_by) {
        osrivDataErrors.value.requested_by = true
    }

    if (!osrivData.value.item_from) {
        osrivDataErrors.value.item_from = true
    }

    const hasError = Object.values(osrivDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}

const onClickViewDetails = (id: string) => router.push('/warehouse/osriv/view/' + id)

</script>
