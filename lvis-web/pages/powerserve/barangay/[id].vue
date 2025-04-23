<template>

    <div class="container">

        <div class="card">
            <div class="card-body">
    
                <div v-if="!isLoadingPage && authUser">
            
                    <h2 class="text-warning">Update Barangay</h2>
            
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
                                        Municipality <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select :options="municipalities" label="name" v-model="formData.municipality"></v-select>
                                    </client-only>
                                    <small class="text-danger fst-italic" v-if="formErrors.municipality"> {{ error_msg }} </small>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">
                                        Name <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" v-model="formData.name" required>
                                    <small class="text-danger fst-italic" v-if="formErrors.name"> {{ error_msg }} </small>
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

import * as api from '~/composables/powerserve/barangay/barangay.api'
import type { Barangay, UpdateBarangay } from '~/composables/powerserve/barangay/barangay'
import Swal from 'sweetalert2'
import type { Municipality } from '~/composables/powerserve/municipality/municipality'

definePageMeta({
    name: ROUTES.BARANGAY_UPDATE,
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

const _initialFormData: UpdateBarangay = {
    municipality: null,
    name: '',
}

const _initialFormErrors = {
    municipality: false,
    name: false,
}

const existing_barangay = ref<Barangay>()
const formData = ref<UpdateBarangay>(deepClone(_initialFormData))
const formErrors = ref(deepClone(_initialFormErrors))

onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await api.barangay_update_init({ id: route.params.id as string })

    if(!response.barangay) {
        return redirectTo401Page()
    }
    
    existing_barangay.value = deepClone(response.barangay)
    populate_form_data({ barangay: deepClone(response.barangay) })
    municipalities.value = response.municipalities

    isLoadingPage.value = false
})

function populate_form_data(payload: { barangay: Barangay }) {

    const { barangay } = payload
    
    formData.value = {
        municipality: barangay.municipality,
        name: barangay.name
    }

} 

async function onSubmit() {

    if(!existing_barangay.value) {
        console.error('existing_barangay is undefined');
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
        id: existing_barangay.value.id,
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

        router.push(`/powerserve/barangay/view/${response.data.id}`);

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

    if(!formData.value.municipality) {
        formErrors.value.municipality = true 
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

const onClickGoToList = () => router.push('/powerserve/barangay')

</script>