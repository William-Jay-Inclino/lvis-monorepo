<template>

    <div class="card">
        <div class="card-body">
        
            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Update Account</h2>
        
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
                                    Description <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.description" required>
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

</template>


<script setup lang="ts">

import * as api from '~/composables/system/account/account.api'
import type { CreateAccountInput, Account } from '~/composables/system/account/account'
import Swal from 'sweetalert2'

definePageMeta({
    name: ROUTES.ACCOUNT_UPDATE,
    layout: "layout-system",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)

const route = useRoute()
const router = useRouter()
const isSaving = ref(false)

const item = ref<Account>()

onMounted(async () => {

    const response = await api.findOne(route.params.id as string)

    if (!response) {
        console.error('Account not found')
        return
    }

    item.value = response

    isLoadingPage.value = false
})


async function onSubmit() {

    if (!item.value) return

    console.log('saving...')

    const data: CreateAccountInput = {
        code: item.value.code,
        name: item.value.name,
        description: item.value.description,
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

        router.push(`/system/account/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/system/account')

</script>