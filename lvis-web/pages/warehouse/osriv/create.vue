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
                            <small class="text-danger fst-italic" v-show="osrivDataErrors.item_from"> This field is required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requested By <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="osrivData.requested_by" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="osrivDataErrors.requested_by"> This field is required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Imd Superior <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="osrivData.supervisor" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="osrivDataErrors.supervisor"> This field is required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Warehouse Custodian <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="osrivData.warehouse_custodian" :clearable="false" disabled></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="osrivDataErrors.warehouse_custodian"> This field is required </small>
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
                                <v-select :options="items" v-model="osrivData.items" label="name" multiple></v-select>
                            </client-only>
                        </div>

                        <WarehouseItems :items="osrivData.items" @remove-item="handleRemoveItem"/>

                    </div>
                </div> 

                <div class="row justify-content-center pt-5">
                    <div :class="{ 'col-lg-6': currentStep === 1, 'col-lg-10 col-md-10 col-sm-12': currentStep === 2 }">
        
                        <div v-if="currentStep === 1" class="d-flex justify-content-between">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/osriv">
                                <i class="fas fa-chevron-left"></i> Back to Search
                            </nuxt-link>
                            <button @click="onClickNextStep1()" class="btn btn-primary">
                                <i class="fas fa-chevron-right"></i> Next
                            </button>
                        </div>
        
                        <div v-else class="d-flex justify-content-between">
                            <button @click="currentStep--" type="button" class="btn btn-secondary">
                                <i class="fas fa-chevron-left"></i> Back
                            </button>
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

    import * as osrivApi from '~/composables/warehouse/osriv/osriv.api'
    import type { CreateOsrivInput } from '~/composables/warehouse/osriv/osriv.types';
    import type { Employee } from '~/composables/system/employee/employee.types';
    import { addPropertyFullName } from '~/composables/system/employee/employee';
    import type { Station } from '~/composables/warehouse/station/station';
    import type { AddItem, Item } from '~/composables/warehouse/item/item.type';
import Swal from 'sweetalert2';
import type { CreateOSRIVApprover } from '~/composables/warehouse/osriv/osriv-approver.types';

    definePageMeta({
        name: ROUTES.RV_CREATE,
        layout: "layout-warehouse",
        middleware: ['auth'],
    })
    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)

    // CONSTANTS
    const router = useRouter()
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
    const items = ref<AddItem[]>([])



    // ======================== LIFECYCLE HOOKS ========================  
    onMounted(async () => {
        authUser.value = getAuthUser()

        const response = await osrivApi.fetchFormDataInCreate()

        employees.value = addPropertyFullName(response.employees)
        stations.value = response.stations
        // items.value = response.items

        items.value = response.items.map(i => {
            const x: AddItem = {
                id: i.id,
                code: i.code,
                name: i.name,
                description: i.description,
                available_quantity: i.total_quantity - i.quantity_on_queue,
                unit: i.unit,
                qty_request: 0,
                GWAPrice: i.GWAPrice,
            }

            return x
        })

        if(response.warehouse_custodian) {
            const wc = response.warehouse_custodian
            response.warehouse_custodian['fullname'] = getFullname(wc.firstname, wc.middlename, wc.lastname)
            osrivData.value.warehouse_custodian = response.warehouse_custodian
        }

        isLoadingPage.value = false

    })



    // ======================== COMPUTED ========================  

    const isDisabledSave = computed((): boolean => {
        if(hasErrorStep1() || hasErrorStep2()) {
            return true 
        }
        return false
    })


    // ======================== FUNCTIONS ========================  

    async function save() {

        console.log('save')

        console.log('saving...')

        const supervisor: CreateOSRIVApprover = {
            approver: osrivData.value.supervisor,
            label: 'Imd Superior',
            order: 1,
            is_supervisor: true,
            is_warehouse_custodian: false,
        }

        const warehouseCustodian: CreateOSRIVApprover = {
            approver: osrivData.value.warehouse_custodian,
            label: 'Warehouse Custodian',
            order: 2,
            is_supervisor: false,
            is_warehouse_custodian: true,
        }

        osrivData.value.approvers.push(supervisor)
        osrivData.value.approvers.push(warehouseCustodian)

        console.log('osrivData.value', osrivData.value);

        isSaving.value = true
        const response = await osrivApi.create(osrivData.value)
        isSaving.value = false

        if (response.success && response.data) {

            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })

            router.push(`/warehouse/osriv/view/${response.data.id}`);

        } else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

    function handleRemoveItem(item: AddItem) {
        console.log('handleRemoveItem', item);

        const indx = osrivData.value.items.findIndex(i => i.id === item.id)

        if(indx === -1) {
            console.error('item not found in osrivData.items with id of ', item.id);
            return 
        }

        osrivData.value.items.splice(indx, 1)
    }


    async function onClickNextStep1() {

        osrivDataErrors.value = { ..._osrivDataErrorsInitial }

        if (osrivData.value.purpose.trim() === '') {
            osrivDataErrors.value.purpose = true
        }

        if (!osrivData.value.requested_by) {
            osrivDataErrors.value.requested_by = true
        }

        if (!osrivData.value.item_from) {
            osrivDataErrors.value.item_from = true
        }

        if (!osrivData.value.supervisor) {
            osrivDataErrors.value.supervisor = true
        }

        if (!osrivData.value.warehouse_custodian) {
            osrivDataErrors.value.warehouse_custodian = true
        }

        if(!hasErrorStep1()) {
            currentStep.value += 1
        }

    }

    function hasErrorStep1(): boolean {
        console.log('hasErrorStep1');
        const hasError = Object.values(osrivDataErrors.value).includes(true);
        console.log('hasError', hasError);
        if (hasError) {
            return true
        }

        return false 
    }

    function hasErrorStep2(): boolean {

        if(osrivData.value.items.length === 0) {
            return true
        }

        for(let item of osrivData.value.items) {
            if(item.qty_request <= 0 || item.qty_request > item.available_quantity) {
                return true 
            }
        }

        return false 
    }





</script>
