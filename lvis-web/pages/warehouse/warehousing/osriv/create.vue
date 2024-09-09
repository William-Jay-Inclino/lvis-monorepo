<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Create OSRIV</h2>
                <hr>

                <div class="row pt-3">
                    <div class="col">
                        <span class="text-secondary">
                            Step {{ currentStep }} of 2:
                            <span v-if="currentStep === 1"> Fill up OSRIV info </span>
                            <span v-if="currentStep === 2"> Add OSRIV items </span>
                        </span>
                    </div>
                </div>
        
                <div v-show="currentStep === 1" class="row justify-content-center pt-5 pb-3">
        
                    <div class="col-lg-6">

                        <div class="mb-3">
                            <label class="form-label">
                                Item From <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="stations" label="name" v-model="osrivData.item_from" :clearable="false"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requested By <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="osrivData.requested_by" :clearable="false"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Imd Superior <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="osrivData.supervisor" :clearable="false"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Warehouse Custodian <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="osrivData.warehouse_custodian" :clearable="false"></v-select>
                            </client-only>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Purpose <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="osrivData.purpose" class="form-control"
                                rows="3"> </textarea>
                            <small class="text-danger fst-italic" v-show="osrivDataErrors.purpose"> This field is required
                            </small>
                        </div>

                    </div>
        
                </div>
        
                <div v-show="currentStep === 2" class="row justify-content-center pt-5">
                    <div class="col-lg-10">
                        
                        <div class="mb-3">
                            <small class="form-label fst-italic text-muted">
                                Input the name of the item in the search field below
                            </small>
                            <client-only>
                                <v-select :options="items" label="name" v-model="osrivData.items" multiple></v-select>
                            </client-only>
                        </div>

                        <div v-if="osrivData.items.length > 0" class="mb-3">

                            <div class="alert alert-info">
                                <small class="fst-italic">
                                    Input qty should be greater than 0 and less than or equal to the available quantity
                                </small>
                            </div>
                            
                            <table class="table table-bordered table-hovered table-sm small">
                                <thead>
                                    <tr>
                                        <th class="text-muted">Description</th>
                                        <th class="text-muted">Unit</th>
                                        <th class="text-muted">Available Qty</th>
                                        <th class="text-muted">Ave. Price</th>
                                        <th class="text-muted">Input Qty</th>
                                        <th class="text-muted">Amount</th>
                                        <th class="text-muted">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="i, indx in osrivData.items">
                                        <td class="text-muted"> {{ i.name + ' - ' + i.description }} </td>
                                        <td class="text-muted"> {{ i.unit.name }} </td>
                                        <td class="text-muted"> {{ i.available_quantity }} </td>
                                        <td class="text-muted"> {{ i.GWAPrice }} </td>
                                        <td class="text-muted">
                                           <input
                                             type="number"
                                             class="form-control"
                                             :class="{'border-danger': i.qty_input <= 0 || i.qty_input > i.available_quantity}"
                                             v-model="i.qty_input"/>
                                        </td>
                                        <td class="text-muted">
                                            <input
                                             type="number"
                                             class="form-control"
                                             :value="i.GWAPrice * i.qty_input"/>
                                        </td>
                                        <td class="text-center">
                                            <button @click="handleRemoveItem(indx)" class="btn btn-sm btn-light me-3">
                                                <i class="fas fa-trash text-danger"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                <div class="row justify-content-center pt-5">
                    <div :class="{ 'col-lg-6': currentStep === 1, 'col-lg-10 col-md-10 col-sm-12': currentStep === 2 }">
        
                        <div v-if="currentStep === 1" class="d-flex justify-content-between">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/warehousing/osriv">
                                <i class="fas fa-chevron-left"></i> Back to Search
                            </nuxt-link>
                            <button @click="onClickNextStep1()" type="button" class="btn btn-primary">
                                <i class="fas fa-chevron-right"></i> Next
                            </button>
                        </div>
        
                        <div v-else class="d-flex justify-content-between">
                            <button @click="currentStep--" type="button" class="btn btn-secondary">
                                <i class="fas fa-chevron-left"></i> Back
                            </button>
                            <button @click="save()" :disabled="isSaving" type="button"
                                class="btn btn-primary">
                                <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
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


</template>


<script setup lang="ts">

import * as osrivApi from '~/composables/warehouse/osriv/osriv.api'
import type { CreateOsrivInput } from '~/composables/warehouse/osriv/osriv.types';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';
import type { Station } from '~/composables/warehouse/station/station';
import type { CreateOSRIVItem } from '~/composables/warehouse/osriv/osriv-item.types';

definePageMeta({
    name: ROUTES.RV_CREATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// CONSTANTS
const router = useRouter();

// FLAGS
const isSaving = ref(false)

// INITIAL DATA
const _osrivDataErrorsInitial = {
    purpose: false,
    requested_by: false,
    item_from: false,
    supervisor: false,
    warehouse_custodian: false,
    items: false,
}

const currentStep = ref(1)

// FORM DATA
const osrivData = ref<CreateOsrivInput>({
    purpose: "",
    requested_by: null,
    item_from: null,
    supervisor: null,
    warehouse_custodian: null,
    approvers: [],
    items: []
})
const osrivDataErrors = ref({ ..._osrivDataErrorsInitial })


// DROPDOWNS
const employees = ref<Employee[]>([])
const stations = ref<Station[]>([])
const items = ref<CreateOSRIVItem[]>([])



// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await osrivApi.fetchFormDataInCreate()

    employees.value = addPropertyFullName(response.employees)
    stations.value = response.stations
    items.value = response.items.map(i => {
        const x: CreateOSRIVItem = {
            id: i.id,
            code: i.code,
            name: i.name,
            description: i.description,
            available_quantity: i.available_quantity,
            unit: i.unit,
            qty_input: 0,
            GWAPrice: i.GWAPrice,
        }

        return x
    })

    isLoadingPage.value = false

})



// ======================== FUNCTIONS ========================  

async function save() {

    console.log('save')

    // if (!isValid()) {
    //     return
    // }

    // console.log('saving...')

    // isSaving.value = true
    // const response = await rvApi.create(rvData.value)
    // isSaving.value = false

    // if (response.success && response.data) {

    //     Swal.fire({
    //         title: 'Success!',
    //         text: response.msg,
    //         icon: 'success',
    //         position: 'top',
    //     })

    //     router.push(`/warehouse/purchasing/rv/view/${response.data.id}`);
    // } else {
    //     Swal.fire({
    //         title: 'Error!',
    //         text: response.msg,
    //         icon: 'error',
    //         position: 'top',
    //     })
    // }

}

function handleRemoveItem(indx: number) {
    osrivData.value.items.splice(indx, 1)
}


async function onClickNextStep1() {

    osrivDataErrors.value = { ..._osrivDataErrorsInitial }

    // if (osrivData.value.purpose.trim() === '') {
    //     osrivDataErrors.value.purpose = true
    // }

    const hasError = Object.values(osrivDataErrors.value).includes(true);

    if (hasError) {
        return
    }

    currentStep.value += 1
}

</script>
