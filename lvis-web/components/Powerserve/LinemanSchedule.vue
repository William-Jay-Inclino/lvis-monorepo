<template>
    <div class="schedule-container bg-white rounded-4 p-4 shadow-soft">
        <div class="schedule-header mb-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h3 class="m-0 text-secondary">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'users']" class="me-2" />
                        </client-only>
                        Lineman Personnels
                    </h3>
                    <small class="text-muted">Note: Only active status are displayed</small>
                </div>
                <div class="search-box position-relative w-25">
                    <client-only>
                        <font-awesome-icon class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
                            :icon="['fas', 'search']"></font-awesome-icon>
                    </client-only>
                    <input 
                        v-model="searchQuery"
                        type="text" 
                        class="form-control ps-5 rounded-pill" 
                        placeholder="Search lineman..." 
                    >
                </div>
            </div>
        </div>
    
        <div class="table-responsive">
            <table class="table table-borderless align-middle schedule-table">
                <thead>
                    <tr class="schedule-header-row">
                        <th class="text-start">Employee</th>
                        <th class="text-center shift-column-header">
                            <div class="day-header">Primary Shift</div>
                            <div class="sub-header">Standard Work Hours</div>
                        </th>
                        <th v-for="day in days" :key="day" class="text-center">
                            <div class="day-header">{{ day }}</div>
                        </th>
                        <th class="text-end pe-4"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="lineman in filteredLinemen" :key="lineman.id" class="schedule-row">
						<td class="no-wrap">
							<div class="d-flex align-items-center">
								<div>
									<h6 class="mb-0">{{ lineman.fullname }}</h6>
									<small class="text-muted d-block mb-1">{{ lineman.employee.position }}</small>
									<button 
										class="btn btn-sm btn-light fw-bold p-0 text-orange"
									>
										<small>
											<client-only>
												<font-awesome-icon :icon="['fas', 'history']" class="me-1" />
											</client-only>
											View schedule history
										</small>
									</button>
								</div>
							</div>
						</td>
                        
                        <!-- Shift Column (Standout) -->
                        <td class="text-center shift-column">
                            <select 
                                @change="onChangeShift({ lineman, field: 'general_shift' })" 
                                v-model="lineman.schedule.general_shift" 
                                class="shift-select standout"
                                :class="lineman.schedule.general_shift?.color_class"
                            >
                                <option :value="null" disabled>---</option>
                                <option 
                                    v-for="shift in shifts_without_day_off" 
                                    :key="shift.id" 
                                    :value="shift"
                                    :class="shift.color_class"
                                >
                                    {{ shift.name }}
                                </option>
                            </select>
                        </td>
                        
                        <!-- Day Columns -->
						<td 
							v-for="day in days" 
							:key="day" 
							class="text-center day-column"
						>
							<select 
								@change="onChangeShift({ lineman, field: getShiftField(day) })" 
								v-model="lineman.schedule[getShiftField(day)]" 
								class="shift-select"
								:class="lineman.schedule[getShiftField(day)]?.color_class"
							>
								<option :value="null" disabled class="small text-muted">---</option>
                                <option 
                                    v-for="shift in shifts" 
                                    :key="shift.id" 
                                    :value="shift"
                                    :class="shift.color_class"
                                >
                                    {{ shift.name }}
                                </option>
							</select>
						</td>
                        
                        <td class="pe-4 text-end">
                            <button :disabled="lineman.is_updating" @click="onClickUpdate({ lineman })" class="btn btn-sm btn-success">
                                {{ lineman.is_updating ? 'Updating...' : 'Update' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="filteredLinemen.length === 0" class="empty-state text-center py-5">
                <p class="text-muted mt-3">No employees found</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Lineman } from '~/composables/powerserve/lineman/lineman.types';
    import type { Shift } from '~/composables/powerserve/shift/shift.entity';

    const emits = defineEmits(['update-shift', 'update-schedule'])

    const props = defineProps({
        linemen: {
            type: Array as () => Lineman[],
            default: () => []
        },
        shifts: {
            type: Array as () => Shift[],
            default: () => []
        },
    });

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
    type DayKey = typeof days[number];
    type ShiftField = `${DayKey}_shift` | 'general_shift';

    const searchQuery = ref('');

    const localLinemen = ref<Lineman[]>(deepClone(props.linemen));

    const shifts_without_day_off = computed(() => props.shifts.filter(i => !i.is_day_off))

    const filteredLinemen = computed(() => {
        if (!searchQuery.value) return localLinemen.value;
        return localLinemen.value.filter(lineman => 
            lineman.fullname.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    });

    watch(() => props.linemen, (newLinemen) => {
        localLinemen.value = deepClone(newLinemen)
    }, { deep: true });

    const onChangeShift = (payload: { lineman: Lineman, field: ShiftField }) => {
        emits('update-shift', deepClone(payload))
    }

    const onClickUpdate = (payload: { lineman: Lineman }) => {
        emits('update-schedule', deepClone(payload))
    }

    // Helper function to safely access schedule fields
    const getShiftField = (day: DayKey): ShiftField => `${day}_shift`;
</script>

<style scoped>
    .schedule-container {
        border: 1px solid rgba(0,0,0,0.05);
    }
    
    .shadow-soft {
        box-shadow: 0 4px 24px rgba(0,0,0,0.05);
    }
    
    .schedule-table {
        --shift-column-bg: #f8fafc;
        --border-color: #e9ecef;
    }
    
    .schedule-header-row {
        background-color: #f8f9fa;
    }
    
    .schedule-header-row th {
        font-weight: 500;
        color: #495057;
        padding: 12px 8px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .shift-column-header {
        background-color: var(--shift-column-bg);
        border-left: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
    }
    
    .day-header {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: #6c757d;
        font-weight: 600;
    }
    
    .sub-header {
        font-size: 0.65rem;
        color: #adb5bd;
        margin-top: 2px;
    }
    
    .schedule-row {
        transition: all 0.2s ease;
        border-bottom: 1px solid var(--border-color);
    }
    
    .schedule-row:hover {
        background-color: #f8fafc;
    }
    
    .schedule-row td {
        padding: 12px 8px;
        vertical-align: middle;
    }
    
    .shift-column {
        background-color: var(--shift-column-bg);
        border-left: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
    }
    
    .shift-select {
        transition: all 0.2s ease;
        cursor: pointer;
        min-width: 100px;
        appearance: none;
        background-color: #f8f9fa;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236c757d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 0.5rem center;
        background-size: 12px;
        border: 0;
        border-radius: 0.25rem;
        padding: 0.25rem 1.75rem 0.25rem 0.5rem;
        font-size: 0.875rem;
    }
    
    .shift-select.standout {
        font-weight: 500;
        background-color: white;
        box-shadow: 0 0 0 1px rgba(67, 97, 238, 0.3);
    }
    
    .shift-select:hover {
        background-color: #e9ecef !important;
    }
    
    .shift-select:focus {
        box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.25) !important;
        background-color: white !important;
        outline: none;
    }
    
    .search-box input {
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .search-box input:focus {
        border-color: #4361ee;
        box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.15);
    }
    
    .empty-state {
        background-color: #f8f9fa;
        border-radius: 12px;
    }

	.text-orange {
		color: #fd7e14;
	}
	.text-orange:hover {
		color: #dc3545; /* Changes to red on hover for attention */
	}
</style>