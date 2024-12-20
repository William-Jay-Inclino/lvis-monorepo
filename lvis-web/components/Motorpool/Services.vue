<template>
    <div>
    
        <div class="row mt-4 mb-2">
            <div class="col">
                <input
                    type="text"
                    v-model="search_input"
                    class="form-control"
                    placeholder="Search service here..."
                />
            </div>
        </div>
    
        <div class="responsive table-container">
            <table class="table">
                <thead>
                    <tr v-if="items.length > 0">
                        <th style="width: 20%;"></th>
                        <th style="width: 40%;" class="text-center">Service Name</th>
                        <th style="width: 40%;" class="text-center">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="items.length === 0">
                    <td colspan="3" class="text-center">
                        <small class="fst-italic text-muted">No services found</small>
                    </td>
                    </tr>
                    <tr v-for="item in items" :key="item.service.id">
                    <td width="10%" class="align-middle text-center">
                        <div>
                            <input class="form-check-input big-checkbox" type="checkbox" v-model="item.isChecked" />
                        </div>
                    </td>
                    <td class="align-middle text-center">{{ item.service.name }}</td>
                    <td>
                        <textarea class="form-control form-control-sm" rows="3" v-model="item.note"></textarea>
                    </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
  


<script setup lang="ts">
    import { ref, computed } from 'vue';
    import type { CreateVehicleMaintenanceDetail } from '~/composables/motorpool/vehicle-maintenance/vehicle-maintenance.types';
    
    const props = defineProps({
        services: {
            type: Array as () => CreateVehicleMaintenanceDetail[],
            default: () => [],
        },
    });

    const search_input = ref('');
    
    const items = computed((): CreateVehicleMaintenanceDetail[] => {
        return props.services.filter((service) =>
            service.service.name.toLowerCase().includes(search_input.value.toLowerCase())
        );
    });



</script>
  
  <style scoped>
    .table-container {
        height: 500px;
        overflow-y: auto;
        border: 1px solid #dee2e6;
    }
    
    .big-checkbox {
        width: 50px;
        height: 50px;
    }
  </style>
  