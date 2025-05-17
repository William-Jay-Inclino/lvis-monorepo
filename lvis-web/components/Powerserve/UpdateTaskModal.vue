<template>
    <div class="modal fade" id="update_task_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-fullscreen-md-down" :class="{'modal-xl': show_task_details}">
            <div v-if="task && can_update_task_info({ status_id: task.status!.id })" class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title fw-bold"> Update Task </h5>
                    <button @click="onClickCloseBtn()" ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="alert alert-info fst-italic small" role="alert">
                        <ul>
                            <li>
                                Fields with * are required
                            </li>
                            <li>
                                Task details will only be displayed based on the activity category and if the status is completed
                            </li>
                            <li>
                                Only images are allowed as attachments
                            </li>
                        </ul>
                    </div>

                    <div class="row">
                        <div class="col-sm-12" :class="{'col-lg-6 col-md-6': show_task_details, 'col-lg-12 col-md-12': !show_task_details}">
                            <h5 class="fw-bold soft-badge-blue text-center p-2 rounded mb-3">Task Info</h5>
                            <div class="mb-3">
                                <label class="form-label">
                                    Activity <span class="text-danger">*</span>
                                </label>
                                <client-only>
                                    <v-select :options="activities" label="name" v-model="form.activity" :clearable="false"></v-select>
                                </client-only>
                                <div v-if="form.activity">
                                    <div class="text-muted small">Category: {{ form.activity.category.name }}</div>
                                    <div class="text-muted small">No. of personnel req.: {{ form.activity.num_of_personnel }}</div>
                                    <div class="text-muted small">Standard rate per day: {{ form.activity.quantity + ' ' + form.activity.unit.name }}</div>
                                </div>
                                <div v-if="form_errors.activity" class="text-danger small fst-italic">
                                    {{ error_msg }}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Update Status to: <span class="text-danger">*</span>
                                </label> 
                                <client-only>
                                    <v-select :disabled="task.status?.id !== TASK_STATUS.ONGOING" :options="task_status_options" label="name" v-model="form.status" :clearable="false"></v-select>
                                </client-only>
                                <div v-if="form_errors.status" class="text-danger small fst-italic">
                                    {{ error_msg }}
                                </div>
                                <div :class="`badge mt-2 soft-badge soft-badge-${ task?.status?.color_class }`">
                                    Current Status: {{ task?.status?.name }}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Task Description <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm small" rows="3" v-model="form.description"></textarea>
                                <div v-if="form_errors.description" class="text-danger small fst-italic">
                                    {{ error_msg }}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Accomplishment <span class="text-danger">*</span>
                                </label>
                                <input type="number" class="form-control" v-model="form.accomplishment_qty">
                                <div v-if="form_errors.accomplishment_qty" class="text-danger small fst-italic">
                                    {{ error_msg }}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Action Taken <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm small text-muted" rows="3" v-model="form.action_taken"></textarea>
                                <div v-if="form_errors.action_taken" class="text-danger small fst-italic">
                                    {{ error_msg }}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Notes</label>
                                <textarea class="form-control form-control-sm small" rows="3" v-model="form.notes"></textarea>
                                <small class="text-muted fst-italic">This field will be recorded in task logs</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Date & Time Acted <span class="text-danger">*</span>
                                </label>
                                <input type="datetime-local" class="form-control" v-model="form.acted_at">
                                <div v-if="form_errors.acted_at" class="text-danger small fst-italic">
                                    {{ error_msg }}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Attachments</label>
                                <small class="text-muted fst-italic">(Max size: 5mb, Max files: 3)</small>
                                <client-only>
                                    <file-pond
                                      v-bind:files="files"
                                      ref="filepond"
                                      label-idle="Drop file here..."
                                      :allow-multiple="true"
                                      accepted-file-types="image/jpeg, image/png"
                                      :max-files="3"
                                      @updatefiles="handleFileProcessing"
                                      fileSizeBase="1000" />
                                </client-only>
                            </div>
                        </div>
                        <div v-if="show_task_details" class="col-sm-12" :class="{'col-lg-6 col-md-6': show_task_details, 'col-lg-12 col-md-12': !show_task_details}">
                            <h5 class="fw-bold soft-badge-green text-center p-2 rounded mb-3">Task Details</h5>
                            <PowerserveFormKwhMeter
                                v-if="form.activity?.category.id === ACTIVITY_CATEGORY.KWH_Meter" 
                                :linemen="linemen"
                                :task="task"
                                :task_status="form.status"
                                :meter_brands="meter_brands"
                                :causes="causes"
                                :form_error="form_errors.task_detail.kwh_meter"
                                v-model="form.task_detail.kwh_meter"
                            />
                            <PowerserveFormPowerInterruption
                                v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.Power_Interruption" 
                                :linemen="linemen"
                                :feeders="feeders"
                                :weather_conditions="weather_conditions"
                                :devices="devices"
                                :causes="causes"
                                :equipments="equipments"
                                :task="task"
                                :form_error="form_errors.task_detail.power_interruption"
                                v-model="form.task_detail.power_interruption"
                            />
                            <PowerserveFormLineServices
                                v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.Line_Services" 
                                :linemen="linemen"
                                :task="task"
                                :task_status="form.status"
                                :causes="causes"
                                :form_error="form_errors.task_detail.line_services"
                                v-model="form.task_detail.line_services"
                            />
                            <PowerserveFormDles
                                v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.DLES" 
                                :linemen="linemen"
                                :task="task"
                                :task_status="form.status"
                                :causes="causes"
                                :form_error="form_errors.task_detail.dles"
                                v-model="form.task_detail.dles"
                            />
                            <PowerserveFormLmdga
                                v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.LMDGA" 
                                :linemen="linemen"
                                :task="task"
                                v-model="form.task_detail.lmdga"
                                :feeders="feeders"
                                :causes="causes"
                                :form_error="form_errors.task_detail.lmdga"
                                :substations="substations"
                            />

                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="onClickCloseBtn()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button :disabled="is_updating" @click="onUpdate()" type="button" class="btn btn-primary"> {{ is_updating ? 'Updating...' : 'Update' }} </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
    import vueFilePond from "vue-filepond"
    import "filepond/dist/filepond.min.css";
    import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
    import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
    import FilePondPluginImagePreview from "filepond-plugin-image-preview";

    import type { Activity, ActivityCategoryCause, Device, Equipment, Feeder, MeterBrand, Substation, WeatherCondition } from '~/composables/powerserve/common';
    import { ACTIVITY_CATEGORY, activity_category_with_details, initial_form_data, initial_form_errors, TASK_STATUS } from '~/composables/powerserve/task/task.constants';
    import type { UpdateTaskInput } from '~/composables/powerserve/task/task.dto';
    import type { Task, TaskStatus } from '~/composables/powerserve/task/task.types';
    import Swal from 'sweetalert2'
    import { is_valid_dles, is_valid_kwh_meter, is_valid_line_services, is_valid_lmdga, is_valid_power_interruption, can_update_task_info, get_kwh_meter_data, get_power_interruption_data, get_line_services_data, get_dles_data, get_lmdga_data } from '~/composables/powerserve/task/task.helpers';
    import type { Lineman } from "~/composables/powerserve/lineman/lineman.types";

    const FilePond = vueFilePond(
        FilePondPluginFileValidateType,
        FilePondPluginImagePreview
    );

    const emits = defineEmits(['update-task'])

    const props = defineProps({
        task: {
            type: Object as () => Task,
        },
        activities: {
            type: Array as () => Activity[],
            default: [],
        },
        task_statuses: {
            type: Array as () => TaskStatus[],
            default: [],
        },
        linemen: {
            type: Array as () => Lineman[],
            default: [],
        },
        feeders: {
            type: Array as () => Feeder[],
            default: [],
        },
        weather_conditions: {
            type: Array as () => WeatherCondition[],
            default: [],
        },
        devices: {
            type: Array as () => Device[],
            default: [],
        },
        meter_brands: {
            type: Array as () => MeterBrand[],
            default: [],
        },
        substations: {
            type: Array as () => Substation[],
            default: [],
        },
        causes: {
            type: Array as () => ActivityCategoryCause[],
            default: [],
        },
        equipments: {
            type: Array as () => Equipment[],
            default: [],
        },
        is_updating: {
            type: Boolean,
            default: false
        },
        files: {
            type: Array as () => File[],
            default: () => []
        }
    })

    const filepond = ref()
    const files = ref<File[]>([])

    const error_msg = ref('This field is required')
    const form = ref<UpdateTaskInput>(deepClone(initial_form_data))
    const form_errors = ref({...initial_form_errors})
    const closeBtn = ref<HTMLButtonElement>()

    const task_status_options = computed( () => {
        return props.task_statuses?.filter(i => i.id === TASK_STATUS.COMPLETED || i.id === TASK_STATUS.UNRESOLVED)
    })

    const show_task_details = computed( () => {

        if(!form.value.activity || !form.value.status) return false

        const activity_has_details = activity_category_with_details.includes(form.value.activity.category.id)

        if((form.value.status.id === TASK_STATUS.COMPLETED || form.value.status.id === TASK_STATUS.UNRESOLVED) && activity_has_details) {
            return true
        }
        
        return false
    })

    watch(() => props.task, (newTask) => {
        if (newTask) {
            const task = deepClone(newTask);
            const status = task.status!.id === TASK_STATUS.ONGOING ? null : task.status!;

            form.value = {
                activity: task.activity || null,
                description: task.description || '',
                status: status,
                action_taken: task.action_taken || '',
                accomplishment_qty: task.accomplishment_qty || 0,
                acted_at: task.acted_at ? formatToValidHtmlDate(task.acted_at, true) : '',
                notes: task.remarks || '',
                attachments: task.files,
                task_detail: {
                    kwh_meter: get_kwh_meter_data({ task }),
                    power_interruption: get_power_interruption_data({ task }),
                    line_services: get_line_services_data({ task }),
                    dles: get_dles_data({ task }),
                    lmdga: get_lmdga_data({ task }),
                }
            };
        }
    }, { immediate: true }); 

    watch(() => props.files, (newFiles) => {
        files.value = newFiles || [];
    }, { immediate: true });


    function onUpdate() {

        if(!props.task) return 

        if(!is_valid_form({ form: form.value })) return 

        // if (form.value.status?.id === TASK_STATUS.UNRESOLVED) {
        //     form.value.task_detail = {};
        // }
        
        if(form.value.activity) {
            const activity_not_requiring_details = !activity_category_with_details.includes(form.value.activity.category.id)

            // remove task_detail property if activity dont require task details
            if(activity_not_requiring_details) {
                form.value.task_detail = {};
            } 
            // filter task_detail prop base on category
            else {

                if(form.value.activity.category.id === ACTIVITY_CATEGORY.Power_Interruption) {
                    form.value.task_detail = {
                        power_interruption: form.value.task_detail.power_interruption
                    }
                }
    
                else if(form.value.activity.category.id === ACTIVITY_CATEGORY.KWH_Meter) {
                    form.value.task_detail = {
                        kwh_meter: form.value.task_detail.kwh_meter
                    }
                }

                else if(form.value.activity.category.id === ACTIVITY_CATEGORY.Line_Services) {
                    form.value.task_detail = {
                        line_services: form.value.task_detail.line_services
                    }
                }

                else if(form.value.activity.category.id === ACTIVITY_CATEGORY.DLES) {
                    form.value.task_detail = {
                        dles: form.value.task_detail.dles
                    }
                }

                else if(form.value.activity.category.id === ACTIVITY_CATEGORY.LMDGA) {
                    form.value.task_detail = {
                        lmdga: form.value.task_detail.lmdga
                    }
                }

            }

            
        }

        console.log('form.value', form.value);

        emits('update-task', { task_id: props.task.id, form: form.value, closeBtn: closeBtn.value });
    }

    function onClickCloseBtn() {
        form.value = deepClone(initial_form_data)
    }

    function is_valid_form(payload: { form: UpdateTaskInput }) {

        console.log('is_valid_form', payload);

        const { form } = payload 

        form_errors.value = { ...initial_form_errors }

        if(!form.activity) {
            form_errors.value.activity = true
        }

        if(form.description.trim() === '') {
            form_errors.value.description = true
        }

        if(!form.status) {
            form_errors.value.status = true
        }

        if(form.action_taken.trim() === '') {
            form_errors.value.action_taken = true
        }

        if(form.acted_at === '' || !form.acted_at) {
            form_errors.value.acted_at = true
        }

        let hasErrorTaskInfo = Object.values(form_errors.value).includes(true);
        let hasErrorPowerInterruption = false 
        let hasErrorKwhMeter = false 
        let hasErrorLineServices = false 
        let hasErrorDles = false 
        let hasErrorLmdga = false 

        if(form.status) {

            if(form.activity?.category.id === ACTIVITY_CATEGORY.Power_Interruption && form.task_detail.power_interruption) {
                const errors = is_valid_power_interruption({ data: form.task_detail.power_interruption, task_status: form.status })
                form_errors.value.task_detail.power_interruption = errors
                hasErrorPowerInterruption = Object.values(errors).includes(true);
            }
    
            if(form.activity?.category.id === ACTIVITY_CATEGORY.KWH_Meter && form.task_detail.kwh_meter) {
                const errors = is_valid_kwh_meter({ data: form.task_detail.kwh_meter, task_status: form.status })
                console.log('errors', errors);
                form_errors.value.task_detail.kwh_meter = errors
                hasErrorKwhMeter = Object.values(errors).includes(true);
            }
    
            if(form.activity?.category.id === ACTIVITY_CATEGORY.Line_Services && form.task_detail.line_services) {
                const errors = is_valid_line_services({ data: form.task_detail.line_services, task_status: form.status })
                form_errors.value.task_detail.line_services = errors
                hasErrorLineServices = Object.values(errors).includes(true);
            }
    
            if(form.activity?.category.id === ACTIVITY_CATEGORY.DLES && form.task_detail.dles) {
                const errors = is_valid_dles({ data: form.task_detail.dles, task_status: form.status })
                form_errors.value.task_detail.dles = errors
                hasErrorDles = Object.values(errors).includes(true);
            }
    
            if(form.activity?.category.id === ACTIVITY_CATEGORY.LMDGA && form.task_detail.lmdga) {
                const errors = is_valid_lmdga({ data: form.task_detail.lmdga, task_status: form.status })
                form_errors.value.task_detail.lmdga = errors
                hasErrorLmdga = Object.values(errors).includes(true);
            }
            
        }


        const hasError = hasErrorTaskInfo || hasErrorPowerInterruption || hasErrorKwhMeter || hasErrorLineServices || hasErrorDles || hasErrorLmdga

        if(hasError) {
            Swal.fire({
                title: 'Form has errors!',
                text: 'Please review the form and correct the errors.',
                icon: 'error',
                position: 'top',
            })
            return false 
        }

        return true

    }

    function handleFileProcessing(_files: any[]) {

        console.log('_files', _files)

        form.value.attachments = _files

    }

</script>