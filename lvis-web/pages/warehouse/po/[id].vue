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
                                <v-select @search="handleSearchAccounts" :options="accounts" label="name" v-model="poData.fund_source"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Notes</label>
                            <textarea v-model="poData.notes" class="form-control" rows="3"></textarea>
                        </div>

                    </div>

                </div>


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
import type { PO, UpdatePoInput } from '~/composables/warehouse/po/po.types';
import * as poApi from '~/composables/warehouse/po/po.api'
import type { Account } from '~/composables/accounting/account/account';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchAccountsByName } from '~/composables/accounting/account/account.api';

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

async function handleSearchAccounts(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        accounts.value = []
        return 
    } 

    debouncedSearchAccounts(input, loading)

}


async function searchAccounts(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchAccountsByName(input);
        accounts.value = response
    } catch (error) {
        console.error('Error fetching Accounts:', error);
    } finally {
        loading(false);
    }
}


const debouncedSearchAccounts = debounce((input: string, loading: (status: boolean) => void) => {
    searchAccounts(input, loading);
}, 500);


</script>