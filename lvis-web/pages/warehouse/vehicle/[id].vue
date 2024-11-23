<template>

    <div class="card">
        <div class="card-body">

            <div v-if="!isLoadingPage">
        
                <h2 class="text-warning">Update Vehicle</h2>
        
                <hr>
        
                <form v-if="item" @submit.prevent="onSubmit">
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">

                            <div class="alert alert-info" role="alert">
                                <small class="fst-italic">
                                    Fields with * are required
                                </small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Name <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.name" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Vehicle Number <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.vehicle_number" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Plate Number <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" v-model="item.plate_number" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Classification <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="VEHICLE_CLASSIFICATIONS" label="name" v-model="item.classification"></v-select>
                                </client-only>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Assignee <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="employees" label="fullname" v-model="item.assignee"></v-select>
                                </client-only>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Date Acquired <span class="text-danger">*</span>
                                </label>
                                <input type="date" class="form-control" v-model="item.date_acquired">
                            </div>
        
                        </div>
                    </div>
        
        
                    <div class="row justify-content-center pt-3">
                        <div class="col-lg-6">
                            <div class="d-flex justify-content-between">
                                <button type="button" @click="onClickGoToList" class="btn btn-secondary">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'list']"/>
                            </client-only> Go to list
                                </button>
                                <button type="submit" class="btn btn-success" :disabled="isSaving">
                                    <client-only>
                                <font-awesome-icon :icon="['fas', 'sync']"/>
                            </client-only> {{ isSaving ? 'Updating...' : 'Update' }}
                                </button>
                            </div>
                        </div>
                    </div>
        
                </form>
        
            </div>
        
            <div v-else>
                <LoaderSpinner />
            </div>
            
        </div>
    </div>


</template>


<script setup lang="ts">

import * as api from '~/composables/warehouse/vehicle/vehicle.api'
import Swal from 'sweetalert2'
import type { UpdateVehicleInput } from '~/composables/warehouse/vehicle/vehicle.types';
import { VehicleClassificationMapper } from '~/composables/warehouse/vehicle/vehicle.enums';
import { VEHICLE_CLASSIFICATIONS } from '~/composables/warehouse/vehicle/vehicle.constants';
import type { Employee } from '~/composables/system/employee/employee.types';
import { addPropertyFullName } from '~/composables/system/employee/employee';

definePageMeta({
    name: ROUTES.VEHICLE_UPDATE,
    layout: "layout-warehouse",
    middleware: ['auth'],
})

const isLoadingPage = ref(true)
const route = useRoute()
const router = useRouter()
const isSaving = ref(false)

const vehicleId = ref('')
const item = ref<UpdateVehicleInput>()

const employees = ref<Employee[]>([])

onMounted(async () => {

    const response = await api.fetchFormDataInUpdate(route.params.id as string)

    if (!response.vehicle) {
        return redirectTo401Page()
    }

    employees.value = addPropertyFullName(response.employees)

    vehicleId.value = response.vehicle.id
    response.vehicle.assignee['fullname'] = getFullname(response.vehicle.assignee.firstname, response.vehicle.assignee.middlename, response.vehicle.assignee.lastname)

    item.value = {
        name: response.vehicle.name,
        vehicle_number: response.vehicle.vehicle_number,
        plate_number: response.vehicle.plate_number,
        classification: {
            id: response.vehicle.classification_id,
            name: VehicleClassificationMapper[response.vehicle.classification_id]
        },
        assignee: response.vehicle.assignee,
        date_acquired: formatToValidHtmlDate(response.vehicle.date_acquired)
    }

    isLoadingPage.value = false
})


async function onSubmit() {

    if (!item.value) return

    console.log('saving...')

    isSaving.value = true
    const response = await api.update(vehicleId.value, item.value)
    isSaving.value = false

    if (response.success && response.data) {

        Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            position: 'top',
        })

        router.push(`/warehouse/vehicle/view/${response.data.id}`);

    } else {

        Swal.fire({
            title: 'Error!',
            text: response.msg,
            icon: 'error',
            position: 'top',
        })

    }

}



const onClickGoToList = () => router.push('/warehouse/vehicle')

</script>