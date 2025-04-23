<template>
    <div v-if="!isLoadingPage && authUser && areas.length > 0" class="container pt-4">

        <div class="row mb-3">
            <div class="col">
                <button v-if="canCreate(authUser, 'canManageArea', SERVICES.POWERSERVE)" @click="onClickCreate"
                    class="btn btn-primary float-end">
                    <client-only>
                        <font-awesome-icon :icon="['fas', 'plus']"/>
                    </client-only> 
                    Create
                </button>
            </div>
        </div>

        <div class="row g-5">
            <div v-for="area in areas" class="col-lg-6 mt-5">
                <div class="mb-2">
                    <button :disabled="!canDelete(authUser, 'canManageArea', SERVICES.POWERSERVE)"
                        @click="onClickDelete(area.id)" class="btn btn-sm btn-light me-2">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'trash']" :class="{ 'text-danger': canDelete(authUser, 'canManageArea', SERVICES.POWERSERVE) }"/>
                        </client-only>
                    </button>
                    <button :disabled="!canEdit(authUser, 'canManageArea', SERVICES.POWERSERVE)"
                        @click="onClickEdit(area.id)" class="btn btn-sm btn-light">
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'edit']" :class="{ 'text-primary': canEdit(authUser, 'canManageArea', SERVICES.POWERSERVE) }" />
                        </client-only>
                    </button>
                </div>
                <PowerserveArea :area="area"/>
            </div>
        </div>
    </div>
    <div v-else>
        <LoaderSpinner />
    </div>
</template>


<script setup lang="ts">
    import type { Area } from '~/composables/powerserve/area/area.types'
    import * as areaApi from '~/composables/powerserve/area/area.api'
    import Swal from 'sweetalert2'
    import { useToast } from "vue-toastification";

    definePageMeta({
        name: ROUTES.AREA_INDEX,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)
    const router = useRouter()
    const toast = useToast();

    const areas = ref<Area[]>([])

    onMounted(async () => {

        authUser.value = getAuthUser()
        isLoadingPage.value = false

        areas.value = await areaApi.findAll()

    })

    async function onClickDelete(id: string) {
        console.log('onClickDelete', id)

        const indx = areas.value.findIndex(i => i.id === id)
        const item = areas.value[indx]


        if (!item) {
            console.error('Item not found with id: ' + id)
            return
        }

        Swal.fire({
            title: "Are you sure?",
            text: `${item.name} will be removed!`,
            position: "top",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74a3b",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, remove it!",
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: async (remove) => {

                if (remove) {
                    const response = await areaApi.remove(item.id)

                    if (response.success) {

                        areas.value.splice(indx, 1)
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

    const onClickCreate = () => router.push('/powerserve/area/create')
    const onClickEdit = (id: string) => router.push('/powerserve/area/' + id)

</script>




<style scoped>

    .container {
        max-width: 1600px; 
        margin: 0 auto; 
    }

</style>