<template>

    <div class="container">

        <div class="card">
            <div class="card-body">
    
                <div v-if="!isLoadingPage && authUser">
            
                    <h2 class="text-warning">Update Municipality</h2>
            
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
                                        Area <span class="text-danger">*</span>
                                    </label>
                                    <client-only>
                                        <v-select :options="areas" label="name" v-model="formData.area"></v-select>
                                    </client-only>
                                    <small class="text-danger fst-italic" v-if="formErrors.area"> {{ error_msg }} </small>
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

import * as api from '~/composables/powerserve/municipality/municipality.api'
import type { Municipality, UpdateMunicipality } from '~/composables/powerserve/municipality/municipality'
import Swal from 'sweetalert2'
import type { Area } from '~/composables/powerserve/area/area.types'

definePageMeta({
    name: ROUTES.MUNICIPALITY_UPDATE,
    layout: "layout-powerserve",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const route = useRoute()
const router = useRouter()
const isSaving = ref(false)
const authUser = ref<AuthUser>({} as AuthUser)
const error_msg = 'This field is required'
const areas = ref<Area[]>([])

const _initialFormData: UpdateMunicipality = {
    area: null,
    name: '',
}

const _initialFormErrors = {
    area: false,
    name: false,
}

const existing_municipality = ref<Municipality>()
const formData = ref<UpdateMunicipality>(deepClone(_initialFormData))
const formErrors = ref(deepClone(_initialFormErrors))

onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await api.municipality_update_init({ id: route.params.id as string })

    if(!response.municipality) {
        return redirectTo401Page()
    }
    
    existing_municipality.value = deepClone(response.municipality)
    populate_form_data({ municipality: deepClone(response.municipality) })
    areas.value = response.areas

    isLoadingPage.value = false
})

function populate_form_data(payload: { municipality: Municipality }) {

    const { municipality } = payload
    
    formData.value = {
        area: municipality.area,
        name: municipality.name
    }

} 

async function onSubmit() {

    if(!existing_municipality.value) {
        console.error('existing_municipality is undefined');
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
        id: existing_municipality.value.id,
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

        router.push(`/powerserve/municipality/view/${response.data.id}`);

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

    if(!formData.value.area) {
        formErrors.value.area = true 
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

const onClickGoToList = () => router.push('/powerserve/municipality')

</script>