<template>

    <div>

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
    
                            <div class="alert alert-info" role="alert">
                                <div>
                                    <small class="fst-italic">
                                        - Fields with * are required
                                    </small>
                                </div>
                                <div v-if="osriv_expiration">
                                    <small class="fst-italic">
                                        - The system will automatically cancel this OSRIV if it's not approved within <b>{{ osriv_expiration }} days </b>.
                                    </small>
                                </div>
                                <div>
                                    <small class="fst-italic">
                                        - Only employees with a rank higher than {{ SUPERVISOR_MIN_RANK - 1 }} are included as options in the <b>Imd. Sup.</b> field.
                                    </small>
                                </div>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Item From <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select data-testid="item-from" :options="stations" label="name" v-model="osrivData.item_from" :clearable="false" :disabled="!!default_station"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="osrivDataErrors.item_from"> {{ errorMsg }} </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Purpose <span class="text-danger">*</span>
                                </label>
                                <textarea data-testid="purpose" v-model="osrivData.purpose" class="form-control"
                                    rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-show="osrivDataErrors.purpose"> {{ errorMsg }} </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Requested By <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select data-testid="requested-by" :options="employees" label="fullname" v-model="osrivData.requested_by" :clearable="false"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="osrivDataErrors.requested_by"> {{ errorMsg }} </small>
                            </div>
    
                            <div v-for="approver, indx in osrivData.approvers" class="mb-3">
                                <label class="form-label">
                                    {{ approver.label }} <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select
                                        :data-testid="`approver-${ indx }`"
                                        :options="approver.order === 1 ? supervisors : employees"
                                        label="fullname"
                                        v-model="approver.approver"
                                        :clearable="false"
                                        :disabled="approver.order === 2"
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
                                    data-testid="add-item"
                                    class="btn btn-success btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addItemModal">
                                    <i
                                    class="fas fa-plus"></i>
                                    Add Item
                                </button>
                            </div>

                            <WarehouseItems
                              :items="osrivData.items"
                              @remove-item="handleRemoveItem"
                              @update-qty="handleUpdateItemQty" />
    
                        </div>
                    </div> 
    
                    <div class="row justify-content-center pt-5">
                        <div :class="{ 'col-lg-6': currentStep === 1, 'col-lg-10 col-md-10 col-sm-12': currentStep === 2 }">
            
                            <div v-if="currentStep === 1" class="d-flex justify-content-between">
                                <nuxt-link class="btn btn-secondary" to="/warehouse/osriv">
                                    <client-only>
                                        <font-awesome-icon :icon="['fas', 'search']" />
                                    </client-only> 
                                    Search OSRIV
                                </nuxt-link>
                                <button data-testid="next" @click="onClickNextStep1()" class="btn btn-primary">
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
                                <button data-testid="save" @click="save()" :disabled="isSaving || isDisabledSave" type="button"
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
        
        <WarehouseAddItemModal @add-item="handleAddItem" :items="items" :added-item-ids="osrivItemIds"/>

    </div>


</template>


<script setup lang="ts">

    import * as osrivApi from '~/composables/warehouse/osriv/osriv.api'
    import type { CreateOsrivInput } from '~/composables/warehouse/osriv/osriv.types';
    import type { Employee } from '~/composables/hr/employee/employee.types';
    import { addPropertyFullName } from '~/composables/hr/employee/employee';
    import type { Station } from '~/composables/warehouse/station/station';
    import type { AddItem } from '~/composables/warehouse/item/item.type';
    import Swal from 'sweetalert2';
    import { OSRIV_DEFAULT_APPROVERS } from '~/composables/warehouse/osriv/osriv.constants';
    import { useToast } from 'vue-toastification';

    definePageMeta({
        name: ROUTES.OSRIV_CREATE,
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
    const _osrivDataErrorsInitial = {
        purpose: false,
        requested_by: false,
        item_from: false,
        items: false,
    }

    const currentStep = ref(1)

    // FORM DATA
    const osrivData = ref<CreateOsrivInput>({
        purpose: "",
        requested_by: null,
        item_from: null,
        approvers: [],
        items: []
    })
    const osrivDataErrors = ref({ ..._osrivDataErrorsInitial })

    const default_station = ref<Station>()
    const osriv_expiration = ref()

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
                description: i.description,
                label: i.code + ' - ' + i.description,
                available_quantity: i.total_quantity - i.quantity_on_queue,
                unit: i.unit,
                qty_request: 0,
                GWAPrice: i.GWAPrice,
                item_type: i.item_type,
            }

            return x
        })

        osrivData.value.approvers = OSRIV_DEFAULT_APPROVERS.map(i => ({...i}))


        // set default warehouse_custodian
        if(response.warehouse_custodian) {
            const wc = osrivData.value.approvers.find(i => i.order === 2)
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
                osrivData.value.item_from = station
            }
        }

        if(response.osriv_expiration) {
            osriv_expiration.value = response.osriv_expiration
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

    const osrivItemIds = computed( () => osrivData.value.items.map(i => i.id))

    const supervisors = computed(() => {
        return employees.value.filter(i => i.rank_number >= SUPERVISOR_MIN_RANK)
    })

    // ======================== FUNCTIONS ========================  

    async function save() {

        console.log('save')

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

    function handleUpdateItemQty(item: AddItem, qty: number) {
        console.log('handleUpdateItemQty', item, qty);

        const osrivItem = osrivData.value.items.find(i => i.id === item.id) 

        if(!osrivItem) {
            console.error('Item not found', item.code);
            return 
        }

        osrivItem.qty_request = qty

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

    function handleAddItem(itemId: string) {
        console.log('handleAddItem', itemId);
        const item = items.value.find(i => i.id === itemId)

        if(!item) {
            console.error('item not found');
            return 
        }

        const isExist = osrivData.value.items.find(i => i.id === itemId) 

        if(isExist) {
            toast.error('Item exist!')
            return 
        }

        const osrivItem: AddItem = {
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

        osrivData.value.items.push(osrivItem)
        toast.success('Item added!')
    }

    function onClickNextStep1() {

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

        for(let i of osrivData.value.approvers) {
            if(!i.approver) {
                i.showRequiredMsg = true
            } else {
                i.showRequiredMsg = false 
            }
        }

        if(!hasErrorStep1()) {
            currentStep.value += 1
        } else {
            Swal.fire({
                title: 'Form has errors!',
                text: 'Please review the form and correct the errors.',
                icon: 'error',
                position: 'top',
            })
        }

    }

    function hasErrorStep1(): boolean {
        const hasError = Object.values(osrivDataErrors.value).includes(true);
        const hasErrorApprovers = osrivData.value.approvers.some(i => i.showRequiredMsg === true)
        if (hasError || hasErrorApprovers) {
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
