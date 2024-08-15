<template>

    <div>

        <div class="row">

            <div class="col-lg-4 col-md-6">
                <div class="accordion" id="accordionFlushExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#flush-collapseOne" aria-expanded="false"
                                aria-controls="flush-collapseOne">
                                Table Filters
                            </button>
                        </h2>
                        <div id="flush-collapseOne" class="accordion-collapse collapse"
                            aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showDescription" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Description</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showClass" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Class</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showUnit" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Unit</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showDelivered" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Delivered</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showAccepted" class="form-check-input" type="checkbox"
                                                disabled>
                                            <label class="form-check-label">Accepted</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showVat" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">VAT</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showGrossPrice" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Unit Price</label>
                                        </div>
                                    </div>
                                    <!-- <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showNetPrice" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Net Price</label>
                                        </div>
                                    </div> -->
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showGrossTotal" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Amount</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showVatTotal" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">VAT Amount</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check form-switch">
                                            <input v-model="showNetTotal" class="form-check-input" type="checkbox">
                                            <label class="form-check-label">Net Amount</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="row pt-3">
            <div class="col">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th v-show="showDescription" class="bg-secondary text-white">Description</th>
                                <th v-show="showClass" class="bg-secondary text-white">Item Class</th>
                                <th v-show="showUnit" class="bg-secondary text-white">Unit</th>
                                <th v-show="showDelivered" class="bg-secondary text-white">Qty Request</th>
                                <th v-show="showAccepted" class="bg-secondary text-white">
                                    Qty Accepted <span class="text-danger"> * </span>
                                </th>
                                <th v-show="showVat" class="bg-secondary text-white">VAT Type</th>
                                <th v-show="showGrossPrice" class="bg-secondary text-white">Unit Cost</th>
                                <th v-show="showNetTotal" class="bg-secondary text-white">Vatable Amount</th>
                                <th v-show="showVatTotal" class="bg-secondary text-white">VAT</th>
                                <th v-show="showGrossTotal" class="bg-secondary text-white">Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="rrItem, i in rrItems" :key="i">
                                <td v-show="showDescription" class="text-muted">
                                    <div class="input-group input-group-sm">
                                        {{ i + 1 }}.
                                        <textarea class="form-control ms-2" rows="3"
                                            :value="rrItem.meqs_supplier_item.canvass_item.description"
                                            disabled></textarea>
                                    </div>
                                </td>
                                <td v-show="showClass" class="text-muted align-middle">
                                    {{ rrItem.meqs_supplier_item.canvass_item.item ? 'Stock' : 'Non-Stock' }}
                                </td>
                                <td v-show="showUnit" class="text-muted align-middle">
                                    {{ rrItem.meqs_supplier_item.canvass_item.unit ?
                                                rrItem.meqs_supplier_item.canvass_item.unit.name : 'N/A' }}
                                </td>
                                <td v-show="showDelivered" class="text-muted text-center align-middle">
                                    {{ rrItem.meqs_supplier_item.canvass_item.quantity }}
                                </td>
                                <td v-show="showAccepted" class="text-muted align-middle">
                                    <div class="d-flex justify-content-center align-items-center">
                                        <input type="number" :class="{
                                                'border-danger border border-2': rrItem.isInvalidQtyAccepted,
                                            }" class="form-control" v-model="rrItem.quantity_accepted"
                                            style="width: 80px">
                                    </div>
                                </td>
                                <td v-show="showVat" class="text-muted text-center align-middle">
                                    {{ VAT[rrItem.meqs_supplier_item.vat_type].label }}
                                </td>
                                <td v-show="showGrossPrice" class="text-muted text-center align-middle">
                                    {{ formatToPhpCurrency(rrItem.meqs_supplier_item.price) }}
                                </td>
                                <td v-show="showNetTotal" class="text-muted text-center align-middle">
                                    {{
                                                formatToPhpCurrency(
                                                    getTotalNetPrice({
                                                        vatType: rrItem.meqs_supplier_item.vat_type,
                                                        pricePerUnit: rrItem.meqs_supplier_item.price,
                                                        vatPerUnit: getVatAmount(rrItem.meqs_supplier_item.price,
                                                            rrItem.meqs_supplier_item.vat_type),
                                                        quantity: rrItem.quantity_accepted
                                                    })
                                                )
                                            }}
                                </td>
                                <td v-show="showVatTotal" class="text-muted text-center align-middle">
                                    {{
                                                formatToPhpCurrency(
                                                    getVatTotal({
                                                        price: rrItem.meqs_supplier_item.price,
                                                        quantity: rrItem.quantity_accepted,
                                                        vatType: rrItem.meqs_supplier_item.vat_type
                                                    })
                                                )
                                            }}
                                </td>
                                <td v-show="showGrossTotal" class="text-muted text-center align-middle">
                                    {{
                                                formatToPhpCurrency(
                                                    getGrossTotal({
                                                        price: rrItem.meqs_supplier_item.price,
                                                        quantity: rrItem.quantity_accepted
                                                    })
                                                )
                                            }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


    </div>



</template>



<script setup lang="ts">
import type { RrItem } from '~/composables/warehouse/rr/rr-item.types';
import { getTotalNetPrice, getVatAmount, getNetPrice, getGrossTotal, getVatTotal } from '~/utils/helpers';
import { useToast } from "vue-toastification";


const props = defineProps({
    rrItems: {
        type: Array as () => RrItem[],
        default: () => [],
    }
});

const toast = useToast();



const showDescription = ref(true)
const showItemCode = ref(true)
const showClass = ref(true)
const showUnit = ref(false)
const showDelivered = ref(true)
const showAccepted = ref(true)
const showVat = ref(true)
const showGrossPrice = ref(true)
const showNetPrice = ref(false)
const showGrossTotal = ref(true)
const showVatTotal = ref(true)
const showNetTotal = ref(true)


</script>




<style scoped>
th {
    white-space: nowrap;
}
</style>