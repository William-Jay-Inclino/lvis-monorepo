<template>

    <div class="card">
        <div class="card-body">
            
            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Update Item</h2>
        
                <hr>
        
                <form v-if="item" @submit.prevent="onSubmit">
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">
                                    Code <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.code">
                                <small v-if="formDataErrors.code" class="text-danger fst-italic"> This field is required
                                </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Description
                                </label>
                                <textarea rows="3" class="form-control" v-model="item.description"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Unit</label>
                                <client-only>
                                    <v-select :options="units" label="name" v-model="item.unit" :clearable="false"></v-select>
                                </client-only>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Item Types</label>
                                <client-only>
                                    <v-select :options="itemTypes" label="name" v-model="item.item_type"
                                        :clearable="false"></v-select>
                                </client-only>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Alert level</label>
                                <client-only>
                                    <v-select :options="alertLevels" v-model="item.alert_level" :clearable="false"></v-select>
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

import * as api from '~/composables/warehouse/item/item.api'
import type { UpdateItemInput, Item, ItemType } from '~/composables/warehouse/item/item.type'
import Swal from 'sweetalert2'
import { generateNumbersBy5 } from '~/composables/warehouse/item/item.common';

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
const alertLevels = ref<number[]>([])

const _initialFormErrors = {
    code: false,
    name: false,
}

const item = ref<Item>({} as Item)
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
    alertLevels.value = generateNumbersBy5({ max: 100 })
    isLoadingPage.value = false
})


async function onSubmit() {

    if (!item.value) return

    console.log('saving...')

    if (!isValid()) return

    const data: UpdateItemInput = {
        item_type: item.value.item_type,
        unit: item.value.unit,
        code: item.value.code,
        description: item.value.description,
        alert_level: item.value.alert_level,
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

    if (item.value.code.trim() === '') {
        formDataErrors.value.code = true
    }

    const hasError = Object.values(formDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}


const onClickGoToList = () => router.push('/warehouse/item')

</script>