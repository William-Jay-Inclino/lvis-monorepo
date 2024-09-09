<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Create OSRIV</h2>
                <hr>
        
                <div class="row pb-3">
                    <div class="col">
                        <div class="row justify-content-center pt-3">
        
                            <div class="col-lg-6">
        
                                <div class="mb-3">
                                    <label class="form-label">
                                        Item From <span class="text-danger">*</span>
                                    </label>
                                </div>
        
                                <div class="d-flex justify-content-between">
                                    <nuxt-link class="btn btn-secondary" to="/warehouse/warehousing/osriv">
                                        <i class="fas fa-chevron-left"></i> Back to Search
                                    </nuxt-link>
                                    <button @click="save()" type="button" class="btn btn-primary" :disabled="isSaving">
                                        <i class="fas fa-save"></i> {{ isSaving ? 'Saving...' : 'Save' }}
                                    </button>
                                </div>
        
                            </div>
        
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

import Swal from 'sweetalert2'
import { getFullname } from '~/utils/helpers'
import * as rvApi from '~/composables/warehouse/rv/rv.api'
import type { Canvass } from '~/composables/warehouse/canvass/canvass.types';
import type { CreateRvInput } from '~/composables/warehouse/rv/rv.types';
import type { Employee } from '~/composables/system/employee/employee.types';
import { fetchCanvassesByRcNumber } from '~/composables/warehouse/canvass/canvass.api';
import { fetchEmployees } from '~/composables/system/employee/employee.api';
import { addPropertyFullName } from '~/composables/system/employee/employee';

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
const _rvDataErrorsInitial = {
    canvass: false,
    supervisor: false,
}

// FORM DATA
const rvData = ref<CreateRvInput>({
    canvass: null,
    supervisor: null,
    classification: null,
    work_order_no: '',
    work_order_date: null,
    notes: '',
    approvers: []
})
const rvDataErrors = ref({ ..._rvDataErrorsInitial })



// DROPDOWNS
const employees = ref<Employee[]>([])



// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    const response = await rvApi.fetchFormDataInCreate()

    employees.value = addPropertyFullName(response.employees)

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


</script>
