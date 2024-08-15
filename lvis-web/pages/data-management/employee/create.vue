<template>
    <div class="card">

        <div class="card-body">

            <div v-if="!isLoadingPage">
                <h2 class="text-warning">Create Employee</h2>
        
                <hr>
        
                <form @submit.prevent="onSubmit">
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">
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
                                    Position
                                </label>
                                <client-only>
                                    <v-select :options="positions" label="name" v-model="formData.position">
                                        <template #search="{attributes, events}">
                                            <input
                                            class="vs__search"
                                            :required="!formData.position"
                                            v-bind="attributes"
                                            v-on="events"
                                            />
                                        </template>
                                    </v-select>
                                </client-only>
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
import * as api from '~/composables/system/employee/employee.api'
import type { CreateEmployeeInput } from '~/composables/system/employee/employee.types'
import Swal from 'sweetalert2'
import type { Position } from '~/composables/system/position/position';

definePageMeta({
    name: ROUTES.EMPLOYEE_CREATE,
    layout: "layout-system",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const router = useRouter()
const isSaving = ref(false)

const config = useRuntimeConfig()
const API_URL = config.public.apiUrl

const positions = ref<Position[]>([])

const _initialFormData: CreateEmployeeInput = {
    firstname: '',
    middlename: '',
    lastname: '',
    position: null,
    signature_src: null,
}

const formData = ref({ ..._initialFormData })

const signatureFile = ref<File>()


onMounted( async () => {

    const response = await api.fetchFormDataInCreate()

    positions.value = response.positions 

    isLoadingPage.value = false

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

        router.push(`/data-management/employee/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

function handleFileUpload(event: any) {
    signatureFile.value = event.target.files[0];
}


const onClickGoToList = () => router.push('/data-management/employee')

</script>