<template>

    <div class="card">
        <div class="card-body">
            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Update User</h2>
        
                <hr>
        
                <div class="row pt-3">
                    <div class="col">
                        <ul class="nav nav-tabs justify-content-center">
                            <li class="nav-item" @click="formType = FORM_TYPE.USER_INFO">
                                <a class="nav-link" :class="{ 'active': formType === FORM_TYPE.USER_INFO }" href="#">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'info-circle']"/>
                                    </client-only> 
                                    User Info
                                </a>
                            </li>
                            <li class="nav-item" @click="formType = FORM_TYPE.LOGIN_CREDENTIALS">
                                <a class="nav-link" :class="{ 'active': formType === FORM_TYPE.LOGIN_CREDENTIALS }" href="#">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'fa-lock']"/>
                                    </client-only>  
                                    Login Credentials
                                </a>
                            </li>
                            <li class="nav-item" @click="formType = FORM_TYPE.USER_PERMISSIONS">
                                <a class="nav-link" :class="{ 'active': formType === FORM_TYPE.USER_PERMISSIONS }" href="#">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'key']"/>
                                    </client-only>  
                                    User Permissions
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
        
        
                <div v-if="formType === FORM_TYPE.USER_INFO" class="row justify-content-center pt-5">
        
                    <div class="col-lg-6">
        
                        <form v-if="item" @submit.prevent="updateUserInfo">
        
                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic"> Fields with * are required </small>
                            </div>
        
                            <div class="mb-3">
                                <label class="form-label">
                                    Role
                                </label>
                                <select class="form-select" v-model="item.role">
                                    <option :value="ROLE.ADMIN">Admin</option>
                                    <option :value="ROLE.USER">User</option>
                                </select>
                            </div>
        
                            <div v-if="item.user_employee">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Firstname <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" :value="item.user_employee.employee.firstname"
                                        disabled>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">
                                        Middlename
                                    </label>
                                    <input type="text" class="form-control" :value="item.user_employee.employee.middlename"
                                        disabled>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">
                                        Lastname <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" :value="item.user_employee.employee.lastname"
                                        disabled>
                                </div>
                            </div>
        
                            <div v-else>
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
                            </div>
        
        
        
                            <div class="d-flex justify-content-between pt-3">
                                <button type="button" @click="onClickGoToList" class="btn btn-secondary">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'list']"/>
                                    </client-only> 
                                    Go to list
                                </button>
                                <button type="submit" class="btn btn-success" :disabled="isUpdatingUserInfo">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'sync']"/>
                                    </client-only> 
                                    {{ isUpdatingUserInfo ? 'Updating...' : 'Update' }}
                                </button>
                            </div>
        
                        </form>
        
                    </div>
        
                </div>
        
        
                <div v-else-if="formType === FORM_TYPE.LOGIN_CREDENTIALS" class="row justify-content-center pt-5">
        
                    <div class="col-lg-6">

                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic"> Fields with * are required </small>
                        </div>
        
                        <SystemUserLoginCredentials :username="item.username" :password="item.password"
                            :can-update-username="false" @update-password="onUpdatePassword" />
        
        
                        <div class="d-flex justify-content-between pt-3">
                            <button type="button" @click="onClickGoToList" class="btn btn-secondary">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'list']"/>
                                </client-only> 
                                Go to list
                            </button>
                            <button type="button" @click="updatePassword" class="btn btn-success"
                                :disabled="isUpdatingPassword">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'sync']"/>
                                </client-only> 
                                {{ isUpdatingPassword ? 'Updating...' : 'Update' }}
                            </button>
                        </div>
        
                    </div>
        
                </div>
        
        
                <div v-else-if="formType === FORM_TYPE.USER_PERMISSIONS" class="row justify-content-center pt-5">
        
                    <div class="col-lg-6">
                        
                        <div class="mb-3" v-if="item.user_employee">
                            <div>
                                <small class="label text-muted fst-italic">
                                    Department: <span class="text-primary">{{ item.user_employee.employee.department.code }} </span>
                                </small>
                            </div>
                            <div>
                                <small class="label text-muted fst-italic">
                                    Division / Section: 
                                    <span :class="{'text-primary': !!item.user_employee.employee.division, 'text-danger': !item.user_employee.employee.division}">
                                        {{ !!item.user_employee.employee.division ? item.user_employee.employee.division.code : 'N/A' }} 
                                    </span>
                                </small>
                            </div>
                        </div>
        
                        <SystemUserPermissions :permissions="item.permissions" />
        
        
                        <div class="d-flex justify-content-between pt-3">
                            <button type="button" @click="onClickGoToList" class="btn btn-secondary">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'list']"/>
                                </client-only> 
                                Go to list
                            </button>
                            <button type="button" @click="updatePermissions" class="btn btn-success"
                                :disabled="isUpdatingPermissions">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'sync']"/>
                                </client-only>  
                                {{ isUpdatingPermissions ? 'Updating...' : 'Update' }}
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

definePageMeta({
    layout: "layout-system"
})

import * as api from '~/composables/system/user/user.api'
import type { UpdateUserInput, User } from '~/composables/system/user/user.types'
import { mergeUserPermissions } from '~/composables/system/user/user.helpers'
import { permissions } from '~/composables/system/user/user.permissions'
import Swal from 'sweetalert2'

const enum FORM_TYPE {
    USER_INFO,
    LOGIN_CREDENTIALS,
    USER_PERMISSIONS
}

const route = useRoute()
const router = useRouter()
const isUpdatingUserInfo = ref(false)
const isUpdatingPassword = ref(false)
const isUpdatingPermissions = ref(false)

const formType = ref(FORM_TYPE.USER_INFO)

const item = ref<User>({} as User)
const isLoadingPage = ref(true)

// const defaultPermissions = { ...permissions }
const defaultPermissions = JSON.parse(JSON.stringify(permissions));


onMounted(async () => {

    const response = await api.findOne(route.params.id as string)

    console.log('response', response)
    isLoadingPage.value = false

    if (!response) {
        console.error('User not found')
        return
    }

    item.value = response

    if (item.value.permissions) {
        // use defaultPermissions object and set the value if they have same property
        item.value.permissions = mergeUserPermissions(defaultPermissions, item.value.permissions)
    } else {
        item.value.permissions = defaultPermissions
    }


})


async function updateUserInfo() {

    if (!item.value) return

    console.log('saving...')

    const data: UpdateUserInput = {
        firstname: item.value.firstname,
        middlename: item.value.middlename,
        lastname: item.value.lastname,
        role: item.value.role,
    }

    isUpdatingUserInfo.value = true
    const response = await api.updateUserInfo(item.value.id, data)
    isUpdatingUserInfo.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}


async function updatePassword() {
    isUpdatingPassword.value = true
    const response = await api.updatePassword(item.value.id, item.value.password)
    isUpdatingPassword.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

async function updatePermissions() {

    if (!item.value.permissions) return

    isUpdatingPermissions.value = true
    const response = await api.updatePermissions(item.value.id, item.value.permissions)
    isUpdatingPermissions.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

const onUpdatePassword = (val: string) => item.value.password = val


const onClickGoToList = () => router.push('/system/user')

</script>