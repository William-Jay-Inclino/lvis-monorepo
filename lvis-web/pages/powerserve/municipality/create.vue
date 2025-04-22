<template>

    <div class="container">
        <div class="card">
    
            <div class="card-body">
    
                <div v-if="authUser">
                    
                    <h2 class="text-warning">Create Municipality</h2>
            
                    <hr>
            
                    <form @submit.prevent="onSubmit">
            
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
    </div>


</template>


<script setup lang="ts">

import * as api from '~/composables/powerserve/municipality/municipality.api'
import type { CreateMunicipality } from '~/composables/powerserve/municipality/municipality'
import Swal from 'sweetalert2'
import type { Area } from '~/composables/powerserve/area/area.types'

definePageMeta({
    name: ROUTES.MUNICIPALITY_CREATE,
    layout: "layout-powerserve",
    middleware: ['auth'],
})

const router = useRouter()
const isSaving = ref(false)
const authUser = ref<AuthUser>()
const error_msg = 'This field is required'
const areas = ref<Area[]>([])

const _initialFormData: CreateMunicipality = {
    area: null,
    name: '',
}

const _initialFormErrors = {
    area: false,
    name: false,
}

const formData = ref(deepClone(_initialFormData))
const formErrors = ref(deepClone(_initialFormErrors))


onMounted(async () => {
    authUser.value = await getAuthUserAsync()
    const response = await api.municipality_create_init()
    areas.value = response.areas

})

async function onSubmit() {

    console.log('saving...')

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
    const response = await api.create(formData.value)
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