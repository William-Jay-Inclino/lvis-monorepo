<template>
    <div v-if="area" class="soft-wrapper p-4 shadow-sm">
        <div class="content-wrapper">
            
            <div class="row d-flex flex-column flex-md-row align-items-center text-center mb-3">
                <div class="col-12 col-md">
                    <h5 class="display-6 fw-bold text-muted no-wrap d-flex justify-content-center align-items-center">
                        <client-only>
                            <font-awesome-icon class="soft-blue" :icon="['fas', 'map-marker-alt']"/>
                        </client-only> 
                        {{ area?.name }}
                    </h5>
                    <table class="table table-light table-sm small table-borderless">
                        <tbody>
                            <tr>
                                <td class="text-end fw-bold text-muted"> Area Head: </td>
                                <td class="text-start text-muted"> {{ getFullnameWithTitles(area.oic.lastname, area.oic.firstname, area.oic.middlename, area.oic.name_prefix, area.oic.name_suffix) }} </td>
                            </tr>
                            <tr>
                                <td class="text-end fw-bold text-muted"> Position: </td>
                                <td class="text-start text-muted"> {{ area.oic.position }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-12 col-md d-flex flex-wrap justify-content-center gap-2 mb-3">
                    <button type="button" class="btn soft-btn-green text-nowrap w-100 w-md-auto">
                        Linemen - {{ area.total_lineman }}
                    </button> 
                    <button type="button" class="btn soft-btn-blue text-nowrap w-100 w-md-auto">
                        Municipalities - {{ area.total_municipalities }}
                    </button> 
                    <button type="button" class="btn soft-btn-orange text-nowrap w-100 w-md-auto">
                        Barangays - {{ area.total_barangays }}
                    </button> 
                    <button type="button" class="btn soft-btn-yellow text-nowrap w-100 w-md-auto">
                        Sitios - {{ area.total_sitios }}
                    </button> 
                </div>
    
                <hr class="d-md-none">
            </div>
    
            <div class="row">
                <div class="col">
                    
                    <ul class="nav nav-tabs nav-fill mb-3">
                        <li class="nav-item">
                            <a @click="active_tab = 'lineman'" :class="`nav-link ${ active_tab === 'lineman' ? 'active' : '' }`" href="#"> Linemen </a>
                        </li>
                        <li class="nav-item">
                            <a @click="active_tab = 'municipality'" :class="`nav-link ${ active_tab === 'municipality' ? 'active' : '' }`" href="#"> Municipalities </a>
                        </li>
                    </ul>
                    
                    <div v-show="active_tab === 'lineman'">
                        <div v-if="area.linemen.length > 0" class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th class="bg-gray">Lineman</th>
                                        <th class="bg-gray">Position</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="lineman in area.linemen">
                                        <td class="text-muted">
                                            {{ getFullnameWithTitles(lineman.employee.lastname, lineman.employee.firstname, lineman.employee.middlename, lineman.employee.name_prefix, lineman.employee.name_suffix) }} 
                                        </td>
                                        <td class="text-muted"> {{ lineman.employee.position }} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="text-muted text-center fst-italic" v-else>
                            --- No lineman ---
                        </div>
                    </div>

                    <div v-show="active_tab === 'municipality'">
                        <div v-if="area.municipalities.length > 0" v-for="municipality in area.municipalities">
                            <h5 class="municipality-header"> {{ municipality.name }} </h5>
        
        
                            <div class="table-responsive">
                                <table class="table table-sm small table-striped">
                                    <tbody>
                                        <tr v-for="(barangay, index) in municipality.barangays" :key="index">
                                            <td class="text-muted align-middle no-wrap">
                                                <div class="accordion accordion-flush" :id="'accordion-' + municipality.name">
                                                    <div class="accordion-item">
                                                        <h2 class="accordion-header" :id="'heading-' + municipality.name + '-' + index">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                                                :data-bs-target="'#collapse-' + municipality.name + '-' + index"
                                                                aria-expanded="false"
                                                                :aria-controls="'collapse-' + municipality.name + '-' + index">
                                                                {{ barangay.name }}
                                                            </button>
                                                        </h2>
                                                        <div :id="'collapse-' + municipality.name + '-' + index" 
                                                            class="accordion-collapse collapse" 
                                                            :aria-labelledby="'heading-' + municipality.name + '-' + index"
                                                            :data-bs-parent="'#accordion-' + municipality.name">
                                                            <div class="accordion-body">
                                                                <div v-if="barangay.sitios.length === 0">
                                                                    <span class="text-muted fst-italic">No sitios</span>
                                                                </div>
                                                                <ul v-else v-for="sitio in barangay.sitios" class="list-group">
                                                                    <li class="list-group-item"> {{ sitio.name }} </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="text-muted text-center fst-italic" v-else>
                            --- No municipality ---
                        </div>
                    </div>

    
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Area } from '~/composables/powerserve/area/area.types';

    const props = defineProps({
        area: {
            type: Object as () => Area,
        },
    });

    const active_tab = ref<'lineman' | 'municipality'>('lineman')

</script>

<style scoped>
.soft-wrapper {
    background: #f8f9fa;
    border-radius: 12px;
    height: 600px; /* Set a fixed height for the main container */
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Prevent content overflow */
}

/* Create a scrollable content area inside soft-wrapper */
.content-wrapper {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 10px; /* Prevent scrollbar overlap */
}

/* Table responsiveness */
.table-responsive {
    overflow-x: auto;
    max-height: 400px;
}

/* Ensure buttons are responsive */
@media (max-width: 768px) {
    .btn {
        width: 100%;
    }
}

/* Search input */
.search-input {
    width: 100%;
    max-width: 230px;
    border-radius: 6px;
    padding: 6px 10px;
}

/* Prevent table from breaking */
.table {
    width: 100%;
    table-layout: auto;
    white-space: nowrap;
}

/* Make sure text doesn't overflow */
.no-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.municipality-header {
    background: #e2e3e5; /* Soft Gray */
    color: #6c757d;
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: bold;
    margin-bottom: 10px;
    display: inline-block;
    width: 100%;
    text-align: center;
}

.accordion-button {
    padding: 6px 10px; /* Reduce padding for a smaller button */
    font-size: 14px; /* Smaller font size */
}

.accordion-body {
    padding: 6px 10px; /* Reduce padding inside the body */
    font-size: 13px; /* Slightly smaller font for content */
}

.accordion-item {
    border: none; /* Remove borders for a cleaner look */
}

.accordion-button:not(.collapsed) {
    background-color: #f8f9fa; /* Soft background when expanded */
    box-shadow: none;
}

.accordion-button:focus {
    box-shadow: none; /* Remove focus outline */
}

.bg-green {
    background: #d1e7dd; /* Soft Green */
    color: #0f5132;
}

.bg-gray {
    background: #e2e3e5; /* Soft Gray */
    color: #6c757d;
}

</style>
