
<template>
    <div v-if="meqs && referenceData&& referenceData.canvass" class="responsive">


        <!-- MEQS INFO -->
        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> MEQS Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>MEQS #</td>
                            <td class="text-muted"> {{ meqs.meqs_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[meqs.status].color}`]: true }">
                                    {{ approvalStatus[meqs.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Requisitioner</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(referenceData.canvass.requested_by!.firstname, referenceData.canvass.requested_by!.lastname,
                                    referenceData.canvass.requested_by!.middlename, referenceData.canvass.requested_by!.name_prefix, referenceData.canvass.requested_by!.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Requisitioner Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="referenceData.canvass.purpose" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Requisitioner Notes</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="referenceData.canvass.notes" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(meqs.meqs_date) }} </td>
                        </tr>
                        <tr>
                            <td class="align-middle">MEQS Notes</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="meqs.notes" readonly/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- SIGNATORIES -->
        <div class="row justify-content-center pt-2">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'users']"/>
                        </client-only> Signatories
                    </h5>
                    <hr class="result">
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered table-table-sm small">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white"> Label </th>
                                <th class="bg-secondary text-white"> Approver </th>
                                <th class="bg-secondary text-white"> Status </th>
                                <th class="bg-secondary text-white"> Comment </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in meqs.meqs_approvers">
                                <td class="align-middle"> {{ i.label }} </td>
                                <td class="align-middle"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(meqs.status, i.status)" class="text-muted text-center align-middle">
                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                        {{ approvalStatus[i.status].label }}
                                    </div>
                                    <div class="fst-italic" v-if="i.date_approval">
                                        <small> {{ formatDate(i.date_approval, true) }} </small>
                                    </div>
                                </td>
                                <td v-else class="text-muted text-center align-middle fst-italic">
                                    N/A
                                </td>
                                <td>
                                    <textarea rows="2" class="form-control form-control-sm text-muted" readonly
                                        :value="i.notes || 'N/A'"></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- SUPPLIERS -->
        <div class="row justify-content-center pt-2">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'truck']" />
                        </client-only> Suppliers
                    </h5>
                    <hr class="result">
                </div>

                <div class="alert alert-info" role="alert">
                    <small class="text-muted fst-italic">Click the attachment to view it in a larger size.</small>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-bordered small">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white"> Supplier </th>
                                <th class="bg-secondary text-white"> Payment Terms </th>
                                <th class="bg-secondary text-white"> Attachments </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in meqs.meqs_suppliers">
                                <td class="text-muted align-middle"> {{ i.supplier!.name }} </td>
                                <td class="text-muted align-middle"> {{ i.payment_terms }} </td>
                                <td>
                                    <div class="d-flex flex-wrap">
                                        <div v-for="attachment in i.attachments" class="p-1 image-container">
                                            <a href="javascript:void(0)" @click="onClickAttachment(attachment.src)"
                                            data-bs-toggle="offcanvas" data-bs-target="#myOffcanvas">
                                                <img :src="getUploadsPath(attachment.src)"
                                                    class="img-thumbnail small-image" alt="Image not found">
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- ITEMS -->
        <div class="row justify-content-center pt-2">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                        </client-only> Items
                    </h5>
                    <hr class="result">
                </div>

                <div class="alert alert-info" role="alert">
                    <div>
                        <small class="text-muted fst-italic">1. The awarded supplier is indicated by a yellow
                            star.</small>
                    </div>
                    <div>
                        <small class="text-muted fst-italic">2. The highlighted row needs some review.</small>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-sm table-bordered small">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white"> No </th>
                                <th class="bg-secondary text-white"> Item </th>
                                <th class="bg-secondary text-white"> Unit Price </th>
                                <th class="bg-secondary text-white"> Qty </th>
                                <th class="bg-secondary text-white text-center"
                                    v-for="meqsSupplier in meqs.meqs_suppliers">
                                    {{ `${meqsSupplier.supplier?.name}` }}
                                </th>
                                <th class="bg-secondary text-white text-center">Remarks</th>
                            </tr>
                        </thead>
                        <tbody v-if="referenceData?.canvass">
                            <tr :class="{'table-danger': hasRemarks(canvassItem.id, meqs.meqs_suppliers)}" v-for="canvassItem, i in referenceData.canvass.canvass_items">
                                <td class="text-muted align-middle"> {{ i + 1 }} </td>
                                <td class="text-muted align-middle">
                                    <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ canvassItem.description }} </textarea>
                                </td>
                                <td class="text-muted align-middle"> {{ canvassItem.unit ? canvassItem.unit.name : 'N/A' }} </td>
                                <td class="text-muted align-middle"> {{ canvassItem.quantity }} </td>
                                <td class="text-muted text-center align-middle" v-for="meqsSupplier in meqs.meqs_suppliers">
                                    <template v-for="supplierItem in meqsSupplier.meqs_supplier_items">
                                        <span v-if="supplierItem.canvass_item.id === canvassItem.id">
                                            {{ 
                                                supplierItem.price === -1 
                                                    ? 
                                                        'N/A' 
                                                    :
                                                        formatToPhpCurrency(supplierItem.price) 
                                            }}
                                            
                                                <client-only>
                                                    <font-awesome-icon 
                                                    :icon="['fas', 'star']" 
                                                    class="fs-5" 
                                                    :class="{ 'text-warning': supplierItem.is_awarded }" 
                                                    />

                                                </client-only>
                                        </span>
                                    </template>
                                </td>
                                <td class="text-center align-middle">
                                    <button @click="onClickNote(canvassItem.id)" class="btn btn-secondary btn-sm"
                                    data-bs-toggle="offcanvas" data-bs-target="#myOffcanvas">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'book']" />
                                        </client-only>
                                        View
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td :colspan="5 + meqs.meqs_suppliers.length" class="text-center">N/A</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


        <div class="row justify-content-center pt-2">
            <div class="col-lg-9 col-md-12 col-sm-12">
                <div class="row pt-3 mb-5">
                        <div class="col">
                            <ul class="list-group">
                                <li class="list-group-item text-center bg-warning text-white fw-bold">AWARDED SUPPLIERS</li>
                                <li v-for="awarded_supplier in awarded_suppliers" class="list-group-item d-flex justify-content-between align-items-center">
                                    <span data-test="awarded-supplier" class="fw-bold">
                                        {{ awarded_supplier.supplier?.name }}
                                    </span>
                                    <span class="badge bg-warning rounded-pill">
                                        <client-only>
                                            <font-awesome-icon :icon="['fas', 'star']"/>
                                        </client-only>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
            </div>
        </div>


        <!-- OFF CANVASS -->
        <div class="offcanvas offcanvas-end" tabindex="-1" id="myOffcanvas" aria-labelledby="offcanvasLabel">
            <div class="offcanvas-header">
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
            <div v-if="modalToShow === 'attachment'">
                <img :src="selectedAttachment" class="img-fluid" :alt="selectedAttachment">
            </div>
            <div v-else>
                <textarea rows="5" cols="50" class="form-control" :value="selectedNote" readonly></textarea>
            </div>
            </div>
        </div>
        

    </div>
</template>


<script setup lang="ts">
    import type { MEQS } from '~/composables/purchase/meqs/meqs.types';
    import { hasRemarks } from '~/composables/purchase/meqs/meqs';
    import type { MeqsSupplier } from '~/composables/purchase/meqs/meqs-supplier';

    const props = defineProps({
        meqs: {
            type: Object as () => MEQS,
        },
    });

    const config = useRuntimeConfig()
    const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload'


    const selectedAttachment = ref('')
    const selectedNote = ref('')
    const modalToShow = ref<'attachment' | 'note'>('attachment')

    const referenceData = computed(() => {

        if(!props.meqs) return 

        if (props.meqs.rv) return props.meqs.rv
        if (props.meqs.spr) return props.meqs.spr
        if (props.meqs.jo) return props.meqs.jo

    })

    const awarded_suppliers = computed( (): MeqsSupplier[] => {
    
        if(!props.meqs) return []

        const awarded_suppliers = []

        for(let meqs_supplier of props.meqs.meqs_suppliers) {
            const awarded_item = meqs_supplier.meqs_supplier_items.find(i => i.is_awarded === true)
            if(awarded_item) {
                awarded_suppliers.push(meqs_supplier)
            }
        }

        return awarded_suppliers

    })


    function onClickAttachment(src: string) {
        modalToShow.value = 'attachment'
        selectedAttachment.value = getUploadsPath(src)
    }

    function onClickNote(canvass_item_id: string) {

        if(!props.meqs) return 

        modalToShow.value = 'note'

        for (let supplier of props.meqs.meqs_suppliers) {

            const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

            if (item) {
                const emptyNote = (!item.notes || item.notes.trim() === '')
                selectedNote.value = emptyNote ? 'No remarks' : item.notes!
                break
            }

        }

    }

    function getUploadsPath(src: string) {

        const path = src.replace(UPLOADS_PATH, '')
        console.log('PATH', path)

        const uploadsPath = API_FILE_ENDPOINT + path
        return uploadsPath

    }

</script>



<style scoped>
    .small-image {
        max-width: 100px;
        max-height: 100px;
    }

    .image-container {
        overflow: hidden;
    }

    .image-container img {
        transition: transform 0.3s ease;
    }

    .image-container:hover img {
        transform: scale(1.2);
    }
</style>