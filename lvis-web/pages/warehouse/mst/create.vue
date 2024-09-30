<template>

    <div>
        <div class="card">
            <div class="card-body">
    
                <div v-if="!isLoadingPage && authUser">
                    <h2 class="text-warning">Create MST</h2>
                    <hr>
            
                    <div class="row justify-content-center pt-5 pb-3">
            
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
    
                        <div class="col-lg-8">
    
                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-shopping-cart"></i> Item list
                                </h5>
                                <hr class="result">
                            </div>
    
                            <div class="text-end">
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
                              @remove-item="handleRemoveItem"
                              @update-item="handleUpdateItem" />
    
                        </div>
            
                    </div>
    
                    <div class="row justify-content-center">
                        <div class="col-lg-6">
                            <div class="d-flex justify-content-between">
                                <nuxt-link class="btn btn-secondary" to="/warehouse/mst">
                                    <i class="fas fa-chevron-left"></i> Back to Search
                                </nuxt-link>
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

        <WarehouseAddItemModal @add-item="handleAddItem" :items="items" :added-item-ids="mstItemIds"/>
    </div>


</template>


<script setup lang="ts">

    import * as mstApi from '~/composables/warehouse/mst/mst.api'
    import type { AddMSTItem, CreateMstInput } from '~/composables/warehouse/mst/mst.types';
    import type { Employee } from '~/composables/system/employee/employee.types';
    import { addPropertyFullName } from '~/composables/system/employee/employee';
    import type { AddItem } from '~/composables/warehouse/item/item.type';
    import Swal from 'sweetalert2';
    import { MST_DEFAULT_APPROVERS } from '~/composables/warehouse/mst/mst.constants';
    import { useToast, POSITION as TOAST_POSITION } from 'vue-toastification';

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
    const items = ref<AddItem[]>([])

    // ======================== LIFECYCLE HOOKS ========================  
    onMounted(async () => {
        authUser.value = getAuthUser()

        const response = await mstApi.fetchFormDataInCreate()

        employees.value = addPropertyFullName(response.employees)

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

        mstData.value.approvers = MST_DEFAULT_APPROVERS.map(i => ({...i}))
        isLoadingPage.value = false

    })

    // ======================== COMPUTED ========================  

    const mstItemIds = computed( () => mstData.value.items.map(i => i.itemId))



    // ======================== FUNCTIONS ========================  


    async function save() {

        console.log('save')

        if(!isValid()) return 

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

        const isExist = mstData.value.items.find(i => i.itemId === itemId) 

        if(isExist) {
            toast.error('Item exist!')
            return 
        }

        const mstItem: AddMSTItem = {
            itemId: item.id,
            code: item.code,
            description: item.description,
            quantity: 0,
            unit: item.unit,
            unitPrice: item.GWAPrice,
            showQtyError: false,
        }

        mstData.value.items.push(mstItem)
        toast.success('Item added!')
    }

    function handleRemoveItem(item: AddMSTItem) {
        console.log('handleRemoveItem', item);

        const indx = mstData.value.items.findIndex(i => i.itemId === item.itemId)

        if(indx === -1) {
            console.error('item not found in mstData.items with id of ', item.itemId);
            return 
        }

        mstData.value.items.splice(indx, 1)

        toast.success('Item removed!', {position: TOAST_POSITION.BOTTOM_RIGHT})
    }

    function handleUpdateItem(mstItem: AddMSTItem, data: {qty: number}) {
        console.log('handleUpdateItem');
        const item = mstData.value.items.find(i => i.itemId === mstItem.itemId)

        if(!item) {
            console.error('item not found');
            return 
        }

        item.quantity = data.qty

        console.log('mstData.value.items', mstData.value.items);
    }

    function isValid() {

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

        for(let i of mstData.value.items) {
            if(i.quantity <= 0) {
                i.showQtyError = true
            } else {
                i.showQtyError = false
            }
        }

        const hasError = Object.values(mstDataErrors.value).includes(true);
        const hasErrorApprovers = mstData.value.approvers.some(i => i.showRequiredMsg === true)
        const hasErrorItem = mstData.value.items.some(i => i.showQtyError === true)
        if (hasError || hasErrorApprovers || hasErrorItem) {
            return false
        }

        return true

    }

</script>
