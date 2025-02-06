<template>

    <div class="table-responsive">

        <div class="row">
            <div class="col">
                <div>
                    <small class="text-secondary fst-italic">Click the star icon to award the supplier </small>
                </div>
            </div>
        </div>

        <table class="table table-hover table-sm mt-3">

            <thead>
                <tr>
                    <th class="bg-secondary text-white"> No. </th>
                    <th class="bg-secondary text-white"> Item </th>
                    <th class="bg-secondary text-white"> Unit </th>
                    <th class="bg-secondary text-white"> Qty </th>
                    <th class="bg-secondary text-white text-center" v-for="meqsSupplier in meqs_suppliers">
                        {{ `${meqsSupplier.supplier?.name} (${meqsSupplier.payment_terms})` }}
                    </th>
                    <th class="bg-secondary text-white text-center"> Remarks </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="item, i in canvass_items_with_suppliers"
                    :class="{ 'table-danger': !item.hasAwardedSupplier && !isInitial }">
                    <td class="text-muted align-middle"> {{ i + 1 }} </td>
                    <td class="text-muted align-middle nowrap">
                        <textarea class="form-control form-control-sm" rows="5" readonly>{{ item.description }}</textarea>
                    </td>
                    <td class="text-muted align-middle nowrap">{{ item.unit ? item.unit.name : 'N/A' }}</td>
                    <td class="text-muted align-middle nowrap">{{ item.quantity }}</td>
                    <td class="align-middle" v-for="meqsSupplier, meqsSupplierIndx in meqs_suppliers">
                        <div class="d-flex justify-content-center align-items-center">

                            <div v-for="supplierItem, indx in meqsSupplier.meqs_supplier_items">
                                <div v-if="supplierItem.canvass_item.id === item.id" class="d-flex align-items-center">
                                    <input type="text"
                                        :value="(supplierItem.price === -1) ? 'N/A' : formatToPhpCurrency(supplierItem.price)"
                                        class="form-control me-2" style="width: 100px" disabled>

                                        <client-only>
                                            <font-awesome-icon 
                                                :data-testid="`award-icon-${ i }-${ meqsSupplierIndx }`"
                                                :icon="['fas', 'star']" 
                                                class="clickable-icon fs-5" 
                                                @click="onAward(meqsSupplier, item.id, supplierItem, indx)" 
                                                :class="{ 'text-warning': supplierItem.is_awarded }" 
                                            />
                                        </client-only>
                                </div>
                            </div>

                        </div>
                    </td>
                    <td class="align-middle text-center">
                        <button ref="attachRemarkBtns" @click="onClickAttachNote(item.id)" class="btn btn-light btn-sm"
                            data-bs-toggle="modal" data-bs-target="#attachNoteModal">
                            <!-- <i class="fas fa-sticky-note fs-2" :class="{'text-warning': hasRemarks(item.id, meqs_suppliers)}"></i> -->
                            <client-only>
                                <font-awesome-icon 
                                    :icon="['fas', 'sticky-note']" 
                                    class="fs-2" 
                                    :class="{ 'text-warning': hasRemarks(item.id, meqs_suppliers) }" 
                                />
                            </client-only>
                        </button>
                    </td>
                </tr>
            </tbody>

        </table>

        <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="attachNoteModal" tabindex="-1"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-warning" id="exampleModalLabel">
                            Attach Remark
                        </h5>
                        <button @click="onCloseAttachModal" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <textarea rows="3" class="form-control" v-model="attachNoteData.note"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button @click="onCloseAttachModal" ref="closeattachNoteModal" class="btn btn-secondary"
                            data-bs-dismiss="modal">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'close']"/>
                            </client-only> Close
                        </button>
                        <button @click="attachNote" class="btn btn-primary" :disabled="isAttachingRemark">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'paperclip']" />
                            </client-only> {{ isAttachingRemark ? 'Attaching...' : 'Attach' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>



<script setup lang="ts">
import type { CanvassItem } from '~/composables/purchase/canvass/canvass-item.types';
import { hasRemarks } from '~/composables/purchase/meqs/meqs';
import type { MeqsSupplier } from '~/composables/purchase/meqs/meqs-supplier';
import type { MeqsSupplierItem } from '~/composables/purchase/meqs/meqs-supplier-item';


const emits = defineEmits(['awardSupplierItem', 'attachNote']);

const props = defineProps({
    meqs_suppliers: {
        type: Array as () => MeqsSupplier[],
        default: () => [],
    },
    canvass_items_with_suppliers: {
        type: Array as () => CanvassItem[],
        default: () => [],
    },
    isInitial: {
        type: Boolean,
        default: () => true
    },
    isAttachingRemark: {
        type: Boolean,
        default: () => false
    }
});

interface AttachNoteData {
    canvass_item_id: string,
    note: string
}

const _attachNoteDataInitial = {
    canvass_item_id: '',
    note: ''
}

const attachNoteData = ref<AttachNoteData>({ ..._attachNoteDataInitial })
const closeattachNoteModal = ref<HTMLButtonElement>()

const attachRemarkBtns = ref<HTMLButtonElement[]>([])

function attachNote() {
    console.log('attachNote', attachNoteData)

    emits('attachNote', attachNoteData.value.canvass_item_id, attachNoteData.value.note)
    closeattachNoteModal.value?.click()
}

function onClickAttachNote(canvassItemId: string) {
    attachNoteData.value.canvass_item_id = canvassItemId

    let note = ''
    for (let supplier of props.meqs_suppliers) {

        const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvassItemId)

        if (item) {
            note = item.notes
            break
        }

    }

    attachNoteData.value.note = note

}

function onAward(meqsSupplier: MeqsSupplier, canvass_item_id: string, meqsSupplierItem: MeqsSupplierItem, indx: number) {

    console.log('onAward')

    // if(meqsSupplierItem.is_awarded) return 

    emits('awardSupplierItem', meqsSupplier, canvass_item_id, meqsSupplierItem.id, attachRemarkBtns.value[indx])

}

function onCloseAttachModal() {
    attachNoteData.value = { ..._attachNoteDataInitial }
}

</script>


<style scoped>
.clickable-icon {
    cursor: pointer;
    color: #6c757d;
    /* Default color similar to text-muted */
    transition: color 0.3s;
    /* Add transition for smooth color change */
}

.clickable-icon:hover {
    color: #ffc107;
    /* Hover color similar to text-warning */
}

.nowrap {
    white-space: nowrap;
}

.select-responsive {
    max-width: 100%;
    width: auto;
}
</style>