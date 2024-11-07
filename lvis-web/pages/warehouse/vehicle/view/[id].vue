<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage && authUser" class="row justify-content-center pt-3">
        
                <div class="col-lg-6">
        
                    <div v-if="item">
        
                        <div class="h5wrapper mb-3">
                            <hr class="result">
                            <h5 class="text-warning fst-italic">
                                <i class="fas fa-info-circle"></i> Vehicle Info
                            </h5>
                            <hr class="result">
                        </div>
        
                        <div class="row pt-3">
                            <div class="col">

                                <div v-if="!item.rf_id" class="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                                    <small class="fst-italic">
                                        Vehicle has no assigned RFID
                                    </small>
                                    <button @click="onClickAssignRFID(item)" class="btn btn-danger btn-sm">
                                        Assign RFID
                                    </button>
                                </div>


                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="text-muted">Vehicle Number</td>
                                            <td> {{ item.vehicle_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Name</td>
                                            <td> {{ item.name }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Plate Number</td>
                                            <td> {{ item.plate_number }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Classification</td>
                                            <td> {{ VehicleClassificationMapper[item.classification_id] }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Assignee</td>
                                            <td> {{ getFullname(item.assignee.firstname, item.assignee.middlename, item.assignee.lastname) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Date Acquired</td>
                                            <td> {{ formatDate(item.date_acquired) }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Status</td>
                                            <td>
                                                <div :class="{ [`badge bg-${VehicleStatusMapper[item.status].color}`]: true }">
                                                    {{ VehicleStatusMapper[item.status].label }}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Total Unposted Gaslips</td>
                                            <td class="text-danger fw-bold"> {{ item.total_unposted_gas_slips }} </td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">RFID</td>
                                            <td>
                                                <div v-if="!item.rf_id"> N/A </div>
                                                <div v-else>
                                                    <button @click="onClickAssignRFID(item, true)" class="btn btn-sm btn-danger"> Update RFID </button>
                                                </div>
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
                                        <button v-if="canRead(authUser, 'canManageVehicle')" class="btn btn-secondary"
                                            @click="onClickGoToList">
                                            <i class="fas fa-list"></i> Go to List
                                        </button>
                                        <button v-if="canEdit(authUser, 'canManageVehicle')" class="btn btn-success"
                                            @click="onClickUpdate">
                                            <i class="fas fa-sync"></i> Update
                                        </button>
                                        <button v-if="canCreate(authUser, 'canManageVehicle')" class="btn btn-primary"
                                            @click="onClickAddNew">
                                            <i class="fas fa-plus"></i> Add New
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
import * as api from '~/composables/warehouse/vehicle/vehicle.api'
import type { Vehicle } from '~/composables/warehouse/vehicle/vehicle.types';
import { VehicleStatusMapper, VehicleClassificationMapper } from '~/composables/warehouse/vehicle/vehicle.enums';
import Swal from 'sweetalert2'

definePageMeta({
    name: ROUTES.VEHICLE_VIEW,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const authUser = ref<AuthUser>({} as AuthUser)
const router = useRouter()
const route = useRoute()
const item = ref<Vehicle | undefined>()

onMounted(async () => {
    authUser.value = getAuthUser()
    item.value = await api.findOne(route.params.id as string)
    isLoadingPage.value = false
})


function onClickAssignRFID(vehicle: Vehicle, isUpdate: boolean = false) {
    console.log('assignRFID', vehicle);

    const action = isUpdate ? "Update" : "Assign"

    Swal.fire({
        title: `${action} RFID`,
        text: `Please input RFID to vehicle ${vehicle.vehicle_number} ${vehicle.name}`,
        input: 'text',
        inputPlaceholder: 'Enter RFID here',
        position: "top",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#6c757d",
        confirmButtonText: action,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to enter RFID!';
            }
        },
        preConfirm: async (confirm) => {

            const inputValue = Swal.getInput()?.value;

            const response = await api.assignRFID(vehicle.id, inputValue!)

            if (response.success && response.data) {

                Swal.fire({
                    title: 'Success!',
                    text: "RFID assigned successfully",
                    icon: 'success',
                    position: 'top',
                });


                item.value!.rf_id = response.data.rf_id

            } else {

                Swal.fire({
                    title: 'Error!',
                    text: response.msg,
                    icon: 'error',
                    position: 'top',
                })

            }

        },
        allowOutsideClick: () => !Swal.isLoading()
    })

}

const onClickGoToList = () => router.push(`/warehouse/vehicle`);
const onClickAddNew = () => router.push(`/warehouse/vehicle/create`);
const onClickUpdate = () => router.push(`/warehouse/vehicle/${item.value?.id}`);


</script>