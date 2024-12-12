<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Update Item</h2>
        
                <hr>
        
                <form v-if="item" @submit.prevent="onSubmit">
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">

                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic">
                                    Fields with * are required
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Code
                                </label>
                                <input type="text" class="form-control" :value="item.code" disabled>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Description <span class="text-danger">*</span>
                                </label>
                                <textarea rows="3" class="form-control" v-model="formData.description"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Unit</label> <span class="text-danger">*</span>
                                <client-only>
                                    <v-select :options="units" label="name" v-model="formData.unit" :clearable="false"></v-select>
                                </client-only>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Item Types</label> <span class="text-danger">*</span>
                                <client-only>
                                    <v-select :options="itemTypes" label="name" v-model="formData.item_type"
                                        :clearable="false"></v-select>
                                </client-only>
                            </div>
                            <div v-if="show_project_field" class="mb-3">
                                <label class="form-label">Project</label>
                                <client-only>
                                    <v-select @search="handleSearchProjects" :options="projects" label="name" v-model="formData.project"></v-select>
                                </client-only>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Alert level</label> <span class="text-danger">*</span>
                                <client-only>
                                    <v-select :options="alertLevels" v-model="formData.alert_level" :clearable="false"></v-select>
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
                                <button type="submit" class="btn btn-success" :disabled="isSaving">
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
import type { UpdateItemInput, Item, ItemType } from '~/composables/warehouse/item/item.type'
import Swal from 'sweetalert2'
import { generateNumbersBy5 } from '~/composables/warehouse/item/item.common';
import type { Project } from '~/composables/warehouse/project/project.types';
import { fetchProjectsByName } from '~/composables/warehouse/project/project.api';

definePageMeta({
    name: ROUTES.ITEM_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const route = useRoute()
const router = useRouter()
const isSaving = ref(false)

const itemTypes = ref<ItemType[]>([])
const units = ref<Unit[]>([])
const projects = ref<Project[]>([])
const alertLevels = ref<number[]>([])

const _initialFormErrors = {
    description: false,
}

const item = ref<Item>({} as Item)
const formData = ref<UpdateItemInput>({} as UpdateItemInput)
const formDataErrors = ref({ ..._initialFormErrors })


onMounted(async () => {

    const response = await api.fetchFormDataInUpdate(route.params.id as string)

    if (!response.item) {
        console.error('Item not found')
        return
    }
    itemTypes.value = response.item_types
    item.value = response.item
    units.value = response.units
    projects.value = response.projects
    alertLevels.value = generateNumbersBy5({ max: 100 })

    formData.value = {
        item_type: response.item.item_type,
        unit: response.item.unit,
        description: response.item.description,
        alert_level: response.item.alert_level,
        project: response.item.project_item ? response.item.project_item.project : null
    }

    isLoadingPage.value = false
})


const item_type = computed( () => {
    return formData.value.item_type 
})

const show_project_field = computed( (): boolean => {

    if(item_type.value.code === ITEM_TYPE.LINE_MATERIALS || item_type.value.code === ITEM_TYPE.SPECIAL_EQUIPMENT) {
        return true 
    }

    return false

})

// clear project if item type is null or not line material and special equipment
watch(item_type, (val) => {
    if(!val || val.code !== ITEM_TYPE.LINE_MATERIALS && val.code !== ITEM_TYPE.SPECIAL_EQUIPMENT) {
        formData.value.project = null 
    }
})


async function onSubmit() {

    if (!item.value) return

    console.log('saving...')

    if (!isValid()) return

    isSaving.value = true
    const response = await api.update(item.value.id, formData.value)
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

    if (item.value.description.trim() === '') {
        formDataErrors.value.description = true
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