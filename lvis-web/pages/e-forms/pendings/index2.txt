<template>
    <div v-if="!isLoadingPage && authUser && authUser.user.user_employee">

        <div class="card">

            <div class="card-body">

                <h3 class="text-warning">Pending for Approval/Disapproval</h3>
                
                <hr>

                <div class="row justify-content-center pt-3">
                    <div class="col-lg-12">
        
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white"> No </th>
                                        <th class="bg-secondary text-white"> Transaction </th>
                                        <th class="bg-secondary text-white"> Date </th>
                                        <th class="text-center bg-secondary text-white">
                                            Approve / Disapprove
                                        </th>
                                    </tr>
                                </thead>
        
                                <tbody>
                                    <tr v-for="item, i in pendings" :key="i">
                                        <td class="text-muted align-middle"> {{ i + 1 }} </td>
                                        <td class="text-muted align-middle">
                                            {{ item.description }}
                                            <nuxt-link class="btn btn-outline-light btn-sm"
                                                :to="getLink(item.type, item.reference_id)" target="_blank">
                                                <small class="text-info fst-italic"> View details </small>
                                            </nuxt-link>
                                        </td>
                                        <td class="text-muted align-middle"> {{ formatDate(item.transaction_date) }} </td>
                                        <td v-if="!isDefaultApproval(item)" class="text-center align-middle">
                                            <button @click="onClickApprove(i)" class="btn btn-light w-50" data-bs-toggle="modal"
                                                data-bs-target="#pendingModal">
                                                <i class="fas fa-check-circle text-success"></i>
                                            </button>
                                            <!-- <button @click="onClickDisapprove(i)" class="btn btn-light w-50"
                                                data-bs-toggle="modal" data-bs-target="#pendingModal">
                                                <i class="fas fa-times-circle text-danger"></i>
                                            </button> -->
                                            <button @click="onDefaultDisapprove(i)" class="btn btn-light w-50">
                                                <i class="fas fa-times-circle text-danger"></i>
                                            </button>
                                        </td>
                                        <td v-else class="text-center align-middle">
                                            <button @click="onDefaultApprove(i)" class="btn btn-light w-50">
                                                <i class="fas fa-check-circle text-success"></i>
                                            </button>
                                            <button @click="onDefaultDisapprove(i)" class="btn btn-light w-50">
                                                <i class="fas fa-times-circle text-danger"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
        
                            </table>
                        </div>
        
                    </div>
                </div>
        
                <EformsPendingModal v-if="isBudgetOfficer || isFinanceManager" :employee="authUser.user.user_employee.employee"
                    :pending-approval="modalData.pendingApproval" :pending-transaction="modalData.pendingTransaction"
                    :accounts="accounts" :classifications="classifications" :is-approving="isApproving"
                    :is-disapproving="isDisapproving" @approve-budget-officer="onApproveBudgetOfficer"
                    @disapprove-budget-officer="onDisapproveBudgetOfficer" @approve-finance-manager="onApproveFinanceManager"
                    @disapprove-finance-manager="onDisapproveFinanceManager" />
    
            </div>

        </div>

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>
</template>


<script setup lang="ts">

definePageMeta({
    layout: "layout-e-form"
})

import { PENDING_APPROVAL_TYPE, PENDING_TRANSACTION, type PendingApproval } from '~/composables/e-forms/pendings/pendings.types';
import * as pendingsApi from '~/composables/e-forms/pendings/pendings.api'
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";
import { APPROVAL_STATUS, type AuthUser } from '#imports';
import type { Account } from '~/composables/system/account/account';
import type { Classification } from '~/composables/system/classification/classification';

const isLoadingPage = ref(true)
const isApproving = ref(false)
const isDisapproving = ref(false)


const authUser = ref<AuthUser>()
const toast = useToast();
const pendings = ref<PendingApproval[]>([])
const classifications = ref<Classification[]>([])
const accounts = ref<Account[]>([])

type ModalData = {
    pendingTransaction: PENDING_TRANSACTION,
    pendingApproval: PendingApproval | null,
    accounts: Account[],
    classifications: Classification[]
}

const modalData = ref<ModalData>({
    pendingTransaction: PENDING_TRANSACTION.APPROVE,
    pendingApproval: null,
    accounts: [],
    classifications: []
})

onMounted(async () => {
    authUser.value = getAuthUser()
    console.log('authUser', authUser)

    if (authUser.value.user.user_employee) {

        if (!!authUser.value.user.user_employee.employee.is_budget_officer) {
            console.log('is budget officer')
            const response = await pendingsApi.fetchDataForBudgetOfficer(authUser.value.user.user_employee.employee.id)
            pendings.value = response.pendings
            classifications.value = response.classifications

        } else if (!!authUser.value.user.user_employee.employee.is_finance_manager) {
            console.log('is finance manager')
            const response = await pendingsApi.fetchDataForFinanceManager(authUser.value.user.user_employee.employee.id)
            pendings.value = response.pendings
            accounts.value = response.accounts

        } else {
            console.log('is normal approver')
            const response = await pendingsApi.getPendingsByEmployeeId(authUser.value.user.user_employee.employee.id)
            pendings.value = response.pendings
        }

        updateTotalPendingsOfUser(authUser.value, pendings.value.length)

        isLoadingPage.value = false

    }


})

const isBudgetOfficer = computed(() => {
    if (!authUser.value) return
    if (!authUser.value.user.user_employee) return
    return !!authUser.value.user.user_employee.employee.is_budget_officer
})

const isFinanceManager = computed(() => {
    if (!authUser.value) return
    if (!authUser.value.user.user_employee) return
    return !!authUser.value.user.user_employee.employee.is_finance_manager
})

function updateTotalPendingsOfUser(authUser: AuthUser, totalPendings: number) {
    console.log('updateTotalPendingsOfUser()', authUser, totalPendings)
    authUser.user.user_employee!.employee.total_pending_approvals = totalPendings
    const updatedAuthUser = JSON.stringify(authUser)
    localStorage.setItem('authUser', updatedAuthUser);
}

function isDefaultApproval(pending: PendingApproval) {

    const pendingIsJO = pending.type === PENDING_APPROVAL_TYPE.JO
    const pendingIsRV = pending.type === PENDING_APPROVAL_TYPE.RV
    const pendingIsSPR = pending.type === PENDING_APPROVAL_TYPE.SPR
    const pendingIsPO = pending.type === PENDING_APPROVAL_TYPE.PO

    if (isBudgetOfficer.value && (pendingIsJO || pendingIsRV || pendingIsSPR)) {
        return false
    }

    if (isFinanceManager.value && pendingIsPO) {
        return false
    }

    return true

}

function getLink(type: PENDING_APPROVAL_TYPE, id: string) {

    if (type === PENDING_APPROVAL_TYPE.RV) {
        return '/warehouse/purchasing/rv/view/' + id
    }

    if (type === PENDING_APPROVAL_TYPE.SPR) {
        return '/warehouse/purchasing/spr/view/' + id
    }

    if (type === PENDING_APPROVAL_TYPE.JO) {
        return '/warehouse/purchasing/jo/view/' + id
    }

    if (type === PENDING_APPROVAL_TYPE.MEQS) {
        return '/warehouse/purchasing/meqs/view/' + id
    }

    if (type === PENDING_APPROVAL_TYPE.PO) {
        return '/warehouse/purchasing/po/view/' + id
    }

    if (type === PENDING_APPROVAL_TYPE.RR) {
        return '/warehouse/purchasing/rr/view/' + id
    }

}

function onClickApprove(indx: number) {
    console.log('onClickApprove', indx)
    const item = pendings.value[indx]

    modalData.value.pendingApproval = item
    modalData.value.pendingTransaction = PENDING_TRANSACTION.APPROVE
}

function onClickDisapprove(indx: number) {
    console.log('onClickApprove', indx)
    const item = pendings.value[indx]

    modalData.value.pendingApproval = item
    modalData.value.pendingTransaction = PENDING_TRANSACTION.DISAPPROVE
}

async function onApproveBudgetOfficer(payload: {
    pendingApproval: PendingApproval,
    classification: Classification,
    remarks: string
}, closeBtnModal: HTMLButtonElement) {
    console.log('onApproveBudgetOfficer', payload)


    const indx = pendings.value.findIndex(i => i.id === payload.pendingApproval.id)

    if (indx === -1) {
        console.error('pending approval not found with id of ', payload.pendingApproval.id)
        return
    }

    let mutationName = ''

    if (payload.pendingApproval.type === PENDING_APPROVAL_TYPE.RV) {
        mutationName = 'update_rv_classification_and_rv_approver'
    } else if (payload.pendingApproval.type === PENDING_APPROVAL_TYPE.SPR) {
        mutationName = 'update_spr_classification_and_spr_approver'
    } else if (payload.pendingApproval.type === PENDING_APPROVAL_TYPE.JO) {
        mutationName = 'update_jo_classification_and_jo_approver'
    } else {
        toast.error('Budget Officer can only approve RV, SPR, and JO')
        return
    }

    // reference id is either rv_id, spr_id, jo_id

    const data = {
        id: payload.pendingApproval.reference_id,
        classificationId: payload.classification.id,
        notes: payload.remarks,
        status: APPROVAL_STATUS.APPROVED
    }

    isApproving.value = true
    const response = await pendingsApi.update_classification_and_approver(mutationName, data)
    isApproving.value = false

    if (response.success) {

        Swal.fire({
            title: 'Approved!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        });

        pendings.value.splice(indx, 1)

        updateTotalPendingsOfUser(authUser.value!, pendings.value.length)

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

    closeBtnModal.click()

}

async function onDisapproveBudgetOfficer(payload: {
    pendingApproval: PendingApproval,
    classification: Classification,
    remarks: string
}, closeBtnModal: HTMLButtonElement) {
    console.log('onDisapproveBudgetOfficer', payload)


    const indx = pendings.value.findIndex(i => i.id === payload.pendingApproval.id)

    if (indx === -1) {
        console.error('pending approval not found with id of ', payload.pendingApproval.id)
        return
    }

    let mutationName = ''

    if (payload.pendingApproval.type === PENDING_APPROVAL_TYPE.RV) {
        mutationName = 'update_rv_classification_and_rv_approver'
    } else if (payload.pendingApproval.type === PENDING_APPROVAL_TYPE.SPR) {
        mutationName = 'update_spr_classification_and_spr_approver'
    } else if (payload.pendingApproval.type === PENDING_APPROVAL_TYPE.JO) {
        mutationName = 'update_jo_classification_and_jo_approver'
    } else {
        toast.error('Budget Officer can only disapprove RV, SPR, and JO')
        return
    }

    // reference id is either rv_id, spr_id, jo_id

    const data = {
        id: payload.pendingApproval.reference_id,
        classificationId: payload.classification.id,
        notes: payload.remarks,
        status: APPROVAL_STATUS.DISAPPROVED
    }

    isDisapproving.value = true
    const response = await pendingsApi.update_classification_and_approver(mutationName, data)
    isDisapproving.value = false

    if (response.success) {

        Swal.fire({
            title: 'Disapproved!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        });

        pendings.value.splice(indx, 1)

        updateTotalPendingsOfUser(authUser.value!, pendings.value.length)

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

    closeBtnModal.click()

}

async function onApproveFinanceManager(payload: {
    pendingApproval: PendingApproval,
    fundSource: Account,
    remarks: string
}, closeBtnModal: HTMLButtonElement) {
    console.log('onApproveFinanceManager', payload)


    const indx = pendings.value.findIndex(i => i.id === payload.pendingApproval.id)

    if (indx === -1) {
        console.error('pending approval not found with id of ', payload.pendingApproval.id)
        return
    }

    let mutationName = 'update_po_fund_source_and_po_approver'

    const data = {
        id: payload.pendingApproval.reference_id,
        fundSourceId: payload.fundSource.id,
        notes: payload.remarks,
        status: APPROVAL_STATUS.APPROVED
    }

    isApproving.value = true
    const response = await pendingsApi.update_fund_source_and_po_approver(mutationName, data)
    isApproving.value = false

    if (response.success) {

        Swal.fire({
            title: 'Approved!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        });

        pendings.value.splice(indx, 1)

        updateTotalPendingsOfUser(authUser.value!, pendings.value.length)

    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

    closeBtnModal.click()

}

async function onDisapproveFinanceManager(payload: {
    pendingApproval: PendingApproval,
    fundSource: Account,
    remarks: string
}, closeBtnModal: HTMLButtonElement) {
    console.log('onDisapproveFinanceManager', payload)


    const indx = pendings.value.findIndex(i => i.id === payload.pendingApproval.id)

    if (indx === -1) {
        console.error('pending approval not found with id of ', payload.pendingApproval.id)
        return
    }

    let mutationName = 'update_po_fund_source_and_po_approver'

    const data = {
        id: payload.pendingApproval.reference_id,
        fundSourceId: payload.fundSource.id,
        notes: payload.remarks,
        status: APPROVAL_STATUS.DISAPPROVED
    }

    isDisapproving.value = true
    const response = await pendingsApi.update_fund_source_and_po_approver(mutationName, data)
    isDisapproving.value = false

    if (response.success) {

        Swal.fire({
            title: 'Disapproved!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        });

        pendings.value.splice(indx, 1)

        updateTotalPendingsOfUser(authUser.value!, pendings.value.length)


    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

    closeBtnModal.click()

}

function onDefaultApprove(indx: number) {

    const item = pendings.value[indx]
    const status = APPROVAL_STATUS.APPROVED

    Swal.fire({
        title: "Approve Confirmation",
        text: `Are you sure you want to approve transaction ${item.description}?`,
        input: 'text',
        inputPlaceholder: 'Enter remarks (optional)...',
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Approve!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async (confirm) => {

            const inputValue = Swal.getInput()?.value;
            const notes = inputValue || '';

            await executeTransaction(item.type, indx, {
                id: item.id,
                notes,
                status
            })

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

function onDefaultDisapprove(indx: number) {

    const item = pendings.value[indx]
    const status = APPROVAL_STATUS.DISAPPROVED


    Swal.fire({
        title: "Disapprove Confirmation",
        text: `Are you sure you want to disapprove transaction ${item.description}?`,
        input: 'text',
        inputPlaceholder: 'Enter remarks...',
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74a3b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Disapprove!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to enter a remark!';
            }
        },
        preConfirm: async (confirm) => {

            const inputValue = Swal.getInput()?.value;
            const notes = inputValue || '';

            await executeTransaction(item.type, indx, {
                id: item.id,
                notes,
                status
            })

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function executeTransaction(type: PENDING_APPROVAL_TYPE, indx: number, payload: {
    id: string,
    status: APPROVAL_STATUS,
    notes: string
}) {

    console.log('executeTransaction', type, indx, payload)

    let response

    if (type === PENDING_APPROVAL_TYPE.RV) {
        response = await pendingsApi.updateStatus('updateRvApprover', payload)
    } else if (type === PENDING_APPROVAL_TYPE.SPR) {
        response = await pendingsApi.updateStatus('updateSprApprover', payload)
    } else if (type === PENDING_APPROVAL_TYPE.JO) {
        response = await pendingsApi.updateStatus('updateJoApprover', payload)
    } else if (type === PENDING_APPROVAL_TYPE.MEQS) {
        response = await pendingsApi.updateStatus('updateMeqsApprover', payload)
    } else if (type === PENDING_APPROVAL_TYPE.PO) {
        response = await pendingsApi.updateStatus('updatePoApprover', payload)
    } else if (type === PENDING_APPROVAL_TYPE.RR) {
        response = await pendingsApi.updateStatus('updateRrApprover', payload)
    }

    if (!response) return


    if (response.success) {

        Swal.fire({
            title: 'Approved!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        });

        pendings.value.splice(indx, 1)

        updateTotalPendingsOfUser(authUser.value!, pendings.value.length)

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