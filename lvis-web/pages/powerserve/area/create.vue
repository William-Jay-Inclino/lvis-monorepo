<template>

    <div class="container">
        <div class="card">
    
            <div class="card-body">
    
                <div v-if="authUser">
                    
                    <h2 class="text-warning">Create Area</h2>
            
                    <hr>
            
                    <form @submit.prevent="onSubmit">
            
                        <div class="row justify-content-center pt-3">
                            <div class="col-lg-6">
        
                                <div class="alert alert-info fst-italic" role="alert">
                                    <div>
                                        <small> Fields with * are required </small>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">
                                        Area Head <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="formData.oic"></v-select>
                                    </client-only>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">
                                        Area Name <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" v-model="formData.name" required>
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
                                    <button type="submit" class="btn btn-primary" :disabled="isSaving">
                                        <client-only>
                                        <font-awesome-icon :icon="['fas', 'save']"/>
                                    </client-only> {{ isSaving ? 'Saving...' : 'Save' }}
                                    </button>
                                </div>
                            </div>
                        </div>
            
                    </form>
    
                </div>
    
                <div v-else>
                    <LoaderSpinner />
                </div>
        
    
            </div>
    
        </div>
    </div>


</template>


<script setup lang="ts">

import * as api from '~/composables/powerserve/area/area.api'
import type { CreateArea } from '~/composables/powerserve/area/area.types'
import Swal from 'sweetalert2'
import type { Employee } from '~/composables/hr/employee/employee.types'
import { addPropertyFullName } from '~/composables/hr/employee/employee';
import { fetchEmployees } from '~/composables/hr/employee/employee.api';

definePageMeta({
    name: ROUTES.AREA_CREATE,
    layout: "layout-powerserve",
    middleware: ['auth'],
})

const router = useRouter()
const isSaving = ref(false)
const authUser = ref<AuthUser>()

const employees = ref<Employee[]>([])

const _initialFormData: CreateArea = {
    oic: null,
    name: '',
}

const _initialFormErrors = {
    oic: false,
    name: false,
}

const formData = ref(deepClone(_initialFormData))
const formErrors = ref(deepClone(_initialFormErrors))

onMounted(async () => {
    authUser.value = await getAuthUserAsync()
})

async function onSubmit() {

    console.log('saving...')

    if (!isValid()) {
        Swal.fire({
            title: 'Error Saving!',
            text: 'Please check the form for errors.',
            icon: 'warning',
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

        router.push(`/powerserve/area/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

function isValid() {
    formErrors.value = deepClone(_initialFormErrors)

    if(!formData.value.oic) {
        formErrors.value.oic = true 
    }

    if(formData.value.name.trim() === '') {
        formErrors.value.name = true
    }

    const hasError = Object.values(formErrors.value).includes(true);

    if(hasError) {
        return false 
    }

    return true

}

async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        employees.value = []
        return 
    } 

    debouncedSearchEmployees(input, loading)

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

const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
    searchEmployees(input, loading);
}, 500);

const onClickGoToList = () => router.push('/powerserve/area')

</script>