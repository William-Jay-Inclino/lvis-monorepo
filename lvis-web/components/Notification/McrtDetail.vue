
<template>
    <div v-if="mcrt" class="responsive">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> MCRT Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>MCRT #</td>
                            <td class="text-muted"> {{ mcrt.mcrt_number }} </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td data-testid="status">
                                <div :class="{ [`badge bg-${approvalStatus[mcrt.status].color}`]: true }">
                                    {{ approvalStatus[mcrt.status].label }}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Returned by</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(mcrt.returned_by!.firstname, mcrt.returned_by!.lastname,
                                    mcrt.returned_by!.middlename, mcrt.returned_by!.name_prefix, mcrt.returned_by!.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(mcrt.mcrt_date) }} </td>
                        </tr>
                        <tr>
                            <td>CWO Number</td>
                            <td class="text-muted"> {{ cwo_number }} </td>
                        </tr>
                        <tr>
                            <td>MWO Number</td>
                            <td class="text-muted"> {{ mwo_number }} </td>
                        </tr>
                        <tr>
                            <td>JO Number</td>
                            <td class="text-muted"> {{ jo_number }} </td>
                        </tr>
                        <tr>
                            <td class="align-middle">Notes</td>
                            <td>
                                <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ mcrt.note }}</textarea>
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
                            <tr v-for="i, count in mcrt.mcrt_approvers">
                                <td class="align-middle no-wrap"> {{ i.label }} </td>
                                <td class="align-middle no-wrap"> 
                                    {{ 
                                        getFullname(i.approver!.firstname,i.approver!.middlename, i.approver!.lastname) 
                                    }} 
                                </td>
                                <td v-if="!isBlankStatus(mcrt.status, i.status)" class="text-muted text-center align-middle no-wrap">
                                    <div :class="{ [`badge bg-${approvalStatus[i.status].color}`]: true }">
                                        {{ approvalStatus[i.status].label }}
                                    </div>
                                    <div class="fst-italic" v-if="i.date_approval">
                                        <small> {{ formatDate(i.date_approval, true) }} </small>
                                    </div>
                                </td>
                                <td v-else class="text-muted text-center align-middle fst-italic no-wrap">
                                    N/A
                                </td>
                                <td>
                                    <textarea rows="2" class="form-control form-control-sm text-muted" readonly
                                        :value="!isEmptyString(i.notes) ? i.notes : 'N/A'"></textarea>
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
                    <table class="table table-bordered table-sm small">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white align-middle"> No. </th>
                                <th class="bg-secondary text-white align-middle no-wrap"> Item Code </th>
                                <th class="bg-secondary text-white align-middle"> Description </th>
                                <th class="bg-secondary text-white align-middle"> Unit </th>
                                <th class="bg-secondary text-white align-middle"> Quantity </th>
                                <th class="bg-secondary text-white align-middle no-wrap"> Unit Price </th>
                                <th class="bg-secondary text-white align-middle"> Amount </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in mcrt.mcrt_items">
                                <td class="align-middle text-muted"> {{ count + 1 }} </td>
                                <td class="align-middle text-muted no-wrap">
                                    {{ i.item.code }}
                                </td>
                                <td class="align-middle">
                                    <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ i.item.description }}</textarea>
                                </td>
                                <td class="align-middle text-muted no-wrap"> {{ i.item.unit.name }} </td>
                                <td class="align-middle text-muted"> {{ i.quantity }} </td>
                                <td class="align-middle text-muted no-wrap"> {{ formatToPhpCurrency(i.price) }} </td>
                                <td class="align-middle text-muted no-wrap"> {{ formatToPhpCurrency(i.quantity * i.price) }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
    import type { MCRT } from '~/composables/warehouse/mcrt/mcrt.types';

    const props = defineProps({
        mcrt: {
            type: Object as () => MCRT,
        },
    });


    const jo_number = computed( () => {

        if(!props.mcrt) return ''
            
        if(props.mcrt.mct) {
            return props.mcrt.mct.mrv.jo_number
        }

        if(props.mcrt.seriv) {
            return props.mcrt.seriv.jo_number
        }

        return ''

    })

    const mwo_number = computed( () => {

        if(!props.mcrt) return ''
            
        if(props.mcrt.mct) {
            return props.mcrt.mct.mrv.mwo_number
        }

        if(props.mcrt.seriv) {
            return props.mcrt.seriv.mwo_number
        }

        return ''

    })

    const cwo_number = computed( () => {

        if(!props.mcrt) return ''
            
        if(props.mcrt.mct) {
            return props.mcrt.mct.mrv.cwo_number
        }

        if(props.mcrt.seriv) {
            return props.mcrt.seriv.cwo_number
        }

        return ''

    })

</script>