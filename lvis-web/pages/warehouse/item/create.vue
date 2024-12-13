<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Create Item</h2>
        
                <hr>
        
                <form @submit.prevent="onSubmit">
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">

                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic">
                                    Fields with * are required
                                </small>
                            </div>
                                
                            <div class="mb-3">
                                <label class="form-label">
                                    Description <span class="text-danger">*</span>
                                </label>
                                <textarea rows="3" class="form-control" v-model="formData.description"></textarea>
                                <small v-if="formDataErrors.description" class="text-danger fst-italic"> This field is required
                                </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Initial Quantity <span class="text-danger">*</span>
                                </label>
                                <input type="number" class="form-control" v-model="formData.initial_quantity">
                                <small v-if="formDataErrors.initial_quantity" class="text-danger fst-italic"> Must be greater
                                    than or equal to 0 </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Initial Average Price <span class="text-danger">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    class="form-control" 
                                    v-model="formData.initial_average_price" 
                                    step="0.01" 
                                    min="0"
                                >
                                <small v-if="formDataErrors.initial_average_price" class="text-danger fst-italic"> Must be
                                    greater than or equal to 0 </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Unit</label>  <span class="text-danger">*</span>
                                <client-only>
                                    <v-select :options="units" label="name" v-model="formData.unit"
                                        :clearable="false"></v-select>
                                </client-only>
                                <small v-if="formDataErrors.unit" class="text-danger fst-italic"> This field is required
                                </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Item Types</label>
                                <client-only>
                                    <v-select :options="itemTypes" label="name" v-model="formData.item_type"
                                        :clearable="false"></v-select>
                                </client-only>
                                <small v-if="formDataErrors.item_type" class="text-danger fst-italic"> This field is required
                                </small>
                            </div>
                            <div v-if="show_project_field" class="mb-3">
                                <label class="form-label">Project</label>
                                <client-only>
                                    <v-select @search="handleSearchProjects" :options="projects" label="name" v-model="formData.project"></v-select>
                                </client-only>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Alert level</label>  <span class="text-danger">*</span>
                                <client-only>
                                    <v-select :options="alertLevels" v-model="formData.alert_level"
                                        :clearable="false"></v-select>
                                </client-only>
                                <small class="text-muted fst-italic">Unit is percentage</small>
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


</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/item/item.api'
import type { CreateItemInput, ItemType } from '~/composables/warehouse/item/item.type'
import { generateNumbersBy5 } from '~/composables/warehouse/item/item.common'
import Swal from 'sweetalert2'
import { fetchProjectsByName } from '~/composables/warehouse/project/project.api';
import type { Project } from '~/composables/warehouse/project/project.types';

definePageMeta({
    name: ROUTES.ITEM_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const router = useRouter()
const isSaving = ref(false)

const itemTypes = ref<ItemType[]>([])
const units = ref<Unit[]>([])
const projects = ref<Project[]>([])
const alertLevels = ref<number[]>([])

const _initialFormErrors = {
    description: false,
    initial_quantity: false,
    initial_average_price: false,
    unit: false,
    item_type: false,
}

const _initialFormData: CreateItemInput = {
    item_type: null,
    unit: null,
    description: '',
    initial_quantity: 0,
    initial_average_price: 0,
    alert_level: 20,
    project: null,
}

const formData = ref({ ..._initialFormData })
const formDataErrors = ref({ ..._initialFormErrors })

onMounted(async () => {

    const response = await api.fetchFormDataInCreate()

    units.value = response.units
    itemTypes.value = response.item_types
    projects.value = response.projects
    alertLevels.value = generateNumbersBy5({ max: 100 })
    isLoadingPage.value = false
})

const item_type = computed( () => {
    return formData.value.item_type 
})

const show_project_field = computed( (): boolean => {
    
    if(!item_type.value) return false 

    if(ITEM_TYPES_WITH_PROJECT.includes(item_type.value.code)) {
        return true 
    }

    return false

})

// clear project if item type is null or not line material and special equipment
watch(item_type, (val) => {

    if (!val || !ITEM_TYPES_WITH_PROJECT.includes(val.code)) {
        formData.value.project = null;
    }
});

async function onSubmit() {

    console.log('saving...')

    if (!isValid()){
        Swal.fire({
            title: 'Form has errors!',
            text: 'Please review the form and correct the errors.',
            icon: 'error',
            position: 'top',
        })
        return
    }

    isSaving.value = true
    const response = await api.create(formData.value)
    console.log('response', response)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/item/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}

function isValid(): boolean {

    formDataErrors.value = { ..._initialFormErrors }

    if(formData.value.description.trim() === '') {
        formDataErrors.value.description = true
    }

    if (formData.value.initial_quantity < 0) {
        formDataErrors.value.initial_quantity = true
    }

    if (formData.value.initial_average_price < 0) {
        formDataErrors.value.initial_average_price = true
    }

    if (!formData.value.item_type) {
        formDataErrors.value.item_type = true
    }

    if (!formData.value.unit) {
        formDataErrors.value.unit = true
    }

    const hasError = Object.values(formDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}

async function handleSearchProjects(input: string, loading: (status: boolean) => void ) {

    if(input.trim() === ''){
        projects.value = []
        return 
    } 

    debouncedSearchProjects(input, loading)

}


async function searchProjects(input: string, loading: (status: boolean) => void) {

    loading(true)

    try {
        const response = await fetchProjectsByName(input);
        projects.value = response
    } catch (error) {
        console.error('Error fetching Projects:', error);
    } finally {
        loading(false);
    }
}

const debouncedSearchProjects = debounce((input: string, loading: (status: boolean) => void) => {
    searchProjects(input, loading);
}, 500);

const onClickGoToList = () => router.push('/warehouse/item')

</script>