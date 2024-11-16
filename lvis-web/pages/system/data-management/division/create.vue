<template>
    <div class="card">

        <div class="card-body">

            <div v-if="!isLoadingPage">

                <h2 class="text-warning">Create Division</h2>
        
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
                                    Department <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="departments" label="code" v-model="formData.department">
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
                                <SystemUserPermissions :permissions="formData.permissions" />
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

            <div v-else>

                <LoaderSpinner />

            </div>
            
        </div>


    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/system/division/division.api'
import type { CreateDivisionInput } from '~/composables/system/division/division.ts'
import Swal from 'sweetalert2'
import { permissions } from '~/composables/system/user/user.permissions'
import type { Department } from '#imports';

definePageMeta({
    name: ROUTES.DIVISION_CREATE,
    layout: "layout-system",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const router = useRouter()
const isSaving = ref(false)

const _initialFormData: CreateDivisionInput = {
    code: '',
    name: '',
    department: null,
    permissions: JSON.parse(JSON.stringify(permissions)),
}

const formData = ref({ ..._initialFormData })

const departments = ref<Department[]>([])


onMounted( async () => {

    const response = await api.fetchFormDataInCreate()
    departments.value = response.departments
    isLoadingPage.value = false

})

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

        router.push(`/system/data-management/division/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/system/data-management/division')

</script>