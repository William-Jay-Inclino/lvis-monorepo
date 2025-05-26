<template>

    <div v-if="!isLoadingPage && authUser && authUser.user.user_employee">

        <div v-if="!isMobile" class="row">
            <div class="col d-flex justify-content-end">
                <button 
                    @click="view_type = 'list'" 
                    :class="['btn me-2', view_type === 'list' ? 'btn-primary text-white' : 'btn-light text-warning']"
                >
                    <client-only>
                        <font-awesome-icon :icon="['fas', 'list']" />
                    </client-only>
                </button>
                <button 
                    @click="view_type = 'tile'" 
                    :class="['btn me-2', view_type === 'tile' ? 'btn-primary text-white' : 'btn-light text-warning']"
                >
                    <client-only>
                        <font-awesome-icon :icon="['fas', 'th-large']" />
                    </client-only>
                </button>
            </div>
        </div>

        <div class="alert alert-light text-muted fst-italic small mt-3" role="alert">
            <b>Note:</b> If you encounter an error while approving or disapproving, refresh the page and try again.
        </div>


        <div v-if="view_type === 'tile'">
            <PendingTileView 
                :items="filteredItems" 
                :is-budget-officer="is_budget_officer"
                :is-finance-manager="is_finance_manager"
                @view-details="handle_click_view_details" 
                @approve="handle_approval" 
                @disapprove="handle_approval" 
            /> 
        </div>

        <div v-if="view_type === 'list'">
            <PendingListView 
                :items="filteredItems" 
                :is-budget-officer="is_budget_officer"
                :is-finance-manager="is_finance_manager"
                @view-details="handle_click_view_details"
                @approve="handle_approval" 
                @disapprove="handle_approval" 
                @save-comment="handle_save_comment"
                @start-edit-comment="handle_start_edit_comment"
                @cancel-comment="handle_cancel_edit_comment"
            />
        </div>

        <button
            ref="pending_modal_btn"
            v-show="false" 
            data-bs-toggle="modal" 
            data-bs-target="#pendingModal2"
        >
            
        </button>

        <PendingDetailsModal
            :pending-data="pending_selected"
            :is-loading-modal="isLoadingModal"
            :is-approving="isApproving"
            :is-disapproving="isDisapproving"
            :is-adding-comment="isAddingComment"
            :current-tab="currentTab"
            :classifications="classifications"
            :accounts="accounts"
            :is-budget-officer="is_budget_officer"
            :is-finance-manager="is_finance_manager"
            @approve="handle_approval"
            @disapprove="handle_approval"
            @addComment="handle_add_comment"
            @change-tab="handle_change_tab"
            @search-classifications="handleSearchedClassifications"
            @search-accounts="handleSearchedAccounts"
        />

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-notifications"
    })

    import * as pendingApi from '~/composables/pending/pending.api'
    import { usePendingStore } from '~/composables/pending/pending.store'
    import { findOne as findRvDetails } from '~/composables/purchase/rv/rv.api'
    import { findOne as findSprDetails } from '~/composables/purchase/spr/spr.api'
    import { findOne as findJoDetails } from '~/composables/purchase/jo/jo.api'
    import { findOne as findMeqsDetails } from '~/composables/purchase/meqs/meqs.api'
    import { findOne as findPoDetails } from '~/composables/purchase/po/po.api'
    import { findOne as findRrDetails } from '~/composables/warehouse/rr/rr.api'
    import { findOne as findOsrivDetails } from '~/composables/warehouse/osriv/osriv.api'
    import { findOne as findSerivDetails } from '~/composables/warehouse/seriv/seriv.api'
    import { findOne as findMrvDetails } from '~/composables/warehouse/mrv/mrv.api'
    import { findOne as findMctDetails } from '~/composables/warehouse/mct/mct.api'
    import { findOne as findMcrtDetails } from '~/composables/warehouse/mcrt/mcrt.api'
    import { findOne as findMstDetails } from '~/composables/warehouse/mst/mst.api'
    import { findOne as findTripDetails } from '~/composables/motorpool/trip-ticket/trip-ticket.api'
    import { findOne as findGasSlipDetails } from '~/composables/motorpool/gas-slip/gas-slip.api'
    import Swal from 'sweetalert2'
    import type { Account } from '~/composables/accounting/account/account';
    import type { Classification } from '~/composables/accounting/classification/classification';
    import type { Employee } from '~/composables/hr/employee/employee.types'
    import { fetchTotalNotifications } from '~/composables/system/user/user.api'
    import { useToast } from 'vue-toastification'
    import { db_entity_mapper, type Pending } from '~/composables/pending/pending.types'
    import { PENDING_MODAL_TABS } from '~/composables/pending/pending.enums'

    // Constants
    const config = useRuntimeConfig()
    const WAREHOUSE_API_URL = config.public.warehouseApiUrl
    const pending_modal_btn = ref<HTMLButtonElement>()
    const toast = useToast();
    const store = usePendingStore()

    // Flags
    const isLoadingPage = ref(true)
    const isLoadingModal = ref(false)
    const isApproving = ref(false)
    const isDisapproving = ref(false)
    const isAddingComment = ref(false)
    const view_type = ref<'list' | 'tile'>('list')

    const screenWidth = ref(0);

    const searchValue = ref('')
    const authUser = ref<AuthUser>()
    const currentTab = ref<PENDING_MODAL_TABS>(PENDING_MODAL_TABS.RV)

    const pendings = ref<Pending[]>([])
    const classifications = ref<Classification[]>([])
    const accounts = ref<Account[]>([])

    const pending_selected = ref<Pending | null>(null)
    const login_employee = ref<Employee>()

    const isMobile = computed(() => screenWidth.value <= MOBILE_WIDTH);

    onMounted(async () => {
        authUser.value = getAuthUser()

        screenWidth.value = window.innerWidth;

        window.addEventListener('resize', () => {
            screenWidth.value = window.innerWidth;
        });

        if(isMobile.value) {
            view_type.value = 'tile'
        }

        if (authUser.value.user.user_employee) {
            const response = await pendingApi.getPendingsByEmployeeId(authUser.value.user.user_employee.employee.id)
            pendings.value = response.pendings.map(i => ({...i, is_editing: false, is_saving: false}))
            classifications.value = response.classifications
            accounts.value = response.accounts
            login_employee.value = response.employee
            isLoadingPage.value = false
        }

    })


    // ================================== COMPUTED ================================== 

    

    const filteredItems = computed(() => {

        if (searchValue.value.trim() === '') return pendings.value

        return pendings.value.filter(i => i.description.toLowerCase().includes(searchValue.value.toLowerCase()))

    })

    const is_budget_officer = computed((): boolean => {
        if(!login_employee.value) return false 
        if(login_employee.value.is_budget_officer === true) return true
        return false 
    })

    const is_finance_manager = computed((): boolean => {
        if(!login_employee.value) return false 
        if(login_employee.value.is_finance_manager === true) return true
        return false 
    })



    // ================================== WATCHERS ================================== 

    watch(isMobile, (val) => {

        if(val) {
            view_type.value = 'tile'
        } else {
            view_type.value = 'list'
        }

    })

    // ================================== FUNCTIONS ================================== 


    async function handle_click_view_details(pendingData: Pending) {
        isLoadingModal.value = true
        open_pending_modal(pendingData)

        if(pendingData.reference_table === DB_ENTITY.RV) {
            const rv = await findRvDetails(pendingData.reference_number)

            console.log('rv', rv?.rv_number);

            if(!rv || !rv.canvass) {
                console.error('rv or rv.canvass is undefined');
                return 
            }

            pending_selected.value = {...pendingData, rv, canvass: rv.canvass }
            currentTab.value = PENDING_MODAL_TABS.RV
        }

        else if(pendingData.reference_table === DB_ENTITY.SPR) {
            const spr = await findSprDetails(pendingData.reference_number)
            
            if(!spr || !spr.canvass) {
                console.error('spr or spr.canvass is undefined');
                return 
            }

            pending_selected.value = {...pendingData, spr, canvass: spr.canvass }
            currentTab.value = PENDING_MODAL_TABS.SPR
        }

        else if(pendingData.reference_table === DB_ENTITY.JO) {
            const jo = await findJoDetails(pendingData.reference_number)

            if(!jo || !jo.canvass) {
                console.error('jo or jo.canvass is undefined');
                return 
            }

            pending_selected.value = {...pendingData, jo, canvass: jo.canvass }
            currentTab.value = PENDING_MODAL_TABS.JO
        }

        else if(pendingData.reference_table === DB_ENTITY.MEQS) {
            const meqs = await findMeqsDetails(pendingData.reference_number)

            if(!meqs) {
                console.error('meqs is undefined');
                return 
            }

            let canvass = null

            if(meqs.rv) canvass = meqs.rv.canvass
            if(meqs.spr) canvass = meqs.spr.canvass
            if(meqs.jo) canvass = meqs.jo.canvass

            if(!canvass) {
                console.error('Canvass is undefined');
                return 
            }

            pending_selected.value = {
                ...pendingData, 
                meqs, 
                rv: meqs.rv || undefined, 
                spr: meqs.spr || undefined, 
                jo: meqs.jo || undefined,
                canvass
            }

            currentTab.value = PENDING_MODAL_TABS.MEQS

        }

        else if(pendingData.reference_table === DB_ENTITY.PO) {
            const po = await findPoDetails(pendingData.reference_number)

            if(!po || !po.meqs_supplier || !po.meqs_supplier.meqs) {
                console.error('po / po.meqs_supplier / po.meqs_supplier.meqs is undefined');
                return 
            }

            let canvass = null

            if(po.meqs_supplier.meqs.rv) canvass = po.meqs_supplier.meqs.rv.canvass
            if(po.meqs_supplier.meqs.spr) canvass = po.meqs_supplier.meqs.spr.canvass
            if(po.meqs_supplier.meqs.jo) canvass = po.meqs_supplier.meqs.jo.canvass

            if(!canvass) {
                console.error('Canvass is undefined');
                return 
            }

            pending_selected.value = {
                ...pendingData, 
                po,
                meqs: po.meqs_supplier.meqs, 
                rv: po.meqs_supplier.meqs.rv || undefined, 
                spr: po.meqs_supplier.meqs.spr || undefined, 
                jo: po.meqs_supplier.meqs.jo || undefined,
                canvass
            }

            currentTab.value = PENDING_MODAL_TABS.PO

        }

        else if(pendingData.reference_table === DB_ENTITY.RR) {
            const rr = await findRrDetails(pendingData.reference_number)

            if(!rr || !rr.po || !rr.po.meqs_supplier || !rr.po.meqs_supplier.meqs) {
                console.error('rr / rr.po / rr.po.meqs_supplier / rr.po.meqs_supplier.meqs is undefined');
                return 
            }

            let canvass = null

            if(rr.po.meqs_supplier.meqs.rv) canvass = rr.po.meqs_supplier.meqs.rv.canvass
            if(rr.po.meqs_supplier.meqs.spr) canvass = rr.po.meqs_supplier.meqs.spr.canvass
            if(rr.po.meqs_supplier.meqs.jo) canvass = rr.po.meqs_supplier.meqs.jo.canvass

            if(!canvass) {
                console.error('Canvass is undefined');
                return 
            }

            pending_selected.value = {
                ...pendingData,
                rr, 
                po: rr.po,
                meqs: rr.po.meqs_supplier.meqs, 
                rv: rr.po.meqs_supplier.meqs.rv || undefined, 
                spr: rr.po.meqs_supplier.meqs.spr || undefined, 
                jo: rr.po.meqs_supplier.meqs.jo || undefined,
                canvass
            }

            currentTab.value = PENDING_MODAL_TABS.RR

        }

        else if(pendingData.reference_table === DB_ENTITY.OSRIV) {
            const osriv = await findOsrivDetails(pendingData.reference_number)
            
            if(!osriv) {
                console.error('osriv is undefined');
                return 
            }

            pending_selected.value = {...pendingData, osriv }
            currentTab.value = PENDING_MODAL_TABS.OSRIV
        }

        else if(pendingData.reference_table === DB_ENTITY.SERIV) {
            const seriv = await findSerivDetails(pendingData.reference_number)
            
            if(!seriv) {
                console.error('seriv is undefined');
                return 
            }

            pending_selected.value = {...pendingData, seriv }
            currentTab.value = PENDING_MODAL_TABS.SERIV
        }

        else if(pendingData.reference_table === DB_ENTITY.MRV) {
            const mrv = await findMrvDetails(pendingData.reference_number)
            
            if(!mrv) {
                console.error('mrv is undefined');
                return 
            }

            pending_selected.value = {...pendingData, mrv }
            currentTab.value = PENDING_MODAL_TABS.MRV
        }

        else if(pendingData.reference_table === DB_ENTITY.MCT) {
            const mct = await findMctDetails(pendingData.reference_number)
            
            if(!mct) {
                console.error('mct is undefined');
                return 
            }

            pending_selected.value = {...pendingData, mct }
            currentTab.value = PENDING_MODAL_TABS.MCT
        }

        else if(pendingData.reference_table === DB_ENTITY.MCRT) {
            const mcrt = await findMcrtDetails(pendingData.reference_number)
            
            if(!mcrt) {
                console.error('mcrt is undefined');
                return 
            }

            pending_selected.value = {...pendingData, mcrt }
            currentTab.value = PENDING_MODAL_TABS.MCRT
        }

        else if(pendingData.reference_table === DB_ENTITY.MST) {
            const mst = await findMstDetails(pendingData.reference_number)
            
            if(!mst) {
                console.error('mst is undefined');
                return 
            }

            pending_selected.value = {...pendingData, mst }
            currentTab.value = PENDING_MODAL_TABS.MST
        }

        else if(pendingData.reference_table === DB_ENTITY.TRIP_TICKET) {
            const tripTicket = await findTripDetails(pendingData.reference_number)
            
            if(!tripTicket) {
                console.error('tripTicket is undefined');
                return 
            }

            pending_selected.value = {...pendingData, tripTicket }
            currentTab.value = PENDING_MODAL_TABS.TRIP_TICKET
        }

        else if(pendingData.reference_table === DB_ENTITY.GAS_SLIP) {
            const gasSlip = await findGasSlipDetails(pendingData.reference_number)
            
            if(!gasSlip) {
                console.error('gasSlip is undefined');
                return 
            }

            pending_selected.value = {...pendingData, gasSlip }
            currentTab.value = PENDING_MODAL_TABS.GAS_SLIP
        }

        isLoadingModal.value = false

    }

    // ================================== Pending Modal Handlers ================================== 

    async function handle_approval(payload: { 
        pending_data: Pending, 
        action: 'approve' | 'disapprove',
        classification_id?: string,
        fund_source_id?: string,
        close_btn?: HTMLButtonElement 
    }) {

        console.log('handle_approval', payload);
        const { pending_data, action, close_btn, classification_id, fund_source_id } = payload

        if(close_btn) {
            close_btn.click()
        }

        if(action === 'approve') {
            await approve_pending({ item: pending_data, classification_id, fund_source_id })
        } else {
            await disapprove_pending({ item: pending_data })
        }

    }

    async function handle_add_comment(payload: { pending_data: Pending, comment: string }) {
        console.log('handle_add_comment', payload);
    }

    function handle_change_tab(payload: { tab: PENDING_MODAL_TABS }) {
        currentTab.value = payload.tab
    }

    async function approve_pending(payload: { item: Pending, classification_id?: string, fund_source_id?: string, closePendingModalBtn?: HTMLButtonElement }) {

        const { item, classification_id, fund_source_id, closePendingModalBtn } = payload

        Swal.fire({
            title: "Approve Confirmation",
            text: `Are you sure you want to approve transaction ${ get_module_label(item) }?`,
            input: 'text',
            inputValue: item.approver_notes || '', 
            inputPlaceholder: 'Add Comment (optional)...',
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#198754",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Approve!",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async (confirm) => {

                const inputValue = Swal.getInput()?.value;
                const notes = inputValue || '';

                const response = await pendingApi.approvePending({
                    id: item.id,
                    classification_id,
                    fund_source_id,
                    remarks: notes,
                })

                if (response.success) {

                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        position: 'top',
                    });

                    store.decrement_total_pendings()
                    // await updateTotalNotifications()
                    removePending(item.id)
                    } else {

                    Swal.fire({
                        title: 'Error!',
                        text: response.msg,
                        icon: 'error',
                        position: 'top',
                    })

                }

            },
            allowOutsideClick: () => !Swal.isLoading()
        })

    }

    async function disapprove_pending(payload: {item: Pending, closePendingModalBtn?: HTMLButtonElement }) {

        const { item, closePendingModalBtn } = payload

        Swal.fire({
            title: "Disapprove Confirmation",
            text: `Are you sure you want to disapprove transaction ${ get_module_label(item) }?`,
            input: 'text',
            inputValue: item.approver_notes || '',
            inputPlaceholder: 'Add Comment...',
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74a3b",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Disapprove!",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to enter a comment!';
                }
            },
            preConfirm: async (confirm) => {

                const inputValue = Swal.getInput()?.value;
                const notes = inputValue || '';

                const response = await pendingApi.disapprovePending({
                    id: item.id,
                    remarks: notes,
                })

                if (response.success) {

                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        position: 'top',
                    })
                    store.decrement_total_pendings()
                    // await updateTotalNotifications()
                    removePending(item.id)

                    } else {

                    Swal.fire({
                        title: 'Error!',
                        text: response.msg,
                        icon: 'error',
                        position: 'top',
                    })

                }

            },
            allowOutsideClick: () => !Swal.isLoading()
        })

    }

    async function handleSearchedAccounts(searchedAccounts: Account[]) {
        accounts.value = searchedAccounts.map(i => ({...i}))
    }

    async function handleSearchedClassifications(searchedClassifications: Classification[]) {
        classifications.value = searchedClassifications.map(i => ({...i}))
    }

    // =============================== Comment.vue Handlers =============================== 

    async function handle_save_comment(payload: {pending_id: number, comment: string}) {

        const { pending_id, comment } = payload

        const pending = pendings.value.find(i => i.id === pending_id) 
        if(!pending) {
            console.error('Pending not found with id of', pending_id);
            return 
        }

        const sanitizedComment = comment
        .trim()  // Remove leading/trailing spaces
        .replace(/\s+/g, ' '); // Replace multiple spaces with a single space

        pending.is_saving = true 
        const response = await pendingApi.saveComment(pending_id, sanitizedComment)
        pending.is_saving = false 
        pending.is_editing = false

        if(response.success) {
            toast.success(response.msg)
            pending.approver_notes = comment 
        } else {
            toast.error(response.msg)
        }

    }

    function handle_cancel_edit_comment(payload: {pending_id: number}) {
        const { pending_id } = payload
        
        const pending = pendings.value.find(i => i.id === pending_id) 
        if(!pending) {
            console.error('Pending not found with id of', pending_id);
            return 
        }
        pending.is_editing = false
    }

    function handle_start_edit_comment(payload: {pending_id: number}) {
        const { pending_id } = payload

        const pending = pendings.value.find(i => i.id === pending_id) 
        if(!pending) {
            console.error('Pending not found with id of', pending_id);
            return 
        }
        pending.is_editing = true
    }

    // =============================== Utils =============================== 

    // async function updateTotalNotifications() {
    //     console.log('updateTotalNotifications');
        
    //     if(!authUser.value) return 

    //     if(authUser.value.user.user_employee) {
    //         const response = await fetchTotalNotifications(authUser.value.user.user_employee.employee_id, WAREHOUSE_API_URL)
    //         if(response !== undefined) {
    //             authUser.value.user.user_employee.employee.total_pending_approvals = response
    //             const newAuthUser = JSON.stringify(authUser.value);
    //             localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, newAuthUser);
    //         }
    //     }

    // }

    function removePending(id: number) {
        const indx = pendings.value.findIndex(i => i.id === id);
        if (indx !== -1) {
            pendings.value.splice(indx, 1);
        }
    }

    function get_module_label(pending: Pending) {
        return db_entity_mapper[pending.reference_table] + ': ' + pending.reference_number
    }

    function open_pending_modal(pending: Pending) {
        console.log('open_pending_modal');

        const item = pendings.value.find(i => i.id === pending.id)

        if(item) {
            console.log('Item found in pendings. Opening modal...');
            pending_modal_btn.value?.click()
        } else {
            console.log('Item not found in pendings. Will not open modal');
        }

    }

</script>



<style scoped>
    .card-header {
        background-color: #FFFACD; /* Soft Yellow - Lemon Chiffon */
        color: #333333; 
    }

    .pending-btn {
        background-color: #4A90E2; /* Bright and vibrant blue */
        color: #ffffff; /* Clear and contrasting white text */
        border: none; /* Clean border */
        border-radius: 0.375rem; /* Rounded corners for a soft look */
        padding: 0.5rem 1rem; /* Adequate spacing */
        font-size: 0.8rem; /* Readable text size */
        font-weight: 500; /* Slightly bolder text for emphasis */
        transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    }

    .pending-btn:hover {
        background-color: #357ABD; /* Slightly darker shade for hover */
        transform: translateY(-1px); /* Slight lift effect */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
        color: #ffffff; /* Ensure the text is still visible */
    }

    .pending-btn:focus {
        outline: none; /* Remove default outline */
        background-color: #357ABD; /* Keep the hover color for focus */
        box-shadow: 0 0 0 0.25rem rgba(74, 144, 226, 0.5); /* Glow effect */
    }

    .pending-btn:active {
        background-color: #2C6AA5; /* Even darker blue for active state */
        transform: scale(0.98); /* Pressed-in effect */
        box-shadow: none; /* Remove shadow for active state */
    }

</style>