<template>
    <div v-if="authUser && !isLoadingPage" class="container">

        <div v-if="canCreate(authUser, 'canManageLineman', SERVICES.POWERSERVE)" class="row mb-3">
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
                                <v-select :options="store.supervisors" label="fullname" v-model="store.selected_supervisor"></v-select>
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

        <div class="card border-0 shadow-sm mt-3">
            <div class="card-body p-0">
                <!-- Search Bar -->
                <div class="p-3 border-bottom">
                    <div class="input-group">
                        <span class="input-group-text bg-transparent border-end-0">
                            <client-only>
                                <font-awesome-icon class="text-muted" :icon="['fas', 'search']" />
                            </client-only>
                        </span>
                        <input 
                            type="text" 
                            class="form-control border-start-0 ps-0" 
                            placeholder="Search here..." 
                            v-model="store.search_value"
                        >
                    </div>
                </div>

                <!-- Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="text-uppercase small text-muted bg-light">
                            <tr>
                                <th class="ps-4 py-3 fw-semibold">Employee</th>
                                <th class="py-3 fw-semibold">Position</th>
                                <th class="py-3 fw-semibold">Area</th>
                                <th class="py-3 fw-semibold">Supervisor</th>
                                <th class="py-3 fw-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="lineman in store.linemen" class="border-top">
                                <td class="ps-4">
                                    <div class="fw-medium text-nowrap">{{ lineman.fullname }}</div>
                                </td>
                                <td class="text-secondary text-nowrap">{{ lineman.employee.position }}</td>
                                <td>
                                    <span class="badge bg-light text-dark border">
                                        {{ lineman.area.name }}
                                    </span>
                                </td>
                                <td class="text-secondary text-nowrap">{{ lineman.supervisor.fullname }}</td>
                                <td>
                                    <span :class="`badge bg-${lineman.status === LINEMAN_STATUS.ACTIVE ? 'success' : 'danger'}-subtle text-${lineman.status === LINEMAN_STATUS.ACTIVE ? 'success' : 'danger'} rounded-pill px-3 py-1`">
                                        {{ lineman.status }}
                                    </span>
                                </td>
                                <td class="pe-4 text-end">
                                    <div class="d-flex justify-content-end gap-2">
                                        <!-- Edit Button -->
                                        <button 
                                            :disabled="!canEdit(authUser, 'canManageLineman', SERVICES.POWERSERVE)"
                                            @click="onClickEdit({ lineman })" 
                                            data-bs-toggle="modal" 
                                            data-bs-target="#lineman_modal" 
                                            class="btn btn-sm btn-light"
                                            :class="{ 'text-primary': canEdit(authUser, 'canManageLineman', SERVICES.POWERSERVE) }"
                                            aria-label="Edit"
                                        >
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'edit']" />
                                            </client-only>
                                        </button>

                                        <!-- Delete Button -->
                                        <button 
                                            :disabled="!canDelete(authUser, 'canManageLineman', SERVICES.POWERSERVE)"
                                            @click="onClickRemove({ lineman })" 
                                            class="btn btn-sm btn-light"
                                            :class="{ 'text-danger': canDelete(authUser, 'canManageLineman', SERVICES.POWERSERVE) }"
                                            aria-label="Delete"
                                        >
                                            <client-only>
                                                <font-awesome-icon :icon="['fas', 'trash']" />
                                            </client-only>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
        <powerserve-form-lineman-modal
            :is_saving="is_saving"
            :is_edit_mode="is_edit_mode"
            :linemen="store.linemen"
            :lineman_id="selected_lineman?.id"
            :areas="store.areas"
            :form="lineman_form_data" 
            @close-form="handleFormClosed"
            @add-lineman="handleCreateLineman"
            @update-lineman="handleUpdateLineman"
        />

    </div>
    <div v-else>
        <LoaderSpinner />
    </div>
</template>

<script setup lang="ts">
    import { lineman_index_init } from '~/composables/powerserve/lineman/lineman.api'
    import { useLinemanStore } from '~/composables/powerserve/lineman/lineman.store'
    import { LINEMAN_STATUS, type CreateLineman, type Lineman, type UpdateLineman } from '~/composables/powerserve/lineman/lineman.types';
    import * as linemanApi from '~/composables/powerserve/lineman/lineman.api'
    import Swal from 'sweetalert2'
    import { useToast } from "vue-toastification";

    definePageMeta({
        name: ROUTES.LINEMAN_INDEX,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const store = useLinemanStore()
    const toast = useToast();

    const selected_lineman = ref<Lineman>()
    const is_edit_mode = ref(false)
    const is_saving = ref(false)


    onMounted(async () => {

        authUser.value = await getAuthUserAsync()

        const { areas, linemen } = await lineman_index_init()
        store.set_linemen({ linemen: deepClone(linemen) })
        store.set_areas({ areas: deepClone(areas) })

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

    function onClickRemove(payload: { lineman: Lineman }) {
        const { lineman } = payload 

        Swal.fire({
            title: "Are you sure?",
            text: `${lineman.fullname} will be deleted!`,
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74a3b",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async (remove) => {

                if (remove) {
                    const response = await linemanApi.remove(lineman.id)

                    if (response.success) {

                        store.remove_lineman({ lineman })
                        toast.success(response.msg)

                    } else {

                        Swal.fire({
                            title: 'Error!',
                            text: response.msg,
                            icon: 'error',
                            position: 'top',
                        })

                    }
                }

            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    function onClickAdd() {
        is_edit_mode.value = false
    }

    function handleFormClosed() {
        is_edit_mode.value = false
    }

    async function handleCreateLineman(payload: { input: CreateLineman, closeBtn: HTMLButtonElement }) {

        const { input, closeBtn } = payload

        is_saving.value = true 
        const response = await linemanApi.create({ input })
        is_saving.value = false 

        if(response.success && response.data) {
            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })

            store.add_lineman({ lineman: response.data })
            closeBtn.click()

        } else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

    async function handleUpdateLineman(payload: { lineman_id: string, input: UpdateLineman, closeBtn: HTMLButtonElement }) {

        const { lineman_id, input, closeBtn } = payload

        is_saving.value = true 
        const response = await linemanApi.update({ input, lineman_id })
        is_saving.value = false 

        if(response.success && response.data) {
            Swal.fire({
                title: 'Success!',
                text: response.msg,
                icon: 'success',
                position: 'top',
            })

            store.update_lineman({ lineman: response.data })
            closeBtn.click()
        } else {
            Swal.fire({
                title: 'Error!',
                text: response.msg,
                icon: 'error',
                position: 'top',
            })
        }

    }

</script>

<style scoped>
    .bg-gray {
        background: #e2e3e5; /* Soft Gray */
        color: #6c757d;
    }
</style>