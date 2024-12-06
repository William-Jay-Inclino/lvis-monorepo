<template>

    <div>

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
    
                            <div class="alert alert-info" role="alert">
                                <div>
                                    <small class="fst-italic">
                                        - Fields with * are required
                                    </small>
                                </div>
                                <div v-if="seriv_expiration">
                                    <small class="fst-italic">
                                        - The system will automatically cancel this SERIV if it's not approved within <b>{{ seriv_expiration }} days </b>.
                                    </small>
                                </div>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Request Type <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="request_types" label="name" v-model="serivData.request_type" :clearable="false"></v-select>
                                </client-only>
                                <small v-if="showMwoNumber" class="text-muted fst-italic">
                                    Note: The MWO number is automatically assigned when approved.
                                </small>
                                <small class="text-danger fst-italic" v-show="serivDataErrors.request_type"> {{ errorMsg }} </small>
                            </div>
    
                            <div v-if="showOrNumber" class="mb-3">
                                <label class="form-label">
                                    OR Number
                                </label>
                                <input v-model="serivData.or_number" class="form-control"
                                    rows="3" />
                            </div>
    
                            <div v-if="showCwoNumber" class="mb-3">
                                <label class="form-label">
                                    CWO Number
                                </label>
                                <input v-model="serivData.cwo_number" class="form-control"
                                    rows="3" />
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    JO Number
                                </label>
                                <input v-model="serivData.jo_number" class="form-control"
                                    rows="3" />
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Item From <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="stations" label="name" v-model="serivData.item_from" :clearable="false" :disabled="!!default_station"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="serivDataErrors.item_from"> {{ errorMsg }} </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Consumer Name <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="serivData.consumer_name" class="form-control"
                                    rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-show="serivDataErrors.consumer_name"> {{ errorMsg }}
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Location <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="serivData.location" class="form-control"
                                    rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-show="serivDataErrors.location"> {{ errorMsg }}
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Purpose <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="serivData.purpose" class="form-control"
                                    rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-show="serivDataErrors.purpose"> {{ errorMsg }}
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Requested By <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="employees" label="fullname" v-model="serivData.requested_by" :clearable="false"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="serivDataErrors.requested_by"> {{ errorMsg }} </small>
                            </div>
    
                            <div class="mb-4">
                                <label class="form-label">
                                    Withdrawn By <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="employees" label="fullname" v-model="serivData.withdrawn_by" :clearable="false"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="serivDataErrors.withdrawn_by"> {{ errorMsg }} </small>
                            </div>

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'users']"/>
                            </client-only> Signatories
                                </h5>
                                <hr class="result">
                            </div>
    
                            <div v-for="approver in serivData.approvers" class="mb-3">
                                <label class="form-label">
                                    {{ approver.label }} <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select
                                        :options="approver.order === 3 ? auditors : employees"
                                        label="fullname"
                                        v-model="approver.approver"
                                        :clearable="false"
                                        :disabled="approver.order === 5"
                                      ></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="approver.showRequiredMsg"> {{ errorMsg }} </small>
                            </div>
    
                        </div>
            
                    </div>
            
                    <div v-show="currentStep === 2" class="row justify-content-center pt-5">
                        <div class="col-lg-10">

                            <div class="text-end mb-3">
                                <button
                                    class="btn btn-success btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addItemModal">
                                    <i
                                    class="fas fa-plus"></i>
                                    Add Item
                                </button>
                            </div>
    
                            <WarehouseItems
                              :items="serivData.items"
                              @remove-item="handleRemoveItem"
                              @update-qty="handleUpdateItemQty" />
    
                        </div>
                    </div> 
    
                    <div class="row justify-content-center pt-5">
                        <div :class="{ 'col-lg-6': currentStep === 1, 'col-lg-10 col-md-10 col-sm-12': currentStep === 2 }">
            
                            <div v-if="currentStep === 1" class="d-flex justify-content-between">
                                <nuxt-link class="btn btn-secondary" to="/warehouse/seriv">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search SERIV
                                </nuxt-link>
                                <button @click="onClickNextStep1()" class="btn btn-primary">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-right']"/>
                            </client-only> Next
                                </button>
                            </div>
            
                            <div v-else class="d-flex justify-content-between">
                                <button @click="currentStep--" type="button" class="btn btn-secondary">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                            </client-only> Back
                                </button>
                                <button @click="save()" :disabled="isSaving || isDisabledSave" type="button"
                                    class="btn btn-primary">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'save']"/>
                            </client-only> {{ isSaving ? 'Saving...' : 'Save' }}
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

        <WarehouseAddItemModal @add-item="handleAddItem" :items="items" :added-item-ids="serivItemIds"/>

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
    import { SERIV_DEFAULT_APPROVERS } from '~/composables/warehouse/seriv/seriv.constants';
    import { showCWOnumber, showMWOnumber, showORnumber } from '~/utils/helpers';
    import { useToast } from 'vue-toastification';

    definePageMeta({
        name: ROUTES.SERIV_CREATE,
        layout: "layout-warehouse",
        middleware: ['auth'],
    })
    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)

    // CONSTANTS
    const router = useRouter()
    const toast = useToast();
    // FLAGS
    const isSaving = ref(false)
    const errorMsg = 'This field is required'

    // INITIAL DATA
    const _serivDataErrorsInitial = {
        request_type: false,
        purpose: false,
        consumer_name: false,
        location: false,
        requested_by: false,
        withdrawn_by: false,
        item_from: false,
        items: false,
    }

    const currentStep = ref(1)

    // FORM DATA
    const serivData = ref<CreateSerivInput>({
        request_type: null,
        purpose: "",
        or_number: "",
        cwo_number: "",
        jo_number: "",
        consumer_name: "",
        location: "",
        requested_by: null,
        withdrawn_by: null,
        item_from: null,
        approvers: [],
        items: []
    })
    const serivDataErrors = ref({ ..._serivDataErrorsInitial })

    const default_station = ref<Station>()
    const seriv_expiration = ref()

    // DROPDOWNS
    const employees = ref<Employee[]>([])
    const auditors = ref<Employee[]>([])
    const stations = ref<Station[]>([])
    const items = ref<AddItem[]>([])
    const request_types = ref<WarehouseRequestType[]>([])


    // ======================== LIFECYCLE HOOKS ========================  
    onMounted(async () => {
        authUser.value = getAuthUser()

        const response = await serivApi.fetchFormDataInCreate()

        employees.value = addPropertyFullName(response.employees)
        auditors.value = addPropertyFullName(response.auditors)
        stations.value = response.stations
        request_types.value = WAREHOUSE_REQUEST_TYPES.map(i => ({...i}))

        items.value = response.items.map(i => {
            const x: AddItem = {
                id: i.id,
                code: i.code,
                label: i.code + ' - ' + i.description,
                description: i.description,
                available_quantity: i.total_quantity - i.quantity_on_queue,
                unit: i.unit,
                qty_request: 0,
                GWAPrice: i.GWAPrice,
                item_type: i.item_type,
            }

            return x
        })

        serivData.value.approvers = SERIV_DEFAULT_APPROVERS.map(i => ({...i}))

        // set default warehouse_custodian
        if(response.warehouse_custodian) {
            const wc = serivData.value.approvers.find(i => i.order === 5)
            if(wc) {
                wc.approver = response.warehouse_custodian
                wc.approver['fullname'] = getFullname(wc.approver.firstname, wc.approver.middlename, wc.approver.lastname)
            }
        }

        // set default station 
        if(response.default_station) {

            default_station.value = response.default_station

            const station = stations.value.find(i => i.id === response.default_station?.id)
            if(station) {
                serivData.value.item_from = station
            }
        }

        if(response.seriv_expiration) {
            seriv_expiration.value = response.seriv_expiration
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

    const showOrNumber = computed( () => {

        if(!serivData.value.request_type) return false 

        return showORnumber(serivData.value.request_type.id)
        
    })

    const showMwoNumber = computed( () => {

        if(!serivData.value.request_type) return false 

        return showMWOnumber(serivData.value.request_type.id)


    })

    const showCwoNumber = computed( () => {

        if(!serivData.value.request_type) return false 

        return showCWOnumber(serivData.value.request_type.id)

    })

    const serivItemIds = computed( () => serivData.value.items.map(i => i.id))


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

    function handleUpdateItemQty(item: AddItem, qty: number) {
        console.log('handleUpdateItemQty', item, qty);

        const serivItem = serivData.value.items.find(i => i.id === item.id) 

        if(!serivItem) {
            console.error('Item not found', item.code);
            return 
        }

        serivItem.qty_request = qty

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

    function handleAddItem(itemId: string) {
        console.log('handleAddItem', itemId);
        const item = items.value.find(i => i.id === itemId)

        if(!item) {
            console.error('item not found');
            return 
        }

        const isExist = serivData.value.items.find(i => i.id === itemId) 

        if(isExist) {
            toast.error('Item exist!')
            return 
        }

        const serivItem: AddItem = {
            id: item.id,
            code: item.code,
            label: item.code + ' - ' + item.description,
            description: item.description,
            available_quantity: item.available_quantity,
            unit: item.unit,
            GWAPrice: item.GWAPrice,
            qty_request: 0,
            item_type: item.item_type,
        }

        serivData.value.items.push(serivItem)
        toast.success('Item added!')
    }

    async function onClickNextStep1() {

        serivDataErrors.value = { ..._serivDataErrorsInitial }

        if(!serivData.value.request_type) {
            serivDataErrors.value.request_type = true
        }

        if (serivData.value.purpose.trim() === '') {
            serivDataErrors.value.purpose = true
        }

        // if(showOrNumber.value === true && serivData.value.or_number?.trim() === '') {
        //     serivDataErrors.value.or_number = true
        // }

        // if(showMwoNumber.value === true && serivData.value.mwo_number?.trim() === '') {
        //     serivDataErrors.value.mwo_number = true
        // }

        // if(showCwoNumber.value === true && serivData.value.cwo_number?.trim() === '') {
        //     serivDataErrors.value.cwo_number = true
        // }

        // if(serivData.value.jo_number?.trim() === '') {
        //     serivDataErrors.value.jo_number = true
        // }

        if(serivData.value.consumer_name?.trim() === '') {
            serivDataErrors.value.consumer_name = true
        }

        if(serivData.value.location?.trim() === '') {
            serivDataErrors.value.location = true
        }

        if (!serivData.value.requested_by) {
            serivDataErrors.value.requested_by = true
        }

        if (!serivData.value.withdrawn_by) {
            serivDataErrors.value.withdrawn_by = true
        }

        if (!serivData.value.item_from) {
            serivDataErrors.value.item_from = true
        }

        for(let i of serivData.value.approvers) {
            if(!i.approver) {
                i.showRequiredMsg = true
            } else {
                i.showRequiredMsg = false 
            }
        }

        if(!hasErrorStep1()) {
            currentStep.value += 1
        }

    }

    function hasErrorStep1(): boolean {
        const hasError = Object.values(serivDataErrors.value).includes(true);
        const hasErrorApprovers = serivData.value.approvers.some(i => i.showRequiredMsg === true)
        if (hasError || hasErrorApprovers) {
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
