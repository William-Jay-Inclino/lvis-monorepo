<template>

    <div>
        <div class="card">
            <div class="card-body">
    
                <div v-if="!isLoadingPage && authUser">
                    <h2 class="text-warning">Create MCRT</h2>
                    <hr>
            
                    <div class="row justify-content-center pt-5 pb-3">
            
                        <div class="col-lg-8 mb-4">
    
                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic">
                                    Fields with * are required
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">Reference</label>
                                <div class="row g-0">
                                    <div class="col-4">
                                        <client-only>
                                            <v-select @option:selected="onChangeReferenceType" :options="referenceTypes" v-model="referenceType"
                                                :clearable="false"></v-select>
                                        </client-only>
                                    </div>
                                    <div class="col-8" v-if="referenceType === 'MCT'">
                                        <client-only>
                                            <v-select @search="handleSearchMctNumber" @option:selected="onMctNumberSelected" :options="mcts" label="mct_number"
                                                v-model="mcrtData.mct">
                                                <template v-slot:option="option">
                                                    <div v-if="option.status !== APPROVAL_STATUS.APPROVED" class="row">
                                                        <div class="col">
                                                            <span class="text-danger">{{ option.mct_number }}</span>
                                                        </div>
                                                        <div class="col text-end">
                                                            <small class="text-muted fst-italic">
                                                                {{
            // @ts-ignore
            approvalStatus[option.status].label
        }}
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div v-else class="row">
                                                        <div class="col">
                                                            <span>{{ option.mct_number }}</span>
                                                        </div>
                                                        <div class="col text-end">
                                                            <small class="text-success fst-italic"> Available </small>
                                                        </div>
                                                    </div>
                                                </template>
                                            </v-select>
                                        </client-only>
                                        <nuxt-link v-if="mcrtData.mct" class="btn btn-sm btn-light text-primary"
                                            :to="'/warehouse/mct/view/' + mcrtData.mct.id" target="_blank">View MCT
                                            details</nuxt-link>
                                    </div>
                                    <div class="col-8" v-else-if="referenceType === 'SERIV'">
                                        <client-only>
                                            <v-select @search="handleSearchSerivNumber" @option:selected="onSerivNumberSelected" :options="serivs" label="seriv_number"
                                                v-model="mcrtData.seriv">
                                                <template v-slot:option="option">
                                                    <div v-if="option.status !== APPROVAL_STATUS.APPROVED" class="row">
                                                        <div class="col">
                                                            <span class="text-danger">{{ option.seriv_number }}</span>
                                                        </div>
                                                        <div class="col text-end">
                                                            <small class="text-muted fst-italic">
                                                                {{
            // @ts-ignore
            approvalStatus[option.status].label
        }}
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div v-else class="row">
                                                        <div class="col">
                                                            <span>{{ option.seriv_number }}</span>
                                                        </div>
                                                        <div class="col text-end">
                                                            <small class="text-success fst-italic"> Available </small>
                                                        </div>
                                                    </div>
                                                </template>
                                            </v-select>
                                        </client-only>
                                        <nuxt-link v-if="mcrtData.seriv" class="btn btn-sm btn-light text-primary"
                                            :to="'/warehouse/seriv/view/' + mcrtData.seriv.id" target="_blank">View SERIV
                                            details</nuxt-link>
                                    </div>
                                </div>
                                <small class="text-danger fst-italic" v-show="mcrtDataErrors.reference">
                                    Please select {{ referenceType === 'MCT'? 'MCT' : 'SERIV' }} number
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Work Order Number 
                                </label>
                                <input v-model="mcrtData.wo_number" class="form-control"
                                    rows="3" />
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Maint Order Number 
                                </label>
                                <input v-model="mcrtData.mo_number" class="form-control"
                                    rows="3" />
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Job Order Number
                                </label>
                                <input v-model="mcrtData.jo_number" class="form-control"
                                    rows="3" />
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Note <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="mcrtData.note" class="form-control"
                                    rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-show="mcrtDataErrors.note"> {{ errorMsg }}
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
                                        v-model="mcrtData.returned_by"
                                        :clearable="false"
                                        ></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="mcrtDataErrors.returned_by"> {{ errorMsg }} </small>
                            </div>
                            <div v-for="approver in mcrtData.approvers" class="mb-3">
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
    
                        <div v-show="mcrtData.seriv || mcrtData.mct" class="col-lg-8">
    
                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <i class="fas fa-shopping-cart"></i> Item list
                                </h5>
                                <hr class="result">
                            </div>
    
                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic">
                                    Items are based on either SERIV or MCT, but you can still add or remove items.
                                </small>
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
                            
                            <WarehouseMCRTItems
                              :items="mcrtData.items"
                              @remove-item="handleRemoveItem"
                              @update-item="handleUpdateItem" />
    
                        </div>
            
                    </div>
    
                    <div class="row justify-content-center">
                        <div class="col-lg-6">
                            <div class="d-flex justify-content-between">
                                <nuxt-link class="btn btn-secondary" to="/warehouse/mcrt">
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

        <WarehouseAddItemModal @add-item="handleAddItem" :items="filteredItems" :added-item-ids="mcrtItemIds"/>
    </div>


</template>


<script setup lang="ts">

    import * as mcrtApi from '~/composables/warehouse/mcrt/mcrt.api'
    import type { AddMCRTItem, CreateMcrtInput } from '~/composables/warehouse/mcrt/mcrt.types';
    import type { Employee } from '~/composables/system/employee/employee.types';
    import { addPropertyFullName } from '~/composables/system/employee/employee';
    import type { AddItem } from '~/composables/warehouse/item/item.type';
    import Swal from 'sweetalert2';
    import { MCRT_DEFAULT_APPROVERS } from '~/composables/warehouse/mcrt/mcrt.constants';
    import type { MCT } from '~/composables/warehouse/mct/mct.types';
    import type { SERIV } from '~/composables/warehouse/seriv/seriv.types';
    import { fetchMCTsByMctNumber } from '~/composables/warehouse/mct/mct.api';
    import { fetchSERIVsBySerivNumber } from '~/composables/warehouse/seriv/seriv.api';
    import { useToast, POSITION as TOAST_POSITION } from 'vue-toastification';

    definePageMeta({
        name: ROUTES.MCRT_CREATE,
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
    const _mcrtDataErrorsInitial = {
        reference: false,
        returned_by: false,
        note: false,
        items: false,
    }

    const referenceTypes = ref(['MCT', 'SERIV'])
    const referenceType = ref<'MCT' | 'SERIV'>('MCT')


    // FORM DATA
    const mcrtData = ref<CreateMcrtInput>({
        mct: null,
        seriv: null,
        returned_by: null,
        wo_number: "",
        mo_number: "",
        jo_number: "",
        note: "",
        approvers: [],
        items: []
    })
    const mcrtDataErrors = ref({ ..._mcrtDataErrorsInitial })

    let currentMct: MCT | null = null
    let currentSeriv: SERIV | null = null

    // DROPDOWNS
    const employees = ref<Employee[]>([])
    const items = ref<AddItem[]>([])
    const mcts = ref<MCT[]>([])
    const serivs = ref<SERIV[]>([])


    // ======================== LIFECYCLE HOOKS ========================  
    onMounted(async () => {
        authUser.value = getAuthUser()

        const response = await mcrtApi.fetchFormDataInCreate()

        employees.value = addPropertyFullName(response.employees)
        mcts.value = response.mcts
        serivs.value = response.serivs

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

        mcrtData.value.approvers = MCRT_DEFAULT_APPROVERS.map(i => ({...i}))
        isLoadingPage.value = false

    })



    // ======================== COMPUTED ========================  

    const mctId = computed(() => {
        if (mcrtData.value.mct) {
            return mcrtData.value.mct.id
        }
        return null
    })

    const serivId = computed(() => {
        if (mcrtData.value.seriv) {
            return mcrtData.value.seriv.id
        }
        return null
    })

    const filteredItems = computed(() => {
        
        if(referenceType.value === 'MCT') {
            return items.value.filter(i => i.item_type.code === ITEM_TYPE.LINE_MATERIALS)
        }

        if(referenceType.value === 'SERIV') {
            return items.value.filter(i => i.item_type.code === ITEM_TYPE.SPECIAL_EQUIPMENT)
        }

        return []

    })

    const mcrtItemIds = computed( () => mcrtData.value.items.map(i => i.itemId))

    // ======================== WATCHERS ========================  

    watch(mctId, (val) => {
        if (!val) {
            currentMct = null
        }
    })

    watch(serivId, (val) => {

        if (!val) {
            currentSeriv = null
            return 
        }

    })



    // ======================== FUNCTIONS ========================  

    function onChangeReferenceType() {

        if(referenceType.value === 'MCT') {
            mcrtData.value.seriv = null
            return 
        }

        if(referenceType.value === 'SERIV') {
            mcrtData.value.mct = null
            return 
        }

    }

    async function save() {

        console.log('save')

        if(!isValid()) return 

        isSaving.value = true
        const response = await mcrtApi.create(mcrtData.value)
        isSaving.value = false

        if (response.success && response.data) {

            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })

            router.push(`/warehouse/mcrt/view/${response.data.id}`);

        } else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

    function onMctNumberSelected(payload: MCT) {
        if (payload.status === APPROVAL_STATUS.APPROVED) {
            currentMct = payload
        } else {
            if (currentMct) {
                mcrtData.value.mct = currentMct
            } else {
                mcrtData.value.mct = null
            }
            return 
        }

        if(!mcrtData.value.mct) return 

        // populate mcrtData.items
        mcrtData.value.items = mcrtData.value.mct.mrv.mrv_items.map(i => {
            const item: AddMCRTItem = {
                itemId: i.item.id,
                code: i.item.code,
                description: i.item.description,
                referenceQty: i.quantity,
                mcrtQty: 0,
                unit: i.item.unit,
                unitPrice: i.price,
                showQtyError: false,
            }
            return item
        })
    }

    function onSerivNumberSelected(payload: SERIV) {
        if (payload.status === APPROVAL_STATUS.APPROVED) {
            currentSeriv = payload
        } else {
            if (currentSeriv) {
                mcrtData.value.seriv = currentSeriv
            } else {
                mcrtData.value.seriv = null
            }
            return 
        }

        if(!mcrtData.value.seriv) return 

        // populate mcrtData.items
        mcrtData.value.items = mcrtData.value.seriv.seriv_items.map(i => {
            const item: AddMCRTItem = {
                itemId: i.item.id,
                code: i.item.code,
                description: i.item.description,
                referenceQty: i.quantity,
                mcrtQty: 0,
                unit: i.item.unit,
                unitPrice: i.price,
                showQtyError: false,
            }
            return item
        })
    }

    async function handleSearchMctNumber(input: string, loading: (status: boolean) => void ) {

        if(input.trim() === '') {
            mcts.value = []
            return
        } 

        debouncedSearchMctNumbers(input, loading)

    }

    async function handleSearchSerivNumber(input: string, loading: (status: boolean) => void ) {

        if(input.trim() === '') {
            serivs.value = []
            return
        } 

        debouncedSearchSerivNumbers(input, loading)

    }

    function handleAddItem(itemId: string) {
        console.log('handleAddItem', itemId);
        const item = items.value.find(i => i.id === itemId)

        if(!item) {
            console.error('item not found');
            return 
        }

        const isExist = mcrtData.value.items.find(i => i.itemId === itemId) 

        if(isExist) {
            toast.error('Item exist!')
            return 
        }

        const mcrtItem: AddMCRTItem = {
            itemId: item.id,
            code: item.code,
            description: item.description,
            referenceQty: 0,
            mcrtQty: 0,
            unit: item.unit,
            unitPrice: item.GWAPrice,
            showQtyError: false,
        }

        mcrtData.value.items.push(mcrtItem)
        toast.success('Item added!')
    }

    function handleRemoveItem(item: AddMCRTItem) {
        console.log('handleRemoveItem', item);

        const indx = mcrtData.value.items.findIndex(i => i.itemId === item.itemId)

        if(indx === -1) {
            console.error('item not found in mcrtData.items with id of ', item.itemId);
            return 
        }

        mcrtData.value.items.splice(indx, 1)

        toast.success('Item removed!', {position: TOAST_POSITION.BOTTOM_RIGHT})
    }

    function handleUpdateItem(mcrtItem: AddMCRTItem, data: {qty: number}) {
        console.log('handleUpdateItem');
        const item = mcrtData.value.items.find(i => i.itemId === mcrtItem.itemId)

        if(!item) {
            console.error('item not found');
            return 
        }

        item.mcrtQty = data.qty

        console.log('mcrtData.value.items', mcrtData.value.items);
    }

    function isValid() {

        mcrtDataErrors.value = { ..._mcrtDataErrorsInitial }

        if(!mcrtData.value.seriv && !mcrtData.value.mct) {
            mcrtDataErrors.value.reference = true
        }

        if (!mcrtData.value.returned_by) {
            mcrtDataErrors.value.returned_by = true
        }

        if (mcrtData.value.note.trim() === '') {
            mcrtDataErrors.value.note = true
        }

        for(let i of mcrtData.value.approvers) {
            if(!i.approver) {
                i.showRequiredMsg = true
            } else {
                i.showRequiredMsg = false 
            }
        }

        for(let i of mcrtData.value.items) {
            if(i.mcrtQty <= 0) {
                i.showQtyError = true
            } else {
                i.showQtyError = false
            }
        }

        const hasError = Object.values(mcrtDataErrors.value).includes(true);
        const hasErrorApprovers = mcrtData.value.approvers.some(i => i.showRequiredMsg === true)
        const hasErrorItem = mcrtData.value.items.some(i => i.showQtyError === true)
        if (hasError || hasErrorApprovers || hasErrorItem) {
            return false
        }

        return true

    }

    async function searchMctNumbers(input: string, loading: (status: boolean) => void) {

        loading(true)

        try {
            const response = await fetchMCTsByMctNumber(input);
            mcts.value = response;
        } catch (error) {
            console.error('Error fetching MCT numbers:', error);
        } finally {
            loading(false);
        }
    }

    async function searchSerivNumbers(input: string, loading: (status: boolean) => void) {

        loading(true)

        try {
            const response = await fetchSERIVsBySerivNumber(input);
            serivs.value = response;
        } catch (error) {
            console.error('Error fetching SERIV numbers:', error);
        } finally {
            loading(false);
        }
    }

    const debouncedSearchMctNumbers = debounce((input: string, loading: (status: boolean) => void) => {
        searchMctNumbers(input, loading);
    }, 500);

    const debouncedSearchSerivNumbers = debounce((input: string, loading: (status: boolean) => void) => {
        searchSerivNumbers(input, loading);
    }, 500);


</script>
