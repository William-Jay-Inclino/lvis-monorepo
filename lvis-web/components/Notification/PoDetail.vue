
<template>
    <div v-if="po && canvass" class="responsive">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> PO Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>PO #</td>
                            <td class="text-muted"> {{ po.po_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[po.status].color}`]: true }">
                                    {{ approvalStatus[po.status].label }}
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
                            <td class="text-muted"> {{ po.meqs_supplier ? po.meqs_supplier.supplier!.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(po.po_date) }} </td>
                        </tr>
                        <tr>
                            <td>Supplier</td>
                            <td class="text-muted"> {{ po.meqs_supplier ? po.meqs_supplier.supplier!.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>VAT Status</td>
                            <td class="text-muted"> {{ po.meqs_supplier ? po.meqs_supplier.supplier?.is_vat_registered ? 'VAT Registered' : 'Non-VAT Registered' : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>Fund Source</td>
                            <td class="text-muted"> {{ po.fund_source ? po.fund_source.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td class="align-middle">PO Notes</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="po.notes" readonly/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

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
                            <tr v-for="i, count in po.po_approvers">
                                <td class="align-middle"> {{ i.label }} </td>
                                <td class="align-middle"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(po.status, i.status)" class="text-muted text-center align-middle">
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

                <div class="table-responsive">
                    <table class="table table-sm table-bordered small">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white align-middle">No</th>
                                <th class="bg-secondary text-white align-middle">Description</th>
                                <th class="bg-secondary text-white align-middle">Item Class</th>
                                <th class="bg-secondary text-white align-middle">Unit</th>
                                <th class="bg-secondary text-white align-middle">Qty</th>
                                <th class="bg-secondary text-white align-middle">VAT Type</th>
                                <th class="bg-secondary text-white align-middle">Unit Cost</th>
                                <th class="bg-secondary text-white align-middle">Vatable Amount</th>
                                <th class="bg-secondary text-white align-middle">VAT</th>
                                <th class="bg-secondary text-white align-middle">Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item, i in supplierItems">
                                <td class="text-muted align-middle"> {{ i + 1 }} </td>
                                <td class="align-middle"> 
                                    <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ item.canvass_item.description }}</textarea>
                                </td>
                                <td class="text-muted align-middle"> {{ item.canvass_item.item ? 'Stock' : 'Non-Stock' }} </td>
                                <td class="text-muted align-middle"> {{ item.canvass_item.unit ? item.canvass_item.unit.name : 'N/A'
                                    }} </td>
                                <td class="text-muted align-middle"> {{ item.canvass_item.quantity }} </td>
                                <td class="text-muted align-middle"> {{ VAT[item.vat_type].label }} </td>
                                <td class="text-muted align-middle"> {{ formatToPhpCurrency(item.price) }} </td>
                                <td class="text-muted align-middle">
                                    {{
        formatToPhpCurrency(
            getTotalNetPrice({
                vatType: item.vat_type,
                pricePerUnit: item.price,
                vatPerUnit: getVatAmount(item.price, item.vat_type), quantity:
                    item.canvass_item.quantity
            })
        )
                                    }}
                                </td>
                                <td class="text-muted align-middle"> {{ formatToPhpCurrency(getVatAmount(item.price * item.canvass_item.quantity, item.vat_type))
                                    }} </td>
                                <td class="text-muted align-middle"> {{ formatToPhpCurrency(item.price * item.canvass_item.quantity) }} </td>
                            </tr>
                            <tr>
                                <td colspan="9" class="text-end fw-bold">
                                    Summary Total
                                </td>
                                <td class="fw-bold">
                                    {{ formatToPhpCurrency(totalPriceOfAllItems) }}
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
    import type { PO } from '~/composables/purchase/po/po.types';

    const props = defineProps({
        po: {
            type: Object as () => PO,
        },
    });

    const meqs = computed(() => {
        if(!props.po || !props.po.meqs_supplier || !props.po.meqs_supplier.meqs) return
        const meqs = props.po.meqs_supplier.meqs
        return meqs

    })

    const canvass = computed(() => {
        if(!meqs.value) return 
        if(meqs.value.rv && meqs.value.rv.canvass) return meqs.value.rv.canvass 
        if(meqs.value.spr && meqs.value.spr.canvass) return meqs.value.spr.canvass
        if(meqs.value.jo && meqs.value.jo.canvass) meqs.value.jo.canvass
    })

    const supplierItems = computed(() => {

        if (!props.po || !props.po.meqs_supplier) return []

        const items = props.po.meqs_supplier.meqs_supplier_items

        if (items.length === 0) return []

        const awardedItems = items.filter(i => i.is_awarded)

        return awardedItems


    })

    const totalPriceOfAllItems = computed(() => {

        if (supplierItems.value.length === 0) return 0

        let totalPrice = 0

        for (let item of supplierItems.value) {

            totalPrice += item.price * item.canvass_item.quantity

        }

        return totalPrice

    })

</script>