<template>
    <div class="schedule-container bg-white rounded-4 p-4 shadow-soft">
      <div class="schedule-header mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <h3 class="m-0 text-secondary">
            <client-only>
                <font-awesome-icon :icon="['fas', 'users']" class="me-2" />
            </client-only>
            Lineman Personnels
          </h3>
          <div class="search-box position-relative w-25">
            <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input 
              type="text" 
              class="form-control ps-5 rounded-pill" 
              placeholder="Search lineman..." 
            >
          </div>
        </div>
      </div>
  
      <div class="table-responsive">
        <table class="table table-borderless align-middle">
          <thead>
            <tr class="schedule-header-row">
              <th class="text-start">Employee</th>
              <th v-for="day in days" :key="day" class="text-center">
                <div class="day-header">{{ day }}</div>
              </th>
              <th class="text-end pe-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lineman in linemen" :key="lineman.id" class="schedule-row">
              <td class="no-wrap">
                <div class="d-flex align-items-center">
                  <div>
                    <h6 class="mb-0">{{ lineman.fullname }}</h6>
                    <small class="text-muted">{{ lineman.employee.position }}</small>
                  </div>
                </div>
              </td>
              <td v-for="(day, index) in days" :key="index" class="text-center px-2">
                <select class="form-select-sm border-0 bg-light rounded-2 px-2 py-1 shadow-sm">
                    <option selected disabled class="small text-muted">---</option>
                    <option 
                        v-for="shift in shifts" 
                        :key="shift.id" 
                        :value="shift.id"
                        :class="`${shift.color_class}`"
                    >
                        <span :class="`${shift.color_class}`">
                            {{ shift.name }}
                        </span>
                    </option>
                </select>
                </td>
              <td class="pe-4 text-end">
                <button class="btn btn-sm btn-outline-primary rounded-pill px-3">
                  <i class="bi bi-arrow-repeat me-1"></i> Update
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="linemen.length === 0" class="empty-state text-center py-5">
          <i class="bi bi-calendar2-x text-muted" style="font-size: 2.5rem;"></i>
          <p class="text-muted mt-3">No employees found</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import type { Shift } from '~/composables/powerserve/common';
    import type { Lineman } from '~/composables/powerserve/lineman/lineman.types';

    
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

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


  </script>
  
  <style scoped>
  .schedule-container {
    border: 1px solid rgba(0,0,0,0.05);
  }
  
  .shadow-soft {
    box-shadow: 0 4px 24px rgba(0,0,0,0.05);
  }
  
  .schedule-header-row {
    background-color: #f8f9fa;
  }
  
  .schedule-header-row th {
    font-weight: 500;
    color: #495057;
    padding: 12px 8px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .day-header {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #6c757d;
    font-weight: 600;
  }
  
  .schedule-row {
    transition: all 0.2s ease;
    border-bottom: 1px solid #f1f3f5;
  }
  
  .schedule-row:hover {
    background-color: #f8fafc;
  }
  
  .schedule-row td {
    padding: 12px 8px;
    vertical-align: middle;
  }
  
  .day-slot {
    background-color: #f8f9fa;
    min-width: 40px;
  }

  .day-slot select {
    transition: all 0.2s ease;
    cursor: pointer;
    min-width: 100px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236c757d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 12px;
    }

    .day-slot select:hover {
    background-color: #f8f9fa !important;
    }

    .day-slot select:focus {
    box-shadow: 0 0 0 2px rgba(13,110,253,0.25) !important;
    background-color: white !important;
}
  
  .avatar-sm {
    width: 36px;
    height: 36px;
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
}

/* Hover/focus states */
.shift-select:hover {
  background-color: #e9ecef !important;
}
.shift-select:focus {
  box-shadow: 0 0 0 2px rgba(13,110,253,0.25) !important;
  background-color: white !important;
}

/* Make options stand out on hover */
option:hover {
  font-weight: 500;
}

  </style>