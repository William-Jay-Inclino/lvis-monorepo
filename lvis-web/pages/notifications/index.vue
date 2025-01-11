<template>

    <div v-if="!isLoadingPage && authUser && authUser.user.user_employee">

        <div class="row pt-3">
            <div v-for="item, i in filteredItems" :key="i" class="col-lg-3 col-md-6 col-sm-12 pt-3">
                <div class="card">
                    <div class="card-header">
                        <div class="small">
                            Pending #{{ i + 1 }}
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="mb-2">
                            <textarea class="form-control form-control-sm" rows="6" readonly>{{ item.description }}</textarea>
                        </div>
                        <span class="small text-muted fst-italic">{{ formatDate(item.transaction_date, true) }}</span>

                    </div>
                    <div class="card-footer text-center">
                        <button 
                            @click="on_click_view_details(item)"
                            data-bs-toggle="modal" 
                            data-bs-target="#pendingModal2" 
                            class="btn pending-btn"
                        >
                            View Details
                            <client-only>
                                <font-awesome-icon class="ms-1" :icon="['fas', 'paper-plane']" />
                            </client-only> 
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <PendingModal
            :pending-data="pending_selected"
            :is-loading-modal="isLoadingModal"
            :is-approving="isApproving"
            :is-disapproving="isDisapproving"
            :is-adding-comment="isAddingComment"
            :current-tab="currentTab"
            @approve="handle_approval"
            @disapprove="handle_approval"
            @addComment="handle_add_comment"
            @change-tab="handle_change_tab"
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

    import * as noticationApi from '~/composables/notification/notification.api'
    import { findOne as findRvDetails } from '~/composables/purchase/rv/rv.api'
    import { findOne as findSprDetails } from '~/composables/purchase/spr/spr.api'
    import { findOne as findJoDetails } from '~/composables/purchase/jo/jo.api'
    import { findOne as findMeqsDetails } from '~/composables/purchase/meqs/meqs.api'
    import Swal from 'sweetalert2'
    import { DB_ENTITY, type AuthUser } from '#imports';
    import type { Account } from '~/composables/accounting/account/account';
    import type { Classification } from '~/composables/accounting/classification/classification';
    import { useToast } from "vue-toastification";
    import type { Pending } from '~/composables/notification/notification.types';
    import { PENDING_MODAL_TABS } from '~/composables/notification/notifications.enums';
    import PendingModal from '~/components/Purchase/PendingModal.vue';

    // Constants
    const config = useRuntimeConfig()
    const WAREHOUSE_API_URL = config.public.warehouseApiUrl
    const toast = useToast();


    // Flags
    const isLoadingPage = ref(true)
    const isLoadingModal = ref(false)
    const isApproving = ref(false)
    const isDisapproving = ref(false)
    const isAddingComment = ref(false)

    const searchValue = ref('')
    const authUser = ref<AuthUser>()
    const currentTab = ref<PENDING_MODAL_TABS>(PENDING_MODAL_TABS.RV)

    const pendings = ref<Pending[]>([])
    const classifications = ref<Classification[]>([])
    const accounts = ref<Account[]>([])

    const pending_selected = ref<Pending | null>(null)

    onMounted(async () => {
        authUser.value = getAuthUser()

        if (authUser.value.user.user_employee) {
            const response = await noticationApi.getPendingsByEmployeeId(authUser.value.user.user_employee.employee.id)
            pendings.value = response.pendings
            classifications.value = response.classifications
            accounts.value = response.accounts
            isLoadingPage.value = false
        }

    })


    // ================================== COMPUTED ================================== 

    const filteredItems = computed(() => {

        if (searchValue.value.trim() === '') return pendings.value

        return pendings.value.filter(i => i.description.toLowerCase().includes(searchValue.value.toLowerCase()))

    })

    // ================================== FUNCTIONS ================================== 


    async function on_click_view_details(pendingData: Pending) {
        isLoadingModal.value = true

        if(pendingData.reference_table === DB_ENTITY.RV) {
            const rv = await findRvDetails(pendingData.reference_number)

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
            currentTab.value = PENDING_MODAL_TABS.SPR
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

        isLoadingModal.value = false

    }

    // ================================== Pending Modal Handlers ================================== 

    async function handle_approval(payload: { pending_data: Pending, action: 'approve' | 'disapprove' }) {
        console.log('handle_approval', payload);
    }

    async function handle_add_comment(payload: { pending_data: Pending, comment: string }) {
        console.log('handle_add_comment', payload);
    }

    function handle_change_tab(payload: { tab: PENDING_MODAL_TABS }) {
        currentTab.value = payload.tab
    }

    // =============================== Utils =============================== 


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