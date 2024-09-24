<template>

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
        
                    <div class="col-lg-6">

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
                                                <div v-else-if="option.is_referenced" class="row">
                                                    <div class="col">
                                                        <span class="text-danger">{{ option.mct_number }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-muted fst-italic">
                                                            Referenced
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
                                                <div v-else-if="option.is_referenced" class="row">
                                                    <div class="col">
                                                        <span class="text-danger">{{ option.seriv_number }}</span>
                                                    </div>
                                                    <div class="col text-end">
                                                        <small class="text-muted fst-italic">
                                                            Referenced <span class="text-danger">*</span>
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
        
                </div>
        
                <div v-show="currentStep === 2" class="row justify-content-center pt-5">
                    <div class="col-lg-10">
                        <div class="mb-3">
                            <small class="form-label fst-italic text-muted">
                                Input the name of the item in the search field below
                            </small>
                            <client-only>
                                <v-select :options="items" v-model="mcrtData.items" label="name" multiple></v-select>
                            </client-only>
                        </div>

                        <WarehouseItems :items="mcrtData.items" @remove-item="handleRemoveItem"/>

                    </div>
                </div> 

                <div class="row justify-content-center pt-5">
                    <div :class="{ 'col-lg-6': currentStep === 1, 'col-lg-10 col-md-10 col-sm-12': currentStep === 2 }">
        
                        <div v-if="currentStep === 1" class="d-flex justify-content-between">
                            <nuxt-link class="btn btn-secondary" to="/warehouse/mcrt">
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

    import * as mcrtApi from '~/composables/warehouse/mcrt/mcrt.api'
    import type { CreateMcrtInput } from '~/composables/warehouse/mcrt/mcrt.types';
    import type { Employee } from '~/composables/system/employee/employee.types';
    import { addPropertyFullName } from '~/composables/system/employee/employee';
    import type { AddItem } from '~/composables/warehouse/item/item.type';
    import Swal from 'sweetalert2';
    import { MCRT_DEFAULT_APPROVERS } from '~/composables/warehouse/mcrt/mcrt.constants';
    import type { MCT } from '~/composables/warehouse/mct/mct.types';
    import type { SERIV } from '~/composables/warehouse/seriv/seriv.types';
import { fetchMCTsByMctNumber } from '~/composables/warehouse/mct/mct.api';
import { fetchSERIVsBySerivNumber } from '~/composables/warehouse/seriv/seriv.api';

    definePageMeta({
        name: ROUTES.MCRT_CREATE,
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
    const _mcrtDataErrorsInitial = {
        returned_by: false,
        note: false,
        items: false,
    }

    const currentStep = ref(1)
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
                name: i.name,
                description: i.description,
                available_quantity: i.total_quantity - i.quantity_on_queue,
                unit: i.unit,
                qty_request: 0,
                GWAPrice: i.GWAPrice,
            }

            return x
        })

        mcrtData.value.approvers = MCRT_DEFAULT_APPROVERS.map(i => ({...i}))
        isLoadingPage.value = false

    })



    // ======================== COMPUTED ========================  

    const isDisabledSave = computed((): boolean => {
        if(hasErrorStep1() || hasErrorStep2()) {
            return true 
        }
        return false
    })

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




    // ======================== WATCHERS ========================  

    watch(mctId, (val) => {
        if (!val) {
            currentMct = null

        }
    })

    watch(serivId, (val) => {

        if (!val) {
            currentSeriv = null
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
        if (payload.status === APPROVAL_STATUS.APPROVED && !payload.is_referenced) {
            currentMct = payload
        } else {
            if (currentMct) {
                mcrtData.value.mct = currentMct
            } else {
                mcrtData.value.mct = null
            }
        }
    }

    function onSerivNumberSelected(payload: SERIV) {
        if (payload.status === APPROVAL_STATUS.APPROVED && !payload.is_referenced) {
            currentSeriv = payload
        } else {
            if (currentSeriv) {
                mcrtData.value.seriv = currentSeriv
            } else {
                mcrtData.value.seriv = null
            }
        }
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

        debouncedSearchMctNumbers(input, loading)

    }

    function handleRemoveItem(item: AddItem) {
        console.log('handleRemoveItem', item);

        const indx = mcrtData.value.items.findIndex(i => i.id === item.id)

        if(indx === -1) {
            console.error('item not found in mcrtData.items with id of ', item.id);
            return 
        }

        mcrtData.value.items.splice(indx, 1)
    }


    async function onClickNextStep1() {

        mcrtDataErrors.value = { ..._mcrtDataErrorsInitial }

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

        if(!hasErrorStep1()) {
            currentStep.value += 1
        }

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
            if(item.qty_request <= 0 || item.qty_request > item.available_quantity) {
                return true 
            }
        }

        return false 
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
