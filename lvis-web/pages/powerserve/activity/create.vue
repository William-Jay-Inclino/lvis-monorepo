<template>

    <div class="container">
        <div class="card">
    
            <div class="card-body">
    
                <div v-if="!isLoadingPage && authUser">
                    
                    <h2 class="text-warning">Create Activity</h2>
            
                    <hr>
            
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">
    
                            <div class="alert alert-info fst-italic" role="alert">
                                <div>
                                    <small> Fields with * are required </small>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">
                                    Category <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="activity_categories" label="name" v-model="formData.category"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="formErrors.category"> {{ error_msg }} </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Code <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="formData.code" required>
                                <small class="text-danger fst-italic" v-if="formErrors.code"> {{ error_msg }} </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Name <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="formData.name" required>
                                <small class="text-danger fst-italic" v-if="formErrors.name"> {{ error_msg }} </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Quantity <span class="text-danger">*</span>
                                </label>
                                <input type="number" class="form-control" v-model="formData.quantity" required>
                                <small class="text-danger fst-italic" v-if="formErrors.quantity"> {{ error_msg }} </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Unit <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="units" label="name" v-model="formData.unit"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-if="formErrors.unit"> {{ error_msg }} </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    No. of personnel required <span class="text-danger">*</span>
                                </label>
                                <input type="number" class="form-control" v-model="formData.num_of_personnel" required>
                                <small class="text-danger fst-italic" v-if="formErrors.num_of_personnel"> {{ error_msg }} </small>
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
                                <button @click="onSubmit" class="btn btn-primary" :disabled="isSaving">
                                    <client-only>
                                    <font-awesome-icon :icon="['fas', 'save']"/>
                                </client-only> {{ isSaving ? 'Saving...' : 'Save' }}
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
    </div>


</template>


<script setup lang="ts">

import * as api from '~/composables/powerserve/activity/activity.api'
import Swal from 'sweetalert2'
import type { ActivityCategory, PowerserveUnit } from '~/composables/powerserve/common'
import type { CreateActivity } from '~/composables/powerserve/activity/activity'

definePageMeta({
    name: ROUTES.ACTIVITY_CREATE,
    layout: "layout-powerserve",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const router = useRouter()
const isSaving = ref(false)
const authUser = ref<AuthUser>()
const error_msg = 'This field is required'
const activity_categories = ref<ActivityCategory[]>([])
const units = ref<PowerserveUnit[]>([])

const _initialFormData: CreateActivity = {
    category: null,
    unit: null,
    code: '',
    name: '',
    quantity: 0,
    num_of_personnel: 1,
}

const _initialFormErrors = {
    category: false,
    unit: false,
    code: false,
    name: false,
    quantity: false,
    num_of_personnel: false,
}

const formData = ref(deepClone(_initialFormData))
const formErrors = ref(deepClone(_initialFormErrors))


onMounted(async () => {
    authUser.value = await getAuthUserAsync()
    const response = await api.activity_create_init()
    activity_categories.value = response.activity_categories
    units.value = response.units
    isLoadingPage.value = false
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

        router.push(`/powerserve/activity/view/${response.data.id}`);

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

    if(!formData.value.category) {
        formErrors.value.category = true 
    }

    if(!formData.value.unit) {
        formErrors.value.unit = true 
    }

    if(formData.value.code.trim() === '') {
        formErrors.value.code = true
    }

    if(formData.value.name.trim() === '') {
        formErrors.value.name = true
    }

    if(formData.value.quantity <= 0) {
        formErrors.value.quantity = true
    }

    if(formData.value.num_of_personnel <= 0) {
        formErrors.value.num_of_personnel = true
    }

    const hasError = Object.values(formErrors.value).includes(true);

    if(hasError) {
        return false 
    }

    return true

}


const onClickGoToList = () => router.push('/powerserve/activity')

</script>