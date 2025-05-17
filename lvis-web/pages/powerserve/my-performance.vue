<template>
    <div v-if="authUser && !isLoadingPage" class="container py-4">

        <div class="row">
            <div class="col">
                <!-- Header with improved styling -->
                <div class="header-badge bg-gradient-primary text-white text-center p-3 rounded-lg mb-4 shadow-sm">
                    <h5 class="fw-semibold mb-0">My Performance Evaluation</h5>
                    <p class="small mb-0 opacity-75">Track and analyze your performance metrics</p>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-12">
        
                <!-- Date Range Card - Consolidated with action button -->
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-white border-0 py-3">
                        <h6 class="fw-semibold mb-0 d-flex align-items-center">
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'calendar']" class="me-2" />
                            </client-only>
                            Date Range Selection
                        </h6>
                    </div>
                    <form @submit.prevent="filter_date" class="card-body">
                        <div class="row g-3">
                            <div class="col-lg-6 col-md-6 col-sm-12">
                                <div class="form-floating">
                                    <input required type="date" class="form-control" id="startDate" v-model="start_date" 
                                           :max="end_date">
                                    <label for="startDate">Start Date</label>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12">
                                <div class="form-floating">
                                    <input required type="date" class="form-control" id="endDate" v-model="end_date" 
                                           :min="start_date">
                                    <label for="endDate">End Date</label>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-white border-0 py-3 d-flex justify-content-end">
                            <button :disabled="is_filtering_date" type="submit" class="btn btn-primary px-4">
                                <client-only>
                                    <font-awesome-icon class="me-2" :icon="['fas', 'filter']" />
                                </client-only>
                                {{ is_filtering_date ? 'Applying filter...' : 'Apply Filter' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="col-lg-8 col-md-8 col-sm-12">
        
                <!-- Lineman Cards with loading state and empty state -->
                <div v-if="is_filtering_date" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 text-muted">Loading data...</p>
                </div>
        
                <div v-else-if="store.linemen.length === 0" class="card border-0 shadow-sm">
                    <div class="card-body text-center py-5">
                        <i class="bi bi-people display-5 text-muted mb-3"></i>
                        <h5 class="text-muted">No linemen found</h5>
                        <p class="text-muted">Adjust your filters or search criteria</p>
                    </div>
                </div>
        
                <div v-else class="accordion" id="linemanAccordion">
                    <div v-for="(lineman, index) in store.linemen" :key="lineman.id" class="card border-0 shadow-sm mb-3">
                        <powerserve-lineman-evaluation 
                            :lineman="lineman" 
                            @view_task="view_task"
                            :accordion-id="'collapse-' + index"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Task Details Modal -->
        <PowerserveTaskDetailsModal 
            :task="selected_task" 
            :is_loading_task_details="is_loading_task_details"
        />
    </div>
    <div v-else>
        <LoaderSpinner />
    </div>
</template>

<script setup lang="ts">
    import { useEvaluationStore } from '~/composables/powerserve/lineman/evaluation.store'
    import { evaluation_index_init, get_linemen_with_activities } from '~/composables/powerserve/lineman/evaluation.api';
    import { startOfMonth, endOfMonth } from 'date-fns'
    import type { Task } from '~/composables/powerserve/task/task.types';
    import { findOne as find_task } from '~/composables/powerserve/task/task.api'

    definePageMeta({
        name: ROUTES.MY_PERFORMANCE_INDEX,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const store = useEvaluationStore()

    const selected_task = ref<Task>()
    const is_loading_task_details = ref(false)
    const is_filtering_date = ref(false)

    const start_date = ref(formatToValidHtmlDate(startOfMonth(new Date())))
    const end_date = ref(formatToValidHtmlDate(endOfMonth(new Date())))


    onMounted(async () => {

        authUser.value = await getAuthUserAsync()

        if(!authUser.value.user.user_employee) {
            return redirectTo401Page()
        }

        const { linemen, areas } = await evaluation_index_init({
            start_date: new Date(start_date.value),
            end_date: new Date(end_date.value),
            employee_id: authUser.value.user.user_employee.employee_id
        });

        store.set_linemen({ linemen: deepClone(linemen) })
        store.set_areas({ areas: deepClone(areas) })

        isLoadingPage.value = false
    })
    
    async function view_task(payload: { task: Task }) {
        const { task } = payload

        console.log('payload', payload);

        is_loading_task_details.value = true
        const _task = await find_task({ id: task.id, with_task_details: true })
        is_loading_task_details.value = false

        console.log('_task', _task);

        if(_task) {
            selected_task.value = _task
        }
    }

    async function filter_date() {

        is_filtering_date.value = true 
        const { linemen } = await get_linemen_with_activities({
            start_date: start_date.value,
            end_date: end_date.value,
            employee_id: authUser.value.user.user_employee?.employee_id
        });
        is_filtering_date.value = false 

        store.set_linemen({ linemen: deepClone(linemen) })

    }


</script>

<style scoped>

    .container {
        max-width: 1800px; 
        margin: 0 auto; 
    }

    .bg-gray {
        background: #e2e3e5; /* Soft Gray */
        color: #6c757d;
    }

    .header-badge {
        background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
    }


    .card {
        transition: all 0.2s ease;
    }

    .card:hover {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);
    }

    .form-floating > label {
        color: #6c757d;
    }
</style>