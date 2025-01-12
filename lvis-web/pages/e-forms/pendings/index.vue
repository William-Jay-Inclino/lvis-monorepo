<template>
    <div v-if="!isLoadingPage && authUser && authUser.user.user_employee">

        <div class="row mb-3 mt-3">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <h4 class="text-warning"> Search Transaction </h4>
                    </div>
                    <div class="card-body">
                        <input type="text" v-model="searchValue" class="form-control">
                        <small class="text-muted fst-italic">Enter transaction details above</small>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!isMobile" class="card">

            <div class="card-body">

                <div class="row justify-content-center pt-3">
                    <div class="col-lg-12">
        
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white"> No </th>
                                        <th class="bg-secondary text-white"> Transaction </th>
                                        <th class="bg-secondary text-white"> Date </th>
                                        <th class="bg-secondary text-white"> Your Comment </th>
                                        <th class="text-center bg-secondary text-white">
                                            Approve / Disapprove
                                        </th>
                                    </tr>
                                </thead>
        
                                <tbody>
                                    <tr v-for="item, i in filteredItems" :key="i">
                                        <td class="text-muted align-middle"> {{ i + 1 }} </td>
                                        <td class="text-muted align-middle">
                                            {{ item.description }}
                                            <nuxt-link class="btn btn-outline-light btn-sm"
                                                :to="getLink(item.reference_table, item.reference_number)" target="_blank">
                                                <small class="text-primary fst-italic"> View details </small>
                                            </nuxt-link>
                                        </td>
                                        <td class="text-muted align-middle"> {{ formatDate(item.transaction_date, true) }} </td>
                                        <td width="30%" class="align-middle">
                                            <EformsComment
                                                :pending_id="item.id"
                                                :is_editing="item.is_editing"
                                                :is_saving="item.is_saving"
                                                :notes="item.approver_notes" 
                                                @start-edit="handleStartEditComment"
                                                @cancel="handleCancelEditComment"
                                                @save="handleSaveComment"
                                            />
                                        </td>
                                        <td v-if="!isDefaultApproval(item)" class="text-center align-middle">
                                            <div class="d-flex w-100">
                                                <button 
                                                    :data-testid="`test-${item.reference_table}-${item.reference_number}`"
                                                    @click="onClickApprove(item.id)" 
                                                    class="btn btn-light text-success w-50 me-2" 
                                                    data-bs-toggle="modal" 
                                                    data-bs-target="#pendingModal">
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'check-circle']" />
                                                    </client-only> 
                                                    Approve
                                                </button>
                                                <button 
                                                    @click="handleCommonDisapprove(item.id)" 
                                                    class="btn btn-light text-danger w-50"
                                                >
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'times-circle']" />
                                                    </client-only> 
                                                    Disapprove
                                                </button>
                                            </div>
                                        </td>
                                        <td v-else class="text-center align-middle">
                                            <div class="d-flex w-100">
                                                <button
                                                    :data-testid="`test-${item.reference_table}-${item.reference_number}`"
                                                    @click="handleCommonApprove(item.id)"
                                                    class="btn btn-light text-success w-50 me-2"
                                                >
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'check-circle']" />
                                                    </client-only> Approve
                                                </button>
                                                <button 
                                                    @click="handleCommonDisapprove(item.id)" 
                                                    class="btn btn-light text-danger w-50"
                                                >
                                                    <client-only>
                                                        <font-awesome-icon :icon="['fas', 'times-circle']" />
                                                    </client-only> 
                                                    Disapprove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
        
                            </table>
                        </div>
        
                    </div>
                </div>
    
            </div>

        </div>

        <div v-else class="pt-2">
            
            <div class="card mb-3" v-for="item, i in filteredItems" :key="i">
                <div class="card-header bg-secondary text-white fw-bold">
                    Pending # {{ i + 1 }}
                </div>
                <div class="card-body">
                    <table class="table">
                        <tbody>
                            <tr>
                                <td>Transaction:</td>
                                <td class="text-primary">
                                    <nuxt-link
                                        :to="getLink(item.reference_table, item.reference_number)" target="_blank">
                                        {{ item.description }}
                                    </nuxt-link>
                                </td>
                            </tr>
                            <tr>
                                <td>Date:</td>
                                <td class="text-muted">
                                    {{ formatDate(item.transaction_date, true) }}
                                </td>
                            </tr>
                            <tr>
                                <td>Comment:</td>
                                <td class="text-muted">
                                    <EformsComment
                                        :pending_id="item.id"
                                        :is_editing="item.is_editing"
                                        :is_saving="item.is_saving"
                                        :notes="item.approver_notes" 
                                        @start-edit="handleStartEditComment"
                                        @cancel="handleCancelEditComment"
                                        @save="handleSaveComment"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="!isDefaultApproval(item)" class="card-footer d-flex justify-content-between">
                    <button 
                        :data-testid="`test-${item.reference_table}-${item.reference_number}`"
                        @click="onClickApprove(item.id)" 
                        class="btn btn-primary text-success" 
                        data-bs-toggle="modal" 
                        data-bs-target="#pendingModal">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'check-circle']" />
                        </client-only> 
                        Approve
                    </button>
                    <button 
                        @click="handleCommonDisapprove(item.id)" 
                        class="btn btn-light text-danger"
                    >
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'times-circle']" />
                        </client-only> 
                        Disapprove
                    </button>
                </div>
                <div v-else class="card-footer d-flex justify-content-between">
                    <button
                        :data-testid="`test-${item.reference_table}-${item.reference_number}`"
                        @click="handleCommonApprove(item.id)"
                        class="btn btn-light text-success"
                    >
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'check-circle']" />
                        </client-only> Approve
                    </button>
                    <button 
                        @click="handleCommonDisapprove(item.id)" 
                        class="btn btn-light text-danger"
                    >
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'times-circle']" />
                        </client-only> 
                        Disapprove
                    </button>
                </div>
            </div>
        </div>

        <EformsPendingModal v-if="isBudgetOfficer || isFinanceManager" 
            :employee="authUser.user.user_employee.employee"
            :pending-approval="modalData.pendingApproval"
            :accounts="accounts" 
            :classifications="classifications" 
            :is-approving="isApproving"
            @approve-budget-officer="handleApproveBudgetOfficer" 
            @approve-finance-manager="handleApproveFinanceManager"
            @search-accounts="handleSearchedAccounts"
            @search-classifications="handleSearchedClassifications"
        />

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>
</template>


<script setup lang="ts">

definePageMeta({
    layout: "layout-e-form"
})

import { type Pending } from '~/composables/notifications/pendings.types';
import * as pendingsApi from '~/composables/notifications/pendings.api'
import Swal from 'sweetalert2'
import type { Account } from '~/composables/accounting/account/account';
import type { Classification } from '~/composables/accounting/classification/classification';
import { MODULE_MAPPER } from '~/utils/constants';
import { fetchTotalNotifications } from '~/composables/system/user/user.api';
import { useToast } from "vue-toastification";

const isLoadingPage = ref(true)
const isApproving = ref(false)
const config = useRuntimeConfig()
const WAREHOUSE_API_URL = config.public.warehouseApiUrl

const authUser = ref<AuthUser>()
const pendings = ref<Pending[]>([])
const classifications = ref<Classification[]>([])
const accounts = ref<Account[]>([])
const toast = useToast();

const screenWidth = ref(0);
const searchValue = ref('')

type ModalData = {
    pendingApproval: Pending | null,
    accounts: Account[],
    classifications: Classification[]
}

interface ApprovalProps {
    pendingApproval: Pending,
    classification?: Classification,
    fundSource?: Account,
    remarks: string,
    closeBtnModal: HTMLButtonElement
    status: 'approve' | 'disapprove'
    approvePending: () => Promise<{success: boolean, msg: string}>
}

const modalData = ref<ModalData>({
    pendingApproval: null,
    accounts: [],
    classifications: []
})

onMounted(async () => {
    authUser.value = getAuthUser()
    console.log('authUser', authUser)

    screenWidth.value = window.innerWidth;

    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth;
    });

    if (authUser.value.user.user_employee) {

        const response = await pendingsApi.getPendingsByEmployeeId(authUser.value.user.user_employee.employee.id)
        pendings.value = response.pendings.map(i => ({...i, is_editing: false, is_saving: false}))
        classifications.value = response.classifications
        accounts.value = response.accounts
        // updateTotalPendingsOfUser(authUser.value, pendings.value.length)
        isLoadingPage.value = false
    }


})


// ================================== COMPUTED ================================== 

const isMobile = computed(() => screenWidth.value <= MOBILE_WIDTH);

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

const filteredItems = computed(() => {

    if (searchValue.value.trim() === '') return pendings.value

    return pendings.value.filter(i => i.description.toLowerCase().includes(searchValue.value.toLowerCase()))

})

// ================================== FUNCTIONS ================================== 

function getLink(entity: DB_ENTITY, reference_number: string) {
    const module = MODULE_MAPPER[entity]

    const is_purchasing = entity === DB_ENTITY.RV || entity === DB_ENTITY.SPR || entity === DB_ENTITY.JO || entity === DB_ENTITY.MEQS || entity === DB_ENTITY.PO
    const is_warehousing = entity === DB_ENTITY.RR || entity === DB_ENTITY.OSRIV || entity === DB_ENTITY.SERIV || entity === DB_ENTITY.MRV || entity === DB_ENTITY.MCT || entity === DB_ENTITY.MCRT || entity === DB_ENTITY.MST
    const is_motorpool = entity === DB_ENTITY.GAS_SLIP || entity === DB_ENTITY.TRIP_TICKET

    if(is_purchasing) {
        return `/purchase/${module}/view/` + reference_number
    }

    if(is_warehousing) {
        return `/warehouse/${module}/view/` + reference_number
    }

    if(is_motorpool) {
        return `/motorpool/${module}/view/` + reference_number
    }

    console.error('Route undefined');
    return 'javascript:void(0)'
}

function isDefaultApproval(pending: Pending) {

    const pendingIsJO = pending.reference_table === DB_ENTITY.JO
    const pendingIsRV = pending.reference_table === DB_ENTITY.RV
    const pendingIsSPR = pending.reference_table === DB_ENTITY.SPR
    const pendingIsPO = pending.reference_table === DB_ENTITY.PO

    if (isBudgetOfficer.value && (pendingIsJO || pendingIsRV || pendingIsSPR)) {
        return false
    }

    if (isFinanceManager.value && pendingIsPO) {
        return false
    }

    return true

}

async function updateTotalNotifications() {
    console.log('updateTotalNotifications');
    
    if(!authUser.value) return 

    if(authUser.value.user.user_employee) {
        const response = await fetchTotalNotifications(authUser.value.user.user_employee.employee_id, WAREHOUSE_API_URL)
        if(response !== undefined) {
            authUser.value.user.user_employee.employee.total_pending_approvals = response
            const newAuthUser = JSON.stringify(authUser.value);
            localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, newAuthUser);
        }
    }

}

function onClickApprove(id: number) {
    console.log('onClickApprove', id)

    const item = pendings.value.find(i => i.id === id)

    if(!item) {
        console.error('Item not found in pendings', id);
        return 
    }

    modalData.value.pendingApproval = item
}

function handleCommonApprove(id: number) {

    const item = pendings.value.find(i => i.id === id)

    if(!item) {
        console.error('Item not found in pendings', id);
        return 
    }

    Swal.fire({
        title: "Approve Confirmation",
        text: `Are you sure you want to approve transaction ${item.description}?`,
        input: 'text',
        inputValue: item.approver_notes || '', 
        inputPlaceholder: 'Add Comment (optional)...',
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

            const response = await pendingsApi.approvePending({
                id: item.id,
                remarks: notes,
            })

            if (response.success) {

                Swal.fire({
                    text: response.msg,
                    icon: 'success',
                    position: 'top',
                });

                await updateTotalNotifications()

                removePending(item.id)
                // pendings.value.splice(indx, 1)

                // updateTotalPendingsOfUser(authUser.value!, pendings.value.length)

                } else {

                Swal.fire({
                    title: 'Error!',
                    text: response.msg,
                    icon: 'error',
                    position: 'top',
                })

            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

function handleCommonDisapprove(id: number) {

    const item = pendings.value.find(i => i.id === id)

    if(!item) {
        console.error('Item not found in pendings', id);
        return 
    }

    Swal.fire({
        title: "Disapprove Confirmation",
        text: `Are you sure you want to disapprove transaction ${item.description}?`,
        input: 'text',
        inputValue: item.approver_notes || '',
        inputPlaceholder: 'Add Comment...',
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

            const response = await pendingsApi.disapprovePending({
                id: item.id,
                remarks: notes,
            })

            if (response.success) {

                Swal.fire({
                    text: response.msg,
                    icon: 'success',
                    position: 'top',
                });

                await updateTotalNotifications()

                removePending(item.id)

                // pendings.value.splice(indx, 1)

                // updateTotalPendingsOfUser(authUser.value!, pendings.value.length)

                } else {

                Swal.fire({
                    title: 'Error!',
                    text: response.msg,
                    icon: 'error',
                    position: 'top',
                })

            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

async function handleApproveBudgetOfficer(payload: {
    pendingApproval: Pending,
    classification: Classification,
    remarks: string
}, closeBtnModal: HTMLButtonElement) {
    console.log('handleApproveBudgetOfficer', payload)

    const data: ApprovalProps = {
        pendingApproval: payload.pendingApproval,
        classification: payload.classification,
        remarks: payload.remarks,
        closeBtnModal,
        status: 'approve',
        approvePending: () => pendingsApi.approvePending({
            id: payload.pendingApproval.id,
            remarks: payload.remarks,
            classification_id: payload.classification.id
        })
    }

    await handleApproveWithUpdates(data)

}

async function handleApproveFinanceManager(payload: {
    pendingApproval: Pending,
    fundSource: Account,
    remarks: string
}, closeBtnModal: HTMLButtonElement) {
    console.log('handleApproveFinanceManager', payload)

    const data: ApprovalProps = {
        pendingApproval: payload.pendingApproval,
        fundSource: payload.fundSource,
        remarks: payload.remarks,
        closeBtnModal,
        status: 'approve',
        approvePending: () => pendingsApi.approvePending({
            id: payload.pendingApproval.id,
            remarks: payload.remarks,
            fund_source_id: payload.fundSource.id
        })
    }

    await handleApproveWithUpdates(data)

}

// this is for approval of budget officer & finance manager
async function handleApproveWithUpdates(payload: ApprovalProps) {
    console.log('onApproveBudgetOfficer', payload)


    const indx = pendings.value.findIndex(i => i.id === payload.pendingApproval.id)

    if (indx === -1) {
        console.error('pending approval not found with id of ', payload.pendingApproval.id)
        return
    }

    isApproving.value = true
    const response = await payload.approvePending()
    isApproving.value = false

    if (response.success) {

        Swal.fire({
            text: response.msg,
            icon: 'success',
            position: 'top',
        });

        await updateTotalNotifications()

        pendings.value.splice(indx, 1)
        // updateTotalPendingsOfUser(authUser.value!, pendings.value.length)

    } else {
        Swal.fire({
            title: 'Error!',
            text: `Failed to ${payload.status}. Please reload the page and then try again`,
            icon: 'error',
            position: 'top',
        })
    }

    payload.closeBtnModal.click()
}

async function handleSearchedAccounts(searchedAccounts: Account[]) {
    accounts.value = searchedAccounts.map(i => ({...i}))
}

async function handleSearchedClassifications(searchedClassifications: Classification[]) {
    classifications.value = searchedClassifications.map(i => ({...i}))
}

// =============================== Comment.vue Handlers =============================== 

async function handleSaveComment(pending_id: number, comment: string) {
    
    const pending = pendings.value.find(i => i.id === pending_id) 
    if(!pending) {
        console.error('Pending not found with id of', pending_id);
        return 
    }

    const sanitizedComment = comment
    .trim()  // Remove leading/trailing spaces
    .replace(/\s+/g, ' '); // Replace multiple spaces with a single space

    pending.is_saving = true 
    const response = await pendingsApi.saveComment(pending_id, sanitizedComment)
    pending.is_saving = false 
    pending.is_editing = false

    if(response.success) {
        toast.success(response.msg)
        pending.approver_notes = comment 
    } else {
        toast.error(response.msg)
    }

}

function handleCancelEditComment(pending_id: number) {
    const pending = pendings.value.find(i => i.id === pending_id) 
    if(!pending) {
        console.error('Pending not found with id of', pending_id);
        return 
    }
    pending.is_editing = false
}

function handleStartEditComment(pending_id: number) {
    const pending = pendings.value.find(i => i.id === pending_id) 
    if(!pending) {
        console.error('Pending not found with id of', pending_id);
        return 
    }
    pending.is_editing = true
}


// =============================== Utils =============================== 

function removePending(id: number) {
    const indx = pendings.value.findIndex(i => i.id === id);
    if (indx !== -1) {
        pendings.value.splice(indx, 1);
    }
}

</script>