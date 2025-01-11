
<template>
    <div v-if="canvass" class="responsive">

        <div class="row justify-content-center pt-4">
            <div class="col-lg-9 col-md-12 col-sm-12">

                <div class="h5wrapper mb-3">
                    <hr class="result">
                    <h5 data-testid="canvass-info" class="text-warning fst-italic">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'info-circle']"/>
                        </client-only> Canvass Info
                    </h5>
                    <hr class="result">
                </div>

                <table class="table table-bordered table-sm small">
                    <tbody>
                        <tr>
                            <td>RC #</td>
                            <td class="text-muted"> {{ canvass.rc_number }} </td>
                        </tr>
                        <tr>
                            <td>Requisitioner</td>
                            <td class="text-muted"> 
                                {{ getFullnameWithTitles(canvass.requested_by!.firstname, canvass.requested_by!.lastname,
                                    canvass.requested_by!.middlename, canvass.requested_by!.name_prefix, canvass.requested_by!.name_suffix) }} 
                            </td>
                        </tr>
                        <tr>
                            <td>Purpose</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="canvass.purpose" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Notes</td>
                            <td class="text-muted">
                                <textarea rows="2" class="form-control form-control-sm text-muted" :value="canvass.notes" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td class="text-muted"> {{ formatDate(canvass.date_requested) }} </td>
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
                            <font-awesome-icon :icon="['fas', 'shopping-cart']"/>
                        </client-only> Canvass Items
                    </h5>
                    <hr class="result">
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered table-sm small">
                        <thead>
                            <tr>
                                <th class="bg-secondary text-white"> No. </th>
                                <th class="bg-secondary text-white"> Description </th>
                                <th class="bg-secondary text-white"> Item Class </th>
                                <th class="bg-secondary text-white"> Unit </th>
                                <th class="bg-secondary text-white"> Quantity </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i, count in canvass.canvass_items">
                                <td class="align-middle"> {{ count + 1 }} </td>
                                <td class="align-middle"> 
                                    <textarea class="form-control form-control-sm text-muted" rows="2" readonly>{{ i.item ? `${ i.item.code } - ${ i.item.description }` : i.description }}</textarea>
                                </td>
                                <td class="align-middle"> {{ i.item ? 'Stock' : 'Non-Stock' }} </td>
                                <td class="align-middle"> {{ i.unit ? i.unit.name : 'N/A' }} </td>
                                <td class="align-middle"> {{ i.quantity }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import type { Canvass } from '~/composables/purchase/canvass/canvass.types';


    const props = defineProps({
        canvass: {
            type: Object as () => Canvass,
        },
    });

</script>