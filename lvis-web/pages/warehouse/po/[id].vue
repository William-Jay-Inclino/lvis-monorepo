<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser && poData && poData.meqs_supplier && !poData.cancelled_at">
                <h2 class="text-warning">Update PO</h2>
                <hr>

                <div v-show="isPODetailForm" class="row justify-content-center">

                    <div class="col-lg-6">

                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>

                        <div class="mb-3 d-flex align-items-center">
                            <label class="form-label me-2 mb-0">Status:</label>
                            <div :class="{ [`badge bg-${poStatus.color}`]: true }">
                                {{ poStatus.label }}
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">PO Number</label>
                            <input type="text" class="form-control" :value="poData.po_number" disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/po/view/' + poData.id" target="_blank">View PO
                                details</nuxt-link>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">MEQS Number</label>
                            <input type="text" class="form-control" :value="poData.meqs_supplier.meqs!.meqs_number"
                                disabled>
                            <nuxt-link class="btn btn-sm btn-light text-primary"
                                :to="'/warehouse/meqs/view/' + poData.meqs_supplier.meqs!.id"
                                target="_blank">View
                                MEQS details</nuxt-link>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Supplier</label>
                            <input type="text" class="form-control" :value="poData.meqs_supplier.supplier!.name"
                                disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">VAT</label>
                            <div class="fst-italic text-warning"> {{ poData.meqs_supplier.supplier?.is_vat_registered ?
                'VAT Registered' : 'Non-VAT Registered' }} </div>
                        </div>

                        <div class="mb-3" v-if="isAdmin(authUser)">
                            <label class="form-label">Fund Source</label>
                            <client-only>
                                <v-select :options="accounts" label="name" v-model="poData.fund_source"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Notes</label>
                            <textarea v-model="poData.notes" class="form-control" rows="3"></textarea>
                        </div>

                    </div>

                </div>


                <!-- <div v-show="!isPODetailForm" class="row justify-content-center pt-5">

                    <div class="col-12">
                        <WarehouseApprover :approvers="poData.po_approvers" :employees="employees"
                            :isUpdatingApproverOrder="isUpdatingApproverOrder" :isAddingApprover="isAddingApprover"
                            :isEditingApprover="isEditingApprover" @changeApproverOrder="changeApproverOrder"
                            @addApprover="addApprover" @editApprover="editApprover" @removeApprover="removeApprover" @searched-employees="handleSearchedEmployees"/>
                    </div>

                </div> -->


                <div class="row justify-content-center pt-3">
                    <div :class="{ 'col-lg-6': isPODetailForm, 'col-12': !isPODetailForm }">
                        <div class="d-flex justify-content-between pt-3">
                            <div>
                                <nuxt-link class="btn btn-secondary" :to="`/warehouse/po/view/${poData.id}`">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Go Back
                                </nuxt-link>
                            </div>
                            <div>
                                <button v-if="isPODetailForm" @click="updatePoInfo()" type="button"
                                    class="btn btn-success" :disabled="isUpdating">
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
import { getFullname, formatToValidHtmlDate } from '~/utils/helpers'
import { useToast } from "vue-toastification";
import type { PO, UpdatePoInput } from '~/composables/warehouse/po/po.types';
import * as poApi from '~/composables/warehouse/po/po.api'
import * as poApproverApi from '~/composables/warehouse/po/po-approver.api'
import type { Account } from '~/composables/system/account/account';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';

definePageMeta({
    name: ROUTES.PO_UPDATE,
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
const isPODetailForm = ref(true)
const isUpdating = ref(false)
const isUpdatingApproverOrder = ref(false)
const isAddingApprover = ref(false)
const isEditingApprover = ref(false)

const poData = ref<PO>({} as PO)

const employees = ref<Employee[]>([])
const accounts = ref<Account[]>([])

// ======================== LIFECYCLE HOOKS ========================  

onMounted(async () => {
    authUser.value = getAuthUser()

    let response = await poApi.fetchFormDataInUpdate(route.params.id as string)

    if (!response.po) {
        return redirectTo401Page()
    }

    if (!response.po.can_update) {
        redirectTo401Page()
    }

    populateForm(response.po)

    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

    accounts.value = response.accounts

    isLoadingPage.value = false

})


// ======================== COMPUTED ========================  

const poStatus = computed(() => {

    const approvers = poData.value.po_approvers

    if (poData.value.cancelled_at) {

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
function populateForm(data: PO) {
    console.log('populateForm', data)
    poData.value = data

    data.po_approvers.map(i => {
        i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
        i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
        return i
    })
}

async function updatePoInfo() {
    console.log('updatePoInfo')

    console.log('updating...')

    const data: UpdatePoInput = {
        notes: poData.value.notes,
        fund_source: poData.value.fund_source,
    }

    isUpdating.value = true
    const response = await poApi.update(poData.value.id, data)
    isUpdating.value = false

    if (response.success && response.data) {
        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/po/view/${response.data.id}`);

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}

// handle searched employees from child component (Approver) 
async function handleSearchedEmployees(searchedEmployees: Employee[]) {
    employees.value = addPropertyFullName(searchedEmployees)
}

// ======================== CHILD EVENTS: <WarehouseApprover> ========================  

async function addApprover(
    data: CreateApproverInput,
    modalCloseBtn: HTMLButtonElement
) {
    console.log('data', data)

    isAddingApprover.value = true
    const response = await poApproverApi.create(poData.value.id, data)
    isAddingApprover.value = false

    if (response.success && response.data) {
        toast.success(response.msg)

        const approver = response.data.approver

        approver!.fullname = getFullname(approver!.firstname, approver!.middlename, approver!.lastname)

        response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval, true) : null

        poData.value.po_approvers.push(response.data)
        modalCloseBtn.click()
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}

async function editApprover(
    data: UpdateApproverInput,
    modalCloseBtn: HTMLButtonElement
) {
    isEditingApprover.value = true
    const response = await poApproverApi.update(data)
    isEditingApprover.value = false

    if (response.success && response.data) {
        toast.success(response.msg)

        const prevApproverItemIndx = poData.value.po_approvers.findIndex(i => i.id === data.id)

        response.data.date_approval = response.data.date_approval ? formatToValidHtmlDate(response.data.date_approval, true) : null

        const a = response.data.approver

        response.data.approver!['fullname'] = getFullname(a!.firstname, a!.middlename, a!.lastname)

        poData.value.po_approvers[prevApproverItemIndx] = { ...response.data }

        modalCloseBtn.click()

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}

async function removeApprover(id: string) {
    const indx = poData.value.po_approvers.findIndex(i => i.id === id)

    const item = poData.value.po_approvers[indx]

    if (!item) {
        console.error('approver not found with id of: ' + id)
        return
    }

    Swal.fire({
        title: "Are you sure?",
        text: `${item.approver?.fullname} will be removed!`,
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (remove) => {

            if (remove) {
                const response = await poApproverApi.remove(item.id)

                if (response.success) {

                    toast.success(`${item.approver?.fullname} removed!`)

                    poData.value.po_approvers.splice(indx, 1)

                } else {

                    Swal.fire({
                        title: 'Error!',
                        text: response.msg,
                        icon: 'error',
                        position: 'top',
                    })

                }
            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

async function changeApproverOrder(
    data: { id: string, order: number }[],
    modalCloseBtn: HTMLButtonElement
) {
    console.log('data', data)
    console.log('modalCloseBtn', modalCloseBtn)

    isUpdatingApproverOrder.value = true
    const response = await poApproverApi.updateApproverOrder(data)
    isUpdatingApproverOrder.value = false

    if (response.success && response.approvers) {
        toast.success(response.msg)

        poData.value.po_approvers = response.approvers.map(i => {
            i.date_approval = i.date_approval ? formatToValidHtmlDate(i.date_approval, true) : null
            i.approver!['fullname'] = getFullname(i.approver!.firstname, i.approver!.middlename, i.approver!.lastname)
            return i
        })
        modalCloseBtn.click()

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}



</script>