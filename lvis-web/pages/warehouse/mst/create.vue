<template>

    <div>
        <div class="card">
            <div class="card-body">
    
                <div v-if="!isLoadingPage && authUser">
                    <h2 class="text-warning">Create MST</h2>
                    <hr>

                    <div class="row pt-3">
                        <div class="col">
                            <span class="text-secondary">
                                Step {{ currentStep }} of 2:
                                <span v-if="currentStep === 1"> Fill up MST info </span>
                                <span v-if="currentStep === 2"> Add MST items </span>
                            </span>
                        </div>
                    </div>
            
                    <div v-show="currentStep === 1" class="row justify-content-center pt-5 pb-3">
            
                        <div class="col-lg-8 mb-4">
    
                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic">
                                    Fields with * are required
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    CWO Number
                                </label>
                                <input v-model="mstData.cwo_number" class="form-control"
                                    rows="3" />
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    MWO Number 
                                </label>
                                <input v-model="mstData.mwo_number" class="form-control"
                                    rows="3" />
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Job Order Number
                                </label>
                                <input v-model="mstData.jo_number" class="form-control"
                                    rows="3" />
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Remarks <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="mstData.remarks" class="form-control"
                                    rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-show="mstDataErrors.note"> {{ errorMsg }}
                                </small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Returned By <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select
                                        :options="employees"
                                        label="fullname"
                                        v-model="mstData.returned_by"
                                        :clearable="false"
                                        ></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="mstDataErrors.returned_by"> {{ errorMsg }} </small>
                            </div>
                            <div v-for="approver in mstData.approvers" class="mb-3">
                                <label class="form-label">
                                    {{ approver.label }} <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select
                                        :options="employees"
                                        label="fullname"
                                        v-model="approver.approver"
                                        :clearable="false"
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

                            <WarehouseMSTItems
                              :items="mstData.items"
                              @status-change="handleItemStatusChange"
                              @remove-item="handleRemoveItem"
                              @update-item="handleUpdateItem" />
    
                        </div>
                    </div> 
    
                    <div class="row justify-content-center pt-5">
                        <div :class="{ 'col-lg-6': currentStep === 1, 'col-lg-10 col-md-10 col-sm-12': currentStep === 2 }">
            
                            <div v-if="currentStep === 1" class="d-flex justify-content-between">
                                <nuxt-link class="btn btn-secondary" to="/warehouse/mst">
                                    <i class="fas fa-search"></i> Search MST
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

        <WarehouseAddItemModal @add-item="handleAddItem" :items="itemsInModal" :added-item-ids="mstItemIds"/>
    </div>


</template>


<script setup lang="ts">

    import * as mstApi from '~/composables/warehouse/mst/mst.api'
    import type { CreateMstInput, MST } from '~/composables/warehouse/mst/mst.types';
    import type { Employee } from '~/composables/system/employee/employee.types';
    import { addPropertyFullName } from '~/composables/system/employee/employee';
    import type { AddItem, Item } from '~/composables/warehouse/item/item.type';
    import Swal from 'sweetalert2';
    import { MST_DEFAULT_APPROVERS } from '~/composables/warehouse/mst/mst.constants';
    import { useToast, POSITION as TOAST_POSITION } from 'vue-toastification';
    import { ITEM_STATUS } from '~/utils/constants';
    import type { MSTItem } from '~/composables/warehouse/mst/mst-item.types';

    definePageMeta({
        name: ROUTES.MST_CREATE,
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
    const _mstDataErrorsInitial = {
        returned_by: false,
        note: false,
        items: false,
    }


    // FORM DATA
    const currentStep = ref(1)

    const mstData = ref<CreateMstInput>({
        returned_by: null,
        cwo_number: "",
        mwo_number: "",
        jo_number: "",
        remarks: "",
        approvers: [],
        items: []
    })
    const mstDataErrors = ref({ ..._mstDataErrorsInitial })

    // DROPDOWNS
    const employees = ref<Employee[]>([])
    const items = ref<Item[]>([])

    // ======================== LIFECYCLE HOOKS ========================  
    onMounted(async () => {
        authUser.value = getAuthUser()

        const response = await mstApi.fetchFormDataInCreate()

        employees.value = addPropertyFullName(response.employees)
        items.value = response.items

        mstData.value.approvers = MST_DEFAULT_APPROVERS.map(i => ({...i}))
        isLoadingPage.value = false

    })

    // ======================== COMPUTED ========================  

    const mstItemIds = computed( () => mstData.value.items.map(i => i.item.id))

    const isDisabledSave = computed((): boolean => {
        if(hasErrorStep1() || hasErrorStep2()) {
            return true 
        }
        return false
    })

    const itemsInModal = computed( (): AddItem[] => {
        return items.value.map(i => {
            return {
                id: i.id,
                code: i.code,
                description: i.description,
                available_quantity: i.total_quantity - i.quantity_on_queue,
                unit: i.unit,
                GWAPrice: i.GWAPrice,
                qty_request: 0,
                item_type: i.item_type,
                label: i.code + ' - ' + i.description,
                statusObject: {
                    id: ITEM_STATUS.NOT_USABLE,
                    name: itemStatusMapper[ITEM_STATUS.NOT_USABLE],
                },
            }
        })
    })

    // ======================== FUNCTIONS ========================  


    async function save() {

        console.log('save')

        isSaving.value = true
        const response = await mstApi.create(mstData.value)
        isSaving.value = false

        if (response.success && response.data) {

            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })

            router.push(`/warehouse/mst/view/${response.data.id}`);

        } else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

    function handleAddItem(itemId: string) {
        console.log('handleAddItem', itemId);
        const item = items.value.find(i => i.id === itemId)

        if(!item) {
            console.error('item not found');
            return 
        }

        const isExist = mstData.value.items.find(i => i.item.id === itemId) 

        if(isExist) {
            toast.error('Item exist!')
            return 
        }

        const mstItem: MSTItem = {
            id: '',
            mst_id: '',
            item_id: itemId,
            quantity: 1,
            price: item.GWAPrice,
            status: ITEM_STATUS.NOT_USABLE,
            mst: {} as MST,
            item,
            statusObject: {
                id: ITEM_STATUS.NOT_USABLE,
                name: itemStatusMapper[ITEM_STATUS.NOT_USABLE]
            },
            showQtyError: false,
        }

        mstData.value.items.push(mstItem)
        toast.success('Item added!')
    }

    function handleRemoveItem(mstItem: MSTItem) {
        console.log('handleRemoveItem', mstItem);

        const indx = mstData.value.items.findIndex(i => i.item.id === mstItem.item.id)

        if(indx === -1) {
            console.error('item not found in mstData.items with id of ', mstItem.item.id);
            return 
        }

        mstData.value.items.splice(indx, 1)

        toast.success('Item removed!', {position: TOAST_POSITION.BOTTOM_RIGHT})
    }

    function handleItemStatusChange(mstItem: MSTItem, data: {status: ITEM_STATUS}) {
        console.log('handleItemStatusChange');

        const indx = mstData.value.items.findIndex(i => i.item.id === mstItem.item.id)

        if(indx === -1) {
            console.error('item not found in mstData.items with id of ', mstItem.item.id);
            return 
        }

        mstData.value.items[indx] = {
            ...mstData.value.items[indx],
            status: data.status,
            statusObject: { id: data.status, name: itemStatusMapper[data.status] }
        }

    }

    function handleUpdateItem(mstItem: MSTItem, data: {qty: number}) {
        console.log('handleUpdateItem');
        const item = mstData.value.items.find(i => i.item.id === mstItem.item.id)

        if(!item) {
            console.error('item not found');
            return 
        }

        if(data.qty <= 0) {
            item.showQtyError = true 
        } else {
            item.showQtyError = false 
        }

        item.quantity = data.qty

        console.log('mstData.value.items', mstData.value.items);
    }

    function onClickNextStep1() {

        mstDataErrors.value = { ..._mstDataErrorsInitial }

        if (!mstData.value.returned_by) {
            mstDataErrors.value.returned_by = true
        }

        if (mstData.value.remarks.trim() === '') {
            mstDataErrors.value.note = true
        }

        for(let i of mstData.value.approvers) {
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
        const hasError = Object.values(mstDataErrors.value).includes(true);
        const hasErrorApprovers = mstData.value.approvers.some(i => i.showRequiredMsg === true)
        if (hasError || hasErrorApprovers) {
            return true
        }

        return false 
    }

    function hasErrorStep2(): boolean {

        if(mstData.value.items.length === 0) {
            return true
        }

        const hasErrorItem = mstData.value.items.some(i => i.showQtyError === true)
        if (hasErrorItem) {
            return true
        }

        return false
    }


</script>
