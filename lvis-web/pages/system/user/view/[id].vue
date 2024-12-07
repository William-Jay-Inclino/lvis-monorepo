<template>

    <div class="card">
        <div class="card-body">
            <div v-if="!isLoadingPage" class="row justify-content-center pt-3">
        
                <div class="col-lg-6">
        
                    <div v-if="item">
        
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'info-circle']"/>
                                </client-only>  
                                User Info
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div class="row pt-3">
                            <div class="col">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="text-muted">Username</td>
                                            <td> {{ item.username }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Is Employee?</td>
                                            <td> {{ !item.user_employee ? 'No' : 'Yes' }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Firstname</td>
                                            <td> {{ !item.user_employee ? item.firstname : item.user_employee.employee.firstname
                                                }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Middlename</td>
                                            <td> {{ !item.user_employee ? (item.middlename || 'N/A') :
                (item.user_employee.employee.middlename || 'N/A') }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Lastname</td>
                                            <td> {{ !item.user_employee ? item.lastname : item.user_employee.employee.lastname
                                                }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Role</td>
                                            <td> {{ item.role }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Status</td>
                                            <td>
                                                <div :class="{ [`badge bg-${userStatus[item.status].color}`]: true }">
                                                    {{ userStatus[item.status].label }}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Password</td>
                                            <td>
                                                <button @click="onClickChangePassword" class="btn btn-sm btn-light text-primary"> Change Password</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
        
                        <div class="row pt-5 pb-5">
                            <div class="col">
                                <div class="d-flex justify-content-end gap-2">
                                    <div class="d-flex justify-content-end gap-2">
                                        <button class="btn btn-secondary" @click="onClickGoToList">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'list']"/>
                                            </client-only> 
                                            Go to List
                                        </button>
                                        <button class="btn btn-success" @click="onClickUpdate">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'sync']"/>
                                            </client-only> 
                                            Update
                                        </button>
                                        <button class="btn btn-primary" @click="onClickAddNew">
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'plus']"/>
                                            </client-only> 
                                            Add New
                                        </button>
                                    </div>
                                </div>
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

definePageMeta({
    name: ROUTES.USER_VIEW,
    layout: "layout-system",
    middleware: ['auth'],
})

import * as api from '~/composables/system/user/user.api'
import type { User } from '~/composables/system/user/user.types';
import { permissions } from '~/composables/system/user/user.permissions'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const item = ref<User | undefined>()
const isLoadingPage = ref(true)

onMounted(async () => {
    const res = await api.findOne(route.params.id as string);

    if(!res) {
        return redirectTo401Page()
    }

    if(!res.permissions) {
        res.permissions = JSON.parse(JSON.stringify(permissions))
    }

    item.value = res

    console.log('item.value', item.value)

    isLoadingPage.value = false;
});

function onClickChangePassword() {

    Swal.fire({
        title: "Change Password",
        text: `Are you sure you want to change the password of ${item.value?.username}?`,
        input: 'password',
        inputPlaceholder: 'Enter new password',
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e63946",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes!",
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            const inputValue = Swal.getInput()?.value;

            if (!inputValue) {
                Swal.showValidationMessage("Password cannot be empty");
                return false; 
            }

            if(inputValue.trim() === "") {
                Swal.showValidationMessage("Invalid password");
                return false; 
            }

            console.log('inputValue', inputValue);

            const response = await api.changePassword(item.value!.id, inputValue)

            if (response.success) {

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

        },
        allowOutsideClick: () => !Swal.isLoading()
    });
}


const onClickGoToList = () => router.push(`/system/user`);
const onClickAddNew = () => router.push(`/system/user/create`);
const onClickUpdate = () => router.push(`/system/user/${item.value?.id}`);


</script>