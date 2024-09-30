<template>
    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && osrivData && !osrivData.cancelled_at" class="mb-3">
                <h2 class="text-warning">Update OSRIV</h2>
                <hr>
        
                <div v-show="isOSRIVDetailForm" class="row justify-content-center">
                    <div class="col-lg-6">
        
        
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
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/osriv/view/' + osrivData.id" target="_blank">View OSRIV details</nuxt-link>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Date
                            </label>
                            <input type="date" class="form-control" :value="osrivData.date_requested" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Requisitioner
                            </label>
                            <input :value="osrivData.requested_by.fullname" type="text" class="form-control" disabled>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Purpose
                            </label>
                            <textarea :value="osrivData.purpose" class="form-control" rows="3" disabled> </textarea>
                        </div>
        
        
                    </div>
                </div>
        
        
                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': isOSRIVDetailForm, 'col-12': !isOSRIVDetailForm }">
        
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" to="/warehouse/osriv">
                                    <i class="fas fa-chevron-left"></i> Back to Search
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="isOSRIVDetailForm" @click="updateOsrivInfo()" type="button" class="btn btn-success"
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

definePageMeta({
    name: ROUTES.OSRIV_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// DEPENDENCIES
const route = useRoute()
const toast = useToast();

// FLAGS
const isOSRIVDetailForm = ref(true)
const isUpdating = ref(false)

// INITIAL DATA
const _osrivDataErrorsInitial = {
    requested_by: false,
    purpose: false,
    item_from: false,
}

// DROPDOWNS
const employees = ref<Employee[]>([])


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

</script>
