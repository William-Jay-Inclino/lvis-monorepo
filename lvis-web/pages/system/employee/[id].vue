<template>

    <div class="card">
        <div class="card-body">
            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Update Employee</h2>
        
                <hr>
        
                <form v-if="item" @submit.prevent="onSubmit">
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">

                            <div class="alert alert-info fst-italic" role="alert">
                                <small> Fields with * are required </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Firstname <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.firstname" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Middlename
                                </label>
                                <input type="text" class="form-control" v-model="item.middlename">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Lastname <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.lastname" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Department <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select @option:selected="onChangeDepartment" :options="departments" label="name" v-model="item.department" :clearable="false">
                                        <template #search="{attributes, events}">
                                            <input
                                            class="vs__search"
                                            :required="!item.department"
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
                                    <v-select :options="divisions_by_department" label="name" v-model="item.division">
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
                                <input type="text" class="form-control" v-model="item.position" required>
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


</template>


<script setup lang="ts">

import * as api from '~/composables/system/employee/employee.api'
import type { Employee, UpdateEmployeeInput } from '~/composables/system/employee/employee.types'
import Swal from 'sweetalert2'
import type { Department } from '~/composables/system/department/department';

definePageMeta({
    name: ROUTES.EMPLOYEE_UPDATE,
    layout: "layout-system",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const route = useRoute()
const router = useRouter()
const isSaving = ref(false)

const config = useRuntimeConfig()
const API_URL = config.public.apiUrl

const item = ref<UpdateEmployeeInput>()
const departments = ref<Department[]>([])
const employee = ref<Employee>()

const signatureFile = ref<File>()


onMounted(async () => {

    const response = await api.fetchFormDataInUpdate(route.params.id as string)

    if (!response || !response.employee) {
        console.error('Employee not found')
        return
    }

    employee.value = {...response.employee}

    item.value = {
        firstname: response.employee.firstname,
        middlename: response.employee.middlename,
        lastname: response.employee.lastname,
        position: response.employee.position,
        division: response.employee.division,
        department: response.employee.department,
    }
    departments.value = response.departments

    isLoadingPage.value = false
})

const divisions_by_department = computed( () => {

    if(!item.value) return []

    if(!item.value.department) return []

    const department = departments.value.find(i => i.id === item.value?.department?.id)

    if(!department) {
        console.error('department not found in departments with id of ', item.value.department.id);
        return 
    }

    return department?.divisions

})

async function onSubmit() {

    if (!item.value || !employee.value) return

    console.log('saving...')

    isSaving.value = true

    console.log('signatureFile.value', signatureFile.value);

    // upload signature first
    if(!!signatureFile.value) {
        const fileSrc = await api.uploadSingleAttachment(signatureFile.value, API_URL)
        console.log('fileSrc', fileSrc);
        item.value['signature_src'] = fileSrc
    }

    const response = await api.update(employee.value.id, item.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/system/employee/view/${response.data.id}`);

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

    if(!item.value) return 

    item.value.division = null 
}

function handleFileUpload(event: any) {
    signatureFile.value = event.target.files[0];
}

const onClickGoToList = () => router.push('/system/employee')

</script>