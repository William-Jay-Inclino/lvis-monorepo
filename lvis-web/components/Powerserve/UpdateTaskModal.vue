<template>
    <div class="modal fade" id="update_task_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-fullscreen-md-down" :class="{'modal-xl': show_task_details}">
            <div v-if="task && task.status?.id === TASK_STATUS.ONGOING" class="modal-content">
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
                                <small class="text-muted" v-if="form.activity">Category: {{ form.activity.category.name }}</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Update Status to: <span class="text-danger">*</span>
                                </label> 
                                <client-only>
                                    <v-select :options="task_status_options" label="name" v-model="form.status" :clearable="false"></v-select>
                                </client-only>
                                <div :class="`badge mt-2 soft-badge soft-badge-${ task?.status?.color_class }`">
                                    Current Status: {{ task?.status?.name }}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Task Description <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm small" rows="3" v-model="form.description"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Action Taken <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm small text-muted" rows="3" v-model="form.action_taken"></textarea>
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
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Attachments</label>
                                
                            </div>
                        </div>
                        <div v-if="show_task_details" class="col-sm-12" :class="{'col-lg-6 col-md-6': show_task_details, 'col-lg-12 col-md-12': !show_task_details}">
                            <h5 class="fw-bold soft-badge-green text-center p-2 rounded mb-3">Task Details</h5>
                            <PowerserveKwhMeterForm v-if="form.activity?.category.id === ACTIVITY_CATEGORY.KWH_Meter" />
                            <PowerservePowerInterruptionForm
                                v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.Power_Interruption" 
                                :linemen="linemen"
                                :feeders="feeders"
                                :weather_conditions="weather_conditions"
                                :devices="devices"
                                v-model="form.task_detail.power_interruption"
                            />
                            <PowerserveLineServicesForm v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.Line_Services" />
                            <PowerserveDlesForm v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.DLES" />
                            <PowerserveLmdgaForm v-else-if="form.activity?.category.id === ACTIVITY_CATEGORY.LMDGA" />

                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="onClickCloseBtn()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button :disabled="is_updating" @click="onUpdate" type="button" class="btn btn-primary"> {{ is_updating ? 'Updating...' : 'Update' }} </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
    import type { Activity, Device, Feeder, Lineman, WeatherCondition } from '~/composables/powerserve/common';
    import { power_interruption_initial_data } from '~/composables/powerserve/task/dtos/task-detail-initial-inputs';
    import { ACTIVITY_CATEGORY, activity_category_with_details, TASK_STATUS } from '~/composables/powerserve/task/task.constants';
    import type { Task, TaskStatus, UpdateTaskInput } from '~/composables/powerserve/task/task.types';

    const emits = defineEmits(['update-task'])

    const props = defineProps({
        task: {
            type: Object as () => Task,
        },
        activities: {
            type: Array as () => Activity[]
        },
        task_statuses: {
            type: Array as () => TaskStatus[]
        },
        linemen: {
            type: Array as () => Lineman[]
        },
        feeders: {
            type: Array as () => Feeder[]
        },
        weather_conditions: {
            type: Array as () => WeatherCondition[]
        },
        devices: {
            type: Array as () => Device[]
        },
        is_updating: {
            type: Boolean,
            default: false
        },
    })

    const initial_form_data: UpdateTaskInput = {
        activity: null,
        description: '',
        status: null,
        action_taken: '',
        acted_at: '',
        notes: '',
        task_detail: {
            power_interruption: {...power_interruption_initial_data}
        }
    }

    const form = ref<UpdateTaskInput>({...initial_form_data})

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
            form.value.description = props.task.description || ''
        }
    })

    function onUpdate() {

        if(!form.value.status || !props.task) return 

        if (form.value.status.id === TASK_STATUS.UNRESOLVED) {
            form.value.task_detail = {};
        }

        // remove task_detail property if activity dont require task details
        if(form.value.activity) {
            const activity_not_requiring_details = !activity_category_with_details.includes(form.value.activity.category.id)

            if(activity_not_requiring_details) {
                form.value.task_detail = {};
            }
            
        }

        console.log('form.value', form.value);

        emits('update-task', { task_id: props.task.id, form: form.value, closeBtn: closeBtn.value });
    }

    function onClickCloseBtn() {
        form.value = {...initial_form_data}
    }

</script>