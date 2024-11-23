<template>
    <div class="card">

        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">

                <h2 class="text-warning">Create Vehicle</h2>
        
                <hr>
        
                <div class="row justify-content-center pt-3">
                    <div class="col-lg-6">
                        
                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Name <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="formData.name" required>
                            <small class="text-danger fst-italic" v-show="formDataErrors.name"> {{ errorMsg }} </small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Vehicle Number <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="formData.vehicle_number" required>
                            <small class="text-danger fst-italic" v-show="formDataErrors.vehicle_number"> {{ errorMsg }} </small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Plate Number <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="formData.plate_number" required>
                            <small class="text-danger fst-italic" v-show="formDataErrors.plate_number"> {{ errorMsg }} </small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Classification <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="VEHICLE_CLASSIFICATIONS" label="name" v-model="formData.classification"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="formDataErrors.classification"> {{ errorMsg }} </small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Assignee <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="formData.assignee"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="formDataErrors.assignee"> {{ errorMsg }} </small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Date Acquired <span class="text-danger">*</span>
                            </label>
                            <input type="date" class="form-control" v-model="formData.date_acquired">
                            <small class="text-danger fst-italic" v-show="formDataErrors.date_acquired"> {{ errorMsg }} </small>
                        </div>
    
                    </div>
                </div>
    
    
                <div class="row justify-content-center pt-3">
                    <div class="col-lg-6">
                        <div class="d-flex justify-content-between">
                            <button type="button" @click="onClickGoToList" class="btn btn-secondary">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'list']"/>
                            </client-only> Go to list
                            </button>
                            <button @click="onSubmit" class="btn btn-primary" :disabled="isSaving">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'save']"/>
                            </client-only> {{ isSaving ? 'Saving...' : 'Save' }}
                            </button>
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

import * as api from '~/composables/warehouse/vehicle/vehicle.api'
import type { CreateVehicleInput } from '~/composables/warehouse/vehicle/vehicle.types'
import Swal from 'sweetalert2'
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Employee } from '~/composables/system/employee/employee.types';
import { VEHICLE_CLASSIFICATIONS } from '~/composables/warehouse/vehicle/vehicle.constants';

definePageMeta({
    name: ROUTES.VEHICLE_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const router = useRouter()
const isSaving = ref(false)
const errorMsg = 'This field is required'
const authUser = ref<AuthUser>({} as AuthUser)

const _formDataErrorsInitial = {
    name: false,
    vehicle_number: false,
    plate_number: false,
    classification: false,
    assignee: false,
    date_acquired: false,
}

const _initialFormData: CreateVehicleInput = {
    name: '',
    vehicle_number: '',
    plate_number: '',
    classification: null,
    assignee: null,
    date_acquired: '',
}

const formDataErrors = ref({ ..._formDataErrorsInitial })

const formData = ref({ ..._initialFormData })
const employees = ref<Employee[]>([])


onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await api.fetchFormDataInCreate()

    employees.value = addPropertyFullName(response.employees)

    isLoadingPage.value = false

})


async function onSubmit() {

    console.log('saving...')

    if(!isValid()) {
        Swal.fire({
            title: 'Unable to Save!',
            text: 'The form contains errors.',
            icon: 'error',
            position: 'top',
        })
        return 
    }

    isSaving.value = true
    const response = await api.create(formData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/vehicle/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}


function isValid(): boolean {

    formDataErrors.value = { ..._formDataErrorsInitial }

    if (formData.value.name.trim() === '') {
        formDataErrors.value.name = true
    }

    if (formData.value.vehicle_number.trim() === '') {
        formDataErrors.value.vehicle_number = true
    }

    if (formData.value.plate_number.trim() === '') {
        formDataErrors.value.plate_number = true
    }

    if (!formData.value.classification) {
        formDataErrors.value.classification = true
    }

    if (!formData.value.assignee) {
        formDataErrors.value.assignee = true
    }

    if (formData.value.date_acquired.trim() === '') {
        formDataErrors.value.date_acquired = true
    }


    const hasError = Object.values(formDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}



const onClickGoToList = () => router.push('/warehouse/vehicle')

</script>