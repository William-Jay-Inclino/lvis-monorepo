<template>
    <div class="card">

        <div class="card-body">

            <h2 class="text-warning">Create User</h2>

            <hr>

            <div class="row pt-3">
                <div class="col">
                    <span class="text-secondary">
                        Step {{ currentStep }} of {{ formData.role === ROLE.ADMIN ? '2' : '3' }}:
                        <span v-show="currentStep === 1"> Add User info </span>
                        <span v-show="currentStep === 2"> Add Login credentials </span>
                        <span v-show="currentStep === 3"> Add User Permissions </span>
                    </span>
                </div>
            </div>
    
    
            <div v-show="currentStep === 1" class="row justify-content-center pt-3">
    
                <div class="col-lg-6">

                    <div class="alert alert-info" role="alert">
                        <small class="fst-italic">
                            Fields with * are required
                        </small>
                    </div>
    
                    <div class="mb-3">
                        <label class="form-label">
                            Role <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" v-model="formData.role">
                            <option :value="ROLE.ADMIN">Admin</option>
                            <option :value="ROLE.USER">User</option>
                        </select>
                    </div>
    
                    <div class="mb-3">
                        <label class="form-label">
                            Is employee?
                        </label>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" v-model="isEmployee">
                            <label class="form-check-label">
                                {{ isEmployee ? 'Yes' : 'No' }}
                            </label>
                        </div>
                    </div>
    
                    <div v-if="isEmployee" class="mb-3">
                        <label class="form-label">
                            Select Employee <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select @option:selected="onEmployeeSelected" :options="employees" label="fullname"
                                v-model="formData.employee">
                                <template v-slot:option="option">
                                    <div v-if="option.user_employee" class="row">
                                        <div class="col">
                                            <span class="text-danger">{{ option.fullname }}</span>
                                        </div>
                                        <div class="col text-end">
                                            <small class="text-muted fst-italic">
                                                Already has user account
                                            </small>
                                        </div>
                                    </div>
                                    <div v-else class="row">
                                        <div class="col">
                                            <span>{{ option.fullname }}</span>
                                        </div>
                                        <div class="col text-end">
                                            <small class="text-success fst-italic"> Available </small>
                                        </div>
                                    </div>
                                </template>
                            </v-select>
                        </client-only>
                    </div>
    
                    <div class="mb-3">
                        <label class="form-label">
                            Firstname <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="formData.firstname" required
                            :disabled="isEmployee">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Middlename
                        </label>
                        <input type="text" class="form-control" v-model="formData.middlename" :disabled="isEmployee">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Lastname <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="formData.lastname" required :disabled="isEmployee">
                    </div>
    
                    <div class="d-flex justify-content-between pt-3">
                        <button @click="onClickGoToList" type="button" class="btn btn-secondary">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'list']"/>
                            </client-only> 
                            Go to list
                        </button>
                        <button @click="goToStep2()" type="button" class="btn btn-primary" :disabled="!canProceedStep2">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-right']"/>
                            </client-only> 
                            Next
                        </button>
                    </div>
    
                </div>
    
            </div>
    
    
            <div v-show="currentStep === 2" class="row justify-content-center pt-3">
    
                <div class="col-lg-6">

                    <div class="alert alert-info" role="alert">
                        <small class="fst-italic">
                            Fields with * are required
                        </small>
                    </div>
    
                    <SystemUserLoginCredentials :username="formData.username" :password="formData.password"
                        :is-username-exist="isUsernameExist" :is-checking-un-availability="isCheckingUnAvailability"
                        @check-username-availability="checkUsernameAvailability" @update-username="onUpdateUsername"
                        @update-password="onUpdatePassword" />
    
                    <div class="d-flex justify-content-between pt-3">
                        <button @click="goToStep1()" type="button" class="btn btn-secondary">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> 
                            Back
                        </button>
                        <button v-if="formData.role === ROLE.USER" @click="goToStep3()" type="button"
                            class="btn btn-primary" :disabled="!canProceedStep3 || isCheckingUnAvailability">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-right']"/>
                            </client-only> 
                            Next
                        </button>
                        <button v-else @click="save" type="button" class="btn btn-primary" :disabled="isSaving">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'fa-save']"/>
                            </client-only> 
                            {{ isSaving ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
    
                </div>
    
            </div>
    
    
            <div v-show="currentStep === 3" class="row justify-content-center pt-3">
    
                <div class="col-lg-6">

                    <div v-if="formData.employee">
                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic"> 
                                Default permissions are based on the employee's division/section. If the employee has no division/section, the department will be used instead. 
                            </small>
                        </div>
    
                        <div class="mb-3">
                            <div>
                                <small class="label text-muted fst-italic">
                                    Department: <span class="text-primary">{{ formData.employee.department.code }} </span>
                                </small>
                            </div>
                            <div>
                                <small class="label text-muted fst-italic">
                                    Division / Section: 
                                    <span :class="{'text-primary': !!formData.employee.division, 'text-danger': !formData.employee.division}">
                                        {{ !!formData.employee.division ? formData.employee.division.code : 'N/A' }} 
                                    </span>
                                </small>
                            </div>
                        </div>
        
                    </div>

                    <SystemUserPermissions :permissions="formData.permissions" />
    
                    <div class="d-flex justify-content-between pt-3">
                        <button @click="goToStep2()" type="button" class="btn btn-secondary">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> 
                            Back
                        </button>
                        <button @click="save" type="button" class="btn btn-primary" :disabled="isSaving">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'fa-save']"/>
                            </client-only> 
                            {{ isSaving ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
    
                </div>
    
            </div>
        </div>


    </div>

</template>


<script setup lang="ts">

definePageMeta({
    layout: "layout-system"
})

import * as api from '~/composables/system/user/user.api'
import type { CreateUserInput } from '~/composables/system/user/user.types'
import { permissions } from '~/composables/system/user/user.permissions'
import Swal from 'sweetalert2'
import type { Employee } from '~/composables/system/employee/employee.types';
import { mergeUserPermissions } from '~/composables/system/user/user.helpers'

const router = useRouter()
const isSaving = ref(false)

const currentStep = ref(1)

const isEmployee = ref(false)
const isUsernameExist = ref(false)
const isCheckingUnAvailability = ref(false)

const employees = ref<Employee[]>([])

let currentEmployee: Employee | null = null


const _initialFormData: CreateUserInput = {
    employee: null,
    username: '',
    password: '',
    firstname: '',
    middlename: '',
    lastname: '',
    role: ROLE.USER,
    permissions: JSON.parse(JSON.stringify(permissions)),
    // permissions: { ...permissions }
}

const formData = ref({ ..._initialFormData })



// ======================== LIFECYCLE HOOKS ======================== 

onMounted(async () => {

    const response = await api.fetchFormDataInCreate()

    employees.value = response.employees.map((i) => {
        i.fullname = getFullname(i.firstname, i.middlename, i.lastname)

        if(i.division) {
            
            if(i.division.permissions) {
                // @ts-ignore
                i.division.permissions = JSON.parse(i.division.permissions)
            } else {
                i.division.permissions = JSON.parse(JSON.stringify(permissions))
            }

        }

        if(i.department.permissions) {
            // @ts-ignore
            i.department.permissions = JSON.parse(i.department.permissions)
        } else {
            i.department.permissions = JSON.parse(JSON.stringify(permissions))
        }

        return i
    })

})



// ======================== COMPUTED PROPERTIES ======================== 

const canProceedStep2 = computed(() => {

    if (!!isEmployee.value && !formData.value.employee) {
        return false
    }

    if (!formData.value.firstname || !formData.value.lastname) {
        return false
    }


    return true

})

const canProceedStep3 = computed(() => {

    if (formData.value.username.trim() === '' || formData.value.password.trim() === '') return false

    if (isUsernameExist.value) return false

    return true

})



// ======================== WATCHERS ======================== 

watch(isEmployee, (val) => {

    console.log('watch: isEmployee', val);

    formData.value.employee = null
    formData.value.firstname = ''
    formData.value.middlename = ''
    formData.value.lastname = ''
    formData.value.permissions = JSON.parse(JSON.stringify(permissions))

})



// ======================== FUNCTIONS ======================== 

async function save() {
    console.log('save()', formData.value)

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

        router.push(`/system/user/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }
}

function onChangeEmployee() {

    console.log('onChangeEmployee()')

    if (!isEmployee.value || !formData.value.employee) return

    formData.value.firstname = formData.value.employee.firstname
    formData.value.middlename = formData.value.employee.middlename
    formData.value.lastname = formData.value.employee.lastname
    // console.log('formData.value.employee.position.permissions', formData.value.employee.position.permissions);

    if(formData.value.employee.division) {
        console.log('1');
        formData.value.permissions = mergeUserPermissions(JSON.parse(JSON.stringify(permissions)), formData.value.employee.division.permissions)
    } else {
        console.log('2', formData.value.employee.department.permissions);
        formData.value.permissions = mergeUserPermissions(JSON.parse(JSON.stringify(permissions)), formData.value.employee.department.permissions)
    }

    // formData.value.permissions = mergeUserPermissions(JSON.parse(JSON.stringify(permissions)), formData.value.employee.position.permissions)
}

function onEmployeeSelected(payload: Employee) {
    console.log('onEmployeeSelected()', payload)
    if (payload.user_employee) {
        if (currentEmployee) {
            formData.value.employee = currentEmployee
        } else {
            formData.value.employee = null
        }
    } else {
        currentEmployee = payload

        onChangeEmployee()

    }
}

// ======================== CHILD FUNCTIONS <LoginCredentials.vue> ======================== 

async function checkUsernameAvailability(username: string) {

    console.log('checkUsernameAvailability()')

    isCheckingUnAvailability.value = true
    const response = await api.isUsernameExist(username)
    isCheckingUnAvailability.value = false

    if (response.success) {
        isUsernameExist.value = response.data
    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

const onUpdateUsername = (val: string) => formData.value.username = val
const onUpdatePassword = (val: string) => formData.value.password = val


// ======================== UTILS ======================== 

const onClickGoToList = () => router.push('/system/user')
const goToStep1 = () => currentStep.value = 1
const goToStep2 = async () => {
    currentStep.value = 2

    // if (formData.value.password && formData.value.username) return

    formData.value.password = 'temp' + generateRandom3Digits()
    formData.value.username = generateUsername(formData.value.firstname, formData.value.lastname)
    await checkUsernameAvailability(formData.value.username)
}
const goToStep3 = async () => {
    await checkUsernameAvailability(formData.value.username)
    if (!isUsernameExist.value) {
        currentStep.value = 3
    }
}
const generateRandom3Digits = () => Math.floor(Math.random() * 900) + 100;
const generateUsername = (firstName: string, lastName: string) => {
    const formattedFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const formattedLastName = lastName.toLowerCase().replace(/\s+/g, '');
    const username = `${formattedFirstName}.${formattedLastName}`;
    return username;
};

</script>