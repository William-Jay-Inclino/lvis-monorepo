<template>
    <div v-if="authUser && !isLoadingPage" class="container">


        <h5 class="fw-bold soft-badge-yellow text-center p-2 rounded mb-3 mt-5"> Lineman Schedule </h5>

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
                                <v-select :options="store.supervisors" label="fullname" v-model="store.selected_supervisor"></v-select>
                            </client-only>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <PowerserveShifts class="mb-3" :shifts="store.shifts" />

        <PowerserveLinemanSchedule @update-schedule="handle_update_lineman_sched" @update-shift="handle_update_shift" :shifts="store.shifts" :linemen="store.linemen" />

    </div>

    <div v-else>
        <LoaderSpinner />
    </div>

</template>

<script setup lang="ts">
    import type { Lineman, LinemanSchedule } from '~/composables/powerserve/lineman/lineman.types'
    import { schedule_index_init, update_lineman_schedule } from '~/composables/powerserve/lineman/schedule.api'
    import { useToast } from "vue-toastification";
    import { useLinemanScheduleStore } from '~/composables/powerserve/lineman/schedule.store'

    definePageMeta({
        name: ROUTES.LINEMAN_SCHEDULE_INDEX,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const store = useLinemanScheduleStore()
    const toast = useToast();


    onMounted(async () => {

        authUser.value = await getAuthUserAsync()

        const { areas, linemen, shifts } = await schedule_index_init()
        store.set_linemen({ linemen: deepClone(linemen) })
        store.set_areas({ areas: deepClone(areas) })
        store.set_shifts({ shifts: deepClone(shifts) })

        isLoadingPage.value = false
    })

    function handle_update_shift(payload: { lineman: Lineman, field: keyof LinemanSchedule }) {
        console.log('handle_update_shift', payload);
        store.update_lineman(payload)
    }

    async function handle_update_lineman_sched(payload: { lineman: Lineman }) {
        console.log('handle_update_lineman_sched', payload);

        const { lineman } = payload

        store.set_lineman_is_updating({ lineman_id: lineman.id, status: true  })
        const response = await update_lineman_schedule({ input: lineman.schedule })
        store.set_lineman_is_updating({ lineman_id: lineman.id, status: false  })

        if(response.success && response.data) {
            toast.success(response.msg)
            store.update_lineman_schedule({ lineman_schedule: deepClone(response.data) })
        } else {
            toast.error(response.msg)
        }

    }

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