<template>
    <div class="card shadow-sm border-0">
        <div class="card-body p-4">
            <div class="d-flex align-items-center mb-4">
                <h2 class="h4 mb-0 text-primary fw-semibold">
                    <i class="bi bi-person-lines-fill me-2"></i>Consumer Reference
                </h2>
            </div>

            <div class="mb-4">
                <label class="form-label fw-medium text-muted mb-2">
                    Search Consumer
                </label>
                <client-only>
                    <v-select
                        @option:selected="on_select_consumer"
                        @search="handle_search_consumers"
                        :options="consumers"
                        label="name"
                        v-model="consumer"
                        class="v-select-custom"
                    ></v-select>
                </client-only>
                <div v-show="is_searching_consumers" class="text-muted small mt-1">
                    <i class="bi bi-search me-1"></i> Searching...
                </div>
            </div>

            <div class="bg-light p-3 rounded mb-4">
                <h6 class="fw-semibold text-primary mb-3">
                    <i class="bi bi-person-badge me-2"></i>Consumer Details
                </h6>

                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label small text-muted fw-medium">Account Number</label>
                        <input
                            type="text"
                            class="form-control form-control-sm"
                            :value="consumer ? consumer.id : ''"
                            disabled
                        >
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small text-muted fw-medium">Meter Number</label>
                        <input
                            type="text"
                            class="form-control form-control-sm"
                            :value="consumer ? consumer.meter_number : ''"
                            disabled
                        >
                    </div>
                    <div class="col-12">
                        <label class="form-label small text-muted fw-medium">Address</label>
                        <textarea
                            class="form-control form-control-sm"
                            rows="2"
                            disabled
                            :value="consumer ? consumer.address : ''"
                        ></textarea>
                    </div>
                </div>
            </div>

            <div class="bg-light p-3 rounded">
                <h6 class="fw-semibold text-primary mb-3">
                    <i class="bi bi-clock-history me-2"></i>Complaint History
                </h6>

                <div v-show="is_loading_consumer_details">
                    <LoaderSpinner />
                </div>

                <div v-show="!is_loading_consumer_details" class="table-responsive">
                    <table class="table table-hover table-bordered small">
                        <thead class="table-light">
                            <tr>
                                <th class="text-nowrap">Ref #</th>
                                <th class="text-nowrap">Complainant</th>
                                <th class="text-nowrap">Description</th>
                                <th class="text-nowrap">Contact</th>
                                <th class="text-nowrap">Recorded By</th>
                                <th class="text-nowrap">Date</th>
                                <th class="text-nowrap">Assigned Group</th>
                                <th class="text-nowrap">Type</th>
                                <th class="text-nowrap">Status</th>
                                <th class="text-nowrap">Address</th>
                                <th class="text-nowrap">Landmark</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in complaint_history" :key="index">
                                <td class="text-nowrap">{{ item.ref_number }}</td>
                                <td class="text-nowrap">{{ item.complainant_name }}</td>
                                <td class="text-nowrap">
                                    {{ item.description }}
                                </td>
                                <td class="text-nowrap">{{ item.complainant_contact_no }}</td>
                                <td class="text-nowrap">{{ item.created_by }}</td>
                                <td class="text-nowrap">{{ formatDate(item.created_at, true) }}</td>
                                <td class="text-nowrap">{{ item.assigned_group?.name || 'N/A' }}</td>
                                <td class="text-nowrap">{{ item.report_type.name }}</td>
                                <td>
                                    <div :class="`badge soft-badge soft-badge-${ item.status?.color_class }`">
                                        {{ item.status?.name }}
                                    </div>
                                </td>
                                <td class="text-nowrap">
                                    {{ get_full_address(item.complaint_detail) }}
                                </td>
                                <td class="text-nowrap">
                                    {{ item.complaint_detail.landmark }}
                                </td>
                            </tr>
                            <tr v-if="complaint_history.length === 0">
                                <td colspan="11" class="text-muted py-4">
                                    No complaint history found
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
    import { get_complaint_history } from '~/composables/powerserve/complaint/complaint.api';
    import type { Complaint, ComplaintDetail } from '~/composables/powerserve/complaint/complaint.types';
    import { get_consumers } from '~/composables/powerserve/consumer/consumer.api';
    import type { Consumer } from '~/composables/powerserve/consumer/consumer.types';

    const emits = defineEmits(['select-consumer'])

    const props = defineProps({
        consumer: {
            type: Object as () => Consumer | null,
            default: null,
        },
    });

    const config = useRuntimeConfig()
    const LEYECO_API = config.public.LEYECO_API

    const consumer = ref<Consumer | null>(props.consumer || null);
    const consumers = ref<Consumer[]>([])

    const is_loading_consumer_details = ref(false)
    const is_searching_consumers = ref(false)
    const complaint_history = ref<Complaint[]>([])


    watch(() => props.consumer, (newConsumer) => {
        consumer.value = newConsumer ? deepClone(newConsumer) : null;
        
        if (newConsumer) {
            load_complaint_history(newConsumer.id);
        } else {
            complaint_history.value = [];
        }
    }, { immediate: true });


    async function load_complaint_history(consumer_id: string) {
        is_loading_consumer_details.value = true;
        try {
            const response = await get_complaint_history({ consumer_id });
            complaint_history.value = deepClone(response.complaint_history) || [];
        } catch (error) {
            console.error('Error loading complaint history:', error);
            complaint_history.value = [];
        } finally {
            is_loading_consumer_details.value = false;
        }
    }


    async function on_select_consumer() {  
        console.log('on_select_consumer');

        const consumer_id = consumer.value?.id
        if (!consumer_id) return 

        emits('select-consumer', { consumer: deepClone(consumer.value) })

        is_loading_consumer_details.value = true;
        try {
            const response = await get_complaint_history({ consumer_id: consumer_id });
            complaint_history.value = deepClone(response.complaint_history) || [];
        } catch (error) {
            console.error('Error loading complaint history:', error);
            complaint_history.value = [];
        } finally {
            is_loading_consumer_details.value = false;
        }
    }

    async function handle_search_consumers(input: string, loading: (status: boolean) => void) {
        if (input.trim() === '') {
            consumers.value = []
            return 
        } 
        debounced_search_consumers(input, loading)
    }

    async function search_consumers(input: string, loading: (status: boolean) => void) {
        console.log('search_consumers');
        loading(true)

        try {
            is_searching_consumers.value = true
            const response = await get_consumers({ consumer_name: input, baseUrl: LEYECO_API });
            is_searching_consumers.value = false
            console.log('response', response);
            consumers.value = response
        } catch (error) {
            console.error('Error fetching Consumers:', error);
        } finally {
            loading(false);
        }
    }

    const debounced_search_consumers = debounce((input: string, loading: (status: boolean) => void) => {
        search_consumers(input, loading);
    }, 500);

    const get_full_address = (detail: ComplaintDetail) => {
        const { barangay, sitio, landmark } = detail;
        
        const addressParts = [
            barangay?.name,
            barangay?.municipality?.name,
            sitio?.name,
        ].filter(Boolean);

        return addressParts.join(', ').replace(/, ,/g, ',').replace(/, $/, '');
    }
</script>

<style scoped>

    .card {
        border-radius: 0.5rem;
    }

    .table {
        --bs-table-striped-bg: rgba(0, 0, 0, 0.02);
    }

    .table th {
        font-weight: 500;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.5px;
    }
</style>