<template>

    <div>
        <div class="card">
            <div class="card-body">
    
                <div v-if="!isLoadingPage && authUser">
                    <h2 class="text-warning">Create MCRT</h2>
                    <hr>

                    <div class="row pt-3">
                        <div class="col">
                            <span class="text-secondary">
                                Step {{ currentStep }} of 2:
                                <span v-if="currentStep === 1"> Fill up MCRT info </span>
                                <span v-if="currentStep === 2"> Add MCRT items </span>
                            </span>
                        </div>
                    </div>
            
                    <div v-show="currentStep === 1" class="row justify-content-center pt-5 pb-3">
            
                        <div class="col-lg-6 mb-4">
    
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
                                        <div class="row">
                                            <div class="col">
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
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <div v-if="mcrtData.mct && mcrtData.mct.mcrts.length > 0">
                                                    <small class="text-muted fst-italic"> Other assigned MCRT: </small>
                                                    <ul>
                                                        <li v-for="mcrt in mcrtData.mct.mcrts" :key="mcrt.id" class="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <nuxt-link :to="'/warehouse/mcrt/view/' + mcrt.id" target="_blank">
                                                                    {{ mcrt.mcrt_number }}
                                                                </nuxt-link>
                                                            </div>
                                                            <div :class="{ [`badge bg-${approvalStatus[mcrt.status].color}`]: true }">
                                                                {{ approvalStatus[mcrt.status].label }}
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-8" v-else-if="referenceType === 'SERIV'">
                                        <div class="row">
                                            <div class="col">
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
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <div v-if="mcrtData.seriv && mcrtData.seriv.mcrts.length > 0">
                                                    <small class="text-muted fst-italic"> Other assigned MCRT: </small>
                                                    <ul>
                                                        <li v-for="mcrt in mcrtData.seriv.mcrts" :key="mcrt.id" class="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <nuxt-link :to="'/warehouse/mcrt/view/' + mcrt.id" target="_blank">
                                                                    {{ mcrt.mcrt_number }}
                                                                </nuxt-link>
                                                            </div>
                                                            <div :class="{ [`badge bg-${approvalStatus[mcrt.status].color}`]: true }">
                                                                {{ approvalStatus[mcrt.status].label }}
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <small class="text-danger fst-italic" v-show="mcrtDataErrors.reference">
                                    Please select {{ referenceType === 'MCT'? 'MCT' : 'SERIV' }} number
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    CWO Number 
                                </label>
                                <input :value="cwo_number" class="form-control" disabled/>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    MWO Number 
                                </label>
                                <input :value="mwo_number" class="form-control" disabled/>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    JO Number
                                </label>
                                <input v-model="jo_number" class="form-control" disabled/>
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
                            <div class="mb-4">
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

                            <div class="h5wrapper mb-3">
                                <hr class="result">
                                <h5 class="text-warning fst-italic">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'users']"/>
                            </client-only> Signatories
                                </h5>
                                <hr class="result">
                            </div>

                            <div v-for="approver in mcrtData.approvers" class="mb-3">
                                <label class="form-label">
                                    {{ approver.label }} <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select
                                        :options="approver.order === 4 ? auditors : employees"
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

                    <div v-show="currentStep === 2" class="row justify-content-center pt-5 pb-3">
                        <div class="col-lg-11 mb-4">

                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic">
                                    Qty to return should be greater than 0 and not exceeding reference qty 
                                </small>
                            </div>

                            <WarehouseMCRTItems
                              :items="mcrtData.items"
                              @remove-item="handleRemoveItem"
                              @update-item="handleUpdateItem" />

                        </div>
                    </div>
    
                    <div class="row justify-content-center pt-5">
                        <div :class="{ 'col-lg-6': currentStep === 1, 'col-lg-11 col-md-10 col-sm-12': currentStep === 2 }">
            
                            <div v-if="currentStep === 1" class="d-flex justify-content-between">
                                <nuxt-link class="btn btn-secondary" to="/warehouse/mcrt">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search MCRT 
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

    </div>


</template>


<script setup lang="ts">

    import * as mcrtApi from '~/composables/warehouse/mcrt/mcrt.api'
    import type { CreateMcrtInput, MCRT } from '~/composables/warehouse/mcrt/mcrt.types';
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
    import type { MCRTItem } from '~/composables/warehouse/mcrt/mcrt-item.types';

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
    const currentStep = ref(1)

    const mcrtData = ref<CreateMcrtInput>({
        mct: null,
        seriv: null,
        returned_by: null,
        note: "",
        approvers: [],
        items: []
    })
    const mcrtDataErrors = ref({ ..._mcrtDataErrorsInitial })

    let currentMct: MCT | null = null
    let currentSeriv: SERIV | null = null
    const general_manager = ref<Employee>()

    // DROPDOWNS
    const employees = ref<Employee[]>([])
    const auditors = ref<Employee[]>([])
    const items = ref<AddItem[]>([])
    const mcts = ref<MCT[]>([])
    const serivs = ref<SERIV[]>([])


    // ======================== LIFECYCLE HOOKS ========================  
    onMounted(async () => {
        authUser.value = getAuthUser()

        const response = await mcrtApi.fetchFormDataInCreate()

        employees.value = addPropertyFullName(response.employees)
        auditors.value = addPropertyFullName(response.auditors)
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

        if(response.general_manager) {
            response.general_manager['fullname'] = getFullname(response.general_manager.firstname, response.general_manager.middlename, response.general_manager.lastname)
            general_manager.value = response.general_manager

            const gm = mcrtData.value.approvers.find(i => i.order === 5)

            if(gm) {
                gm.approver = general_manager.value
            }

        }

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

    const isDisabledSave = computed( () => {
        if(hasErrorStep1() || hasErrorStep2()) {
            return true 
        }
        return false
    })

    const jo_number = computed( () => {
        
        if(mcrtData.value.mct) {
            return mcrtData.value.mct.mrv.jo_number
        }

        if(mcrtData.value.seriv) {
            return mcrtData.value.seriv.jo_number
        }

        return ''

    })

    const mwo_number = computed( () => {
        
        if(mcrtData.value.mct) {
            return mcrtData.value.mct.mrv.mwo_number
        }

        if(mcrtData.value.seriv) {
            return mcrtData.value.seriv.mwo_number
        }

        return ''

    })

    const cwo_number = computed( () => {
        
        if(mcrtData.value.mct) {
            return mcrtData.value.mct.mrv.cwo_number
        }

        if(mcrtData.value.seriv) {
            return mcrtData.value.seriv.cwo_number
        }

        return ''

    })

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

        for(let i of mcrtData.value.items) {
            if(i.quantity <= 0 || i.quantity > (i.reference_qty + i.qty_returned)) {
                i.showQtyError = true
            } else {
                i.showQtyError = false
            }
        }

        const hasErrorItem = mcrtData.value.items.some(i => i.showQtyError === true)

        if(hasErrorItem) return

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
            const item: MCRTItem = {
                id: '',
                mcrt_id: '',
                item_id: i.item.id,
                quantity: 0,
                price: i.price,
                mcrt: {} as MCRT,
                item: i.item,
                showQtyError: false,
                reference_qty: i.quantity,
                qty_returned: i.qty_returned,
                qty_on_queue: i.qty_on_queue,
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
            const item: MCRTItem = {
                id: '',
                mcrt_id: '',
                item_id: i.item.id,
                quantity: 0,
                price: i.price,
                mcrt: {} as MCRT,
                item: i.item,
                showQtyError: false,
                reference_qty: i.quantity,
                qty_returned: i.qty_returned,
                qty_on_queue: i.qty_on_queue,
            }
            return item
        })
    }





    // ======================== CHILD EVENTS: <WarehouseMCRTItems> ========================  

    function handleRemoveItem(mcrtItem: MCRTItem) {

        const indx = mcrtData.value.items.findIndex(i => i.item.id === mcrtItem.item.id)

        if(indx === -1) {
            console.error('item not found in mcrtData.items with id of ', mcrtItem.item.id);
            return 
        }

        mcrtData.value.items.splice(indx, 1)

        toast.success('Item removed!', {position: TOAST_POSITION.BOTTOM_RIGHT})
    }

    function handleUpdateItem(mcrtItem: MCRTItem, data: {qty: number}) {
        const item = mcrtData.value.items.find(i => i.item.id === mcrtItem.item.id)

        if(!item) {
            console.error('item not found');
            return 
        }

        if(data.qty <= 0 || data.qty > (mcrtItem.reference_qty - mcrtItem.qty_returned)) {
            item.showQtyError = true 
        } else {
            item.showQtyError = false
        }

        item.quantity = data.qty

    }




    // ======================== SEARCH MCT NUMBERS ========================  

    async function handleSearchMctNumber(input: string, loading: (status: boolean) => void ) {

        if(input.trim() === '') {
            mcts.value = []
            return
        } 

        debouncedSearchMctNumbers(input, loading)

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

    const debouncedSearchMctNumbers = debounce((input: string, loading: (status: boolean) => void) => {
        searchMctNumbers(input, loading);
    }, 500);




    // ======================== SEARCH SERIV NUMBERS ========================  

    async function handleSearchSerivNumber(input: string, loading: (status: boolean) => void ) {

        if(input.trim() === '') {
            serivs.value = []
            return
        } 

        debouncedSearchSerivNumbers(input, loading)

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


    const debouncedSearchSerivNumbers = debounce((input: string, loading: (status: boolean) => void) => {
        searchSerivNumbers(input, loading);
    }, 500);



    function onClickNextStep1() {

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


        const hasError = Object.values(mcrtDataErrors.value).includes(true);
        const hasErrorApprovers = mcrtData.value.approvers.some(i => i.showRequiredMsg === true)
        if (hasError || hasErrorApprovers) {
            return 
        }

        currentStep.value = 2

    }

    function hasErrorStep1(): boolean {
        const hasError = Object.values(mcrtDataErrors.value).includes(true);
        const hasErrorApprovers = mcrtData.value.approvers.some(i => i.showRequiredMsg === true)
        if (hasError || hasErrorApprovers) {
            return true
        }

        return false 
    }

    function hasErrorStep2(): boolean {

        if(mcrtData.value.items.length === 0) {
            return true
        }

        for(let item of mcrtData.value.items) {
            if(item.quantity <= 0 || item.quantity > (item.reference_qty - item.qty_returned)) {
                return true 
            }
        }

        return false 
    }

</script>
