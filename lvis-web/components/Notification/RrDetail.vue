
<template>
    <div v-if="rr && canvass" class="resrrnsive">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-10 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> RR Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>RR #</td>
                            <td class="text-muted"> {{ rr.rr_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[rr.status].color}`]: true }">
                                    {{ approvalStatus[rr.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Requisitioner</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(canvass.requested_by!.firstname, canvass.requested_by!.lastname,
                                    canvass.requested_by!.middlename, canvass.requested_by!.name_prefix, canvass.requested_by!.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Requisitioner Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="canvass.purpose" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Requisitioner Notes</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="canvass.notes" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Supplier</td>
                            <td class="text-muted"> {{ rr.po?.meqs_supplier ? rr.po?.meqs_supplier.supplier!.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(rr.rr_date) }} </td>
                        </tr>
                        <tr>
                            <td>Supplier</td>
                            <td class="text-muted"> {{ rr.po?.meqs_supplier ? rr.po?.meqs_supplier.supplier!.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>VAT Status</td>
                            <td class="text-muted"> {{ rr.po?.meqs_supplier ? rr.po?.meqs_supplier.supplier?.is_vat_registered ? 'VAT Registered' : 'Non-VAT Registered' : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>Fund Source</td>
                            <td class="text-muted"> {{ rr.po?.fund_source ? rr.po?.fund_source.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>Notes</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="rr.notes" readonly/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row justify-content-center pt-2">
            <div class="col-lg-10 col-md-12 col-sm-12">

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
                            <tr v-for="i, count in rr.rr_approvers">
                                <td class="align-middle"> {{ i.label }} </td>
                                <td class="align-middle"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(rr.status, i.status)" class="text-muted text-center align-middle">
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

        <div class="row justify-content-center pt-2">
            <div class="col-lg-10 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                        </client-only> Items
                    </h5>
                    <hr class="result">
                </div>

                <div class="row">
                    <div class="col">
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered small">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white align-middle">Description</th>
                                        <th class="bg-secondary text-white align-middle">Class</th>
                                        <th class="bg-secondary text-white align-middle">Unit</th>
                                        <th class="bg-secondary text-white align-middle">Qty Request</th>
                                        <th class="bg-secondary text-white align-middle">Qty Accepted</th>
                                        <th class="bg-secondary text-white align-middle">VAT Type</th>
                                        <th class="bg-secondary text-white align-middle">Unit Cost</th>
                                        <th class="bg-secondary text-white align-middle">Vatable Amount</th>
                                        <th class="bg-secondary text-white align-middle">VAT</th>
                                        <th class="bg-secondary text-white align-middle">Total Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="rrItem, i in rr.rr_items" :key="i">
                                        <td class="text-muted align-middle">
                                            <div class="input-group input-group-sm">
                                                {{ i + 1 }}.
                                                <textarea class="form-control form-control-sm text-muted ms-1" rows="2"
                                                    :value="rrItem.meqs_supplier_item.canvass_item.item ? rrItem.meqs_supplier_item.canvass_item.item.code + ' - ' + rrItem.meqs_supplier_item.canvass_item.item.description : rrItem.meqs_supplier_item.canvass_item.description"
                                                    readonly></textarea>
                                            </div>
                                        </td>
                                        <td class="text-muted align-middle text-center">
                                            <div v-if="rrItem.meqs_supplier_item.canvass_item.item">
                                                <div> Stock </div>
                                                <div v-if="rrItem.item_transaction">
                                                    <nuxt-link class="btn btn-outline-light btn-sm"
                                                        :to="'/warehouse/item/view/' + rrItem.item_transaction.item_id" target="_blank">
                                                        <small class="text-info fst-italic"> View Item </small>
                                                    </nuxt-link>
                                                </div>
                                            </div>
                                            <div v-else>
                                                Non-Stock
                                            </div>
                                        </td>
                                        <td class="text-muted align-middle">
                                            {{ 
                                                rrItem.meqs_supplier_item.canvass_item.unit ?
                                                rrItem.meqs_supplier_item.canvass_item.unit.name : 'N/A' 
                                            }}
                                        </td>
                                        <td class="text-muted text-center align-middle">
                                            {{ rrItem.meqs_supplier_item.canvass_item.quantity }}
                                        </td>
                                        <td class="text-muted text-center align-middle">
                                            {{ rrItem.quantity_accepted }}
                                        </td>
                                        <td class="text-muted text-center align-middle">
                                            {{ VAT[rrItem.meqs_supplier_item.vat_type].label }}
                                        </td>
                                        <td class="text-muted text-center align-middle">
                                            {{ formatToPhpCurrency(rrItem.meqs_supplier_item.price) }}
                                        </td>
                                        <td class="text-muted text-center align-middle">
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
                                        <td class="text-muted text-center align-middle">
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
                                        <td class="text-muted text-center align-middle">
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

                <div class="row justify-content-end pt-2">
                    <div class="col-4">
                        <table class="table table-small table-bordered small">
                            <tbody>
                                <tr>
                                    <td class="fst-italic"> Summary (Gross Total) </td>
                                    <td class="fw-bold"> {{ formatToPhpCurrency(grossTotalSummary) }} </td>
                                </tr>
                                <tr>
                                    <td class="fst-italic"> Delivery Charge </td>
                                    <td class="fw-bold"> {{ formatToPhpCurrency(rr.delivery_charge) }} </td>
                                </tr>
                                <tr>
                                    <td class="fst-italic"> Total </td>
                                    <td class="fw-bold"> {{ formatToPhpCurrency(totalPriceSummary) }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
    import type { RR } from '~/composables/warehouse/rr/rr.types';

    const props = defineProps({
        rr: {
            type: Object as () => RR,
        },
    });

    const grossTotalSummary = computed(() => {

        let ctr = 0

        for (let rrItem of props.rr!.rr_items) {
            ctr += rrItem.meqs_supplier_item.price * rrItem.quantity_accepted
        }

        return ctr

    })

    const totalPriceSummary = computed(() => {
        if(!props.rr) return 0

        return grossTotalSummary.value + props.rr.delivery_charge
    })


    const meqs = computed(() => {
        if(!props.rr) return null
        if(!props.rr.po) return null
        if(!props.rr.po.meqs_supplier) return null 
        const meqs = props.rr.po.meqs_supplier.meqs
        return meqs
    })

    const canvass = computed(() => {
        if(!meqs.value) return 
        if(meqs.value.rv && meqs.value.rv.canvass) return meqs.value.rv.canvass 
        if(meqs.value.spr && meqs.value.spr.canvass) return meqs.value.spr.canvass
        if(meqs.value.jo && meqs.value.jo.canvass) meqs.value.jo.canvass
    })

</script>