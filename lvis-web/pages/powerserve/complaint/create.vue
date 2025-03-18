<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Create Complaint</h2>
                <hr>
        
                <div class="row pb-3">
                    <div class="col">
                        <div class="row justify-content-center pt-3">
        
                            <div class="col-lg-6">

                                <div class="alert alert-info" role="alert">
                                    <div>
                                        <small class="fst-italic">
                                            Fields with * are required
                                        </small>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">
                                        Complainant Name
                                    </label>
                                    <input type="text" class="form-control" v-model="complaintData.complainant_name">
                                </div>
        
                                <!-- <div class="mb-3">
                                    <label class="form-label">
                                        Description
                                    </label>
                                    <textarea class="form-control form-control-sm" rows="5" v-model="rvData.notes"></textarea>
                                </div> -->
        
                                <div class="d-flex justify-content-between">
                                    <nuxt-link class="btn btn-secondary" to="/powerserve/complaint">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'search']" />
                                        </client-only> 
                                        Search Complaint
                                    </nuxt-link>
                                    <button data-testid="save" @click="save()" type="button" class="btn btn-primary" :disabled="isSaving">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'save']"/>
                                        </client-only> {{ isSaving ? 'Saving...' : 'Save' }}
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
import * as complaintApi from '~/composables/powerserve/complaint/complaint.api'
import type { CreateComplaintInput } from '~/composables/powerserve/complaint/complaint.types';

definePageMeta({
    name: ROUTES.COMPLAINT_CREATE,
    layout: "layout-powerserve",
    middleware: ['auth'],
})
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)

// CONSTANTS
const router = useRouter();

// FLAGS
const isSaving = ref(false)

// INITIAL DATA
const _complaintDataErrorsInitial = {
    complainant_name: false,
}

// FORM DATA
const complaintData = ref<CreateComplaintInput>({} as CreateComplaintInput)
const complaintDataErrors = ref({ ..._complaintDataErrorsInitial })

// DROPDOWNS




// ======================== LIFECYCLE HOOKS ========================  
onMounted(async () => {
    authUser.value = getAuthUser()

    // const response = await complaintApi.fetchFormDataInCreate()


    isLoadingPage.value = false

})



// ======================== COMPUTED ========================  

// ======================== WATCHERS ========================  


// ======================== FUNCTIONS ========================  

async function save() {

    console.log('save')

    if (!isValid()) {
        Swal.fire({
            title: 'Form has errors!',
            text: 'Please review the form and correct the errors.',
            icon: 'error',
            position: 'top',
        })
        return
    }

    console.log('saving...')

    isSaving.value = true
    const response = await complaintApi.create(complaintData.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/powerserve/complaint/view/${response.data.id}`);
    } else {
        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })
    }

}


// ======================== UTILS ========================  

function isValid(): boolean {

    complaintDataErrors.value = { ..._complaintDataErrorsInitial }

    if (!complaintData.value.complainant_name) {
        complaintDataErrors.value.complainant_name = true
    }

    const hasError = Object.values(complaintDataErrors.value).includes(true);

    if (hasError) {
        return false
    }

    return true

}

</script>
