<template>
    <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="pendingModal2" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-white">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']" />
                        </client-only>
                        Details
                    </h5>
                    <button @click="onCloseModal()" ref="pending_modal_close_btn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="!isLoadingModal">
                        <ul class="nav nav-tabs nav-fill bg-white">
                            <li v-show="showCanvass" class="nav-item">
                                <a @click="emits('changeTab', { tab: PENDING_MODAL_TABS.CANVASS })" class="nav-link" :class="{'active': currentTab === PENDING_MODAL_TABS.CANVASS }" href="javascript:void(0)">Canvass</a>
                            </li>
                            <li v-show="showRV" class="nav-item">
                                <a @click="emits('changeTab', { tab: PENDING_MODAL_TABS.RV })" class="nav-link" :class="{'active': currentTab === PENDING_MODAL_TABS.RV }" href="javascript:void(0)">RV</a>
                            </li>
                            <li v-show="showSPR" class="nav-item">
                                <a @click="emits('changeTab', { tab: PENDING_MODAL_TABS.SPR })" class="nav-link" :class="{'active': currentTab === PENDING_MODAL_TABS.SPR }" href="javascript:void(0)">SPR</a>
                            </li>
                            <li v-show="showJO" class="nav-item">
                                <a @click="emits('changeTab', { tab: PENDING_MODAL_TABS.JO })" class="nav-link" :class="{'active': currentTab === PENDING_MODAL_TABS.JO }" href="javascript:void(0)">JO</a>
                            </li>
                            <li v-show="showMEQS" class="nav-item">
                                <a @click="emits('changeTab', { tab: PENDING_MODAL_TABS.MEQS })" class="nav-link" :class="{'active': currentTab === PENDING_MODAL_TABS.MEQS }" href="javascript:void(0)">MEQS</a>
                            </li>
                            <li v-show="showPO" class="nav-item">
                                <a class="nav-link" href="javascript:void(0)">PO</a>
                            </li>
                            <li v-show="showRR" class="nav-item">
                                <a class="nav-link" href="javascript:void(0)">RR</a>
                            </li>
                        </ul>

                        <hr>

                        <div class="row">
                            <div class="col">
                                <div class="modal-body-content">
                                    <div v-if="currentTab === PENDING_MODAL_TABS.CANVASS">
                                        <CanvassDetail :canvass="pendingData?.canvass" />
                                    </div>
                                    <div v-else-if="currentTab === PENDING_MODAL_TABS.RV">
                                        <RvDetail :rv="pendingData?.rv"/>
                                    </div>
                                    <div v-else-if="currentTab === PENDING_MODAL_TABS.SPR">
                                        <SprDetail :spr="pendingData?.spr"/>
                                    </div>
                                    <div v-else-if="currentTab === PENDING_MODAL_TABS.JO">
                                        <JoDetail :jo="pendingData?.jo"/>
                                    </div>
                                    <div v-else-if="currentTab === PENDING_MODAL_TABS.MEQS">
                                        <MeqsDetail :meqs="pendingData?.meqs"/>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div v-show="isLoadingModal">
                        <LoaderSpinner />
                    </div>
                </div>
                <div class="modal-footer">
                    <!-- Select Account Field -->
                    <div v-if="isBudgetOfficer" class="w-100">
                        <div class="mb-3">
                            <label class="label small">Select Classification</label>
                            <client-only>
                                <v-select class="bg-white text-dark" data-testid="classification" @search="handleSearchClassifications" :options="classifications" label="name" v-model="classification"></v-select>
                            </client-only>
                            <span class="text-danger fst-italic small">Please select a classification</span>
                        </div>
                    </div>
                    <!-- Action Buttons -->
                     <div class="d-flex w-100">
                         <button @click="onCloseModal()" class="btn btn-secondary flex-fill me-2">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'times']" />
                            </client-only>
                            Close
                         </button>
                        <button @click="onClickDisapprove" :disabled="isLoadingModal || isDisapproving" class="btn btn-danger flex-fill me-2">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'times-circle']" />
                            </client-only>
                            {{ isDisapproving ? 'Disapproving...' : 'Disapprove' }}
                        </button>
                        <button @click="onClickApprove" :disabled="isLoadingModal || isApproving" class="btn btn-success flex-fill">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'check-circle']" />
                            </client-only>
                            {{ isApproving ? 'Approving...' : 'Approve' }}
                        </button>
                     </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import type { Pending } from '~/composables/notification/notification.types';
    import { PENDING_MODAL_TABS } from '~/composables/notification/notifications.enums';
    import CanvassDetail from './CanvassDetail.vue';
    import RvDetail from './RvDetail.vue';
    import SprDetail from './SprDetail.vue';
    import JoDetail from './JoDetail.vue';
    import MeqsDetail from './MeqsDetail.vue';
    import type { Account } from '~/composables/accounting/account/account';
    import { fetchAccountsByName } from '~/composables/accounting/account/account.api';
    import { fetchClassificationsByName } from '~/composables/accounting/classification/classification.api';

    const emits = defineEmits([
        'approve',
        'disapprove',
        'addComment',
        'changeTab',
        'search-accounts',
        'search-classifications',
    ])

    const props = defineProps({
        pendingData: {
            type: Object as () => Pending | null,
            default: null,
        },
        classifications: {
            type: Array as () => Classification[],
            default: []
        },
        accounts: {
            type: Array as () => Account[],
            default: []
        },
        currentTab: {
            type: String as () => PENDING_MODAL_TABS,
            required: true,
        },
        isBudgetOfficer: {
            type: Boolean,
            default: false,
        },
        isFinanceManager: {
            type: Boolean,
            default: false,
        },
        isLoadingModal: {
            type: Boolean,
            default: false,
        },
        isApproving: {
            type: Boolean,
            default: false,
        },
        isDisapproving: {
            type: Boolean,
            default: false,
        },
        isAddingComment: {
            type: Boolean,
            default: false,
        },
    });

    const pending_modal_close_btn = ref<HTMLButtonElement>()
    const classification = ref<Classification>()
    const fundSource = ref<Account>()



    // COMPUTED
    const showCanvass = computed( () => {
        if(props.pendingData && props.pendingData.canvass) return true 
        return false  
        
    })

    const showRV = computed( () => {
        if(props.pendingData && props.pendingData.rv) return true 
        return false  
    })

    const showSPR = computed( () => {
        if(props.pendingData && props.pendingData.spr) return true 
        return false  
    })

    const showJO = computed( () => {
        if(props.pendingData && props.pendingData.jo) return true 
        return false  
    })

    const showMEQS = computed( () => {
        if(props.pendingData && props.pendingData.meqs) return true 
        return false  
    })

    const showPO = computed( () => {
        if(props.pendingData && props.pendingData.po) return true 
        return false  
    })

    const showRR = computed( () => {
        if(props.pendingData && props.pendingData.rr) return true 
        return false  
    })



    // ACTIONS
    function onClickApprove() {
        emits('approve', { 
            pending_data: props.pendingData, 
            action: 'approve', 
            close_btn: pending_modal_close_btn.value,
            classification_id: classification.value ? classification.value.id : undefined, 
            fund_source_id: fundSource.value ? fundSource.value.id : undefined, 
        })
    }

    function onClickDisapprove() {
        emits('disapprove', { pending_data: props.pendingData, action: 'disapprove', close_btn: pending_modal_close_btn.value })
    }




    // API SEARCH
    async function handleSearchAccounts(input: string, loading: (status: boolean) => void ) {

        if(input.trim() === ''){
            emits('search-accounts', [])
            return 
        } 

        debouncedSearchAccounts(input, loading)

    }

    async function handleSearchClassifications(input: string, loading: (status: boolean) => void ) {

        if(input.trim() === ''){
            emits('search-accounts', [])
            return 
        } 

        debouncedSearchClassifications(input, loading)

    }

    async function searchAccounts(input: string, loading: (status: boolean) => void) {

        loading(true)

        try {
            const response = await fetchAccountsByName(input);
            emits('search-accounts', response)
        } catch (error) {
            console.error('Error fetching Accounts:', error);
        } finally {
            loading(false);
        }
    }

    async function searchClassifications(input: string, loading: (status: boolean) => void) {

        loading(true)

        try {
            const response = await fetchClassificationsByName(input);
            emits('search-classifications', response)
        } catch (error) {
            console.error('Error fetching Classifications:', error);
        } finally {
            loading(false);
        }
    }



    // UTILS
    const onCloseModal = () => {
        classification.value = undefined
        fundSource.value = undefined
    }

    const debouncedSearchAccounts = debounce((input: string, loading: (status: boolean) => void) => {
        searchAccounts(input, loading);
    }, 500);

    const debouncedSearchClassifications = debounce((input: string, loading: (status: boolean) => void) => {
        searchClassifications(input, loading);
    }, 500);


</script>


<style scoped>

    .modal-header {
        background-color: #1DA1F2; /* Twitter's blue color */
        color: #ffffff;
    }

    .modal-body-content {
        max-height: 50vh; /* Set the maximum height of the modal content */
        overflow-y: auto; /* Enable vertical scrolling */
        overflow-x: hidden; /* Disable horizontal scrolling */
        padding-bottom: 20px; /* Optional: Add space for footer if content is large */
    }

</style>