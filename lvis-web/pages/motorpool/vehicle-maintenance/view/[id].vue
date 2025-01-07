<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center pt-3">
        
                <div class="col-lg-9">
        
                    <div v-if="item">
        
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'info-circle']"/>
                            </client-only> Vehicle PMS Info
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div class="row pt-3">
                            <div class="col">

                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td width="50%" class="text-muted">Reference Number</td>
                                            <td> {{ item.ref_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Vehicle</td>
                                            <td> 
                                                <nuxt-link :to="'/motorpool/vehicle/view/' + item.vehicle.id">
                                                    {{ item.vehicle.vehicle_number + ' ' + item.vehicle.name }}
                                                </nuxt-link> 
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Service Center</td>
                                            <td> {{ item.service_center.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Service Date</td>
                                            <td> {{ formatDate(item.service_date) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Next Service Date</td>
                                            <td> {{ formatDate(item.next_service_date) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Service Mileage</td>
                                            <td> {{ item.next_service_mileage }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Cost</td>
                                            <td> {{ formatToPhpCurrency(item.cost) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Performed By</td>
                                            <td> {{ item.performed_by }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Remarks</td>
                                            <td>
                                                <textarea class="form-control form-control-sm" rows="5" readonly>{{ item.remarks }}</textarea>
                                            </td>
                                        </tr>
                                        <tr v-if="canEdit(authUser, 'canManageVehicleMaintenance')">
                                            <td class="text-muted">Mark as Completed</td>
                                            <td> 
                                                <input @click="update_vehicle_maintenance_status()" class="form-check-input big-checkbox" type="checkbox" v-model="item.is_completed" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="h5wrapper mb-3 mt-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'wrench']"/>
                            </client-only> Services
                            </h5>
                            <hr class="result">
                        </div>


                        <div class="row pt-3">
                            <div class="col">

                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-muted">Service Name</th>
                                            <th class="text-muted">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in item.services">
                                            <td width="50%" class="align-middle text-center"> {{ item.service.name }} </td>
                                            <td>
                                                <textarea class="form-control form-control-sm" rows="3" :value="item.note || 'No remarks'" readonly></textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

        
                        <div class="row pt-5">
                            <div class="col">
                                <div class="d-flex justify-content-end gap-2">
                                    <div class="d-flex justify-content-end gap-2">
                                        <button v-if="canRead(authUser, 'canManageVehicleMaintenance')" class="btn btn-secondary"
                                            @click="onClickGoToList">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'list']"/>
                            </client-only> Go to List
                                        </button>
                                        <button v-if="canEdit(authUser, 'canManageVehicleMaintenance')" class="btn btn-success"
                                            @click="onClickUpdate">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> Update
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageVehicleMaintenance')" class="btn btn-primary"
                                            @click="onClickAddNew">
                                            <client-only>
                                <font-awesome-icon :icon="['fas', 'plus']"/>
                         </client-only> Add New
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                    </div>
        
                </div>
            </div>
        
            <div v-else>
                <LoaderSpinner />
            </div>
            
        </div>
    </div>


</template>


<script setup lang="ts">
import { useToast } from 'vue-toastification';
import * as api from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.api'
import type { VehicleMaintenance } from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.types';

definePageMeta({
    name: ROUTES.VEHICLE_MAINTENANCE_VIEW,
    layout: "layout-motorpool",
    middleware: ['auth'],
})

const toast = useToast()
const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const router = useRouter()
const route = useRoute()
const item = ref<VehicleMaintenance | undefined>()

onMounted(async () => {
    authUser.value = getAuthUser()
    item.value = await api.findOne(route.params.id as string)
    isLoadingPage.value = false
})


async function update_vehicle_maintenance_status() {

    if(!item.value) {
        console.error('item.value is undefined');
        return 
    }

    const response = await api.update_completion(item.value.id, !item.value.is_completed)
    item.value.is_completed = response.is_completed

    if(response.success) {
        toast.success(response.msg)
    } else {
        toast.error(response.msg)
    }

}


const onClickGoToList = () => router.push(`/motorpool/vehicle-maintenance`);
const onClickAddNew = () => router.push(`/motorpool/vehicle-maintenance/create`);
const onClickUpdate = () => router.push(`/motorpool/vehicle-maintenance/${item.value?.id}`);


</script>



<style scoped>

    .big-checkbox {
        width: 25px;
        height: 25px;
    }

</style>