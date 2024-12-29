<template>
    <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="pendingModal" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-warning" id="exampleModalLabel">
                        Approval Confirmation
                    </h5>
                    <button @click="closeModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" v-if="pendingApproval">
                    <div class="alert alert-info" role="alert">
                        Are you sure you want to <b>APPROVE</b> transaction <b>{{
                            pendingApproval.description }}</b> ?
                    </div>
                    <div class="mb-3">
                        <label class="form-label"> Remarks </label>
                        <textarea class="form-control" rows="3" v-model="remarks"></textarea>
                        <small class="text-muted fst-italic">
                            This field is optional </small>
                        <small class="text-danger fst-italic" v-if="formErrors.remarks">
                            This field is required </small>
                    </div>
                    <div class="mb-3" v-if="employee.is_budget_officer">
                        <label class="form-label"> Classification </label>
                        <client-only>
                            <v-select data-test-id="classification" @search="handleSearchClassifications" :options="classifications" label="name" v-model="classification"></v-select>
                        </client-only>
                        <small class="text-danger fst-italic" v-if="formErrors.classification">
                            This field is required </small>
                    </div>
                    <div class="mb-3" v-if="employee.is_finance_manager">
                        <label class="form-label"> Fund Source </label>
                        <client-only>
                            <v-select data-test-id="fund-source" @search="handleSearchAccounts" :options="accounts" label="name" v-model="fundSource"></v-select>
                        </client-only>
                        <small class="text-danger fst-italic" v-if="formErrors.fundSource">
                            This field is required </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="closeModal" ref="closePendingModal" class="btn btn-secondary"
                        data-bs-dismiss="modal">
                        Cancel
                    </button>
                    <button data-test-id="approve" @click="approve"
                        class="btn btn-success" :disabled="isApproving">
                        {{ isApproving ? 'Approving...' : 'Approve' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>



<script setup lang="ts">
import { type Pending } from '~/composables/e-forms/pendings/pendings.types';
import type { Account } from '~/composables/accounting/account/account';
import { fetchAccountsByName } from '~/composables/accounting/account/account.api';
import { fetchClassificationsByName } from '~/composables/accounting/classification/classification.api';
import type { Employee } from '~/composables/hr/employee/employee.types';

const emits = defineEmits([
    'approve-budget-officer',
    'approve-finance-manager',
    'search-accounts',
    'search-classifications',
])

const props = defineProps<{
    employee: Employee,
    pendingApproval: Pending | null,
    accounts: Account[],
    classifications: Classification[],
    isApproving: boolean
}>();

const _initialFormErrors = {
    remarks: false,
    classification: false,
    fundSource: false,
    account: false,
}

const closePendingModal = ref<HTMLButtonElement>()

const classification = ref<Classification>()
const fundSource = ref<Account>()
const remarks = ref(props.pendingApproval?.approver_notes || '')

const formErrors = ref({ ..._initialFormErrors })

const approver_notes = computed( () => {
    if(props.pendingApproval) {
        return props.pendingApproval.approver_notes
    }
})

watch(() => approver_notes.value, (newValue) => {
    remarks.value = newValue || ''; 
});


function approve() {
    console.log('approve')

    if (!isValidApprove()) return


    const sanitizedRemarks = remarks.value
    .trim()  // Remove leading/trailing spaces
    .replace(/\s+/g, ' '); // Replace multiple spaces with a single space


    if (props.employee.is_budget_officer) {
        const payload = {
            pendingApproval: props.pendingApproval,
            classification: classification.value,
            remarks: sanitizedRemarks
        }
        emits('approve-budget-officer', payload, closePendingModal.value)

        return
    }


    if (props.employee.is_finance_manager) {
        const payload = {
            pendingApproval: props.pendingApproval,
            fundSource: fundSource.value,
            remarks: sanitizedRemarks
        }
        emits('approve-finance-manager', payload, closePendingModal.value)

        return
    }


}

function isValidApprove() {

    formErrors.value = { ..._initialFormErrors }

    if (!!props.employee.is_budget_officer && !classification.value) {
        formErrors.value.classification = true
    }

    if (!!props.employee.is_finance_manager && !fundSource.value) {
        formErrors.value.fundSource = true
    }

    const hasError = Object.values(formErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}


function closeModal() {
    remarks.value = ''
    classification.value = undefined
    fundSource.value = undefined
    formErrors.value = { ..._initialFormErrors }
}


async function handleSearchAccounts(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        emits('search-accounts', [])
        return 
    } 

    debouncedSearchAccounts(input, loading)

}

async function handleSearchClassifications(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        emits('search-accounts', [])
        return 
    } 

    debouncedSearchAccounts(input, loading)

}

async function searchAccounts(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchAccountsByName(input);
        emits('search-accounts', response)
    } catch (error) {
        console.error('Error fetching Accounts:', error);
    } finally {
        loading(false);
    }
}

async function searchClassifications(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchClassificationsByName(input);
        emits('search-classifications', response)
    } catch (error) {
        console.error('Error fetching Classifications:', error);
    } finally {
        loading(false);
    }
}

const debouncedSearchAccounts = debounce((input: string, loading: (status: boolean) => void) => {
    searchAccounts(input, loading);
}, 500);

const debouncedSearchClassifications = debounce((input: string, loading: (status: boolean) => void) => {
    searchClassifications(input, loading);
}, 500);

</script>