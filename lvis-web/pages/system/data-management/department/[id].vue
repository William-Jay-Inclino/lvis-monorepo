<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Update Department</h2>
        
                <hr>
        
                <form v-if="item" @submit.prevent="onSubmit">
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">
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

import * as api from '~/composables/system/department/department.api'
import type { CreateDepartmentInput, Department } from '~/composables/system/department/department'
import Swal from 'sweetalert2'

definePageMeta({
    name: ROUTES.DEPARTMENT_UPDATE,
    layout: "layout-system",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const route = useRoute()
const router = useRouter()
const isSaving = ref(false)

const item = ref<Department>()

onMounted(async () => {

    const response = await api.findOne(route.params.id as string)

    if (!response) {
        console.error('Department not found')
        return
    }

    item.value = response

    isLoadingPage.value = false
})


async function onSubmit() {

    if (!item.value) return

    console.log('saving...')

    const data: CreateDepartmentInput = {
        code: item.value.code,
        name: item.value.name,
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

        router.push(`/system/data-management/department/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/system/data-management/department')

</script>