<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser">
                <h2 class="text-warning">Create SERIV</h2>
                <hr>

                <div class="row pt-3">
                    <div class="col">
                        <span class="text-secondary">
                            Step {{ currentStep }} of 2:
                            <span v-if="currentStep === 1"> Fill up SERIV info </span>
                            <span v-if="currentStep === 2"> Add SERIV items </span>
                        </span>
                    </div>
                </div>
        
                <div v-show="currentStep === 1" class="row justify-content-center pt-5 pb-3">
        
                    <div class="col-lg-6">

                        <div class="mb-3">
                            <label class="form-label">
                                Request Type <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="request_types" label="name" v-model="serivData.request_type" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="serivDataErrors.request_type"> This field is required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Item From <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="stations" label="name" v-model="serivData.item_from" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="serivDataErrors.item_from"> This field is required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Requested By <span class="text-danger">*</span>
                            </label>
                            <client-only>
                                <v-select :options="employees" label="fullname" v-model="serivData.requested_by" :clearable="false"></v-select>
                            </client-only>
                            <small class="text-danger fst-italic" v-show="serivDataErrors.requested_by"> This field is required </small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">
                                Purpose <span class="text-danger">*</span>
                            </label>
                            <textarea v-model="serivData.purpose" class="form-control"
                                rows="3"> </textarea>
                            <small class="text-danger fst-italic" v-show="serivDataErrors.purpose"> This field is required
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
                                <v-select :options="items" v-model="serivData.items" label="name" multiple></v-select>
                            </client-only>
                        </div>

                        <WarehouseItems :items="serivData.items" @remove-item="handleRemoveItem"/>

                    </div>
                </div> 

                <div class="row justify-content-center pt-5">
                    <div :class="{ 'col-lg-6': currentStep === 1, 'col-lg-10 col-md-10 col-sm-12': currentStep === 2 }">
        
                        <div v-if="currentStep === 1" class="d-flex justify-content-between">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/seriv">
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

    import * as serivApi from '~/composables/warehouse/seriv/seriv.api'
    import type { CreateSerivInput } from '~/composables/warehouse/seriv/seriv.types';
    import type { Employee } from '~/composables/system/employee/employee.types';
    import { addPropertyFullName } from '~/composables/system/employee/employee';
    import type { Station } from '~/composables/warehouse/station/station';
    import type { AddItem } from '~/composables/warehouse/item/item.type';
    import Swal from 'sweetalert2';
    import type { CreateSERIVApprover } from '~/composables/warehouse/seriv/seriv-approver.types';

    definePageMeta({
        name: ROUTES.SERIV_CREATE,
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
    const _serivDataErrorsInitial = {
        request_type: false,
        purpose: false,
        requested_by: false,
        item_from: false,
        items: false,
    }

    const currentStep = ref(1)

    // FORM DATA
    const serivData = ref<CreateSerivInput>({
        request_type: {
            id: WAREHOUSE_REQUEST_TYPE.MAINTENANCE_WORK_ORDER,
            name: warehouseRequestTypeMapper[WAREHOUSE_REQUEST_TYPE.MAINTENANCE_WORK_ORDER]
        },
        purpose: "",
        requested_by: null,
        item_from: null,
        approvers: [],
        items: []
    })
    const serivDataErrors = ref({ ..._serivDataErrorsInitial })


    // DROPDOWNS
    const employees = ref<Employee[]>([])
    const stations = ref<Station[]>([])
    const items = ref<AddItem[]>([])
    const request_types = ref<WarehouseRequestType[]>([])


    // ======================== LIFECYCLE HOOKS ========================  
    onMounted(async () => {
        authUser.value = getAuthUser()

        const response = await serivApi.fetchFormDataInCreate()

        employees.value = addPropertyFullName(response.employees)
        stations.value = response.stations
        request_types.value = WAREHOUSE_REQUEST_TYPES

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

        isSaving.value = true
        const response = await serivApi.create(serivData.value)
        isSaving.value = false

        if (response.success && response.data) {

            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })

            router.push(`/warehouse/seriv/view/${response.data.id}`);

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

        const indx = serivData.value.items.findIndex(i => i.id === item.id)

        if(indx === -1) {
            console.error('item not found in serivData.items with id of ', item.id);
            return 
        }

        serivData.value.items.splice(indx, 1)
    }


    async function onClickNextStep1() {

        // serivDataErrors.value = { ..._serivDataErrorsInitial }

        // if (serivData.value.purpose.trim() === '') {
        //     serivDataErrors.value.purpose = true
        // }

        // if (!serivData.value.requested_by) {
        //     serivDataErrors.value.requested_by = true
        // }

        // if (!serivData.value.item_from) {
        //     serivDataErrors.value.item_from = true
        // }

        // if(!hasErrorStep1()) {
        //     currentStep.value += 1
        // }

        currentStep.value += 1

    }

    function hasErrorStep1(): boolean {
        console.log('hasErrorStep1');
        const hasError = Object.values(serivDataErrors.value).includes(true);
        console.log('hasError', hasError);
        if (hasError) {
            return true
        }

        return false 
    }

    function hasErrorStep2(): boolean {

        if(serivData.value.items.length === 0) {
            return true
        }

        for(let item of serivData.value.items) {
            if(item.qty_request <= 0 || item.qty_request > item.available_quantity) {
                return true 
            }
        }

        return false 
    }





</script>
