<template>
    <div class="modal fade" id="complaint_form_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">

            <form @submit.prevent="handleSave()" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary fw-bold" id="exampleModalLabel">Add Complaint</h5>
                    <button ref="close_modal_btn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="alert alert-info small fst-italic" role="alert">
                        Fields with * are required
                    </div>

                    <div class="row">

                        <div class="col">

                            <div class="mb-3">
                                <label class="form-label">
                                    Complainant Name <span class="text-danger">*</span>
                                </label>
                                <input type="text" v-model="form.complainant_name" class="form-control">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Complainant Contact Number <span class="text-danger">*</span>
                                </label>
                                <input type="text" v-model="form.complainant_contact_number" class="form-control">
                            </div>
        
                            <div class="mb-3">
                                <label class="form-label">Consumer</label>
                                <client-only>
                                    <v-select :options="searched_consumers" label="name" v-model="form.complaint_detail.consumer"></v-select>
                                </client-only>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Account Number</label>
                                <client-only>
                                    <v-select :options="searched_account_numbers" label="name" v-model="form.complaint_detail.account_number"></v-select>
                                </client-only>
                            </div>
        
                            <div class="mb-3">
                                <label class="form-label">Meter Number</label>
                                <client-only>
                                    <v-select :options="searched_meter_numbers" label="name" v-model="form.complaint_detail.meter_number"></v-select>
                                </client-only>
                            </div>
        

                            <div class="mb-3">
                                <label class="form-label">
                                    Description <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control" rows="3" v-model="form.description"></textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">
                                    Nature of Complaint <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="nature_of_complaints" label="name" v-model="form.nature_of_complaint"></v-select>
                                </client-only>
                            </div>
        
                        </div>
                        
                        <div class="col">
                            
                            <div class="mb-3">
                                <label class="form-label">
                                    Report Type <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="report_types" label="name" v-model="form.report_type"></v-select>
                                </client-only>
                            </div>
        
                            <div class="mb-3">
                                <label class="form-label">
                                    Municipality <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="municipalities" label="name" v-model="form.complaint_detail.municipality"></v-select>
                                </client-only>
                            </div>
        
                            <div class="mb-3">
                                <label class="form-label">
                                    Barangay <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="barangays" label="name" v-model="form.complaint_detail.barangay"></v-select>
                                </client-only>
                            </div>
        
                            <div class="mb-3">
                                <label class="form-label">Sitio / Purok</label>
                                <client-only>
                                    <v-select :options="sitios" label="name" v-model="form.complaint_detail.sitio"></v-select>
                                </client-only>
                            </div>
        
                            <div class="mb-3">
                                <label class="form-label">Landmark</label>
                                <input type="text" class="form-control" v-model="form.complaint_detail.landmark">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Remarks</label>
                                <textarea class="form-control" rows="3" v-model="form.remarks"></textarea>
                            </div>
        
                            <div class="mb-3">
                                <label class="form-label">
                                    Assigned To <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="assignments" label="name" v-model="form.assigned_to"></v-select>
                                </client-only>
                            </div>

                        </div>

                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>

        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Assignment, Barangay, Municipality, Sitio } from '~/composables/powerserve/common';
    import type { ComplaintReportType, CreateComplaint, NatureOfComplaint } from '~/composables/powerserve/complaints/complaints.types';
    import { useComplaintStore } from '~/composables/powerserve/complaints/complaints.store';
    import Swal from 'sweetalert2'
    import * as complaintApi from '~/composables/powerserve/complaints/complaints.api'

    const props = defineProps({
        nature_of_complaints: {
            type: Array as () => NatureOfComplaint[],
            default: () => [],
        },
        municipalities: {
            type: Array as () => Municipality[],
            default: () => [],
        },
        barangays: {
            type: Array as () => Barangay[],
            default: () => [],
        },
        sitios: {
            type: Array as () => Sitio[],
            default: () => [],
        },
        report_types: {
            type: Array as () => ComplaintReportType[],
            default: () => [],
        },
        assignments: {
            type: Array as () => Assignment[],
            default: () => [],
        },
    })

    const store = useComplaintStore()

    const searched_account_numbers = ref<string[]>([])
    const searched_meter_numbers = ref<string[]>([])
    const searched_consumers = ref<string[]>([])

    const initial_form_data: CreateComplaint = {
        report_type: props.report_types[0],
        nature_of_complaint: null,
        complainant_name: '',
        complainant_contact_number: '',
        description: '',
        remarks: '',
        complaint_detail: {
            account_number: null,
            meter_number: null,
            consumer: null,
            municipality: null,
            barangay: null,
            sitio: null,
            landmark: '',
        },
        assigned_to: null
    }

    const form = ref<CreateComplaint>({...initial_form_data})
    const close_modal_btn = ref<HTMLButtonElement>()

    async function handleSave() {
        console.log('saving...');
        const form_data = deepClone(form.value)

        const created_complaint = await complaintApi.create(form_data)

        if(created_complaint.success && created_complaint.data) {

            store.save_complaint({ complaint: created_complaint.data })
            close_modal_btn.value?.click()
    
            Swal.fire({
                title: 'Success!',
                text: 'Complaint successfully saved!',
                icon: 'success',
                position: 'top',
            })

        } else {
            Swal.fire({
                title: 'Error!',
                text: created_complaint.msg,
                icon: 'success',
                position: 'top',
            }) 
        }


    }

</script>


<style scoped>

    

</style>