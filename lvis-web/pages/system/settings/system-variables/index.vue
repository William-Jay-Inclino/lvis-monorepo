<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">System Variables</h2>
        
                <hr>
        
                <div class="row justify-content-center">
                    <div class="col-lg-6">
        
                        <div class="mb-3">
                            <label class="form-label">
                                Budget Officers
                            </label>
                            <client-only>
                                <v-select @option:selected="addBudgetOfficer" @option:deselected="removeBudgetOfficer" multiple
                                    label="fullname" v-model="budgetOfficers" :options="employees"
                                    :disabled="isAddingBudgetOfficer || isRemovingBudgetOfficer" />
                            </client-only>
                            <small v-show="isAddingBudgetOfficer" class="text-muted fst-italic">Adding Budget
                                Officer...</small>
                            <small v-show="isRemovingBudgetOfficer" class="text-muted fst-italic">Removing Budget
                                Officer...</small>
                        </div>
        
                        <div class="mb-3">
                            <label class="form-label">
                                Finance Managers
                            </label>
                            <client-only>
                                <v-select @option:selected="addFinanceManager" @option:deselected="removeFinanceManager"
                                    multiple label="fullname" v-model="financeManagers" :options="employees"
                                    :disabled="isAddingFinanceManager || isRemovingFinanceManager" />
                            </client-only>
                            <small v-show="isAddingFinanceManager" class="text-muted fst-italic">Adding Finance
                                Manager...</small>
                            <small v-show="isRemovingFinanceManager" class="text-muted fst-italic">Removing Finance
                                Manager...</small>
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

import * as systemApi from '~/composables/system/settings/system-variables.api'
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";

definePageMeta({
    // name: ROUTES.ACCOUNT_INDEX,
    layout: "layout-system",
    // middleware: ['auth'],
})

const isLoadingPage = ref(true)

const isAddingBudgetOfficer = ref(false)
const isRemovingBudgetOfficer = ref(false)
const isAddingFinanceManager = ref(false)
const isRemovingFinanceManager = ref(false)

const toast = useToast();

const employees = ref<Employee[]>([])

const budgetOfficers = ref<Employee[]>([])
const financeManagers = ref<Employee[]>([])


onMounted(async () => {

    const response = await systemApi.fetchFormData()

    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

    budgetOfficers.value = response.budgetOfficers.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

    financeManagers.value = response.financeManagers.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)
        return i
    })

    isLoadingPage.value = false

})


async function addBudgetOfficer(budgetOfficers: Employee[]) {
    const budgetOfficer = budgetOfficers[budgetOfficers.length - 1]

    isAddingBudgetOfficer.value = true
    const response = await systemApi.addBudgetOfficer(budgetOfficer.id)
    isAddingBudgetOfficer.value = false

    if (response.success && response.data) {
        toast.success(response.msg)

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

async function removeBudgetOfficer(budgetOfficer: Employee) {

    isRemovingBudgetOfficer.value = true
    const response = await systemApi.removeBudgetOfficer(budgetOfficer.id)
    isRemovingBudgetOfficer.value = false

    if (response.success && response.data) {
        toast.success(response.msg)

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }
}

async function addFinanceManager(financeManagers: Employee[]) {
    const financeManager = financeManagers[financeManagers.length - 1]

    isAddingFinanceManager.value = true
    const response = await systemApi.addFinanceManager(financeManager.id)
    isAddingFinanceManager.value = false

    if (response.success && response.data) {
        toast.success(response.msg)

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

async function removeFinanceManager(financeManager: Employee) {

    isRemovingFinanceManager.value = true
    const response = await systemApi.removeFinanceManager(financeManager.id)
    isRemovingFinanceManager.value = false

    if (response.success && response.data) {
        toast.success(response.msg)

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