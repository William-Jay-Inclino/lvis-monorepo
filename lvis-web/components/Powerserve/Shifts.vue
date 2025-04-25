<template>
  <div class="shifts-container bg-white rounded-4 p-4 shadow-soft">
      <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="m-0 text-secondary">
              <client-only>
                  <font-awesome-icon :icon="['fas', 'clock']" class="me-2" />
              </client-only>
              Shifts
          </h3>
          <span class="badge bg-light-primary text-primary">{{ shifts.length }} shifts</span>
      </div>
  
      <div class="shifts-list">
          <div v-for="(shift, index) in shifts" :key="index" class="shift-item mb-3 p-3 rounded-3" 
              :class="{'bg-light-warning': shift.is_day_off, 'bg-light-primary': !shift.is_day_off}">
              <div class="d-flex justify-content-between align-items-center">
                  <div>
                      <h6 class="mb-1" :class="{'text-muted': shift.is_day_off}">
                          {{ shift.name }}
                      </h6>
                      <div v-if="!shift.is_day_off" class="d-flex align-items-center text-primary">
                          <client-only>
                              <font-awesome-icon :icon="['fas', 'clock']" class="me-2" />
                          </client-only>
                          <small class="me-2">{{ formatTimeTo12Hour(new Date(shift.start_time)) }}</small>
                          <client-only>
                              <font-awesome-icon :icon="['fas', 'arrow-right']" class="me-2" />
                          </client-only>
                          <small>{{ formatTimeTo12Hour(new Date(shift.end_time)) }}</small>
                      </div>
                  </div>
                  <div v-if="!shift.is_day_off" class="shift-hours">
                      <span class="badge bg-primary text-white">
                          {{ calculateShiftDuration(shift.start_time, shift.end_time) }}
                      </span>
                  </div>
              </div>
          </div>
  
          <div v-if="shifts.length === 0" class="empty-state text-center py-4">
              <i class="bi bi-calendar-x text-muted" style="font-size: 2rem;"></i>
              <p class="text-muted mt-2">No shifts scheduled</p>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
  import type { Shift } from '~/composables/powerserve/shift/shift.entity';

  const props = defineProps({
      shifts: {
          type: Array as () => Shift[],
          default: () => []
      },
  });
  
  const calculateShiftDuration = (start: string, end: string) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
  };

  const formatTimeTo12Hour = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
      });
  };
</script>

<style scoped>
  .shifts-container {
      border: 1px solid rgba(0,0,0,0.05);
  }
  
  .shadow-soft {
      box-shadow: 0 4px 24px rgba(0,0,0,0.05);
  }
  
  .shift-item {
      transition: all 0.2s ease;
      border-left: 3px solid;
  }
  
  .shift-item:not(.bg-light-warning) {
      border-left-color: #4361ee;
  }
  
  .shift-item.bg-light-warning {
      border-left-color: #f8961e;
  }
  
  .shift-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  .bg-light-primary {
      background-color: rgba(67, 97, 238, 0.08);
  }
  
  .bg-light-warning {
      background-color: rgba(248, 150, 30, 0.08);
  }
</style>