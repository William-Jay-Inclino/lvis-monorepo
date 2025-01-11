<template>
    <div class="modal fade" id="pendingModal2" tabindex="-1"
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
                    <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="!isLoadingModal">
                        <ul class="nav nav-pills nav-fill bg-white">
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
                    <button :disabled="isLoadingModal" class="btn btn-danger me-2">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'times-circle']" />
                        </client-only> 
                        Disapprove
                    </button>
                    <button :disabled="isLoadingModal" class="btn btn-success">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'check-circle']" />
                        </client-only> 
                        Approve
                    </button>
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

    const emits = defineEmits([
        'approve',
        'disapprove',
        'addComment',
        'changeTab',
    ])

    const props = defineProps({
        pendingData: {
            type: Object as () => Pending | null,
            default: null,
        },
        currentTab: {
            type: String as () => PENDING_MODAL_TABS,
            required: true,
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


</script>


<style scoped>

    .modal-header {
        background-color: #1DA1F2; /* Twitter's blue color */
        color: #ffffff;
    }

    .modal-body-content {
        max-height: 70vh; /* Set the maximum height of the modal content */
        overflow-y: auto; /* Enable vertical scrolling */
        overflow-x: hidden; /* Disable horizontal scrolling */
        padding-bottom: 20px; /* Optional: Add space for footer if content is large */
    }

</style>