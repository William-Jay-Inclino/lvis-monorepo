<template>

    <div class="card">
        <div class="card-body">
            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Update Division</h2>
        
                <hr>
        
                <form v-if="item" @submit.prevent="onSubmit">
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">

                            <div class="alert alert-info fst-italic" role="alert">
                                <small> Fields with * are required </small>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">
                                    Code <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.code" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Name <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.name" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Department <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="departments" label="code" v-model="item.department">
                                        <template #search="{attributes, events}">
                                            <input
                                            class="vs__search"
                                            :required="!item.department"
                                            v-bind="attributes"
                                            v-on="events"
                                            />
                                        </template>
                                    </v-select>
                                </client-only>
                            </div>
                            <div class="mb-3">
                                <SystemUserPermissions :permissions="item.permissions" />
                            </div>
                        </div>
                    </div>
        
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">
                            <div class="d-flex justify-content-between">
                                <button type="button" @click="onClickGoToList" class="btn btn-secondary">
                                    <i class="fas fa-list"></i> Go to list
                                </button>
                                <button type="submit" class="btn btn-success" :disabled="isSaving">
                                    <i class="fas fa-sync"></i> {{ isSaving ? 'Updating...' : 'Update' }}
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
import type { CreateDivisionInput, Division } from '~/composables/system/division/division.ts'
import Swal from 'sweetalert2'
import type { Department } from '~/composables/system/department/department';

definePageMeta({
    name: ROUTES.DIVISION_UPDATE,
    layout: "layout-system",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const route = useRoute()
const router = useRouter()
const isSaving = ref(false)

const item = ref<Division>()
const departments = ref<Department[]>([])

onMounted(async () => {

    const response = await api.fetchFormDataInUpdate(route.params.id as string)

    if (!response.division) {
        console.error('Division not found')
        return
    }

    item.value = response.division
    departments.value = response.departments

    isLoadingPage.value = false
})


async function onSubmit() {

    if (!item.value) return

    console.log('saving...')

    const data: CreateDivisionInput = {
        code: item.value.code,
        name: item.value.name,
        department: item.value.department,
        permissions: item.value.permissions
    }

    isSaving.value = true
    const response = await api.update(item.value.id, data)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/system/division/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/system/division')

</script>