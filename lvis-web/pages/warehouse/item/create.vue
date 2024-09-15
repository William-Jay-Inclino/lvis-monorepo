<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Create Item</h2>
        
                <hr>
        
                <form @submit.prevent="onSubmit">
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">
                                    Code <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="formData.code">
                                <small v-if="formDataErrors.code" class="text-danger fst-italic"> This field is required
                                </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Name <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="formData.name">
                                <small v-if="formDataErrors.name" class="text-danger fst-italic"> This field is required
                                </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Description
                                </label>
                                <textarea rows="3" class="form-control" v-model="formData.description"></textarea>
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
                                <input type="number" class="form-control" v-model="formData.initial_average_price">
                                <small v-if="formDataErrors.initial_average_price" class="text-danger fst-italic"> Must be
                                    greater than or equal to 0 </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Unit</label>
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
                            <div class="mb-3">
                                <label class="form-label">Alert level</label>
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
                                    <i class="fas fa-list"></i> Go to list
                                </button>
                                <button type="submit" class="btn btn-primary" :disabled="isSaving">
                                    <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
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
import { ITEM_TYPES } from '~/utils/constants';

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
const alertLevels = ref<number[]>([])

const _initialFormErrors = {
    code: false,
    name: false,
    initial_quantity: false,
    initial_average_price: false,
    item_type: false,
    unit: false,
}

const _initialFormData: CreateItemInput = {
    item_type: {
        id: ITEM_TYPE.OFFICE_SUPPLY,
        name: itemTypeMapper[ITEM_TYPE.OFFICE_SUPPLY],
    },
    unit: null,
    code: '',
    name: '',
    description: '',
    initial_quantity: 0,
    initial_average_price: 0,
    alert_level: 20
}

const formData = ref({ ..._initialFormData })
const formDataErrors = ref({ ..._initialFormErrors })

onMounted(async () => {

    const response = await api.fetchFormDataInCreate()

    units.value = response.units
    itemTypes.value = ITEM_TYPES
    alertLevels.value = generateNumbersBy5({ max: 100 })
    isLoadingPage.value = false
})


async function onSubmit() {

    console.log('saving...')

    if (!isValid()) return

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

    if (formData.value.code.trim() === '') {
        formDataErrors.value.code = true
    }

    if (formData.value.name.trim() === '') {
        formDataErrors.value.name = true
    }

    if (!formData.value.initial_quantity || formData.value.initial_quantity < 0) {
        formDataErrors.value.initial_quantity = true
    }

    if (!formData.value.initial_average_price || formData.value.initial_average_price < 0) {
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


const onClickGoToList = () => router.push('/warehouse/item')

</script>