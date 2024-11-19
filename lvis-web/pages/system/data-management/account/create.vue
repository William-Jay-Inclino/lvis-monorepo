<template>
    <div class="card">
        <div class="card-body">

            <h2 class="text-warning">Create Account</h2>
    
            <hr>
    
            <form @submit.prevent="onSubmit">
    
                <div class="row justify-content-center pt-3">
                    <div class="col-lg-6">

                        <div class="alert alert-info fst-italic" role="alert">
                            <small> Fields with * are required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Code <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="formData.code" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Name <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="formData.name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Description <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="formData.description" required>
                        </div>
    
                    </div>
                </div>
    
    
                <div class="row justify-content-center pt-3">
                    <div class="col-lg-6">
                        <div class="d-flex justify-content-between">
                            <button type="button" @click="onClickGoToList" class="btn btn-secondary">
                                <i class="fas fa-list"></i> Go to list
                            </button>
                            <button type="submit" class="btn btn-primary" :disabled="isSaving">
                                <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
                            </button>
                        </div>
                    </div>
                </div>
    
            </form>
            
        </div>
    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/system/account/account.api'
import type { CreateAccountInput } from '~/composables/system/account/account'
import Swal from 'sweetalert2'

definePageMeta({
    name: ROUTES.ACCOUNT_CREATE,
    layout: "layout-system",
    middleware: ['auth'],
})

const router = useRouter()
const isSaving = ref(false)

const _initialFormData: CreateAccountInput = {
    code: '',
    name: '',
    description: '',
}

const formData = ref({ ..._initialFormData })


async function onSubmit() {

    console.log('saving...')

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

        router.push(`/system/data-management/account/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/system/data-management/account')

</script>