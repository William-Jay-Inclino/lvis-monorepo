<template>
    <div class="modal fade" id="lineman_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title"> {{ modal_title }} </h5>
                    <button @click="onClickCloseBtn()" ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">
                            Employee <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select :disabled="is_edit_mode" @search="handleSearchEmployees" :options="employees" label="fullname" v-model="form.employee"></v-select>
                        </client-only>
                        <small v-if="is_lineman_exist" class="text-danger fst-italic"> Lineman exist </small>
                        <small v-if="form_error.employee" class="text-danger fst-italic"> {{ error_msg }} </small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Position</label>
                        <input type="text" class="form-control" :value="form.employee?.position || ''" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Area <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select :options="areas" label="name" v-model="form.area"></v-select>
                        </client-only>
                        <small v-if="form_error.area" class="text-danger fst-italic"> {{ error_msg }} </small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">
                            Supervisor <span class="text-danger">*</span>
                        </label>
                        <client-only>
                            <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="form.supervisor"></v-select>
                        </client-only>
                        <small v-if="form_error.supervisor" class="text-danger fst-italic"> {{ error_msg }} </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button ref="closeBtn" @click="onClickCloseBtn()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button :disabled="is_saving" @click="save()" type="button" class="btn btn-primary"> {{ is_saving ? 'Saving...' : 'Save' }} </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import Swal from 'sweetalert2'
    import { fetchEmployees } from '~/composables/hr/employee/employee.api';
    import type { Employee } from '~/composables/hr/employee/employee.types';
    import type { CreateLineman, Lineman, UpdateLineman } from '~/composables/powerserve/lineman/lineman.types';
    import { addPropertyFullName } from '~/composables/hr/employee/employee';
    import type { Area } from '~/composables/powerserve/area/area.types';

    const emits = defineEmits(['add-lineman', 'update-lineman', 'close-form'])


    const props = defineProps({
        lineman_id: {
            type: String,
            default: ''
        },
        linemen: {
            type: Array as () => Lineman[],
            default: []
        },
        is_saving: {
            type: Boolean,
            default: false
        },
        is_edit_mode: {
            type: Boolean,
            default: false
        },
        areas: {
            type: Array as () => Area[],
            default: []
        },
        form: {
            type: Object as () => UpdateLineman,
            default: () => ({}) 
        }
    });

    const employees = ref<Employee[]>([])
    const error_msg = 'This field is required'
    const closeBtn = ref<HTMLButtonElement>()

    const initial_form_errors = {
        employee: false,
        area: false,
        supervisor: false,
    }

    const initial_form_data = {
        id: '',
        employee: null,
        area: null,
        supervisor: null,
    }

    const form = ref<CreateLineman | UpdateLineman>(!props.is_edit_mode ? deepClone(initial_form_data) : props.form)

    const form_error = ref(deepClone(initial_form_errors))

    const modal_title = computed(() => !props.is_edit_mode ? 'Add Lineman' : 'Update Lineman')


    const form_area_id = computed(() => {
        if(form.value.area) {
            return form.value.area.id
        }
        return null
    })


    const is_lineman_exist = computed(() => {
        // Skip check if not changing the employee (edit mode + same employee)
        if (props.is_edit_mode && props.form.employee?.id === form.value.employee?.id) {
            return false;
        }
        // Otherwise, check if employee is already assigned to any lineman
        return props.linemen.some(i => i.employee.id === form.value.employee?.id);
    });
    

    watch(form_area_id, (new_val, old_val) => {
        const area = props.areas.find(area => area.id === new_val)
        if(area) {
            const oic = deepClone(area.oic)
            oic.fullname = getFullname(oic.firstname, oic.middlename, oic.lastname)
            form.value.supervisor = oic
        }
    })

    watch(() => props.form, (newForm) => {
        if (props.is_edit_mode && newForm) {
            form.value = deepClone(newForm)
        }
    }, { deep: true })

    watch(() => props.is_edit_mode, (is_edit) => {
        if (!is_edit) {
            form.value = deepClone(initial_form_data)
            form_error.value = deepClone(initial_form_errors)
        } else if (props.form) {
            form.value = deepClone(props.form)
        }
    })

    function onClickCloseBtn() {
        emits('close-form')

    }

    function save() {

        if (!isValid()) {
            Swal.fire({
                title: 'Error Saving!',
                text: 'Please check the form for errors.',
                icon: 'warning',
                position: 'top',
            })
            return
        }

        const form_data = deepClone(form.value)

        if(!props.is_edit_mode) {

            const data: CreateLineman = {
                employee: form_data.employee,
                supervisor: form_data.supervisor,
                area: form_data.area
            }

            emits('add-lineman', { input: data, closeBtn: closeBtn.value })

        } else {

            const data: UpdateLineman = {
                employee: form_data.employee,
                supervisor: form_data.supervisor,
                area: form_data.area
            }

            emits('update-lineman', { lineman_id: props.lineman_id, input: data, closeBtn: closeBtn.value })
        }

    }

    function isValid(): boolean {

        form_error.value = { ...initial_form_errors }

        if(!form.value.employee) {
            form_error.value.employee = true
        }

        if(!form.value.area) {
            form_error.value.area = true
        }

        if(!form.value.supervisor) {
            form_error.value.supervisor = true
        }

        const hasError = Object.values(form_error.value).includes(true);

        if (hasError || is_lineman_exist.value) {
            return false
        }

        return true

    }

    async function handleSearchEmployees(input: string, loading: (status: boolean) => void ) {

        if(input.trim() === ''){
            employees.value = []
            return 
        } 

        debouncedSearchEmployees(input, loading)

    }

    async function searchEmployees(input: string, loading: (status: boolean) => void) {
        console.log('searchEmployees');
        console.log('input', input);

        loading(true)

        try {
            const response = await fetchEmployees(input);
            console.log('response', response);
            employees.value = addPropertyFullName(response)
        } catch (error) {
            console.error('Error fetching Employees:', error);
        } finally {
            loading(false);
        }
    }

    const debouncedSearchEmployees = debounce((input: string, loading: (status: boolean) => void) => {
        searchEmployees(input, loading);
    }, 500);

</script>