<template>
    <div class="card">

        <div class="card-body">

            <h2 class="text-warning">Create Supplier</h2>
    
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
                                Name <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="formData.name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Contact <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="formData.contact" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                Address <span class="text-danger">*</span>
                            </label>
                            <textarea class="form-control form-control-sm" v-model="formData.address" rows="3" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                TIN <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="formData.tin" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                VAT Status <span class="text-danger">*</span>
                            </label>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" v-model="formData.is_vat_registered" :value="false">
                                <label class="form-check-label" for="exampleRadios1">
                                    Non-VAT Registered
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio"  v-model="formData.is_vat_registered" :value="true">
                                <label class="form-check-label" for="exampleRadios1">
                                    VAT Registered
                                </label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">
                                VAT Type <span class="text-danger">*</span>
                            </label>
                            <select v-model="formData.vat_type" class="form-select" :disabled="!formData.is_vat_registered">
                                <option v-if="!formData.is_vat_registered" selected :value="VAT_TYPE.NONE"> {{ VAT[VAT_TYPE.NONE].label }} </option>
                                <option :value="VAT_TYPE.INC"> {{ VAT[VAT_TYPE.INC].label }} </option>
                                <option :value="VAT_TYPE.EXC"> {{ VAT[VAT_TYPE.EXC].label }} </option>
                            </select>
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

    </div>

</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/supplier/supplier.api'
import type { CreateSupplierInput } from '~/composables/warehouse/supplier/supplier'
import Swal from 'sweetalert2'

definePageMeta({
    name: ROUTES.SUPPLIER_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const router = useRouter()
const isSaving = ref(false)

const _initialFormData: CreateSupplierInput = {
    name: '',
    contact: '',
    tin: '',
    address: '',
    is_vat_registered: false,
    vat_type: VAT_TYPE.NONE
}

const formData = ref({ ..._initialFormData })

const isVatRegistered = computed( () => formData.value.is_vat_registered)

watch(isVatRegistered, (val) => {

    if(!val) {
        formData.value.vat_type = VAT_TYPE.NONE
    } else {
        formData.value.vat_type = VAT_TYPE.INC
    }

})

async function onSubmit() {

    console.log('saving...')

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

        router.push(`/warehouse/supplier/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/warehouse/supplier')

</script>