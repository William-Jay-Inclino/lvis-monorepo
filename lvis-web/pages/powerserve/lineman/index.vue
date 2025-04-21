<template>
    <div v-if="authUser && !isLoadingPage" class="container">

        <div class="row mb-3">
            <div class="col">
                <button @click="onClickAdd" data-bs-toggle="modal" data-bs-target="#lineman_modal" class="btn btn-primary float-end">
                    <client-only>
                        <font-awesome-icon :icon="['fas', 'user-plus']"></font-awesome-icon>
                    </client-only>
                    Add Lineman
                </button>
            </div>
        </div>

        <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3"> Lineman Personnel </h5>

        <div class="card mt-3">
            <div class="card-header">
                Filter 
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-4 col-md-12 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Area</label>
                            <client-only>
                                <v-select :options="store.areas" label="name" v-model="store.selected_area"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-12 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Supervisor</label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="store.selected_supervisor"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-12 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <client-only>
                                <v-select :options="store.lineman_statuses" v-model="store.selected_status"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mt-3">
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col">
                        <input type="text" class="form-control" placeholder="Enter search keyword..." v-model="store.search_value">
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th class="bg-secondary text-white no-wrap">Employee Name</th>
                                        <th class="bg-secondary text-white">Position</th>
                                        <th class="bg-secondary text-white">Area</th>
                                        <th class="bg-secondary text-white">Supervisor</th>
                                        <th class="bg-secondary text-white">Status</th>
                                        <th class="bg-secondary text-white"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="lineman in store.linemen">
                                        <td class="text-muted"> {{ lineman.fullname }} </td>
                                        <td class="text-muted"> {{ lineman.employee.position }} </td>
                                        <td class="text-muted"> {{ lineman.area.name }} </td>
                                        <td class="text-muted"> {{ lineman.supervisor.fullname }} </td>
                                        <td>
                                            <div :class="`badge bg-${ lineman.status === LINEMAN_STATUS.ACTIVE ? 'success' : 'danger' }`"> {{ lineman.status }} </div>
                                        </td>
                                        <td>
                                            <button @click="onClickEdit({ lineman })" data-bs-toggle="modal" data-bs-target="#lineman_modal" class="btn btn-light btn-sm">
                                                <client-only>
                                                    <font-awesome-icon class="text-primary" :icon="['fas', 'edit']"></font-awesome-icon>
                                                </client-only>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <powerserve-form-lineman-modal
            :is_edit_mode="is_edit_mode"
            :linemen="store.linemen"
            :areas="store.areas"
            :form="lineman_form_data" 
            @close-form="handleFormClosed"
        />

    </div>
    <div v-else>
        <LoaderSpinner />
    </div>
</template>

<script setup lang="ts">
    import { fetchEmployees } from '~/composables/hr/employee/employee.api'
    import type { Employee } from '~/composables/hr/employee/employee.types'
    import { lineman_index_init } from '~/composables/powerserve/lineman/lineman.api'
    import { useLinemanStore } from '~/composables/powerserve/lineman/lineman.store'
    import { addPropertyFullName } from '~/composables/hr/employee/employee';
    import { LINEMAN_STATUS, type Lineman, type UpdateLineman } from '~/composables/powerserve/lineman/lineman.types';

    definePageMeta({
        name: ROUTES.LINEMAN_INDEX,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const router = useRouter()
    const store = useLinemanStore()

    const selected_lineman = ref<Lineman>()
    const is_edit_mode = ref(false)

    const employees = ref<Employee[]>([])

    onMounted(async () => {

        authUser.value = await getAuthUserAsync()
        isLoadingPage.value = false

        const { areas, linemen } = await lineman_index_init()
        store.set_linemen({ linemen })
        store.set_areas({ areas })

        isLoadingPage.value = false
    })

    const lineman_form_data = computed((): UpdateLineman | undefined => {
        if(selected_lineman.value) {
            return {
                employee: selected_lineman.value.employee,
                area: selected_lineman.value.area,
                supervisor: selected_lineman.value.supervisor,
            }
        }
    })

    function onClickEdit(payload: { lineman: Lineman }) {
        const { lineman } = payload 
        selected_lineman.value = lineman
        is_edit_mode.value = true
    }

    function onClickAdd() {
        is_edit_mode.value = false
    }

    function handleFormClosed() {
        is_edit_mode.value = false
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

<style scoped>
    .bg-gray {
        background: #e2e3e5; /* Soft Gray */
        color: #6c757d;
    }
</style>