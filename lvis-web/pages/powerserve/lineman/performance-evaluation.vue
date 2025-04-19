<template>
    <div class="container">

        <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3"> Lineman Performance Evaluation </h5>

        <div class="card mb-3">
            <div class="card-header">
                Filter 
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Start Date</label>
                            <input type="date" class="form-control" v-model="start_date">
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">End Date</label>
                            <input type="date" class="form-control" v-model="end_date">
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="mb-3">
                            <label class="form-label">Area</label>
                            <client-only>
                                <v-select :options="store.areas" label="name" v-model="store.selected_area"></v-select>
                            </client-only>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
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

        <div class="card mb-3">
            <div class="card-header">
                Search Lineman
            </div>
            <div class="card-body">
                <input type="text" class="form-control" v-model="store.search_value">                
            </div>
        </div>

        <div v-for="lineman in store.linemen" class="card mb-3">
            <powerserve-lineman-evaluation :lineman="lineman" />
        </div>

    </div>
</template>

<script setup lang="ts">
    import { fetchEmployees } from '~/composables/hr/employee/employee.api'
    import type { Employee } from '~/composables/hr/employee/employee.types'
    import { useEvaluationStore } from '~/composables/powerserve/lineman/evaluation.store'
    import { addPropertyFullName } from '~/composables/hr/employee/employee';
    import { evaluation_index_init } from '~/composables/powerserve/lineman/evaluation.api';
    import { startOfMonth, endOfMonth } from 'date-fns'

    definePageMeta({
        name: ROUTES.LINEMAN_EVALUATION_INDEX,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const router = useRouter()
    const store = useEvaluationStore()

    const start_date = ref(formatToValidHtmlDate(startOfMonth(new Date())))
    const end_date = ref(formatToValidHtmlDate(endOfMonth(new Date())))

    const employees = ref<Employee[]>([])

    onMounted(async () => {

        authUser.value = await getAuthUserAsync()
        isLoadingPage.value = false

        const { linemen } = await evaluation_index_init({
            start_date: new Date(start_date.value),
            end_date: new Date(end_date.value)
        });

        store.set_linemen({ linemen })

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
</style>