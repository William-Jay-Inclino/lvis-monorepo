<template>

    <div class="container">

        <div class="card">
            <div class="card-body">
    
                <div v-if="!isLoadingPage && authUser">
            
                    <h2 class="text-warning">Update Area</h2>
            
                    <hr>
            
                    <form v-if="formData" @submit.prevent="onSubmit">
            
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
                                    <button type="submit" class="btn btn-success" :disabled="isSaving">
                                        <client-only>
                                    <font-awesome-icon :icon="['fas', 'sync']"/>
                                </client-only> {{ isSaving ? 'Updating...' : 'Update' }}
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
import type { Area, UpdateArea } from '~/composables/powerserve/area/area.types'
import Swal from 'sweetalert2'
import type { Municipality } from '~/composables/powerserve/municipality/municipality'
import type { Employee } from '~/composables/hr/employee/employee.types'
import { fetchEmployees } from '~/composables/hr/employee/employee.api'
import { addPropertyFullName } from '~/composables/hr/employee/employee';

definePageMeta({
    name: ROUTES.AREA_UPDATE,
    layout: "layout-powerserve",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const route = useRoute()
const router = useRouter()
const isSaving = ref(false)
const authUser = ref<AuthUser>({} as AuthUser)
const error_msg = 'This field is required'
const municipalities = ref<Municipality[]>([])
const employees = ref<Employee[]>([])

const _initialFormData: UpdateArea = {
    oic: null,
    name: '',
}

const _initialFormErrors = {
    oic: false,
    name: false,
}

const existing_area = ref<Area>()
const formData = ref<UpdateArea>(deepClone(_initialFormData))
const formErrors = ref(deepClone(_initialFormErrors))

onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await api.area_update_init({ id: route.params.id as string })

    if(!response.area) {
        return redirectTo401Page()
    }
    
    existing_area.value = deepClone(response.area)
    populate_form_data({ area: deepClone(response.area) })

    isLoadingPage.value = false
})

function populate_form_data(payload: { area: Area }) {

    const { area } = payload

    area.oic.fullname = getFullname(area.oic.firstname, area.oic.middlename, area.oic.lastname)
    
    formData.value = {
        name: area.name,
        oic: area.oic
    }

} 

async function onSubmit() {

    if(!existing_area.value) {
        console.error('existing_area is undefined');
        return
    }

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

    const response = await api.update({
        id: existing_area.value.id,
        input: formData.value
    })

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