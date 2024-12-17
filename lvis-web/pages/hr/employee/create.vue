<template>
    <div class="card">

        <div class="card-body">

            <div v-if="!isLoadingPage">
                <h2 class="text-warning">Create Employee</h2>
        
                <hr>
        
                <form @submit.prevent="onSubmit">
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">

                            <div class="alert alert-info fst-italic" role="alert">
                                <small> Fields with * are required </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Firstname <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="formData.firstname" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Middlename
                                </label>
                                <input type="text" class="form-control" v-model="formData.middlename">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Lastname <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="formData.lastname" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Name Prefix
                                </label>
                                <input type="text" class="form-control" v-model="formData.name_prefix">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Name Suffix
                                </label>
                                <input type="text" class="form-control" v-model="formData.name_suffix">
                            </div>

                            <div v-show="employee_fullname.trim() !== ''" class="alert alert-warning" role="alert">
                                <small class="fst-italic">
                                    This is how the employee is addressed in reports: <b>{{ employee_fullname }} </b>
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Employee Number <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="formData.employee_number" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Rank Number <span class="text-danger">*</span>
                                </label>
                                <input type="number" class="form-control" v-model="formData.rank_number" required min="0"
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Department <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select @option:selected="onChangeDepartment" :options="departments" label="code" v-model="formData.department">
                                        <template #search="{attributes, events}">
                                            <input
                                            class="vs__search"
                                            :required="!formData.department"
                                            v-bind="attributes"
                                            v-on="events"
                                            />
                                        </template>
                                    </v-select>
                                </client-only>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Division / Section
                                </label>
                                <client-only>
                                    <v-select :options="divisions_by_department" label="name" v-model="formData.division">
                                        <template #search="{attributes, events}">
                                            <input
                                            class="vs__search"
                                            v-bind="attributes"
                                            v-on="events"
                                            />
                                        </template>
                                    </v-select>
                                </client-only>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Position <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="formData.position" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Signature
                                </label>
                                <input class="form-control" type="file" @change="handleFileUpload">
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

</template>


<script setup lang="ts">
import * as api from '~/composables/hr/employee/employee.api'
import type { CreateEmployeeInput } from '~/composables/hr/employee/employee.types'
import Swal from 'sweetalert2'
import type { Department } from '~/composables/hr/department/department';

definePageMeta({
    name: ROUTES.EMPLOYEE_CREATE,
    layout: "layout-hr",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const router = useRouter()
const isSaving = ref(false)

const config = useRuntimeConfig()
const API_URL = config.public.apiUrl

// dropdowns
const departments = ref<Department[]>([])

const _initialFormData: CreateEmployeeInput = {
    employee_number: '',
    rank_number: 0,
    firstname: '',
    middlename: '',
    lastname: '',
    name_prefix: '',
    name_suffix: '',
    position: '',
    division: null,
    department: null,
    signature_src: null,
}

const formData = ref({ ..._initialFormData })

const signatureFile = ref<File>()


onMounted( async () => {

    const response = await api.fetchFormDataInCreate()

    departments.value = response.departments

    isLoadingPage.value = false

})

const divisions_by_department = computed( () => {

    if(!formData.value.department) return []

    return formData.value.department.divisions

})

const employee_fullname = computed( () => {

    if(formData.value.firstname.trim() === '' && formData.value.lastname.trim() === '') return ''

    return getFullnameWithTitles(formData.value.firstname, formData.value.lastname, formData.value.middlename, formData.value.name_prefix, formData.value.name_suffix)
})


async function onSubmit() {

    console.log('saving...')

    isSaving.value = true

    // upload signature first
    if(signatureFile.value) {
        const fileSrc = await api.uploadSingleAttachment(signatureFile.value, API_URL)
        console.log('fileSrc', fileSrc);
        formData.value.signature_src = fileSrc
    }

    
    const response = await api.create(formData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/hr/employee/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

function onChangeDepartment() {
    formData.value.division = null 
}

function handleFileUpload(event: any) {
    signatureFile.value = event.target.files[0];
}

const onClickGoToList = () => router.push('/hr/employee')

</script>