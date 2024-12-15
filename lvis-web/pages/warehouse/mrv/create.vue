<template>

    <div>

        <div class="card">
            <div class="card-body">
    
                <div v-if="!isLoadingPage && authUser">
                    <h2 class="text-warning">Create MRV</h2>
                    <hr>
    
                    <div class="row pt-3">
                        <div class="col">
                            <span class="text-secondary">
                                Step {{ currentStep }} of 2:
                                <span v-if="currentStep === 1"> Fill up MRV info </span>
                                <span v-if="currentStep === 2"> Add MRV items </span>
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
                                <div v-if="mrv_expiration">
                                    <small class="fst-italic">
                                        - The system will automatically cancel this MRV if it's not approved within <b>{{ mrv_expiration }} days </b>.
                                    </small>
                                </div>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Request Type <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="request_types" label="name" v-model="mrvData.request_type" :clearable="false"></v-select>
                                </client-only>
                                <small v-if="showMwoNumber" class="text-muted fst-italic">
                                    Note: The MWO number is automatically assigned when approved.
                                </small>
                                <small class="text-danger fst-italic" v-show="mrvDataErrors.request_type"> {{ errorMsg }} </small>
                            </div>
    
                            <div v-if="showOrNumber" class="mb-3">
                                <label class="form-label">
                                    OR Number 
                                </label>
                                <input v-model="mrvData.or_number" class="form-control"
                                    rows="3" />
                                <small class="text-danger fst-italic" v-show="mrvDataErrors.or_number"> {{ errorMsg }}
                                </small>
                            </div>
    
                            <div v-if="showCwoNumber" class="mb-3">
                                <label class="form-label">
                                    CWO Number
                                </label>
                                <input v-model="mrvData.cwo_number" class="form-control"
                                    rows="3" />
                                <small class="text-danger fst-italic" v-show="mrvDataErrors.cwo_number"> {{ errorMsg }}
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    JO Number
                                </label>
                                <input v-model="mrvData.jo_number" class="form-control"
                                    rows="3" />
                                <small class="text-danger fst-italic" v-show="mrvDataErrors.jo_number"> {{ errorMsg }}
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Item From <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="stations" label="name" v-model="mrvData.item_from" :clearable="false" :disabled="!!default_station"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="mrvDataErrors.item_from"> {{ errorMsg }} </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Project Name
                                </label>
                                <client-only>
                                    <v-select @search="handleSearchProjects" :options="projects" label="name" v-model="mrvData.project"></v-select>
                                </client-only>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Consumer Name <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="mrvData.consumer_name" class="form-control"
                                    rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-show="mrvDataErrors.consumer_name"> {{ errorMsg }}
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Location <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="mrvData.location" class="form-control"
                                    rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-show="mrvDataErrors.location"> {{ errorMsg }}
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Purpose <span class="text-danger">*</span>
                                </label>
                                <textarea v-model="mrvData.purpose" class="form-control"
                                    rows="3"> </textarea>
                                <small class="text-danger fst-italic" v-show="mrvDataErrors.purpose"> {{ errorMsg }}
                                </small>
                            </div>
    
                            <div class="mb-3">
                                <label class="form-label">
                                    Requested By <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="employees" label="fullname" v-model="mrvData.requested_by" :clearable="false"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="mrvDataErrors.requested_by"> {{ errorMsg }} </small>
                            </div>
    
                            <div class="mb-4">
                                <label class="form-label">
                                    Withdrawn By <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="employees" label="fullname" v-model="mrvData.withdrawn_by" :clearable="false"></v-select>
                                </client-only>
                                <small class="text-danger fst-italic" v-show="mrvDataErrors.withdrawn_by"> {{ errorMsg }} </small>
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
    
                            <div v-for="approver in mrvData.approvers" class="mb-3">
                                <label class="form-label">
                                    {{ approver.label }} <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select
                                        :options="approver.order === 3 ? auditors : employees"
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
    
                            <WarehouseItems
                              :items="mrvData.items"
                              @remove-item="handleRemoveItem"
                              @update-qty="handleUpdateItemQty" />
    
                        </div>
                    </div> 
    
                    <div class="row justify-content-center pt-5">
                        <div :class="{ 'col-lg-6': currentStep === 1, 'col-lg-10 col-md-10 col-sm-12': currentStep === 2 }">
            
                            <div v-if="currentStep === 1" class="d-flex justify-content-between">
                                <nuxt-link class="btn btn-secondary" to="/warehouse/mrv">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'search']" />
                            </client-only> 
                            Search MRV
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

        <WarehouseAddItemModal @add-item="handleAddItem" :items="available_items" :added-item-ids="mrvItemIds"/>

    </div>


</template>


<script setup lang="ts">

    import * as mrvApi from '~/composables/warehouse/mrv/mrv.api'
    import type { CreateMrvInput } from '~/composables/warehouse/mrv/mrv.types';
    import type { Employee } from '~/composables/system/employee/employee.types';
    import { addPropertyFullName } from '~/composables/system/employee/employee';
    import type { Station } from '~/composables/warehouse/station/station';
    import type { AddItem } from '~/composables/warehouse/item/item.type';
    import Swal from 'sweetalert2';
    import { MRV_DEFAULT_APPROVERS } from '~/composables/warehouse/mrv/mrv.constants';
    import { showCWOnumber, showMWOnumber, showORnumber } from '~/utils/helpers';
    import { useToast } from 'vue-toastification';
    import { fetchProjectsByName } from '~/composables/warehouse/project/project.api';
import type { Project } from '~/composables/warehouse/project/project.types';

    definePageMeta({
        name: ROUTES.MRV_CREATE,
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
    const _mrvDataErrorsInitial = {
        request_type: false,
        // project: false,
        purpose: false,
        or_number: false,
        mwo_number: false,
        cwo_number: false,
        jo_number: false,
        consumer_name: false,
        location: false,
        requested_by: false,
        withdrawn_by: false,
        item_from: false,
        items: false,
    }

    const currentStep = ref(1)

    // FORM DATA
    const mrvData = ref<CreateMrvInput>({
        request_type: null,
        project: null,
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
    const mrvDataErrors = ref({ ..._mrvDataErrorsInitial })

    const default_station = ref<Station>()
    const mrv_expiration = ref()

    // DROPDOWNS
    const employees = ref<Employee[]>([])
    const auditors = ref<Employee[]>([])
    const projects = ref<Project[]>([])
    const stations = ref<Station[]>([])
    const items = ref<AddItem[]>([])
    const request_types = ref<WarehouseRequestType[]>([])


    // ======================== LIFECYCLE HOOKS ========================  
    onMounted(async () => {
        authUser.value = getAuthUser()

        const response = await mrvApi.fetchFormDataInCreate()

        employees.value = addPropertyFullName(response.employees)
        auditors.value = addPropertyFullName(response.auditors)
        stations.value = response.stations
        projects.value = response.projects
        request_types.value = WAREHOUSE_REQUEST_TYPES.map(i => ({...i}))

        items.value = response.items.map(i => {
            const x: AddItem = {
                id: i.id,
                label: i.code + ' - ' + i.description, 
                code: i.code,
                description: `${i.description} ${i.project_item ? `(${i.project_item.project.name})` : ''}`,
                available_quantity: i.total_quantity - i.quantity_on_queue,
                unit: i.unit,
                qty_request: 0,
                GWAPrice: i.GWAPrice,
                item_type: i.item_type,
                project_item: i.project_item,
            }

            return x
        })

        mrvData.value.approvers = MRV_DEFAULT_APPROVERS.map(i => ({...i}))

        // set default station 
        if(response.default_station) {

            default_station.value = response.default_station

            const station = stations.value.find(i => i.id === response.default_station?.id)
            if(station) {
                mrvData.value.item_from = station
            }
        }

        if(response.mrv_expiration) {
            mrv_expiration.value = response.mrv_expiration
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

        if(!mrvData.value.request_type) return false 

        return showORnumber(mrvData.value.request_type.id)
        
    })

    const showMwoNumber = computed( () => {

        if(!mrvData.value.request_type) return false 

        return showMWOnumber(mrvData.value.request_type.id)


    })

    const showCwoNumber = computed( () => {

        if(!mrvData.value.request_type) return false 

        return showCWOnumber(mrvData.value.request_type.id)

    })

    const mrvItemIds = computed( () => mrvData.value.items.map(i => i.id))

    const available_items = computed( (): AddItem[] => {

        if(!mrvData.value.project) {
            return items.value.filter(i => {
                if(!i.project_item) {
                    return i
                }
            })
        }

        return items.value.filter(i => {
            if(i.project_item && i.project_item.project.id === mrvData.value.project?.id) {
                return i
            }
        })

    })  

    const project = computed( () => mrvData.value.project)



    // ======================== WATCHERS ========================  

    watch(project, (val) => {

        console.log('project is updated. Clearing items...');

        mrvData.value.items = []

    })

    // ======================== FUNCTIONS ========================  

    async function save() {

        console.log('save')

        isSaving.value = true
        const response = await mrvApi.create(mrvData.value)
        isSaving.value = false

        if (response.success && response.data) {

            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })

            router.push(`/warehouse/mrv/view/${response.data.id}`);

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

        const mrvItem = mrvData.value.items.find(i => i.id === item.id) 

        if(!mrvItem) {
            console.error('Item not found', item.code);
            return 
        }

        mrvItem.qty_request = qty

    }

    function handleAddItem(itemId: string) {
        console.log('handleAddItem', itemId);
        const item = items.value.find(i => i.id === itemId)

        if(!item) {
            console.error('item not found');
            return 
        }

        const isExist = mrvData.value.items.find(i => i.id === itemId) 

        if(isExist) {
            toast.error('Item exist!')
            return 
        }

        const mrvItem: AddItem = {
            id: item.id,
            code: item.code,
            label: item.code + ' - ' + item.description,
            description: item.description,
            available_quantity: item.available_quantity,
            unit: item.unit,
            GWAPrice: item.GWAPrice,
            qty_request: 0,
            item_type: item.item_type,
            project_item: item.project_item ? item.project_item : null
        }

        mrvData.value.items.push(mrvItem)
        toast.success('Item added!')
    }

    function handleRemoveItem(item: AddItem) {
        console.log('handleRemoveItem', item);

        const indx = mrvData.value.items.findIndex(i => i.id === item.id)

        if(indx === -1) {
            console.error('item not found in mrvData.items with id of ', item.id);
            return 
        }

        mrvData.value.items.splice(indx, 1)
    }

    async function onClickNextStep1() {

        mrvDataErrors.value = { ..._mrvDataErrorsInitial }

        if(!mrvData.value.request_type) {
            mrvDataErrors.value.request_type = true
        }

        if (mrvData.value.purpose.trim() === '') {
            mrvDataErrors.value.purpose = true
        }

        if(mrvData.value.consumer_name?.trim() === '') {
            mrvDataErrors.value.consumer_name = true
        }

        if(mrvData.value.location?.trim() === '') {
            mrvDataErrors.value.location = true
        }

        if (!mrvData.value.requested_by) {
            mrvDataErrors.value.requested_by = true
        }

        if (!mrvData.value.withdrawn_by) {
            mrvDataErrors.value.withdrawn_by = true
        }

        if (!mrvData.value.item_from) {
            mrvDataErrors.value.item_from = true
        }

        for(let i of mrvData.value.approvers) {
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
        const hasError = Object.values(mrvDataErrors.value).includes(true);
        const hasErrorApprovers = mrvData.value.approvers.some(i => i.showRequiredMsg === true)
        if (hasError || hasErrorApprovers) {
            return true
        }

        return false 
    }

    function hasErrorStep2(): boolean {

        if(mrvData.value.items.length === 0) {
            return true
        }

        for(let item of mrvData.value.items) {
            if(item.qty_request <= 0 || item.qty_request > item.available_quantity) {
                return true 
            }
        }

        return false 
    }


    async function handleSearchProjects(input: string, loading: (status: boolean) => void ) {

        if(input.trim() === ''){
            projects.value = []
            return 
        } 

        debouncedSearchProjects(input, loading)

    }


    async function searchProjects(input: string, loading: (status: boolean) => void) {

        loading(true)

        try {
            const response = await fetchProjectsByName(input);
            projects.value = response
        } catch (error) {
            console.error('Error fetching Projects:', error);
        } finally {
            loading(false);
        }
    }

    const debouncedSearchProjects = debounce((input: string, loading: (status: boolean) => void) => {
        searchProjects(input, loading);
    }, 500);



</script>
