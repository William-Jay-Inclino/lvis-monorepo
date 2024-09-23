<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Create MCT</h2>
                <hr>
        
                <div class="row justify-content-center pt-5 pb-3">
        
                    <div class="col-lg-8">

                        <div class="alert alert-info" role="alert">
                            <small class="fst-italic">
                                Fields with * are required
                            </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                MRV Number <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="mrvs" label="mrv_number" v-model="mctData.mrv" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="mctDataErrors.mrv"> {{ errorMsg }} </small>
                        </div>

                        <div class="mb-3" v-if="mctData.mrv">

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-info-circle"></i> MRV Info
                                </h5>
                                <hr class="result">
                            </div>

                            <div class="table-responsive">
                                <table class="table table-bordered table-striped table-hover table-sm small">
                                    <tbody>
                                        <tr>
                                            <td>Date</td>
                                            <td class="text-muted"> {{formatDate(mctData.mrv?.date_requested)}} </td>
                                        </tr>
                                        <tr>
                                            <td>Item from</td>
                                            <td class="text-muted"> {{mctData.mrv?.item_from.name}} </td>
                                        </tr>
                                        <tr>
                                            <td>Purpose</td>
                                            <td class="text-muted"> {{mctData.mrv?.purpose}} </td>
                                        </tr>
                                        <tr>
                                            <td>Location</td>
                                            <td class="text-muted"> {{mctData.mrv?.location}} </td>
                                        </tr>
                                        <tr>
                                            <td>Requested By</td>
                                            <td class="text-muted"> {{ getFullname(mctData.mrv!.requested_by.firstname, mctData.mrv!.requested_by.middlename, mctData.mrv!.requested_by.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td>Withdrawn By</td>
                                            <td class="text-muted"> {{ getFullname(mctData.mrv!.withdrawn_by!.firstname, mctData.mrv!.withdrawn_by!.middlename, mctData.mrv!.withdrawn_by!.lastname) }} </td>
                                        </tr>
                                        <tr v-for="mrvApprover in mctData.mrv.mrv_approvers">
                                            <td> {{ mrvApprover.label }} </td>
                                            <td class="text-muted"> {{ getFullname(mrvApprover.approver!.firstname, mrvApprover.approver!.middlename, mrvApprover.approver!.lastname) }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-info-circle"></i> MRV Items
                                </h5>
                                <hr class="result">
                            </div>

                            <div class="table-responsive">
                                <table class="table table-bordered table-striped table-hover table-sm small">
                                        <thead>
                                            <tr>
                                                <th class="bg-secondary text-white"> No. </th>
                                                <th class="bg-secondary text-white"> Description </th>
                                                <th class="bg-secondary text-white"> Unit </th>
                                                <th class="bg-secondary text-white"> Price </th>
                                                <th class="bg-secondary text-white"> Qty Request </th>
                                                <th class="bg-secondary text-white"> Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="i, count in mctData.mrv.mrv_items">
                                                <td> {{ count + 1 }} </td>
                                                <td> {{ i.item.name + ' - ' + i.item.description }} </td>
                                                <td> {{ i.item.unit.name }} </td>
                                                <td> {{ formatToPhpCurrency(i.price) }} </td>
                                                <td> {{ i.quantity }} </td>
                                                <td> {{ formatToPhpCurrency(i.quantity * i.price) }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                            </div>

                        </div>

                        <div v-for="approver in mctData.approvers" class="mb-3">
                            <label class="form-label">
                                {{ approver.label }} <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select
                                    :options="employees"
                                    label="fullname"
                                    v-model="approver.approver"
                                    :clearable="false"
                                    disabled
                                  ></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="approver.showRequiredMsg"> {{ errorMsg }} </small>
                        </div>

                    </div>
        
                </div>

                <div class="row justify-content-center pt-5">
                    <div class="col-lg-6">
                        <div class="d-flex justify-content-between">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/mct">
                                <i class="fas fa-chevron-left"></i> Back to Search
                            </nuxt-link>
                            <button @click="save()" :disabled="isSaving || isDisabledSave" type="button"
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

    import * as mctApi from '~/composables/warehouse/mct/mct.api'
    import type { CreateMctInput } from '~/composables/warehouse/mct/mct.types';
    import type { Employee } from '~/composables/system/employee/employee.types';
    import { addPropertyFullName } from '~/composables/system/employee/employee';
    import Swal from 'sweetalert2';
    import { MCT_APPROVER, MCT_DEFAULT_APPROVERS } from '~/composables/warehouse/mct/mct.constants';
    import type { MRV } from '~/composables/warehouse/mrv/mrv.types';

    definePageMeta({
        name: ROUTES.MCT_CREATE,
        layout: "layout-warehouse",
        middleware: ['auth'],
    })
    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)

    // CONSTANTS
    const router = useRouter()
    // FLAGS
    const isSaving = ref(false)
    const errorMsg = 'This field is required'

    // INITIAL DATA
    const _mctDataErrorsInitial = {
        mrv: false,
    }

    // FORM DATA
    const mctData = ref<CreateMctInput>({
        mrv: null,
        approvers: [],
    })
    const mctDataErrors = ref({ ..._mctDataErrorsInitial })


    // DROPDOWNS
    const employees = ref<Employee[]>([])
    const mrvs = ref<MRV[]>([])


    // ======================== LIFECYCLE HOOKS ========================  
    onMounted(async () => {
        authUser.value = getAuthUser()
        const response = await mctApi.fetchFormDataInCreate()
        employees.value = addPropertyFullName(response.employees)
        mrvs.value = response.mrvs
        mctData.value.approvers = MCT_DEFAULT_APPROVERS.map(i => ({...i}))
        isLoadingPage.value = false

        // set default ISSUED BY / WAREHOUSE CUSTODIAN
        if(response.warehouse_custodian) {
            const wc = mctData.value.approvers.find(i => i.label_id === MCT_APPROVER.ISSUED_BY)
            if(wc) {
                wc.approver = response.warehouse_custodian
                wc.approver['fullname'] = getFullname(wc.approver.firstname, wc.approver.middlename, wc.approver.lastname)
            }
        }

    })



    // ======================== COMPUTED ========================  

    const isDisabledSave = computed((): boolean => {
        if(!mctData.value.mrv) {
            return true 
        }

        return false
    })

    // ======================== FUNCTIONS ========================  

    async function save() {

        console.log('save')

        if(!isValid()) {
            return 
        }

        isSaving.value = true
        const response = await mctApi.create(mctData.value)
        isSaving.value = false

        if (response.success && response.data) {

            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })

            router.push(`/warehouse/mct/view/${response.data.id}`);

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

        mctDataErrors.value = { ..._mctDataErrorsInitial }

        if(!mctData.value.mrv) {
            mctDataErrors.value.mrv = true
        }

        const hasError = Object.values(mctDataErrors.value).includes(true);
        if (hasError) {
            return false
        }

        return true

    }


</script>
