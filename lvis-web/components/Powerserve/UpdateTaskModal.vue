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
                                <div class="text-muted small" v-if="form.activity">Category: {{ form.activity.category.name }}</div>
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
                                <textarea class="form-control form-control-sm small" rows="3" v-model="form.accomplishment"></textarea>
                                <div v-if="form_errors.accomplishment" class="text-danger small fst-italic">
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
                                
                            </div>
                        </div>
                        <div v-if="show_task_details" class="col-sm-12" :class="{'col-lg-6 col-md-6': show_task_details, 'col-lg-12 col-md-12': !show_task_details}">
                            <h5 class="fw-bold soft-badge-green text-center p-2 rounded mb-3">Task Details</h5>
                            <PowerserveFormKwhMeter
                                v-if="form.activity?.category.id === ACTIVITY_CATEGORY.KWH_Meter" 
                                :linemen="linemen"
                                :task="task"
                                :meter_brands="meter_brands"
                                :form_error="form_errors.task_detail.kwh_meter"
                                v-model="form.task_detail.kwh_meter"
                            />
                            <PowerserveFormPowerInterruption
                                v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.Power_Interruption" 
                                :linemen="linemen"
                                :feeders="feeders"
                                :weather_conditions="weather_conditions"
                                :devices="devices"
                                :task="task"
                                :form_error="form_errors.task_detail.power_interruption"
                                v-model="form.task_detail.power_interruption"
                            />
                            <PowerserveFormLineServices
                                v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.Line_Services" 
                                :linemen="linemen"
                                :task="task"
                                :form_error="form_errors.task_detail.line_services"
                                v-model="form.task_detail.line_services"
                            />
                            <PowerserveFormDles
                                v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.DLES" 
                                :linemen="linemen"
                                :task="task"
                                :form_error="form_errors.task_detail.dles"
                                v-model="form.task_detail.dles"
                            />
                            <PowerserveFormLmdga
                                v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.LMDGA" 
                                :linemen="linemen"
                                :task="task"
                                v-model="form.task_detail.lmdga"
                                :feeders="feeders"
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
    import type { Activity, Device, Feeder, Lineman, MeterBrand, Substation, WeatherCondition } from '~/composables/powerserve/common';
    import { ACTIVITY_CATEGORY, activity_category_with_details, initial_form_data, initial_form_errors, TASK_STATUS } from '~/composables/powerserve/task/task.constants';
    import type { UpdateTaskInput } from '~/composables/powerserve/task/task.dto';
    import type { Task, TaskStatus } from '~/composables/powerserve/task/task.types';
    import Swal from 'sweetalert2'
    import { is_valid_dles, is_valid_kwh_meter, is_valid_line_services, is_valid_lmdga, is_valid_power_interruption, can_update_task_info } from '~/composables/powerserve/task/task.helpers';

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
        is_updating: {
            type: Boolean,
            default: false
        },
    })

    const error_msg = ref('This field is required')

    const form = ref<UpdateTaskInput>({...initial_form_data})
    const form_errors = ref({...initial_form_errors})

    const closeBtn = ref<HTMLButtonElement>()

    const task_status_options = computed( () => {
        return props.task_statuses?.filter(i => i.id === TASK_STATUS.COMPLETED || i.id === TASK_STATUS.UNRESOLVED)
    })

    const show_task_details = computed( () => {

        if(!form.value.activity || !form.value.status) return false

        const activity_has_details = activity_category_with_details.includes(form.value.activity.category.id)

        if(form.value.status.id === TASK_STATUS.COMPLETED && activity_has_details) {
            return true
        }
        
        return false
    })


    // Watch for changes in props.task and update form.description
    watchEffect(() => {
        if (props.task) {

            const task = deepClone(props.task)

            const status = task.status!.id === TASK_STATUS.ONGOING ? null : task.status!

            form.value.activity = task.activity || null,
            form.value.description = task.description || ''
            form.value.status = status 
            form.value.action_taken = task.action_taken || ''
            form.value.accomplishment = task.accomplishment || ''
            form.value.acted_at =  task.acted_at ? formatToValidHtmlDate(task.acted_at, true) : ''
            form.value.notes = task.remarks || ''

            populate_kwh_meter({ task })
            populate_power_interruption({ task })
            populate_line_services({ task })
            populate_dles({ task })
            populate_lmdga({ task })
        }
    })

    function onUpdate() {

        if(!props.task) return 

        if(!is_valid_form({ form: form.value })) return 

        if (form.value.status?.id === TASK_STATUS.UNRESOLVED) {
            form.value.task_detail = {};
        }
        
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
        form.value = {...initial_form_data}
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

        if(form.activity?.category.id === ACTIVITY_CATEGORY.Power_Interruption && form.task_detail.power_interruption) {
            const errors = is_valid_power_interruption({ data: form.task_detail.power_interruption })
            form_errors.value.task_detail.power_interruption = {...errors}
            hasErrorPowerInterruption = Object.values(errors).includes(true);
        }

        if(form.activity?.category.id === ACTIVITY_CATEGORY.KWH_Meter && form.task_detail.kwh_meter) {
            const errors = is_valid_kwh_meter({ data: form.task_detail.kwh_meter })
            form_errors.value.task_detail.kwh_meter = {...errors}
            hasErrorKwhMeter = Object.values(errors).includes(true);
        }

        if(form.activity?.category.id === ACTIVITY_CATEGORY.Line_Services && form.task_detail.line_services) {
            const errors = is_valid_line_services({ data: form.task_detail.line_services })
            form_errors.value.task_detail.line_services = {...errors}
            hasErrorLineServices = Object.values(errors).includes(true);
        }

        if(form.activity?.category.id === ACTIVITY_CATEGORY.DLES && form.task_detail.dles) {
            const errors = is_valid_dles({ data: form.task_detail.dles })
            form_errors.value.task_detail.dles = {...errors}
            hasErrorDles = Object.values(errors).includes(true);
        }

        if(form.activity?.category.id === ACTIVITY_CATEGORY.LMDGA && form.task_detail.lmdga) {
            const errors = is_valid_lmdga({ data: form.task_detail.lmdga })
            form_errors.value.task_detail.lmdga = {...errors}
            hasErrorLmdga = Object.values(errors).includes(true);
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

    function populate_kwh_meter(payload: { task: Task }) {

        const { task } = payload

        if(task.task_detail_kwh_meter) {
            const kwh_meter = task.task_detail_kwh_meter

            form.value.task_detail.kwh_meter = {
                meter_number: kwh_meter.meter_number,
                meter_brand: kwh_meter.meter_brand,
                last_reading: kwh_meter.last_reading,
                initial_reading: kwh_meter.initial_reading,
                meter_class: kwh_meter.meter_class,
                linemen_incharge: kwh_meter.linemen_incharge.map(i => ({...i.lineman, fullname: getFullname(i.lineman.employee.firstname, i.lineman.employee.middlename, i.lineman.employee.lastname)})),
            }
        }

    }

    function populate_power_interruption(payload: { task: Task }) {

        const { task } = payload

        if(task.task_detail_power_interruption) {
            const pi = task.task_detail_power_interruption

            form.value.task_detail.power_interruption = {
                affected_area: pi.affected_area,
                feeder: pi.feeder,
                cause: pi.cause,
                weather_condition: pi.weather_condition,
                device: pi.device,
                equipment_failed: pi.equipment_failed,
                fuse_rating: pi.fuse_rating,
                linemen_incharge: pi.linemen_incharge.map(i => ({...i.lineman, fullname: getFullname(i.lineman.employee.firstname, i.lineman.employee.middlename, i.lineman.employee.lastname)})),
            }
        }

    }

    function populate_line_services(payload: { task: Task }) {

        const { task } = payload

        if(task.task_detail_line_services) {
            const ls = task.task_detail_line_services

            form.value.task_detail.line_services = {
                order_number: ls.order_number,
                cause: ls.cause,
                mrv_number: ls.mrv_number,
                seriv_number: ls.seriv_number,
                mst_number: ls.mst_number,
                mcrt_number: ls.mcrt_number,
                linemen_incharge: ls.linemen_incharge.map(i => ({...i.lineman, fullname: getFullname(i.lineman.employee.firstname, i.lineman.employee.middlename, i.lineman.employee.lastname)})),
            }
        }

    }

    function populate_dles(payload: { task: Task }) {

        const { task } = payload

        if(task.task_detail_dles) {
            const dles = task.task_detail_dles

            form.value.task_detail.dles = {
                sco_number: dles.sco_number,
                old_serial_number: dles.old_serial_number,
                new_serial_number: dles.new_serial_number,
                seriv_number: dles.seriv_number,
                kva_rating: dles.kva_rating,
                cause: dles.cause,
                linemen_incharge: dles.linemen_incharge.map(i => ({...i.lineman, fullname: getFullname(i.lineman.employee.firstname, i.lineman.employee.middlename, i.lineman.employee.lastname)})),
            }
        }

    }

    function populate_lmdga(payload: { task: Task }) {

        const { task } = payload

        if(task.task_detail_lmdga) {
            const lmdga = task.task_detail_lmdga

            form.value.task_detail.lmdga = {
                kva_rating: lmdga.kva_rating,
                substation: lmdga.substation,
                dt_location: lmdga.dt_location,
                feeder: lmdga.feeder,
                phase_number: lmdga.phase_number,
                number_of_hc: lmdga.number_of_hc,
                number_of_spans: lmdga.number_of_spans,
                copper_aluminum_primary: lmdga.copper_aluminum_primary,
                copper_aluminum_secondary: lmdga.copper_aluminum_secondary,
                copper_aluminum_ground: lmdga.copper_aluminum_ground,
                size_primary: lmdga.size_primary,
                size_secondary: lmdga.size_secondary,
                size_ground: lmdga.size_ground,
                terminal_connector_primary: lmdga.terminal_connector_primary,
                terminal_connector_secondary: lmdga.terminal_connector_secondary,
                terminal_connector_ground: lmdga.terminal_connector_ground,
                tap_position: lmdga.tap_position,
                brand: lmdga.brand,
                number_of_bushing_primary: lmdga.number_of_bushing_primary,
                number_of_bushing_secondary: lmdga.number_of_bushing_secondary,
                protective_device: lmdga.protective_device,
                load_current_sec_bushing: lmdga.load_current_sec_bushing,
                load_current_neutral: lmdga.load_current_neutral,
                load_current_one: lmdga.load_current_one,
                load_current_two: lmdga.load_current_two,
                voltage_level_one: lmdga.voltage_level_one,
                voltage_level_two: lmdga.voltage_level_two,
                sec_line_conductor_size_one: lmdga.sec_line_conductor_size_one,
                sec_line_conductor_size_two: lmdga.sec_line_conductor_size_two,
                linemen_incharge: lmdga.linemen_incharge.map(i => ({...i.lineman, fullname: getFullname(i.lineman.employee.firstname, i.lineman.employee.middlename, i.lineman.employee.lastname)})),
            }
        }

    }

</script>