<template>
    <div class="container">


        <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3"> Lineman Schedule </h5>

        <div class="card mt-3 mb-3">
            <div class="card-header">
                Filter 
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-6 col-md-12 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Area</label>
                            <client-only>
                                <v-select :options="store.areas" label="name" v-model="store.selected_area"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Supervisor</label>
                            <client-only>
                                <v-select @search="handleSearchEmployees" :options="employees" label="fullname" v-model="store.selected_supervisor"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <PowerserveShifts class="mb-3" :shifts="store.shifts" />

        <PowerserveLinemanSchedule :shifts="store.shifts" :linemen="store.linemen" />

    </div>
</template>

<script setup lang="ts">
    import { fetchEmployees } from '~/composables/hr/employee/employee.api'
    import type { Employee } from '~/composables/hr/employee/employee.types'
    import { schedule_index_init } from '~/composables/powerserve/lineman/schedule.api'
    import { useLinemanScheduleStore } from '~/composables/powerserve/lineman/schedule.store'
    import { addPropertyFullName } from '~/composables/hr/employee/employee';
    import { LINEMAN_STATUS } from '~/composables/powerserve/lineman/lineman.types';

    definePageMeta({
        name: ROUTES.LINEMAN_SCHEDULE_INDEX,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const router = useRouter()
    const store = useLinemanScheduleStore()

    const employees = ref<Employee[]>([])

    onMounted(async () => {

        authUser.value = await getAuthUserAsync()
        isLoadingPage.value = false

        const { areas, linemen, shifts } = await schedule_index_init()
        store.set_linemen({ linemen })
        store.set_areas({ areas })
        store.set_shifts({ shifts })

        isLoadingPage.value = false
    })

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

    .container {
        max-width: 1500px; 
        margin: 0 auto; 
    }

</style>